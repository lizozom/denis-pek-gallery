'use server';

import { sendContactEmail } from '@/lib/email';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  try {
    // Validate data (server-side validation)
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        error: 'Name, email, and message are required',
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Invalid email address',
      };
    }

    // Send email
    await sendContactEmail(data);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      error: 'Failed to send message',
    };
  }
}
