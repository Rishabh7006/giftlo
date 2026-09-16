import { useState } from "react";
import { Search, Gift, Star, Shield, Zap, MessageCircle, ChevronRight, Sparkles, TrendingUp, Clock, CheckCircle2, X, BadgePercent, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { brands, categories, type Brand } from "@/lib/data";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";

interface HomePageProps {
  onSelectBrand: (brand: Brand) => void;
}

export function HomePage({ onSelectBrand }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter brands based on search and category
  const filteredBrands = brands.filter((brand) => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Check if we're in search mode
  const isSearching = searchQuery.trim().length > 0;

  // Popular brands - filter by category if selected, otherwise show top 8
  const popularBrands = selectedCategory === "All" && !isSearching
    ? brands.slice(0, 8) 
    : filteredBrands.slice(0, 8);

  // Featured brands - filter by category if selected, otherwise show top 4
  const featuredBrands = selectedCategory === "All" && !isSearching
    ? brands.slice(0, 4) 
    : filteredBrands.slice(0, 4);

  const handleWhatsAppInquiry = () => {
    const message = config.whatsappMessages.generalInquiry();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

    const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <Sparkles className="w-3 h-3 mr-1" /> {config.siteName} - India's Trusted Gift Card Store
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Gift Cards for Every Occasion
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Choose from {brands.length}+ top brands. Instant delivery, best prices, and secure transactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search gift cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-white/95 border-0 shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button
                className="bg-slate-900 hover:bg-slate-800 h-12 px-6"
                onClick={handleWhatsAppInquiry}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </div>
            {/* Search suggestions */}
            {isSearching && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-white/80 text-sm">Popular:</span>
                {["Amazon", "Flipkart", "Swiggy", "PVR", "Spotify"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="text-sm text-white bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Zap, label: "Instant Delivery", desc: "Within minutes" },
              { icon: Shield, label: "100% Secure", desc: "Verified sellers" },
              { icon: Star, label: "Best Prices", desc: "Guaranteed lowest" },
              { icon: MessageCircle, label: "WhatsApp Support", desc: "Quick assistance" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white shrink-0">Categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0",
                  selectedCategory === category
                    ? "bg-rose-500 text-white shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search Results Section - Shows when searching */}
      {isSearching && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Found {filteredBrands.length} gift card{filteredBrands.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="ghost" onClick={clearSearch} className="text-rose-500">
              Clear Search <X className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {filteredBrands.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredBrands.map((brand) => (
                <Card
                  key={brand.id}
                  className="group cursor-pointer border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                  onClick={() => onSelectBrand(brand)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={cn("w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0", brand.color)}>
                        <img src={brand.logo} alt={brand.name} className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-contain" />
                      </div>
                      <div className="ml-1">
                        {brand.discountRate ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-[10px] sm:text-xs">
                            <BadgePercent className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" /> {brand.discountRate}% OFF
                          </Badge>
                        ) : brand.isPromoCode ? (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 text-[10px] sm:text-xs">
                            <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" /> Promo
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white mb-0.5 sm:mb-1 truncate">{brand.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2 sm:mb-3">{brand.category}</p>
                    <span className="text-xs sm:text-sm font-semibold text-rose-500">Buy Now →</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No gift cards found matching "{searchQuery}"</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Try searching for "Amazon", "Swiggy", "PVR", etc.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={clearSearch}
              >
                Clear Search
              </Button>
            </div>
          )}
        </section>
      )}

      {/* Popular Gift Cards - Hidden when searching */}
      {!isSearching && popularBrands.length > 0 && (
        <section  id="popular" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {selectedCategory === "All" ? "Popular Gift Cards" : `Popular ${selectedCategory} Gift Cards`}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {selectedCategory === "All" ? "Most loved by our customers" : `Top ${selectedCategory.toLowerCase()} gift cards`}
              </p>
            </div>
            <Button variant="ghost" className="text-rose-500" onClick={() => scrollToSection("all-brands")}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {popularBrands.map((brand) => (
              <Card
                key={brand.id}
                className="group cursor-pointer border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                onClick={() => onSelectBrand(brand)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={cn("w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0", brand.color)}>
                      <img src={brand.logo} alt={brand.name} className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-contain" />
                    </div>
                    <div className="ml-1">
                      {brand.discountRate ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-[10px] sm:text-xs">
                          <BadgePercent className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" /> {brand.discountRate}% OFF
                        </Badge>
                      ) : brand.isPromoCode ? (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 text-[10px] sm:text-xs">
                          <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" /> Promo
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white mb-0.5 sm:mb-1 truncate">{brand.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2 sm:mb-3">{brand.category}</p>
                  <span className="text-xs sm:text-sm font-semibold text-rose-500">Buy Now →</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Featured Brands - Hidden when searching */}
      {!isSearching && featuredBrands.length > 0 && (
        <section id="featured" className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedCategory === "All" ? "Featured Brands" : `Featured ${selectedCategory} Brands`}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  {selectedCategory === "All" ? "Top brands with exclusive offers" : `Top ${selectedCategory.toLowerCase()} brands with exclusive offers`}
                </p>
              </div>
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                <TrendingUp className="w-3 h-3 mr-1" /> Trending
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredBrands.map((brand) => (
                <div
                  key={brand.id}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                  onClick={() => onSelectBrand(brand)}
                >
                  <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mx-auto mb-4 shadow-lg", brand.color)}>
                    <img src={brand.logo} alt={brand.name} className="w-10 h-10 rounded-xl" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{brand.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {brand.discountRate ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">{brand.discountRate}% OFF</span>
                    ) : brand.isPromoCode ? (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">Promo Codes</span>
                    ) : (
                      "Up to 10% off"
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Brands - Shows filtered by category and search */}
      {!isSearching && (
        <section id="all-brands" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {selectedCategory === "All" ? "All Gift Cards" : `${selectedCategory} Gift Cards`}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {selectedCategory === "All" ? "Browse our complete collection" : `Showing ${filteredBrands.length} ${selectedCategory.toLowerCase()} gift cards`}
              </p>
            </div>
          </div>

          {filteredBrands.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredBrands.map((brand) => (
                <Card
                  key={brand.id}
                  className="group cursor-pointer border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                  onClick={() => onSelectBrand(brand)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={cn("w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0", brand.color)}>
                        <img src={brand.logo} alt={brand.name} className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-contain" />
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-1">
                        {brand.discountRate ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-[10px] sm:text-xs">
                            <BadgePercent className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" /> {brand.discountRate}% OFF
                          </Badge>
                        ) : brand.isPromoCode ? (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 text-[10px] sm:text-xs">
                            <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" /> Promo
                          </Badge>
                        ) : null}
                        {brand.specialOffers && brand.specialOffers.length > 0 && (
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-[10px] sm:text-xs hidden sm:flex">
                            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" /> Offers
                          </Badge>
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white mb-0.5 sm:mb-1 truncate">{brand.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2 sm:mb-3">{brand.category}</p>
                    <span className="text-xs sm:text-sm font-semibold text-rose-500">Buy Now →</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No gift cards found in {selectedCategory} category</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </section>
      )}

      {/* How It Works */}
      <section id="how-it-works" className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Choose Your Card", desc: "Browse our collection and select your favorite brand", icon: Gift },
              { step: "2", title: "Order on WhatsApp", desc: "Click the WhatsApp button and we'll help you complete your purchase", icon: MessageCircle },
              { step: "3", title: "Get Your Code", desc: "Receive your gift card code instantly on WhatsApp/Email", icon: CheckCircle2 },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-rose-500" />
                </div>
                <div className="text-3xl font-bold text-rose-500 mb-2">{item.step}</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: "How do I receive my gift card?", a: "After you order on WhatsApp and complete the payment, we'll send your gift card code directly to your WhatsApp or email within minutes." },
            { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, net banking, and all major payment methods. Our team will guide you through the process on WhatsApp." },
            { q: "Are the gift cards genuine?", a: "Yes, all our gift cards are 100% genuine and sourced directly from authorized distributors. We guarantee authenticity." },
            { q: "How long does delivery take?", a: "Most gift cards are delivered instantly. In some cases, it may take up to 30 minutes for verification." },
            { q: "Can I get a refund?", a: "Gift cards are non-refundable once delivered. However, if you have any issues, contact us on WhatsApp and we'll help resolve them." },
          ].map((faq) => (
            <Card key={faq.q} className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-br from-rose-500 to-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-white/90 mb-6">Connect with us on WhatsApp for instant support</p>
          <Button
            className="bg-white text-rose-500 hover:bg-slate-100 h-12 px-8"
            onClick={handleWhatsAppInquiry}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat on WhatsApp
          </Button>
          {/* <p className="text-white/80 mt-4 text-sm">+91 {config.whatsappNumber}</p> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{config.siteName}</h3>
              <p className="text-sm text-slate-400">Your one-stop destination for gift cards from top brands.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <button 
                    onClick={() => scrollToSection("popular")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Popular Gift Cards
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("categories")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Categories
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("featured")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Featured Brands
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("faq")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {/* <li>WhatsApp: +91 {config.whatsappNumber}</li> */}
                <li>Email: {config.businessEmail}</li>
                <li>Mon-Sat: 9AM-9PM</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Instagram</li>
                <li>Facebook</li>
                <li>Twitter</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            © 2026 {config.siteName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}