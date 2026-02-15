import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TapToUpButton from "../ui/TapToUpButton";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <TapToUpButton />
    </div>
  );
}
