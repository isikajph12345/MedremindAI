import emailjs from '@emailjs/browser';
import { getProfileData } from './storage';

// Replace these three with your actual EmailJS values
const SERVICE_ID = 'service_z1dnk5a';
const TEMPLATE_ID = 'template_3qoq7dn';
const PUBLIC_KEY = 'dWfs1yBMLYaT6tyCx';

export const sendFamilyAlert = async (type, medicineName = '') => {
  const profile = getProfileData();

  // Silently skip if no family email saved — never crash the app over this
  if (!profile || !profile.familyEmail) {
    console.warn('No family email saved — skipping alert.');
    return { success: false, reason: 'no_email' };
  }

  let subject = '';
  let message = '';

  if (type === 'missed_dose') {
    subject = `Missed Medication Alert for ${profile.name || 'your family member'}`;
    message = `${profile.name || 'Your family member'} missed their scheduled dose of ${medicineName}. Please check in with them.`;
  } else if (type === 'worse_checkin') {
    subject = `Wellness Alert for ${profile.name || 'your family member'}`;
    message = `${profile.name || 'Your family member'} reported feeling worse during their daily check-in. Please reach out to them.`;
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: profile.familyEmail,
        to_name: profile.familyName || 'Family Member',
        patient_name: profile.name || 'Your family member',
        subject,
        message,
      },
      PUBLIC_KEY
    );
    return { success: true };
  } catch (error) {
    console.error('EmailJS send failed:', error);
    return { success: false, reason: error.message };
  }
};