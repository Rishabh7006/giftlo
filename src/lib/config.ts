// ============================================
// CONFIGURATION FILE - UPDATE THESE VALUES
// ============================================

export const config = {
  // ============================================
  // SITE NAME
  // ============================================
  siteName: "Giftlo by RK",
  
  // ============================================
  // WHATSAPP NUMBER - UPDATE THIS WITH YOUR NUMBER
  // This is where you'll receive order notifications
  // ============================================
  whatsappNumber: "9986461414", // <-- CHANGE THIS TO YOUR WHATSAPP NUMBER
  
  // ============================================
  // BUSINESS DETAILS
  // ============================================
  businessName: "Giftlo by RK",
  businessEmail: "support@giftlobyrk.com",
  
  // ============================================
  // WHATSAPP MESSAGE TEMPLATES
  // ============================================
  whatsappMessages: {
    generalInquiry: () => 
      `Hi ${config.siteName}! I have a question about gift cards.`,
    
    orderMessage: (brandName: string, amount: number) => 
      `Hi ${config.siteName}! I want to order a ${brandName} gift card worth ₹${amount}. Please help me with the payment details.`,
    
    promoCodeMessage: (brandName: string, amount: number) => 
      `Hi ${config.siteName}! I want to get a ${brandName} promo code worth ₹${amount}. Please share the payment details.`,
  },
};