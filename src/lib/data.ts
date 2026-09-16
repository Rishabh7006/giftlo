import amazonLogo from "../assets/amazon.jpg";
import flipkartLogo from "../assets/flipkart.png";
import myntraLogo from "../assets/myntra_banner.png";
import ajioLogo from "../assets/ajio_banner.png";
import nykaaLogo from "../assets/nykaa_banner.jpg";
import blinkitLogo from "../assets/blinkit_banner.png";
import bigbasketLogo from "../assets/bigbasket_banner.jpg";
import pvrLogo from "../assets/pvr_banner.png";
import pizzaHutLogo from "../assets/pizza_hut_banner.jpg";
import maxLogo from "../assets/max_banner.jpg";
import trendsLogo from "../assets/trends_banner.png";
import swiggyLogo from "../assets/swiggy_banner.jpg";
import zomatoLogo from "../assets/zomoto_banner.png";
import uberLogo from "../assets/uber_banner.png";
import sheinLogo from "../assets/shein_banner.png";


export interface Brand {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  color: string;
  denominations: number[];
  discountRate?: number;
  isPromoCode?: boolean;
  supportsCustomAmount?: boolean;
  specialOffers?: {
    code: string;
    description: string;
    discount: string;
    minOrder?: string;
    isFree?: boolean;
    isPaid?: boolean;
    price?: number;
  }[];
}

export const brands: Brand[] = [
  {
    id: "amazon",
    name: "Amazon",
    logo: amazonLogo,
    category: "Shopping",
    description: "Amazon gift cards with 2% discount on all denominations.",
    color: "from-orange-400 to-amber-600",
    denominations: [4000, 5000],
    discountRate: 2,
    supportsCustomAmount: false,
  },
  {
    id: "flipkart",
    name: "Flipkart",
    logo: flipkartLogo,
    category: "Shopping",
    description: "Flipkart gift cards with 3% discount on all denominations.",
    color: "from-blue-400 to-indigo-600",
    denominations: [100, 250, 500, 1000, 2000, 5000],
    discountRate: 3,
    supportsCustomAmount: false,
  },
  {
    id: "myntra",
    name: "Myntra",
    logo: myntraLogo,
    category: "Fashion",
    description: "Myntra gift cards with 6% discount on all denominations.",
    color: "from-pink-400 to-rose-600",
    denominations: [100, 250, 500, 1000, 2000, 5000],
    discountRate: 6,
    supportsCustomAmount: false,
  },
  {
    id: "ajio",
    name: "Ajio",
    logo: ajioLogo,
    category: "Fashion",
    description: "Ajio gift cards with 10% discount on all denominations.",
    color: "from-purple-400 to-violet-600",
    denominations: [100, 250, 500, 1000, 2000, 5000],
    discountRate: 10,
    supportsCustomAmount: false,
    specialOffers: [
      {
        code: "XXXXXXXXXX",
        description: "Get 20% flat OFF on minimum bill of ₹1500",
        discount: "20%",
        minOrder: "₹1500",
        isPaid: true,
        price: 30,
      },
    ],
  },
  {
    id: "nykaa",
    name: "Nykaa",
    logo: nykaaLogo,
    category: "Beauty",
    description: "Nykaa gift cards with 8% discount on all denominations.",
    color: "from-pink-400 to-fuchsia-600",
    denominations: [100, 250, 500, 1000, 2000, 5000],
    discountRate: 8,
    supportsCustomAmount: false,
  },
  {
    id: "blinkit",
    name: "Blinkit",
    logo: blinkitLogo,
    category: "Grocery",
    description: "Blinkit gift cards with 5% discount. Special Amul offer available!",
    color: "from-yellow-400 to-amber-600",
    denominations: [100, 250, 500, 1000, 2000],
    discountRate: 5,
    supportsCustomAmount: false,
    specialOffers: [
      {
        code: "BLAMULXXXXXXXXXX",
        description: "Get ₹100 flat OFF on minimum bill of ₹100 on Amul ice cream only",
        discount: "₹100 OFF",
        minOrder: "₹100",
        isPaid: true,
        price: 49,
      },
    ],
  },
  {
    id: "bigbasket",
    name: "BigBasket",
    logo: bigbasketLogo,
    category: "Grocery",
    description: "BigBasket gift cards with 5% discount. New user offers available!",
    color: "from-green-400 to-emerald-600",
    denominations: [50, 100],
    discountRate: 5,
    supportsCustomAmount: false,
    specialOffers: [
      {
        code: "PLBB150-XXXXXXXXXXXXXXX",
        description: "New user - Get ₹150 OFF on minimum order of ₹299",
        discount: "₹150 OFF",
        minOrder: "₹299",
        isPaid: true,
      },
      {
        code: "BBCHXXXXXXXXXXXXXXXX",
        description: "New user - Get ₹160 cashback on minimum order of ₹349",
        discount: "₹160 Cashback",
        minOrder: "₹349",
        isPaid: true,
      },
      {
        code: "BBCHF07-XXXXXXXXXXXXX",
        description: "New user - Get ₹200 cashback on minimum order of ₹499",
        discount: "₹200 Cashback",
        minOrder: "₹499",
        isPaid: true,
      },
    ],
  },
  {
    id: "spotify",
    name: "Spotify",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    category: "Entertainment",
    description: "Spotify Premium 3-month codes available at best prices.",
    color: "from-green-400 to-green-600",
    denominations: [],
    isPromoCode: true,
    supportsCustomAmount: false,
    specialOffers: [
      {
        code: "XXXXXXXXXXXXXXXXXX",
        description: "Spotify Premium 3-month code - Best price guaranteed",
        discount: "3 Months Premium",
        isPaid: true,
        price: 10,
      },
    ],
  },
  {
    id: "dominos",
    name: "Dominos",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Domino%27s_pizza_logo.svg",
    category: "Food",
    description: "Dominos gift cards with 20% discount. Special offer: Order worth ₹199 at just ₹99!",
    color: "from-blue-400 to-blue-700",
    denominations: [100, 250, 500, 1000, 2000],
    discountRate: 20,
    supportsCustomAmount: false,
    specialOffers: [
      {
        code: "XXXXXXXXXXXXXXX",
        description: "Get any order worth ₹199 at just ₹99",
        discount: "50% OFF",
        minOrder: "₹199",
        isPaid: true,
        price: 99,
      },
    ],
  },
  {
    id: "pvr",
    name: "PVR",
    logo: pvrLogo,
    category: "Entertainment",
    description: "PVR gift cards with 25% discount. Special offer on movie bookings!",
    color: "from-red-400 to-rose-600",
    denominations: [100, 250, 500, 1000, 2000],
    discountRate: 25,
    supportsCustomAmount: false,
    specialOffers: [
      {
        code: "XXXXXXXXXXXXXXXXXX",
        description: "Get flat ₹200 OFF when you book 2 seats",
        discount: "₹200 OFF",
        minOrder: "2 Seats",
        isPaid: true,
        price: 39,
      },
    ],
  },
  {
    id: "pizzahut",
    name: "Pizza Hut",
    logo: pizzaHutLogo,
    category: "Food",
    description: "Pizza Hut gift cards with 10% discount on all denominations.",
    color: "from-red-400 to-red-600",
    denominations: [100, 250, 500, 1000, 2000],
    discountRate: 10,
    supportsCustomAmount: false,
  },
  {
    id: "max",
    name: "Max",
    logo: maxLogo,
    category: "Fashion",
    description: "Max gift cards with 10% discount on all denominations.",
    color: "from-orange-400 to-red-600",
    denominations: [100, 250, 500, 1000, 2000],
    discountRate: 10,
    supportsCustomAmount: false,
  },
  {
    id: "trends",
    name: "Trends",
    logo: trendsLogo,
    category: "Fashion",
    description: "Trends gift cards with 10% discount on all denominations.",
    color: "from-pink-400 to-rose-600",
    denominations: [100, 250, 500, 1000, 2000],
    discountRate: 10,
    supportsCustomAmount: false,
  },
  {
    id: "swiggy",
    name: "Swiggy",
    logo: swiggyLogo,
    category: "Food",
    description: "Swiggy gift cards with 3% discount on all denominations.",
    color: "from-orange-400 to-orange-600",
    denominations: [100, 250, 500, 1000, 2000, 5000],
    discountRate: 3,
    supportsCustomAmount: false,
  },
  {
    id: "zomato",
    name: "Zomato",
    logo: zomatoLogo,
    category: "Food",
    description: "Zomato gift cards with 3% discount on all denominations.",
    color: "from-red-400 to-red-600",
    denominations: [100, 250, 500, 1000, 2000, 5000],
    discountRate: 3,
    supportsCustomAmount: false,
  },
  {
    id: "uber",
    name: "Uber",
    logo: uberLogo,
    category: "Travel",
    description: "Uber gift cards with 10% discount on all denominations.",
    color: "from-slate-500 to-slate-700",
    denominations: [100, 250, 500, 1000, 2000],
    discountRate: 10,
    supportsCustomAmount: false,
  },
  {
    id: "shein",
    name: "Shein",
    logo: sheinLogo,
   category: "Fashion",
    description: "Get exclusive Shein promo codes for amazing discounts on trendy fashion.",
    color: "from-black to-slate-800",
    denominations: [],
    isPromoCode: true,
    supportsCustomAmount: false,
    specialOffers: [
      {
        code: "JFY50",
        description: "New user exclusive - Get 50% OFF on your first order",
        discount: "50% OFF",
        isFree: true,
      },
      {
        code: "S09XXXXXXXXX",
        description: "Get ₹800 OFF on minimum order of ₹1,000",
        discount: "₹800 OFF",
        minOrder: "₹1,000",
        isPaid: true,
        price: 99,
      },
    ],
  },
];

export const categories = ["All", "Shopping", "Fashion", "Beauty", "Grocery", "Entertainment", "Food", "Travel"];