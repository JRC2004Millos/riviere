import { AboutRiviere } from "@/components/home/about-riviere";
import { BrandValues } from "@/components/home/brand-values";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedCollection />
      <AboutRiviere />
      <BrandValues />
    </main>
  );
}
