// src/app/services/[serviceTitle]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getHomeContent } from "@/lib/api/homeContent";
import Link from "next/link";
import AppointmentSection from "@/components/home/AppointmentSection";

export default function ServiceDetailPage() {
  const { serviceTitle } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getHomeContent();
        if (data && data.services) {
          // Decode the serviceTitle and find matching service
          const decodedServiceTitle = decodeURIComponent(serviceTitle);

          // Find the service by comparing URL-friendly versions of titles
          const foundService = data.services.find((s) => {
            // Create URL-friendly version of the service title
            const urlFriendlyTitle = s.title
              .toLowerCase()
              .replace(/[^a-zA-Z0-9 ]/g, " ") // Replace special chars with spaces
              .replace(/\s+/g, "-") // Replace spaces with hyphens
              .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
              .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

            const urlFriendlyParam = decodedServiceTitle
              .toLowerCase()
              .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

            return urlFriendlyTitle === urlFriendlyParam;
          });

          if (foundService) {
            setService(foundService);
          }
        }
      } catch (error) {
        console.error("Failed to fetch service:", error);
      } finally {
        setLoading(false);
      }
    };

    if (serviceTitle) {
      fetchService();
    }
  }, [serviceTitle]);

  if (loading) {
    return (
      <div className="site-main">
        <p>Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="site-main">
        <h1>Service Not Found</h1>
        <p>The requested service could not be found.</p>
        <Link href="/services">Back to Services</Link>
      </div>
    );
  }

  return (
    <div
      className="site-main"
      style={{
        padding: "20px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          position: "relative",
          marginBottom: "2rem",
          marginTop: "1rem",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ position: "absolute", top: "10px", left: "10px" }}>
          <Link
            href="/"
            className="back-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
              color: "#0b7ac4",
              fontSize: "1.3rem",
              fontWeight: "900",
              padding: "8px 16px",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              border: "1px solid #0b7ac4",
              backgroundColor: "rgba(11, 122, 196, 0.05)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(11, 122, 196, 0.1)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(11, 122, 196, 0.05)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            ← Back
          </Link>
        </div>
        {service.detailedContent?.keyFeatures &&
          Array.isArray(service.detailedContent.keyFeatures) &&
          service.detailedContent.keyFeatures.some(
            (feature) =>
              typeof feature === "string" &&
              feature.includes("24/7 Emergency Services"),
          ) && (
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                display: "flex",
                alignItems: "center",
                padding: "6px 12px",
                backgroundColor: "#f0f9ff",
                borderRadius: "6px",
                border: "1px solid #bae6fd",
              }}
            >
              <strong
                style={{
                  color: "#0b7ac4",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                24/7 Emergency Services
              </strong>
            </div>
          )}
        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            marginBottom: "10px",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              margin: "0.5rem 0",
              color: "#0b7ac4",
              fontWeight: "800",
              textShadow: "0 2px 4px rgba(0,0,0,0.05)",
              letterSpacing: "-0.5px",
            }}
          >
            {service.title}
          </h1>
        </div>
      </div>

      <section
        className="section"
        style={{
          maxWidth: "900px",
          margin: "0 auto 40px",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "40px",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div>
          {/* Service Images */}
          {(service.detailedContent?.image1Path ||
            service.detailedContent?.image2Path) && (
            <div
              style={{
                display: "flex",
                gap: "30px",
                marginBottom: "30px",
                justifyContent: "center",
                flexWrap: "wrap",
                padding: "10px 0",
              }}
            >
              {service.detailedContent?.image1Path && (
                <div
                  style={{
                    flex: "1",
                    minWidth: "300px",
                    textAlign: "center",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <img
                    src={service.detailedContent.image1Path}
                    alt="Service 1"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "10px",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                      border: "1px solid #e2e8f0",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                </div>
              )}
              {service.detailedContent?.image2Path && (
                <div
                  style={{
                    flex: "1",
                    minWidth: "300px",
                    textAlign: "center",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <img
                    src={service.detailedContent.image2Path}
                    alt="Service 2"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "10px",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                      border: "1px solid #e2e8f0",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                </div>
              )}
            </div>
          )}

          <h2
            style={{
              color: "#0b7ac4",
              fontSize: "2rem",
              overflow: "auto",
              marginBottom: "1.5rem",
              paddingBottom: "15px",
              borderBottom: "3px solid #0b7ac4",
              fontWeight: "700",
              textShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {service.detailedContent?.aboutHeading || "About This Service"}
          </h2>

          <p
            style={{
             lineHeight: "1.8",
  color: "#374151",
  overflow: "hidden",
  marginBottom: "2.5rem",
  fontSize: "1.1rem",
  textAlign: "justify",
  
  /* ADD THESE LINES */
  display: "block",         // Ensures it behaves like a block element
  whiteSpace: "normal",     // Forces text to wrap naturally
  wordBreak: "break-word",  // Prevents long words from stretching the line
  width: "100%",
            }}
          >
            {service.detailedContent?.about ||
              `${service.title} is one of our specialized services at Bhaktapur International Hospital. We are committed to providing the highest quality care and treatment in this area of healthcare.`}
          </p>
          <h3
            style={{
              color: "#0b7ac4",
              fontSize: "1.6rem",
              marginBottom: "1.5rem",
              fontWeight: "700",
              marginTop: "1rem",
            }}
          >
            {service.detailedContent?.whyChooseHeading ||
              `Why Choose Our ${service.title}?`}
          </h3>
          <p
            style={{
              lineHeight: "1.8",
              color: "#374151",
              fontSize: "1.1rem",
              textAlign: "justify",
            }}
          >
            {service.detailedContent?.whyChoose ||
              `At Bhaktapur International Hospital, we pride ourselves on delivering exceptional ${service.title.toLowerCase()} services. Our team of specialists combines advanced medical technology with compassionate care to ensure the best possible outcomes for our patients.`}
          </p>
        </div>
      </section>

      {/* Appointment Form Section with Map */}
      <section
        className="appointment-section"
        style={{
          padding: "4rem 0",
          background: "linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)",
          maxWidth: "1200px",
          margin: "3rem auto",
        }}
      >
        <h3
          style={{
            fontSize: "2.5rem",
            color: "#0b7ac4",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Book an Appointment
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1",
              minWidth: "300px",
              maxWidth: "600px",
            }}
          >
            <AppointmentSection />
          </div>

          <div
            style={{
              flex: "1",
              minWidth: "300px",
              maxWidth: "600px",
              height: "500px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
              border: "1px solid #e2e8f0",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1766.6864772580295!2d85.3654504362405!3d27.67486566437954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b3eb720aa73%3A0xbd155722b5862ea1!2sBhaktapur%20International%20Hospital!5e0!3m2!1sne!2snp!4v1767370171204!5m2!1sne!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bhaktapur International Hospital Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
