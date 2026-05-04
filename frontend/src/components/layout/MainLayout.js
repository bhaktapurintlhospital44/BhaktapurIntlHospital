"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getHomeContent } from "@/lib/api/homeContent";
import { reportApi } from "@/lib/api/reports"; // Import the reports API
import { usePathname } from "next/navigation";

export default function MainLayout({ children }) {
  const [phrases, setPhrases] = useState([
    "Caring for your health with compassion and excellence",
    "Dedicated to your wellness and recovery",
    "Providing exceptional healthcare services",
    "Your trusted partner in health",
  ]);

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- NEW REPORTS VISIBILITY STATE ---
  const [reportConfig, setReportConfig] = useState({
    shouldShow: false,
    navLabel: "Reports",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  // Fetch rotating phrases and Report visibility status
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Home Content
        const homeData = await getHomeContent();
        if (homeData?.rotatingTextPhrases?.length > 0) {
          setPhrases(homeData.rotatingTextPhrases);
        }

        // Fetch Report Visibility
        const repData = await reportApi.getReports();
        setReportConfig({
          shouldShow: repData.shouldShow,
          navLabel: repData.navLabel || "Reports",
        });
      } catch (error) {
        console.error("Failed to fetch layout data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/feedbacks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.status === 200 || response.status === 201) {
        setStatus("Success! Feedback sent.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("Sent (Check Admin)");
      }
    } catch (error) {
      setStatus("Server error.");
    }
  };

  const handleLogoError = () => console.log("Logo failed to load");
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const currentPhrase = phrases[currentPhraseIndex];
  const pathname = usePathname();
  const isAdminPanel = pathname && pathname.startsWith("/admin");
  const isServiceDetail =
    pathname && pathname.startsWith("/services/") && pathname !== "/services";

  return (
    <>
      {!isAdminPanel && !isServiceDetail && (
        <header className="site-header" style={{ width: "100%" }}>
          <div className="header-container">
            <div className="logo-section">
              <img
                src="/images/logo.png"
                alt="Bhaktapur International Hospital Logo"
                className="logo-image"
                onError={handleLogoError}
              />
              <div className="logo-text">
                <Link href="/" onClick={closeMobileMenu}>
                  <h1>Bhaktapur International Hospital</h1>
                </Link>
                <p className="rotating-text">{currentPhrase}</p>
              </div>
            </div>

            <div className="nav-container">
              <button
                className="mobile-menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                ☰
              </button>
              <nav
                className={`site-subnav ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}
              >
                <b>
                  <Link href="/" onClick={closeMobileMenu}>
                    Home
                  </Link>
                </b>
                <b>
                  <Link href="/departments" onClick={closeMobileMenu}>
                    Departments
                  </Link>
                </b>

                <b>
                  <Link href="/health-packages" onClick={closeMobileMenu}>
                    Health Packages
                  </Link>
                </b>
                <b>
                  <Link href="/contact-us" onClick={closeMobileMenu}>
                    Contact Us
                  </Link>
                </b>
                <b>
                  <Link href="/feel-free-to-ask-us" onClick={closeMobileMenu}>
                    Ask Us
                  </Link>
                </b>
                <b>
                  <Link href="/about" onClick={closeMobileMenu}>
                    About Us
                  </Link>
                </b>
                <b>
                  <Link href="/patient-recovery" onClick={closeMobileMenu}>
                    Patient Recovery
                  </Link>
                </b>

                {/* DYNAMIC REPORTS LINK[cite: 2] */}
                {reportConfig.shouldShow && (
                  <b>
                    <Link href="/reports" onClick={closeMobileMenu}>
                      {reportConfig.navLabel}
                    </Link>
                  </b>
                )}
              </nav>
            </div>
          </div>
        </header>
      )}

      <main className="site-main" style={{ width: "100%", minHeight: "80vh" }}>
        {children}
      </main>

      {!isAdminPanel && !isServiceDetail && (
        <footer
          className="site-footer"
          style={{
            width: "100%",
            backgroundColor: "var(--primary-dark)",
            color: "var(--hftext-color)",
            padding: "4rem 0 0 0",
            marginTop: "auto",
          }}
        >
          {/* INNER WRAPPER: Space-between ensures one is far left and one is far right */}
          <div
            style={{
              width: "80%",
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "2rem",
              padding: "0 2rem",
            }}
          >
            {/* 1. CONTACT INFO: Now on the LEFT side of the container */}
            <div
              style={{
                flex: "0 1 400px",
                minWidth: "280px",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                textAlign: "left",
              }}
            >
              <img
                src="/images/logo.png"
                alt="Logo"
                style={{ width: "80px", filter: "brightness(0) invert(1)" }}
              />
              <div style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    marginBottom: "1.5rem",
                    color: "white",
                  }}
                >
                  Bhaktapur International Hospital
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <img
                    src="/images/phone.png"
                    style={{
                      width: "25px",
                      height: "25px",
                      position: "relative",
                      top: "2px", //  pushes image downward
                    }}
                  />
                  9801202550
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <img
                    src="/images/telephone.png"
                    style={{
                      width: "25px",
                      height: "25px",
                      position: "relative",
                      top: "2px", //  pushes image downward
                    }}
                  />
                  015178645
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <img
                    src="/images/ambulance.png"
                    style={{
                      width: "25px",
                      height: "25px",
                      position: "relative",
                      top: "2px", //  pushes image downward
                    }}
                  />
                  02349234
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <img
                    src="/images/footerhospital.png"
                    style={{
                      width: "25px",
                      height: "25px",
                      position: "relative",
                      top: "2px", // 👈 pushes image downward
                    }}
                  />
                  Bhaktapur,Nepal
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <img
                    src="/images/email.png"
                    style={{
                      width: "25px",
                      height: "25px",
                      position: "relative",
                      top: "2px", // 👈 pushes image downward
                    }}
                  />
                  info@bihospital.com
                </p>
              </div>

              {/*  SOCIAL ICONS WITH WHITE CIRCULAR BACKGROUNDS */}
              <div
                style={{ display: "flex", gap: "15px", marginTop: "0.1rem" }}
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/images/linkedin.png"
                    alt="LinkedIn"
                    style={{
                      width: "35px", // Adjusted size slightly larger to account for padding
                      height: "35px",
                      backgroundColor: "white", //  White background
                      borderRadius: "50%", // Circular shape
                      padding: "6px", //  Spacing around the logo
                      display: "block", //  Ensures correct alignment within <a> tag
                    }}
                  />
                </a>

                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/images/ig.png"
                    alt="Instagram"
                    style={{
                      width: "35px",
                      height: "35px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "6px",
                      display: "block",
                    }}
                  />
                </a>

                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/images/twitter.png"
                    alt="Twitter"
                    style={{
                      width: "35px",
                      height: "35px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "6px",
                      display: "block",
                    }}
                  />
                </a>

                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/images/fb.png"
                    alt="Facebook"
                    style={{
                      width: "35px",
                      height: "35px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      padding: "6px",
                      display: "block",
                    }}
                  />
                </a>
              </div>
            </div>

            {/* FEEDBACK FORM */}
            <div style={{ flex: "0 1 550px", minWidth: "300px" }}>
              <h2
                style={{
                  color: "white",
                  marginBottom: "1.5rem",
                  fontSize: "1.8rem",
                }}
              >
                Feedback Form
              </h2>
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  marginRight: "40px",
                }}
              >
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "grid", gap: "1rem" }}
                >
                  <label
                    htmlFor="name"
                    style={{ color: "var(--hftext-color)", fontSize: "0.9rem" }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    style={footerInputStyle}
                    required
                  />

                  <label
                    htmlFor="email"
                    style={{ color: "var(--hftext-color)", fontSize: "0.9rem" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    style={footerInputStyle}
                    required
                  />

                  <label
                    htmlFor="subject"
                    style={{ color: "var(--hftext-color)", fontSize: "0.9rem" }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    style={footerInputStyle}
                    required
                  />

                  <label
                    htmlFor="message"
                    style={{ color: "var(--hftext-color)", fontSize: "0.9rem" }}
                  >
                    Message
                  </label>
                  <textarea
                    placeholder="Message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    style={footerInputStyle}
                    required
                  ></textarea>

                  <button type="submit" style={footerButtonStyle}>
                    Send Message
                  </button>
                  {status && (
                    <p
                      style={{
                        color: "white",
                        marginTop: "10px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {status}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              marginTop: "4rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              padding: "1.5rem 2rem",
              textAlign: "center",
              fontSize: "0.9rem",
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
          >
            <p>
              © {new Date().getFullYear()} Bhaktapur International Hospital Pvt.
              Ltd. | All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
const footerInputStyle = {
  width: "100%",
  padding: "0.7rem",
  borderRadius: "var(--radius-md)",
  border: "1px solid rgba(255,255,255,0.2)",
  backgroundColor: "rgba(255,255,255,0.1)",
  color: "white",
  fontSize: "0.9rem",
  outline: "none",
};

const footerButtonStyle = {
  backgroundColor: "var(--secondary-color)",
  color: "white",
  padding: "0.8rem",
  borderRadius: "var(--radius-md)",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
};

const socialIconStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  backgroundColor: "white",
  color: "var(--primary-dark)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "0.8rem",
  cursor: "pointer",
};
