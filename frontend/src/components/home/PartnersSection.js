import React from "react";
import nikeLogo from "../../assets/partners/nike.png";
import edgeLogo from "../../assets/partners/edge.png";
import pumaLogo from "../../assets/partners/puma.png";
import icloudLogo from "../../assets/partners/icloud.png";
import windowsLogo from "../../assets/partners/windows.png";
import appleLogo from "../../assets/partners/apple.png";

function PartnersSection() {
  const partners = [
    { name: "Nike", logo: nikeLogo },
    { name: "Edge", logo: edgeLogo },
    { name: "Puma", logo: pumaLogo },
    { name: "iCloud", logo: icloudLogo },
    { name: "Windows", logo: windowsLogo },
    { name: "Apple", logo: appleLogo },
    { name: "Nike", logo: nikeLogo },
    { name: "Edge", logo: edgeLogo },
    { name: "Puma", logo: pumaLogo },
    { name: "iCloud", logo: icloudLogo },
    { name: "Windows", logo: windowsLogo },
    { name: "Apple", logo: appleLogo },
  ];

  return (
    <section className="partners-section clean-partners-section">
      <div className="container">
        <div className="section-heading text-center">
          <h2 className="partners-title">Our Partners</h2>
        </div>

        <div className="partners-marquee partners-clean-marquee">
          <div className="partners-track">
            {partners.map((partner, index) => (
              <div className="partner-logo-item" key={index}>
                <img src={partner.logo} alt={partner.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartnersSection;