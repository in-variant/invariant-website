import InitiativeProductDetail from './initiative-product-detail';
import type { ProductData } from './initiative-product-detail';

const diabetesProductData: ProductData = {
  id: "glucoguard-monitor-pro",
  name: "Glucoguard Monitor Pro",
  category: "InVariant Metabolic Suite",
  price: 89.99,
  rating: 4.9,
  reviewCount: 450,
  description: "The Glucoguard Monitor Pro is our most advanced non-invasive monitoring solution. It provides real-time glycemic index tracking without the need for traditional blood pricking, utilizing bio-impedance technology for medical-grade accuracy.",
  highlights: [
    "Medical-grade Bio-impedance sensor",
    "Real-time Cloud synchronization with doctors",
    "Zero-prick continuous monitoring",
    "Hypoglycemic event prediction AI",
    "Hypo-allergenic medical silicone strap"
  ],
  details: `Display: 1.4" OLED High Contrast
Battery Life: 14 Days
Connectivity: Bluetooth 5.2, WiFi 6
Compatibility: iOS, Android, InVariant Health Cloud
Sensors: Bio-impedance, Heart Rate, Skin Temperature`,
  images: [
    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80",
    "https://images.unsplash.com/photo-1579165466541-74e214905527?w=800&q=80",
    "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&q=80",
    "https://images.unsplash.com/photo-1581595221444-9a73296c0493?w=800&q=80"
  ],
  dosages: ["30mg", "60mg", "90mg"]
};

const breadcrumbPath = [
  { label: "Home", href: "/" },
  { label: "Initiatives", href: "/patient-care" },
  { label: "Diabetics Care" }
];

export default function DiabetesProduct() {
  return <InitiativeProductDetail product={diabetesProductData} breadcrumbPath={breadcrumbPath} />;
}
