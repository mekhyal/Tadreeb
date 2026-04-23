import React from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import AudienceSection from "../components/home/AudienceSection";
import AboutSection from "../components/home/AboutSection";
import PartnersSection from "../components/home/PartnersSection";
import ContactSection from "../components/home/ContactSection";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <StatsSection />

        <section id="students-companies">
          <AudienceSection />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section id="partners">
          <PartnersSection />
        </section>

        <section id="contact">
          <ContactSection />
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;