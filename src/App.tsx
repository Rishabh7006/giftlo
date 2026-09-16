import { useState, useEffect } from "react";
import { HomePage } from "@/components/HomePage";
import { BrandPage } from "@/components/BrandPage";
import { brands, type Brand } from "@/lib/data";

// Simple hash-based router
function getBrandFromHash(): Brand | null {
  const hash = window.location.hash;
  if (hash.startsWith("#/brand/")) {
    const brandId = hash.replace("#/brand/", "");
    return brands.find((b) => b.id === brandId) || null;
  }
  return null;
}

export default function App() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(() => getBrandFromHash());

  // Listen for hash changes (back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      setSelectedBrand(getBrandFromHash());
      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSelectBrand = (brand: Brand) => {
    // Update URL hash
    window.location.hash = `/brand/${brand.id}`;
    setSelectedBrand(brand);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    // Clear the hash to go back to home
    window.location.hash = "/";
    setSelectedBrand(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {selectedBrand ? (
        <BrandPage
          brand={selectedBrand}
          onBack={handleBack}
        />
      ) : (
        <HomePage onSelectBrand={handleSelectBrand} />
      )}
    </div>
  );
}