import { useState, useRef, useEffect } from "react";
import { QrCode, Copy, CheckCircle2, ArrowLeft, CreditCard, Shield, Mail, Phone, Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { type Brand, type Order, type User, generateOrderId } from "@/lib/data";
import { config } from "@/lib/config";
import { emailService } from "@/lib/emailService";
import { cn } from "@/lib/utils";

interface CheckoutPageProps {
  brand: Brand;
  amount: number;
  user: User | null;
  onSubmit: (order: Order) => void;
  onBack: () => void;
}

const denominations = [100, 250, 500, 1000, 2000];

export function CheckoutPage({ brand, amount, user, onSubmit, onBack }: CheckoutPageProps) {
  const [selectedAmount, setSelectedAmount] = useState(amount);
  const [customAmount, setCustomAmount] = useState("");
  const [utr, setUtr] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upiId = config.upiId;
  const merchantName = config.merchantName;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
        toast.success("Payment screenshot uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!utr || !email || !mobile) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!/^\d{12}$/.test(utr)) {
      toast.error("Please enter a valid 12-digit UTR number");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);
    const order: Order = {
      id: generateOrderId(),
      userId: user?.id || "guest",
      brand: brand.name,
      amount: selectedAmount,
      utr,
      email,
      mobile,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      // Send email notification to admin
      await emailService.sendOrderNotificationToAdmin({
        orderId: order.id,
        userEmail: email,
        userMobile: mobile,
        brand: brand.name,
        amount: selectedAmount,
        utr,
        status: "pending",
      });

      setTimeout(() => {
        onSubmit(order);
        setIsSubmitting(false);
        toast.success("Order submitted! Admin has been notified via email.");
        onBack();
      }, 1500);
    } catch (error) {
      console.error("Error sending email:", error);
      setIsSubmitting(false);
      toast.error("Failed to submit order. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Brands
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Amount Selection */}
        <div>
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Select Amount</CardTitle>
              <CardDescription>Choose your gift card denomination</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className={cn("w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", brand.color)}>
                  <img src={brand.logo} alt={brand.name} className="w-10 h-10 rounded" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{brand.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{brand.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {denominations.map((denom) => (
                  <button
                    key={denom}
                    onClick={() => setSelectedAmount(denom)}
                    className={cn(
                      "p-4 rounded-xl border-2 text-center transition-all",
                      selectedAmount === denom
                        ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    )}
                  >
                    <span className="block text-lg font-bold text-slate-900 dark:text-white">₹{denom}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Gift Card</span>
                  </button>
                ))}
                <button
                  onClick={() => setSelectedAmount(parseInt(customAmount) || 0)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all",
                    customAmount && selectedAmount === parseInt(customAmount)
                      ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  <span className="block text-lg font-bold text-slate-900 dark:text-white">Custom</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Enter amount</span>
                </button>
              </div>

              {customAmount && (
                <div className="mb-4">
                  <Label>Custom Amount (₹)</Label>
                  <Input
                    type="number"
                    min="50"
                    max="10000"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(parseInt(e.target.value) || 0);
                    }}
                    placeholder="Enter amount between ₹50 - ₹10,000"
                    className="mt-1"
                  />
                </div>
              )}

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Gift Card Value</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{selectedAmount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Convenience Fee</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900 dark:text-white">Total Payable</span>
                  <span className="text-xl font-bold text-rose-500">₹{selectedAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment */}
        <div>
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Payment Details</CardTitle>
              <CardDescription>Scan QR code or use UPI ID to pay</CardDescription>
            </CardHeader>
            <CardContent>
              {/* QR Code */}
              <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200">
                  <div className="w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-slate-800" />
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">Scan with any UPI app</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowScanner(!showScanner)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {showScanner ? "Hide Scanner" : "Open Scanner"}
                </Button>
              </div>

              {/* QR Scanner Modal */}
              {showScanner && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Scan QR Code</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowScanner(false)}>
                        ✕
                      </Button>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-8 flex items-center justify-center">
                      <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center">
                        <QrCode className="w-48 h-48 text-slate-800" />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-4">
                      Point your camera at the QR code to make payment
                    </p>
                  </div>
                </div>
              )}

              {/* UPI ID */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">UPI ID</p>
                    <p className="font-mono font-semibold text-slate-900 dark:text-white">{upiId}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopyUpi}>
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-6">
                <p className="text-xs text-slate-500 dark:text-slate-400">Merchant Name</p>
                <p className="font-semibold text-slate-900 dark:text-white">{merchantName}</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Instructions:</strong> Please complete the payment using the QR code above. After payment, enter your UTR/Transaction ID and email address below. Your request will be reviewed by our team and the gift card code will be delivered to your email.
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="utr">UTR/Transaction ID *</Label>
                  <Input
                    id="utr"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="Enter 12-digit UTR number"
                    className="mt-1"
                    maxLength={12}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email to receive gift card"
                      className="pl-10 mt-1"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Gift card will be sent to this email: <strong>{email || "your email"}</strong>
                  </p>
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      className="pl-10 mt-1"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Payment Screenshot Upload */}
                <div>
                  <Label>Payment Screenshot (Optional)</Label>
                  <div className="mt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {screenshot ? "Change Screenshot" : "Upload Payment Screenshot"}
                    </Button>
                    {screenshot && (
                      <div className="mt-2">
                        <img src={screenshot} alt="Payment screenshot" className="w-full h-32 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Gift Card</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{brand.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Amount</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{selectedAmount}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Will be sent to</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{email || "your email"}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 h-12 text-base"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Submit Payment Details"}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Shield className="w-4 h-4" />
                  Your payment details are secure and encrypted
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}