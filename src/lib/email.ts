import { env } from './env';

// Email templates
const EMAIL_TEMPLATES = {
  ORDER_CONFIRMATION: 'order-confirmation',
  ACCESS_GRANTED: 'access-granted',
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password-reset',
};

type EmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  attachments?: Array<{
    content: string;
    filename: string;
    type?: string;
    disposition?: string;
  }>;
};

// Initialize SendGrid with build-time safety
let sgMail: typeof import('@sendgrid/mail') | null = null;

// Queue for failed emails
const emailQueue: Array<{ options: EmailOptions; retries: number }> = [];
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

// Initialize SendGrid
async function initSendGrid() {
  if (sgMail) return true;
  
  try {
    sgMail = (await import('@sendgrid/mail')).default;
    const apiKey = env.SENDGRID_API_KEY;
    
    if (!apiKey) {
      console.error('SENDGRID_API_KEY not configured');
      return false;
    }
    
    sgMail.setApiKey(apiKey);
    return true;
  } catch (error) {
    console.error('Failed to initialize SendGrid:', error);
    return false;
  }
}

// Process the email queue
async function processEmailQueue() {
  if (emailQueue.length === 0) return;
  
  const { options, retries } = emailQueue.shift()!;
  
  try {
    await sendEmailInternal(options);
    console.log(`Successfully sent queued email to ${options.to}`);
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(`Requeuing email to ${options.to} (retry ${retries + 1}/${MAX_RETRIES})`);
      emailQueue.push({ options, retries: retries + 1 });
      setTimeout(processEmailQueue, RETRY_DELAY);
    } else {
      console.error(`Failed to send email to ${options.to} after ${MAX_RETRIES} retries:`, error);
    }
  }
}

// Internal function to send email
async function sendEmailInternal(options: EmailOptions) {
  if (!await initSendGrid() || !sgMail) {
    throw new Error('SendGrid not initialized');
  }
  
  // For template emails, don't include content
  if (options.templateId) {
    const templateMsg = {
      to: options.to,
      from: env.EMAIL_FROM,
      subject: options.subject,
      templateId: options.templateId,
      dynamicTemplateData: options.dynamicTemplateData,
      attachments: options.attachments,
    };
    
    // Use type assertion to satisfy TypeScript
    await sgMail.send(templateMsg as any);
    return;
  }
  
  // For regular emails, include content
  const msg = {
    to: options.to,
    from: env.EMAIL_FROM,
    subject: options.subject,
    attachments: options.attachments,
    text: options.text,
    html: options.html,
  };
  
  // Use type assertion to satisfy TypeScript
  await sgMail.send(msg as any);
}

// Main function to send email with retry logic
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await sendEmailInternal(options);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${options.to}:`, error);
    emailQueue.push({ options, retries: 0 });
    setTimeout(processEmailQueue, RETRY_DELAY);
    return false;
  }
}

// Send order confirmation email
export async function sendOrderConfirmationEmail({
  email,
  orderDetails,
}: {
  email: string;
  orderDetails: {
    productName: string;
    price: number;
    orderId: string;
  };
}): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Your Order Confirmation',
    templateId: EMAIL_TEMPLATES.ORDER_CONFIRMATION,
    dynamicTemplateData: {
      product_name: orderDetails.productName,
      price: orderDetails.price.toFixed(2),
      order_id: orderDetails.orderId,
      order_date: new Date().toLocaleDateString(),
    },
  });
}

// Send access granted email
export async function sendAccessGrantedEmail({
  email,
  productName,
  accessLink,
}: {
  email: string;
  productName: string;
  accessLink: string;
}): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Access Granted to ' + productName,
    templateId: EMAIL_TEMPLATES.ACCESS_GRANTED,
    dynamicTemplateData: {
      product_name: productName,
      access_link: accessLink,
    },
  });
}

// Send welcome email
export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name?: string;
}): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Welcome to Ventaro AI',
    templateId: EMAIL_TEMPLATES.WELCOME,
    dynamicTemplateData: {
      name: name || 'there',
    },
  });
}

// Send password reset email
export async function sendPasswordResetEmail({
  email,
  resetLink,
}: {
  email: string;
  resetLink: string;
}): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Reset Your Password',
    templateId: EMAIL_TEMPLATES.PASSWORD_RESET,
    dynamicTemplateData: {
      reset_link: resetLink,
    },
  });
}