import { Header } from "@/components/ui/header-3";
import { Footer } from "@/components/ui/large-name-footer";
import { ButtonRotate } from "@/components/ui/button-rotate";

export function MasterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ButtonRotate />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
