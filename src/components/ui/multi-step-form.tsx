"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

const multiStepFormVariants = cva(
  "flex flex-col bg-[#0a0a0a]/80 backdrop-blur-xl border-white/5",
  {
    variants: {
      size: {
        default: "md:w-[700px]",
        sm: "md:w-[550px]",
        lg: "md:w-[850px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface MultiStepFormProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof multiStepFormVariants> {
  currentStep: number;
  totalSteps: number;
  title: string;
  description: string;
  onBack: () => void;
  onNext: () => void;
  onClose?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  footerContent?: React.ReactNode;
}

const MultiStepForm = React.forwardRef<HTMLDivElement, MultiStepFormProps>(
  ({
    className,
    size,
    currentStep,
    totalSteps,
    title,
    description,
    onBack,
    onNext,
    onClose,
    backButtonText = "Back",
    nextButtonText = "Next Step",
    footerContent,
    children,
    ...props
  }, ref) => {
    const progress = Math.round((currentStep / totalSteps) * 100);

    const variants = {
      hidden: { opacity: 0, x: 100 },
      enter: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 },
    };

    return (
      <Card ref={ref} className={cn(multiStepFormVariants({ size }), className)} {...props}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-white">{title}</CardTitle>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CardDescription className="text-gray-400">{description}</CardDescription>
          <div className="flex items-center gap-4 pt-2">
            <Progress value={progress} className="w-full bg-white/5" />
            <p className="text-sm text-gray-500 whitespace-nowrap">
              {currentStep}/{totalSteps} completed
            </p>
          </div>
        </CardHeader>

        <CardContent className="min-h-[300px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={variants}
              initial="hidden"
              animate="enter"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div>{footerContent}</div>
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={onBack} className="border-white/10 text-gray-300 hover:bg-white/5">
                {backButtonText}
              </Button>
            )}
            <Button onClick={onNext} className="bg-emerald-600 hover:bg-emerald-500 text-white border-none">
              {nextButtonText}
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
);

MultiStepForm.displayName = "MultiStepForm";

export { MultiStepForm };
