import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('Missing environment variable SENDGRID_API_KEY');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

type EmailData = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sendEmail = async ({ to, subject, text, html }: EmailData) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM || 'noreply@example.com',
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error };
  }
};

export const sendOrderConfirmationEmail = async ({
  email,
  orderNumber,
  orderItems,
  total,
  downloadLinks,
}: {
  email: string;
  orderNumber: string;
  orderItems: any[];
  total: number;
  downloadLinks: { productName: string; url: string }[];
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
            <a href="${link.url}" style="color: #0070f3; text-decoration: none;">Download</a>
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
        
        <h2 style="margin-top: 30px;">Download Links</h2>
        <p>Your purchased products are available for download below:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Product</th>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Download</th>
            </tr>
          </thead>
          <tbody>
            ${downloadLinksList}
          </tbody>
        </table>
        
        <p style="margin-top: 30px;">If you have any questions about your order, please contact our support team.</p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
          <p>© ${new Date().getFullYear()} AI Digital Product Store. All rights reserved.</p>
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
    
    Your purchased products are available in your account dashboard.
    
    If you have any questions about your order, please contact our support team.
  `;

  return sendEmail({
    to: email,
    subject: `Order Confirmation #${orderNumber}`,
    text,
    html,
  });
};