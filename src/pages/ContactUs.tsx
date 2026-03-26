import * as React from "react";
import { ProfessionalConnect } from "@/components/ui/get-in-touch";
import { MultiStepForm } from "@/components/ui/multi-step-form";
import { CallToAction } from "@/components/ui/cta-3";
import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";
import { 
  Globe, 
  Info, 
  AlertTriangle, 
  ArrowUpRight,
  Mail,
  Phone
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MORALS: CarouselItem[] = [
  { id: 1, title: "INTEGRITY" },
  { id: 2, title: "COMPASSION" },
  { id: 3, title: "EXCELLENCE" },
  { id: 4, title: "INNOVATION" },
  { id: 5, title: "PATIENT-FIRST" },
  { id: 6, title: "QUALITY" },
  { id: 7, title: "SUSTAINABILITY" },
  { id: 8, title: "COMPLIANCE" },
  { id: 9, title: "TRANSPARENCY" },
];

const TooltipIcon = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-gray-500 cursor-pointer" />
      </TooltipTrigger>
      <TooltipContent className="bg-[#1e293b] border-white/10 text-white">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function ContactUs() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col bg-[#0a0a0a] min-h-screen">
      {/* 1. Get In Touch / Social Grid */}
      <ProfessionalConnect />

      {/* 2. Multi-Step Inquiry Form Section */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
                <div>
                    <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase mb-4 block">Inquiry Form</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                        Send us a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Professional</span> Inquiry
                    </h2>
                    <p className="text-gray-400 mt-6 text-lg leading-relaxed">
                        Whether you are a healthcare provider looking for partnership or a potential team member, our structured inquiry system ensures your request reaches the right department.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-colors">
                        <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-white font-semibold">Email Us</p>
                            <p className="text-gray-500 text-sm">contact@pharmola.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-colors">
                        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-white font-semibold">Call Us</p>
                            <p className="text-gray-500 text-sm">+91 123 456 7890</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form */}
            <div className="flex justify-center">
                <MultiStepForm
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    title="Partnership Inquiry"
                    description="Complete the steps to help us understand your needs."
                    onBack={handleBack}
                    onNext={handleNext}
                    onClose={() => console.log("Form reset")}
                    footerContent={
                    <a href="#" className="flex items-center gap-1 text-sm text-emerald-400 hover:underline">
                        Need Help? <ArrowUpRight className="h-4 w-4" />
                    </a>
                    }
                >
                    {currentStep === 1 && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="full-name" className="text-gray-300">Full Name</Label>
                                <Input id="full-name" placeholder="John Doe" className="bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-300">Work Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 text-white" />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="country" className="text-gray-300">Country of Registry</Label>
                                <TooltipIcon text="Select where your organization is registered." />
                            </div>
                            <Select>
                                <SelectTrigger id="country" className="bg-white/5 border-white/10 text-white">
                                    <Globe className="h-4 w-4 mr-2 text-gray-500" />
                                    <SelectValue placeholder="Select a country..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                                    <SelectItem value="in">India</SelectItem>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="ae">United Arab Emirates</SelectItem>
                                    <SelectItem value="gb">United Kingdom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="inquiry-type" className="text-gray-300">Inquiry Type</Label>
                                <TooltipIcon text="Help us route your request to the correct team." />
                            </div>
                             <Select>
                                <SelectTrigger id="inquiry-type" className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Choose type..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                                    <SelectItem value="partnership">Clinical Partnership</SelectItem>
                                    <SelectItem value="supply">Supply Chain</SelectItem>
                                    <SelectItem value="career">Career Opportunity</SelectItem>
                                    <SelectItem value="support">General Support</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="message" className="text-gray-300">Your Message</Label>
                                <TooltipIcon text="Briefly describe your requirements." />
                            </div>
                            <textarea 
                                id="message" 
                                className="w-full min-h-[100px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                                placeholder="How can we help you?"
                            />
                        </div>
                        </div>

                        <Alert variant="warning" className="bg-emerald-500/5 border-emerald-500/20 text-emerald-400">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Please verify all details before proceeding to the final summary.
                            </AlertDescription>
                        </Alert>
                    </div>
                    )}

                    {currentStep === 3 && (
                        <div className="py-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                <ArrowUpRight className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Ready to Send</h3>
                            <p className="text-gray-400">Your inquiry is prepared. Once you click submit, our team will review and respond within 24-48 hours.</p>
                        </div>
                    )}
                </MultiStepForm>
            </div>
        </div>
      </section>

      {/* 3. CTA Section */}
      <CallToAction />

      {/* 4. Ethics Ribbon */}
      <div className="pb-24">
        <RulerCarousel originalItems={MORALS} />
      </div>
    </div>
  );
}

