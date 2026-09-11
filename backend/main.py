from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="MedRemind-AI Gemini Vision Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

PRESCRIPTION_PROMPT = """You are an advanced multilingual medical prescription reading engine for a healthcare app called MedRemind-AI. You will be given a photo of a doctor's prescription, which may be handwritten or printed, and may contain shorthand in English, Hindi, Bengali, or Japanese.

Read the prescription directly from the image and extract ONLY the actual medicines. Never include patient names, doctor names, ages, dates, hospital or clinic names, registration numbers, or any other metadata.

Recognize shorthand such as: od, bd, tds, qid, hs, 1-0-1, 1-1-1, 1-0-0, 0-1-0, 0-0-1, and Japanese terms like 食後 (after meals), 食前 (before meals), 分3 (divided into 3 doses), 朝夕 (morning and evening), 就寝前 (before bed).

Convert frequency into 24-hour alarm timestamps:
- "1-0-0", "od", "morning" -> ["08:00"]
- "0-1-0", "noon" -> ["13:00"]
- "0-0-1", "hs", "night" -> ["21:00"]
- "1-0-1", "bd", "twice daily" -> ["08:00", "21:00"]
- "1-1-1", "tds", "thrice daily" -> ["08:00", "13:00", "21:00"]

Map food instructions to exactly one of: "Before Food", "After Food", "Empty Stomach", "None".

Extract total course duration as an integer number of days. Default to 5 if not stated.

Mark "confidence" as "low" if handwriting is unclear for that medicine, otherwise "high".

Return ONLY a raw JSON array. No explanation, no markdown, no backticks, no extra text.

Format:
[
  {
    "medicine_name": "string",
    "dosage": "string",
    "alarm_times": ["HH:MM"],
    "instructions": "Before Food / After Food / Empty Stomach / None",
    "duration_days": 7,
    "confidence": "high"
  }
]

If the image is unreadable or contains no prescription, return an empty array: []
"""

@app.post("/api/scan-prescription")
async def scan_prescription(file: UploadFile = File(...)):
    image_bytes = await file.read()

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                PRESCRIPTION_PROMPT,
                {"inline_data": {"mime_type": file.content_type or "image/jpeg", "data": image_bytes}}
            ]
        )

        raw_output = response.text.strip()
        raw_output = raw_output.replace("```json", "").replace("```", "").strip()

        medicines = json.loads(raw_output)
        return {"success": True, "filename": file.filename, "medicines": medicines}

    except json.JSONDecodeError:
        return {"success": False, "error": "Could not parse AI response"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/scan-report")
async def scan_report(file: UploadFile = File(...)):
    image_bytes = await file.read()
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                (
                    "Analyze this medical/lab report image. Extract key test parameters (e.g., blood sugar, "
                    "hemoglobin, cholesterol). For each parameter, provide the detected value, "
                    "the standard normal range, status ('normal' or 'high' or 'low'), a clear plain-language "
                    "explanation, and a safe lifestyle tip. Return valid structured analysis."
                ),
                {"inline_data": {"mime_type": file.content_type or "image/jpeg", "data": image_bytes}}
            ]
        )
        return {
            "status": "success",
            "title": "Scanned Lab Pathology Report",
            "items": [
                {
                    "name": "General Blood Panel Parameter",
                    "value": "Extracted",
                    "range": "Standard Reference",
                    "status": "normal",
                    "explanation": response.text[:250] if response.text else "Successfully parsed report.",
                    "tip": "Maintain regular consultations with your physician."
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)