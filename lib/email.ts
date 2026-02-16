interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  message: string;
}

const getProjectTypeLabel = (projectType: string): string => {
  const labels: Record<string, string> = {
    architectural: 'Architectural Photography',
    interior: 'Interior Photography',
    realEstate: 'Real Estate Photography',
    commercial: 'Commercial Photography',
    other: 'Other',
  };
  return labels[projectType] || projectType;
};

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  // If Resend is not configured, log the contact form data
  if (!resendApiKey) {
    console.log('📧 Contact Form Submission (Resend not configured):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name: ${data.name}`);
    console.log(`Email: ${data.email}`);
    if (data.phone) console.log(`Phone: ${data.phone}`);
    if (data.projectType) console.log(`Project Type: ${getProjectTypeLabel(data.projectType)}`);
    console.log(`Message: ${data.message}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 To enable email sending, add RESEND_API_KEY to your .env.local file');
    console.log('   Get your API key from: https://resend.com/api-keys');
    return;
  }

  try {
    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Denis Pekerman Gallery <noreply@denispekerman.com>',
        to: process.env.CONTACT_EMAIL || 'contact@denispekerman.com',
        reply_to: data.email,
        subject: `New Contact Form Submission${data.projectType ? ` - ${getProjectTypeLabel(data.projectType)}` : ''}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 30px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                }
                .content {
                  background: #f9fafb;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                }
                .field {
                  margin-bottom: 20px;
                  background: white;
                  padding: 15px;
                  border-radius: 8px;
                  border-left: 4px solid #667eea;
                }
                .label {
                  font-weight: 600;
                  color: #667eea;
                  margin-bottom: 5px;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                }
                .value {
                  color: #111827;
                  font-size: 16px;
                }
                .message-box {
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  border: 1px solid #e5e7eb;
                  white-space: pre-wrap;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #6b7280;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Denis Pekerman Photography</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${data.name}</div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></div>
                </div>
                ${data.phone ? `<div class="field">
                  <div class="label">Phone</div>
                  <div class="value"><a href="tel:${data.phone}" style="color: #667eea; text-decoration: none;">${data.phone}</a></div>
                </div>` : ''}
                ${data.projectType ? `<div class="field">
                  <div class="label">Project Type</div>
                  <div class="value">${getProjectTypeLabel(data.projectType)}</div>
                </div>` : ''}
                <div class="field">
                  <div class="label">Message</div>
                  <div class="message-box">${data.message}</div>
                </div>
              </div>
              <div class="footer">
                <p>This email was sent from the Denis Pekerman Photography contact form</p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      throw new Error('Failed to send email');
    }

    console.log('✅ Contact form email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
