"use client"

import React, { useState } from 'react';
import { Upload, Send, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Alert, AlertDescription } from "@/components/ui/alert";

export function CareersForm() {
  const [fileName, setFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit");
        return;
      }
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-12 text-center max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Application Received!</h3>
        <p className="text-gray-400 mb-8">
          Thank you for your interest in InVariant. Our recruitment team will review your profile and get back to you shortly.
        </p>
        <Button 
          variant="outline" 
          onClick={() => setIsSuccess(false)}
          className="border-white/10 text-gray-300 hover:bg-white/5"
        >
          Send Another Application
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="h-full bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Apply for a Position</h2>
          <p className="text-gray-400 italic">
            "For more details visit Linkedin."
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input id="name" required placeholder="Your full name" className="bg-white/5 border-white/10 text-white focus:ring-emerald-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input id="email" type="email" required placeholder="email@example.com" className="bg-white/5 border-white/10 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input id="phone" required placeholder="+91 000 000 0000" className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post" className="text-gray-300">Select Post *</Label>
              <Select required>
                <SelectTrigger id="post" className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select Post" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="design">Product Designer</SelectItem>
                  <SelectItem value="sales">Medical Representative</SelectItem>
                  <SelectItem value="qa">QA Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume" className="text-gray-300">Upload Resume (PDF, DOC, DOCX - Max 2MB)</Label>
            <div className="relative group">
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 border-dashed transition-colors ${fileName ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/30'}`}>
                <div className="flex items-center gap-3">
                  <Upload className={`w-5 h-5 ${fileName ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${fileName ? 'text-white' : 'text-gray-500 text-xs'}`}>
                    {fileName || "No file chosen"}
                  </span>
                </div>
                <Button type="button" variant="ghost" size="sm" className="pointer-events-none text-emerald-400 text-xs">
                  Browse
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-300">Your Message</Label>
            <textarea 
              id="message" 
              className="w-full min-h-[100px] rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all" 
              placeholder="Briefly tell us why you're a great fit..."
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {isSubmitting ? "Processing..." : (
              <>
                Submit Application <Send className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
