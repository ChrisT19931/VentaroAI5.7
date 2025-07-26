import sgMail from '@sendgrid/mail';

// Enhanced SendGrid configuration
const sendGridConfig = {
  timeout: 30000, // 30 seconds timeout
  retries: 3,
  retryDelay: 1000, // 1 second base delay
};

// Email delivery health monitoring
let emailHealth = {
  lastCheck: 0,
  isHealthy: true,
  consecutiveFailures: 0,
  totalSent: 0,
  totalFailed: 0,
};

// Initialize SendGrid with build-time safety and enhanced configuration
const initializeSendGrid = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn('SENDGRID_API_KEY not configured - email features will not work');
    return false;
  }
  
  sgMail.setApiKey(apiKey);
  
  // Set global request timeout
  sgMail.setTimeout(sendGridConfig.timeout);
  
  return true;
};

const isConfigured = initializeSendGrid();

// Enhanced SendGrid health check
export async function checkSendGridHealth(): Promise<boolean> {
  if (!isConfigured) return false;
  
  const now = Date.now();
  
  // Only check health every 5 minutes to avoid excessive requests
  if (now - emailHealth.lastCheck < 300000 && emailHealth.isHealthy) {
    return emailHealth.isHealthy;
  }
  
  try {
    // Simple health check - try to send a test email to validate configuration
    // We'll use a dry run approach by checking if we can create a valid message
    const testMsg = {
      to: 'test@example.com',
      from: process.env.EMAIL_FROM || 'noreply@ventarosales.com',
      subject: 'Health Check',
      text: 'Test',
      mailSettings: {
        sandboxMode: {
          enable: true, // This ensures no actual email is sent
        },
      },
    };
    
    await sgMail.send(testMsg);
    
    emailHealth.isHealthy = true;
    emailHealth.consecutiveFailures = 0;
    emailHealth.lastCheck = now;
    
    return emailHealth.isHealthy;
  } catch (error) {
    emailHealth.consecutiveFailures++;
    emailHealth.isHealthy = emailHealth.consecutiveFailures < 3;
    emailHealth.lastCheck = now;
    
    console.warn(`SendGrid health check failed (${emailHealth.consecutiveFailures}/3):`, error);
    return emailHealth.isHealthy;
  }
}

// Get email delivery statistics
export function getEmailStats() {
  return {
    ...emailHealth,
    successRate: emailHealth.totalSent > 0 ? 
      ((emailHealth.totalSent - emailHealth.totalFailed) / emailHealth.totalSent * 100).toFixed(2) + '%' : 
      'N/A'
  };
}

type EmailData = {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html: string;
};

export const sendEmail = async ({ to, from, subject, text, html }: EmailData) => {
  if (!isConfigured) {
    console.warn('SendGrid not configured - skipping email send');
    emailHealth.totalFailed++;
    return { success: false, error: 'SendGrid not configured' };
  }

  const msg = {
    to,
    from: from || process.env.EMAIL_FROM || 'noreply@ventarosales.com',
    subject,
    text: text || '',
    html,
    trackingSettings: {
      clickTracking: {
        enable: true,
        enableText: false,
      },
      openTracking: {
        enable: true,
      },
    },
    mailSettings: {
      sandboxMode: {
        enable: false,
      },
    },
  };

  // Retry logic with exponential backoff
  for (let attempt = 1; attempt <= sendGridConfig.retries; attempt++) {
    try {
      await sgMail.send(msg);
      emailHealth.totalSent++;
      
      // Reset consecutive failures on success
      if (emailHealth.consecutiveFailures > 0) {
        emailHealth.consecutiveFailures = 0;
        emailHealth.isHealthy = true;
      }
      
      return { success: true };
    } catch (error: any) {
      console.error(`SendGrid error (attempt ${attempt}/${sendGridConfig.retries}):`, error);
      
      // If this is the last attempt, record the failure
      if (attempt === sendGridConfig.retries) {
        emailHealth.totalFailed++;
        emailHealth.consecutiveFailures++;
        
        if (emailHealth.consecutiveFailures >= 3) {
          emailHealth.isHealthy = false;
        }
        
        return { success: false, error };
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, sendGridConfig.retryDelay * Math.pow(2, attempt - 1))
      );
    }
  }
  
  // This should never be reached, but just in case
  emailHealth.totalFailed++;
  return { success: false, error: 'Max retries exceeded' };
};

// Enhanced email sending with validation
export const sendEmailWithValidation = async (emailData: EmailData) => {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailData.to)) {
    return { success: false, error: 'Invalid email format' };
  }
  
  // Check SendGrid health before sending
  const isHealthy = await checkSendGridHealth();
  if (!isHealthy) {
    console.warn('SendGrid health check failed, but attempting to send anyway');
  }
  
  return sendEmail(emailData);
};

export const sendOrderConfirmationEmail = async ({
  email,
  orderNumber,
  orderItems,
  total,
  downloadLinks,
  isGuest = false,
}: {
  email: string;
  orderNumber: string;
  orderItems: any[];
  total: number;
  downloadLinks: { productName: string; url: string }[];
  isGuest?: boolean;
}) => {
  const itemsList = orderItems
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(
            2
          )}</td>
        </tr>`
    )
    .join('');

  const downloadLinksList = downloadLinks
    .map(
      (link) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${link.productName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="${link.url}" style="color: #0070f3; text-decoration: none;">Access Product</a>
          </td>
        </tr>`
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0070f3; padding: 20px; color: white; text-align: center;">
        <h1 style="margin: 0;">Order Confirmation</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #eee; border-top: none;">
        <p>Thank you for your purchase!</p>
        <p>Order Number: <strong>${orderNumber}</strong></p>

        
        <h2 style="margin-top: 20px;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Product</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
            <tr>
              <td style="padding: 10px; font-weight: bold; text-align: right;">Total:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">$${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <h2 style="margin-top: 30px;">Your Products</h2>
        <p>Your purchased products are available below:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Product</th>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Access</th>
            </tr>
          </thead>
          <tbody>
            ${downloadLinksList}
          </tbody>
        </table>
        
        <p style="margin-top: 30px;">If you have any questions about your order, please contact us at <a href="mailto:chris.t@ventarosales.com" style="color: #0070f3; text-decoration: none;">chris.t@ventarosales.com</a>.</p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Ventaro Digital Store. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  const text = `
    Order Confirmation
    
    Thank you for your purchase!
    Order Number: ${orderNumber}
    
    Order Summary:
    ${orderItems.map((item) => `${item.name}: $${item.price.toFixed(2)}`).join('\n')}
    Total: $${total.toFixed(2)}
    
    Your purchased products are available through the links sent in this email.
    
    If you have any questions about your order, please contact us at chris.t@ventarosales.com.
  `;

  return sendEmail({
    to: email,
    subject: `Order Confirmation #${orderNumber}`,
    text,
    html,
  });
};