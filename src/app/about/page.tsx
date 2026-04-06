import type { Metadata } from "next";
import { AboutUsContent } from "@/components/about/AboutUsContent";

export const metadata: Metadata = {
  title: "About Us",
  description: "Car Editing Studio — who we work with and how we work.",
};

export default function AboutPage() {
  return (
    <AboutUsContent />
  );
}
