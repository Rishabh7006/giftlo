import { useState } from "react";
import { ArrowLeft, Star, Shield, Zap, CreditCard, Gift, MessageCircle, CheckCircle2, Tag, Percent, Copy, Check, Lock, Sparkles, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type Brand } from "@/lib/data";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

interface BrandPageProps {
  brand: Brand;
  onBack: () => void;
}

export function BrandPage({ brand, onBack }: BrandPageProps) {
  const [selectedAmount, setSelectedAmount] = useState(brand.denominations[0] || 0);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleWhatsAppOrder = (offer?: { code: string; description: string; discount: string; minOrder?: string; isFree?: boolean; isPaid?: boolean; price?: number }) => {
    let message: string;
    
    if (offer?.isPaid) {
      // Paid offer - user wants to buy the code
      message = `Hi ${config.siteName}! I want to buy the ${brand.name} promo code *${offer.code}* (${offer.discount}${offer.minOrder ? ` on min order of ${offer.minOrder}` : ''}). Please share the payment details.`;
    } else if (offer?.isFree) {
      // Free offer - user wants the free code
      message = `Hi ${config.siteName}! I'm a new user and want the ${brand.name} promo code *${offer.code}* (${offer.discount}). Please share the code.`;
    } else {
      // Regular gift card order
      const amount = showCustom && customAmount ? parseInt(customAmount) : selectedAmount;
      const discount = brand.discountRate ? ` (${brand.discountRate}% discount)` : '';
      message = `Hi ${config.siteName}! I want to order a ${brand.name} gift card worth ₹${amount}${discount}. Please help me with the payment details.`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Check if this is a promo code only brand (like Shein)
  const isPromoOnlyBrand = brand.isPromoCode && brand.specialOffers && brand.specialOffers.length > 0;

    // Check if custom amount is supported
  const canCustomAmount = brand.supportsCustomAmount !== false && brand.denominations.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to All Brands
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand Info */}
        <div>
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
                <div className={cn("w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0", brand.color)}>
                  <img src={brand.logo} alt={brand.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{brand.name}</h1>
                    <Badge variant="secondary" className="bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                      {brand.category}
                    </Badge>
                    {brand.discountRate && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        <BadgePercent className="w-3 h-3 mr-1" /> {brand.discountRate}% OFF
                      </Badge>
                    )}
                    {brand.isPromoCode && (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                        <Tag className="w-3 h-3 mr-1" /> Promo Codes
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">4.8/5 (2.3k reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 mb-6">{brand.description}</p>

              {/* Special Offers Section */}
              {brand.specialOffers && brand.specialOffers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-rose-500" />
                    Special Offers
                  </h3>
                  <div className="space-y-4">
                    {brand.specialOffers.map((offer) => (
                      <div key={offer.code} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-amber-500 text-white">
                              {offer.discount}
                            </Badge>
                            {offer.minOrder && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                Min order: {offer.minOrder}
                              </span>
                            )}
                          </div>
                          {offer.isFree ? (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                              <Sparkles className="w-3 h-3 mr-1" /> FREE
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                              <Lock className="w-3 h-3 mr-1" /> Paid
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{offer.description}</p>
                        
                        {offer.isFree ? (
                          // Free code - show copy button
                          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 border border-dashed border-amber-300 dark:border-amber-700">
                            <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400 flex-1">
                              {offer.code}
                            </span>
                            <button
                              onClick={() => handleCopyCode(offer.code)}
                              className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                            >
                              {copiedCode === offer.code ? (
                                <>
                                  <Check className="w-3 h-3" /> Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy
                                </>
                              )}
                            </button>
                          </div>
                        ) : (
                          // Paid code - show buy button
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 border border-dashed border-amber-300 dark:border-amber-700">
                                <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400 flex-1 truncate">
                                  {offer.code}
                                </span>
                                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                              </div>
                            </div>
                            <Button
                              className="bg-green-600 hover:bg-green-700 whitespace-nowrap w-full sm:w-auto"
                              onClick={() => handleWhatsAppOrder(offer)}
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Get Code
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="mb-6" />

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Zap, label: "Instant Delivery", desc: "Within minutes" },
                  { icon: Shield, label: "100% Secure", desc: "Verified sellers" },
                  { icon: CreditCard, label: "Easy Payment", desc: "UPI, cards & more" },
                  { icon: Gift, label: "Best Price", desc: "Guaranteed lowest" },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{feature.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-200">How it works</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      {isPromoOnlyBrand 
                        ? "Copy the free code for new users, or click 'Get Code' on paid offers to purchase via WhatsApp."
                        : brand.discountRate 
                          ? `Select your amount, click "Order on WhatsApp", and get ${brand.discountRate}% discount on your gift card.`
                          : "Select your amount, click \"Order on WhatsApp\", and we'll help you complete the purchase directly."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Section - Only for non-promo brands */}
        {!isPromoOnlyBrand && (
          <div>
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Select Amount</CardTitle>
                <CardDescription>Choose your gift card denomination</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                  {brand.denominations.map((denom) => (
                    <button
                      key={denom}
                      onClick={() => {
                        setSelectedAmount(denom);
                        setShowCustom(false);
                      }}
                      className={cn(
                        "p-3 sm:p-4 rounded-xl border-2 text-center transition-all",
                        !showCustom && selectedAmount === denom
                          ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      )}
                    >
                      <span className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white">₹{denom}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Gift Card</span>
                      {brand.discountRate && (
                        <span className="block text-xs font-semibold text-green-600 dark:text-green-400 mt-1">
                          Save ₹{Math.round(denom * brand.discountRate / 100)}
                        </span>
                      )}
                    </button>
                  ))}
                  {canCustomAmount && (
                      <button
                        onClick={() => setShowCustom(true)}
                        className={cn(
                          "p-3 sm:p-4 rounded-xl border-2 text-center transition-all",
                          showCustom
                            ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        )}
                      >
                        <span className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white">Custom</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Enter amount</span>
                      </button>
                    )}
                </div>

                {showCustom && canCustomAmount && (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Custom Amount (₹)</label>
                    <input
                      type="number"
                      min="50"
                      max="10000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount between ₹50 - ₹10,000"
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Gift Card Value</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ₹{showCustom && customAmount ? customAmount : selectedAmount}
                    </span>
                  </div>
                  {brand.discountRate && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Discount ({brand.discountRate}%)</span>
                      <span className="font-semibold text-green-600">
                        -₹{Math.round((showCustom && customAmount ? parseInt(customAmount) : selectedAmount) * brand.discountRate / 100)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Convenience Fee</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900 dark:text-white">Total Payable</span>
                    <span className="text-xl font-bold text-rose-500">
                      ₹{showCustom && customAmount 
                        ? Math.round(parseInt(customAmount) * (1 - (brand.discountRate || 0) / 100))
                        : Math.round(selectedAmount * (1 - (brand.discountRate || 0) / 100))}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
                  onClick={() => handleWhatsAppOrder()}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Order on WhatsApp
                </Button>

                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <p className="text-sm text-green-800 dark:text-green-200 text-center">
                    <strong>Connect with us on WhatsApp</strong>
                    {/* <br />
                    <span className="text-lg font-bold">+91 {config.whatsappNumber}</span> */}
                  </p>
                </div>

                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
                  By proceeding, you agree to our Terms & Conditions
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Promo Code Info Section - Only for promo brands like Shein */}
        {isPromoOnlyBrand && (
          <div>
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Why Choose Our Codes?
                </CardTitle>
                <CardDescription>Exclusive {brand.name} promo codes with verified discounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">✅ Verified & Working</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      All codes are tested and verified to work. We update them regularly.
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">⚡ Instant Delivery</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Paid codes are delivered instantly on WhatsApp after payment confirmation.
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">💰 Best Value</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Get the best discounts on your favorite brands. Save more than the code costs!
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">🛡️ Secure Payment</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Pay securely via UPI, cards, or net banking. Your transaction is 100% safe.
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <p className="text-sm text-green-800 dark:text-green-200 text-center">
                    <strong>Need help?</strong>
                    <br />
                    <span className="text-lg font-bold">+91 {config.whatsappNumber}</span>
                  </p>
                </div> */}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}