// ============================================
// EMAIL SERVICE - Handles all email notifications
// In production, this would call your backend API
// ============================================

import { config } from "./config";

interface OrderEmailData {
  orderId: string;
  userEmail: string;
  userMobile: string;
  brand: string;
  amount: number;
  utr: string;
  status: string;
  giftCardCode?: string;
}

// ============================================
// EMAIL TEMPLATES
// ============================================

const adminNotificationTemplate = (data: OrderEmailData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
    <div style="background: linear-gradient(135deg, #f43f5e, #f97316); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🎁 New Gift Card Request</h1>
    </div>
    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #1a1a1a; margin-top: 0;">Order Details</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Order ID</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #1a1a1a;">${data.orderId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Customer Email</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #1a1a1a;">${data.userEmail}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Customer Mobile</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #1a1a1a;">+91 ${data.userMobile}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Brand</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #1a1a1a;">${data.brand}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">Amount</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #1a1a1a;">₹${data.amount}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">UTR Number</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #1a1a1a;">${data.utr}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #666;">Status</td>
          <td style="padding: 10px; font-weight: bold; color: #f59e0b;">${data.status}</td>
        </tr>
      </table>
      <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>Action Required:</strong> Please review this order in the admin panel and approve or reject it.
        </p>
      </div>
    </div>
  </div>
`;

const userApprovalTemplate = (data: OrderEmailData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
    <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Your Gift Card is Ready!</h1>
    </div>
    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #1a1a1a; margin-top: 0;">Congratulations!</h2>
      <p style="color: #666; line-height: 1.6;">Your gift card has been approved and is ready to use.</p>
      
      <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
        <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Gift Card Details</p>
        <p style="color: #1a1a1a; font-size: 20px; font-weight: bold; margin: 0 0 5px 0;">${data.brand}</p>
        <p style="color: #1a1a1a; font-size: 18px; margin: 0 0 15px 0;">₹${data.amount}</p>
        <div style="background: #1a1a1a; color: #10b981; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 18px; letter-spacing: 2px;">
          ${data.giftCardCode}
        </div>
      </div>
      
      <div style="background: #fef3c7; border-radius: 8px; padding: 15px; margin-top: 20px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>How to Redeem:</strong><br/>
          1. Visit the brand's website or app<br/>
          2. Go to the gift card section<br/>
          3. Enter the code above<br/>
          4. The amount will be added to your account
        </p>
      </div>
      
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        If you have any questions, contact our support team at support@giftkart.com
      </p>
    </div>
  </div>
`;

const userRejectionTemplate = (data: OrderEmailData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
    <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Order Update</h1>
    </div>
    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #1a1a1a; margin-top: 0;">We're Sorry</h2>
      <p style="color: #666; line-height: 1.6;">Unfortunately, your gift card order has been rejected. This could be due to:</p>
      
      <ul style="color: #666; line-height: 2; padding-left: 20px;">
        <li>Invalid UTR/Transaction ID</li>
        <li>Payment not received</li>
        <li>Incorrect payment details</li>
      </ul>
      
      <div style="background: #fef2f2; border-radius: 8px; padding: 15px; margin-top: 20px; border-left: 4px solid #ef4444;">
        <p style="margin: 0; color: #991b1b; font-size: 14px;">
          <strong>Next Steps:</strong><br/>
          Please verify your payment details and try again. If you believe this is an error, contact our support team.
        </p>
      </div>
      
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        Order ID: <strong>${data.orderId}</strong><br/>
        Brand: <strong>${data.brand}</strong><br/>
        Amount: <strong>₹${data.amount}</strong>
      </p>
    </div>
  </div>
`;

// ============================================
// EMAIL SENDING FUNCTIONS
// ============================================

export const emailService = {
  // Send notification to admin when new order is placed
  async sendOrderNotificationToAdmin(orderData: OrderEmailData) {
    console.log("📧 Sending order notification to admin:", config.adminEmail);
    console.log("Order Details:", orderData);
    
    // In production, this would call your backend API
    // const response = await fetch("/api/send-email", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     to: config.adminEmail,
    //     subject: `New Gift Card Request - ${orderData.orderId}`,
    //     html: adminNotificationTemplate(orderData),
    //   }),
    // });
    
    // For demo, we'll simulate the email
    console.log("Email template:", adminNotificationTemplate(orderData));
    return { success: true, message: "Admin notified" };
  },

  // Send gift card code to user when approved
  async sendGiftCardToUser(orderData: OrderEmailData) {
    console.log("📧 Sending gift card to user:", orderData.userEmail);
    console.log("Gift Card Details:", orderData);
    
    // In production, this would call your backend API
    // const response = await fetch("/api/send-email", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     to: orderData.userEmail,
    //     subject: "Your Gift Card is Ready!",
    //     html: userApprovalTemplate(orderData),
    //   }),
    // });
    
    console.log("Email template:", userApprovalTemplate(orderData));
    return { success: true, message: "Gift card sent to user" };
  },

  // Send rejection notification to user
  async sendRejectionToUser(orderData: OrderEmailData) {
    console.log("📧 Sending rejection to user:", orderData.userEmail);
    console.log("Rejection Details:", orderData);
    
    // In production, this would call your backend API
    // const response = await fetch("/api/send-email", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     to: orderData.userEmail,
    //     subject: "Gift Card Order Update",
    //     html: userRejectionTemplate(orderData),
    //   }),
    // });
    
    console.log("Email template:", userRejectionTemplate(orderData));
    return { success: true, message: "Rejection sent to user" };
  },
};