import { motion } from "framer-motion";

import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import JourneySection from "../../components/JourneySection";
import StatsSection from "../../components/StatsSection";
import ProblemsSection from "../../components/ProblemsSection";
import SolutionsSection from "../../components/SolutionsSection";
import CategoriesSection from "../../components/CategoriesSection";
import HowItWorks from "../../components/HowItWorks";
import WhyChooseUs from "../../components/WhyChooseUs";
import CTASection from "../../components/CTASection";
import Footer from "../../components/Footer";

function FadeSection({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      viewport={{
        once: true,
        amount: 0.2,
      }}

      transition={{
        duration: 1.2,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

function LandingPage() {
  return (
    <>
      <Navbar />

      <FadeSection>
        <Hero />
      </FadeSection>

      <FadeSection>
        <JourneySection />
      </FadeSection>

      {/* Platform Statistics */}
      <FadeSection>
        <StatsSection />
      </FadeSection>

      <FadeSection>
        <ProblemsSection />
      </FadeSection>

      <FadeSection>
        <SolutionsSection />
      </FadeSection>

      <FadeSection>
        <CategoriesSection />
      </FadeSection>

      <FadeSection>
        <HowItWorks />
      </FadeSection>

      <FadeSection>
        <WhyChooseUs />
      </FadeSection>

      <FadeSection>
        <CTASection />
      </FadeSection>

      <FadeSection>
        <Footer />
      </FadeSection>
    </>
  );
}

export default LandingPage;
