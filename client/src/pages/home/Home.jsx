import MainLayout from "../../layouts/MainLayout";
import Hero from "../../components/sections/Hero";
import Features from "../../components/sections/Features";
import DashboardPreview from "../../components/sections/DashboardPreview";
import Testimonials from "../../components/sections/Testimonials";
import CTA from "../../components/sections/CTA";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <DashboardPreview />
      <Testimonials />
      <CTA />
    </MainLayout>
  );
}
