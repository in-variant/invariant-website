import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Star, Heart, ShoppingBag, ArrowRight, ArrowLeft, Check, Truck, ShieldCheck } from "lucide-react";

export interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  highlights: string[];
  details: string;
  images: string[];
  dosages: string[];
  specsLabel?: string;
}

interface InitiativeProductDetailProps {
  product: ProductData;
  breadcrumbPath: { label: string; href?: string }[];
}

export default function InitiativeProductDetail({ product, breadcrumbPath }: InitiativeProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDosage, setSelectedDosage] = useState(product.dosages[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans" style={{ paddingTop: '200px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-10">
          <ol className="flex items-center space-x-2 text-xs font-mono tracking-widest uppercase">
            {breadcrumbPath.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                {item.href ? (
                  <a href={item.href} className="text-zinc-500 hover:text-emerald-500 transition-colors">{item.label}</a>
                ) : (
                  <span className="text-emerald-500 font-bold">{item.label}</span>
                )}
                {idx < breadcrumbPath.length - 1 && <span className="text-zinc-700">/</span>}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 items-start">
          {/* Product Gallery */}
          <div className="relative group">
            {/* Main Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/5 mb-6 group-hover:border-emerald-500/20 transition-colors duration-500">
              <img 
                src={product.images[currentImageIndex]} 
                alt={`${product.name}`}
                className="object-cover h-full w-full grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
              
              <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={prevImage} 
                  className="pointer-events-auto bg-black/60 backdrop-blur-md rounded-full p-4 border border-white/10 hover:bg-emerald-500 hover:text-black transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextImage} 
                  className="pointer-events-auto bg-black/60 backdrop-blur-md rounded-full p-4 border border-white/10 hover:bg-emerald-500 hover:text-black transition-all"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Badges */}
              <div className="absolute top-8 left-8">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-tighter">Certified Technology</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "aspect-square w-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 border-2",
                    currentImageIndex === idx 
                      ? "border-emerald-500 ring-4 ring-emerald-500/20" 
                      : "border-white/5 hover:border-white/20"
                  )}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className={cn("object-cover h-full w-full grayscale", currentImageIndex === idx && "grayscale-0")}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-32">
            <div className="mb-6">
                <span className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase mb-4 block">{product.category}</span>
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className={cn("w-4 h-4", i <= 4 ? "fill-emerald-500 text-emerald-500" : "text-zinc-700")} />)}
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    {product.reviewCount}+ Clinical Reports
                  </span>
                  <div className="h-4 w-px bg-zinc-800" />
                  <span className="text-xs text-emerald-500 font-black uppercase">FDA Approved</span>
                </div>
            </div>

            <div className="flex items-end gap-4 mb-10">
              <span className="text-5xl font-black text-white italic">${product.price.toFixed(2)}</span>
              <span className="text-zinc-600 font-mono text-sm mb-1">per unit / global delivery</span>
            </div>

            {/* Tabs */}
            <div className="mb-8 border-b border-white/5">
              <nav className="flex space-x-10">
                {['description', 'details', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "py-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-all relative",
                      activeTab === tab
                        ? "text-emerald-500"
                        : "text-zinc-600 hover:text-zinc-400"
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 w-full h-px bg-emerald-500" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab content */}
            <div className="mb-10 min-h-[160px]">
              {activeTab === 'description' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">{product.description}</p>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Clinical Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Check className="w-3 h-3 text-emerald-500" />
                        </div>
                        <span className="text-zinc-300 text-xs">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="grid grid-cols-1 gap-4">
                    {product.details.split('\n').map((line, i) => (
                        <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-zinc-600 text-xs font-mono uppercase">{line.split(':')[0]}</span>
                            <span className="text-white text-xs font-bold italic">{line.split(':')[1]}</span>
                        </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Truck className="text-emerald-500 w-6 h-6 mt-1" />
                    <div>
                      <h3 className="text-white font-bold text-sm">Global Medical Direct</h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed italic">Express temperature-controlled shipping available for biological samples. 2-5 business days average.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <ShieldCheck className="text-emerald-500 w-6 h-6 mt-1" />
                    <div>
                      <h3 className="text-white font-bold text-sm">InVariant Warranty</h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed italic">3-year replacement warranty on all electronics. 24/7 technical support included.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dosage/Spec Selection */}
            <div className="mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4">{product.specsLabel || 'Select Specification'}</h3>
              <div className="flex items-center gap-3">
                {product.dosages.map(dose => (
                  <button
                    key={dose}
                    onClick={() => setSelectedDosage(dose)}
                    className={cn(
                      "flex-1 py-3 border font-mono text-[10px] tracking-widest uppercase transition-all duration-300 rounded-lg",
                      selectedDosage === dose
                        ? "bg-emerald-500 border-emerald-500 text-black font-black"
                        : "border-white/10 text-zinc-500 hover:border-emerald-500/50 hover:text-emerald-500"
                    )}
                  >
                    {dose}
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase Row */}
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2">
                  <button
                    onClick={decreaseQuantity}
                    className="p-3 text-zinc-500 hover:text-white transition-colors disabled:opacity-20"
                    disabled={quantity <= 1}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-white font-mono">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="p-3 text-zinc-500 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  className="flex-1 bg-white text-black py-4 px-8 rounded-xl font-black italic uppercase tracking-tighter hover:bg-emerald-500 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Initiate Order
                </button>

                <button 
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={cn(
                        "p-4 rounded-xl border transition-all active:scale-95",
                        isWishlisted 
                            ? "bg-red-500/20 border-red-500 text-red-500" 
                            : "border-white/10 text-zinc-600 hover:border-red-500/40"
                    )}
                >
                    <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
                </button>
            </div>
            
            <p className="mt-8 text-[10px] text-zinc-700 font-mono text-center uppercase tracking-[0.2em]">
                Secure payment gateway powered by InVariant Finance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
