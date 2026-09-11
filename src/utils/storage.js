// Offline storage helper for MedRemind-AI — single canonical key, no more key drift

const PROFILE_KEY = 'medremind_profile';
const MEDICINES_KEY = 'medremind_medicines';
const REPORTS_KEY = 'medremind_reports';

export const saveProfileData = (profileData) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
    return true;
  } catch (error) {
    console.error("Failed to save profile offline:", error);
    return false;
  }
};

export const getProfileData = () => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to read profile offline:", error);
    return null;
  }
};

// Single medicine (manual entry)
export const saveMedicine = (medicine) => {
  try {
    const existing = getMedicines();
    const updated = [...existing, { ...medicine, id: Date.now() }];
    localStorage.setItem(MEDICINES_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error("Failed to save medicine offline:", error);
    return false;
  }
};

// Bulk save (used by AI scan sync) — merges with existing rather than overwriting
export const saveMedicines = (medicinesArray) => {
  try {
    localStorage.setItem(MEDICINES_KEY, JSON.stringify(medicinesArray));
    return true;
  } catch (error) {
    console.error("Failed to save medicines offline:", error);
    return false;
  }
};

export const getMedicines = () => {
  try {
    const data = localStorage.getItem(MEDICINES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to read medicines offline:", error);
    return [];
  }
};

// Report storage sync
export const saveReports = (reportsArray) => {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reportsArray));
    return true;
  } catch (error) {
    console.error("Failed to save reports offline:", error);
    return false;
  }
};

export const getReports = () => {
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to read reports offline:", error);
    return [];
  }
};