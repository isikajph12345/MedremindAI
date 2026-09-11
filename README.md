# MedRemind-AI

An elderly‑friendly web application that helps users manage medications, understand prescriptions and lab reports, and stay connected with family caregivers. It combines AI‑assisted image understanding with a mandatory human confirmation step to ensure safety in a medical context.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Core Flows](#core-flows)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [How It Works](#how-it-works)
- [Future Scope](#future-scope)
- [License](#license)

---

## Features

- **Smart Medication Scheduling**  
  A visual 3D timetable that automatically adjusts when meal times change. Doses are displayed clearly and reminders are triggered at the right time.

- **AI‑Assisted Prescription Scanning**  
  Upload a photo of a prescription. The AI reads medicine names, dosages, and timing directly. Extracted data is shown in an editable confirmation screen before it becomes an active schedule.

- **Plain‑Language Lab Report Explanation**  
  Upload a lab report. The AI translates medical jargon into everyday language, with a clear non‑diagnostic disclaimer.

- **Timely Alarms & Notifications**  
  The app monitors the medication schedule and triggers a popup, sound, and browser notification when a dose is due. *(The polling interval is configurable; a short interval is used during development/testing.)*

- **Family & Emergency Alerts**  
  If a dose is not marked as taken within 45 minutes, the backend sends an email to the registered family contact. A daily mood check‑in can also trigger an immediate alert if the user indicates they are feeling worse.

- **Elderly‑First Interface**  
  Large fonts, high contrast, simple navigation, and a calm violet/lavender glassmorphism aesthetic.

---

## Tech Stack

| Layer          | Technology                                                                 |
|----------------|----------------------------------------------------------------------------|
| Frontend       | React + Vite                                                               |
| Styling        | Tailwind CSS + Noto Sans                                                   |
| Animation      | Framer Motion                                                      |
| 3D Visuals     | Three.js                                                                   |
| AI             | AI Vision API (prescription & lab report understanding)                |
| Backend        | Python + FastAPI                                                           |
| Email Alerts   | Email JS                                                       |                                   |
| Deployment     | Vercel (frontend) + FastAPI (backend)                                      |

---

## System Architecture

The architecture separates the client, the FastAPI backend, and external AI/email services.

![System_Architecture](assests/systemWorkFlow.png)
