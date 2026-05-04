
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import AppointmentSection from "@/components/home/AppointmentSection";
import DepartmentSection from "@/components/home/DepartmentSection";
import { getHomeContent } from "@/lib/api/homeContent";
import { getDepartments as fetchDepartmentList } from "@/lib/api/departments";
import DynamicHomeBanner from "@/components/home/HomeBanner";
import "./page.css";
import { use } from "react";
async function loadPageData() {
  try {
    const [homeData, deptData] = await Promise.all([
      getHomeContent(),
      fetchDepartmentList(),
    ]);

    return {
      content: homeData,
      departments: deptData || [],
    };
  } catch (err) {
    console.error("Failed to load page data:", err);
    return { content: null, departments: [] };
  }
}

//for video and floating text
function HomeVideoSection({ videoPath, content }) {
  const validVideoPath = videoPath || "videos/hospital-tour.MOV";

  return (
    <section className="section">
      <div style={{ marginTop: "-3.1rem" }}>
        <div
          className="video-container"
          style={{ width: "100%", position: "relative" }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src={validVideoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: 0,
              width: "100%",
              background: "rgba(28, 67, 164, 0.96)",
              color: "#fff",
              padding: "8px 0",
              overflow: "hidden",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 10,
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            <div
              style={{
                display: "inline-block",
                paddingLeft: "100%",
                marginTop: "4px",
                animation: "marquee 12s linear infinite",
                color: "white",
              }}
            >
              <span>
                {content?.videoHeroTitle ||
                  "Bhaktapur International Hospital 24/7 free ambulance, radiology"}
              </span>
            </div>
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
          `,
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const { content, departments } = await loadPageData();

  const services = Array.isArray(content?.services)
    ? content.services.map((s) => ({
        title: s.title || s,
        description: s.description || "",
        imageUrl: s.imageUrl || "",
      }))
    : [];

  return (
    <>
      <HomeVideoSection
        videoPath={content?.videoPath || "/videos/hospital-tour.mp4"}
        content={content}
      />

      {content ? (
        <>
          <section className="section" style={{ textAlign: "center" }}>
            <h2 className="hero-section-title">
              {content.heroTitle ||
                "Welcome to Bhaktapur International Hospital"}
            </h2>
            <p className="hero-section-subtitle">{content.heroSubtitle}</p>
          </section>

          <ServicesSection services={services} />
          <DynamicHomeBanner bannerImages={content.bannerImages} />
          <DepartmentSection departments={departments} />

          <section className="section">
            <h2 className="section-title">Why Choose Us ?</h2>
            <ul className="bullet-list">
              {Array.isArray(content.whyChooseUs) ? (
                content.whyChooseUs.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))
              ) : (
                <li>No reasons available</li>
              )}
            </ul>
          </section>
        </>
      ) : (
        <>
          <HeroSection />
          <ServicesSection />
          <DynamicHomeBanner />
          <DepartmentSection departments={departments} />
          <WhyChooseUsSection />
        </>
      )}

      {/* Appointment & Map Section */}
      <section
        className="section"
        style={{
          width: "100%",
          padding: "4rem 0",
          background: "linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)",
        }}
      >
        <h2
          className="section-title"
          style={{
            fontSize: "2.5rem",
            color: "#0b7ac4",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Book an Appointment
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1",
              minWidth: "500px",
              maxWidth: "600px",
              marginTop: "-43px",
              marginLeft: "80px",
            }}
          >
            <AppointmentSection />
          </div>

          <div
            style={{
              flex: "1",
              minWidth: "300px",
              maxWidth: "600px",
              height: "470px",
              margin: "0 30px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
              border: "1px solid #04234b",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.344445672234!2d85.3725!3d27.675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQwJzMwLjAiTiA4NcKwMjInMjEuMCJF!5e0!3m2!1sen!2snp!4v1610000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Map"
            />
          </div>
        </div>

        {/* ✅ IMAGE ADDED BELOW MAP (ONLY ADDITION) */}
        <div className="contact-row">
          {/* Phone */}
          <a href="tel:987654" className="contact-item">
            <img src="/images/phone.png" alt="Phone" />
            <span>987654</span>
          </a>

          {/* Telephone */}
          <a href="tel:012345678" className="contact-item">
            <img src="/images/telephone.png" alt="Telephone" />
            <span>012345678</span>
          </a>

          {/* Ambulance */}
          <a href="tel:102" className="contact-item">
            <img src="/images/ambulance.png" alt="Ambulance" />
            <span>Ambulance</span>
          </a>
        </div>
      </section>
    </>
  );
}
