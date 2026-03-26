import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-6 border-y border-white/10 bg-[radial-gradient(35%_80%_at_25%_0%,rgba(16,185,129,0.08),transparent)] px-4 py-12 my-24">
      <PlusIcon
        className="absolute top-[-12.5px] left-[-11.5px] z-1 size-6 text-emerald-500/50"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute top-[-12.5px] right-[-11.5px] z-1 size-6 text-emerald-500/50"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute bottom-[-12.5px] left-[-11.5px] z-1 size-6 text-emerald-500/50"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute right-[-11.5px] bottom-[-12.5px] z-1 size-6 text-emerald-500/50"
        strokeWidth={1}
      />

      <div className="-inset-y-6 pointer-events-none absolute left-0 w-px border-l border-white/10" />
      <div className="-inset-y-6 pointer-events-none absolute right-0 w-px border-r border-white/10" />

      <div className="-z-10 absolute top-0 left-1/2 h-full border-l border-dashed border-white/5" />


      <div className="space-y-1">
        <h2 className="text-center font-bold text-3xl text-white">
          Let your plans shape the future.
        </h2>
        <p className="text-center text-gray-400">
          Partner with InVariant today for a healthier tomorrow.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5">Contact Sales</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white border-none flex items-center gap-2">
          Get Started <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
