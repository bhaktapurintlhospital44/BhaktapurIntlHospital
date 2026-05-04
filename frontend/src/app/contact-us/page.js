"use client";

import AppointmentSection from "@/components/home/AppointmentSection";
import "./page.css";

export default function ContactUsPage() {
  return (
    <div className="page">
      <div className="wrapper">
        <div className="header">
          <h1>Contact Us</h1>
          <p>Reach out to us for appointments, inquiries, or feedback.</p>
        </div>

        {/* CONTACT INFO */}
        <section className="section infoSection">
          <h2
            style={{
              textAlign: "center",
              width: "100%",
              maxWidth: "800px" /* Prevents lines from being too long */,
              margin:
                "0 auto 2.5rem" /* Centers the block and adds bottom spacing */,
              fontSize:
                "clamp(0.7rem, 2.5vw, 1.5rem)" /* Min, Preferred, Max */,
              lineHeight: "1.5" /* Adds breathing room between lines */,
              color: "#1e40af",
            }}
          >
            We would love to hear from you! Please fill in the required details
            and our team will get in touch with you
          </h2>

          <div className="grid">
            <div className="card">
              <div className="icon">
                <img className="phone" src="/images/phone.png" />
              </div>
              <div>
                <div className="label">Phone Number</div>
                <div className="value">+977-1-XXXX-XXXX</div>
              </div>
            </div>

            <div className="card">
              <div className="icon">
                <img className="address" src="/images/address.png" />
              </div>
              <div>
                <div className="label">Address</div>
                <div className="value">
                  Bhaktapur International Hospital, Street Name, Bhaktapur
                </div>
              </div>
            </div>

            <div className="card">
              <div className="icon">
                <img className="email" src="/images/email.png" />
              </div>
              <div>
                <div className="label">Email</div>
                <div className="value">info@bihospital.com.np</div>
              </div>
            </div>

            {/* To direct  uer to facebook */}
            <a href="https://www.google.com/search?q=facebok&ie=UTF-8" target="_blank" rel="noopener noreferrer"><div className="card">
              <div className="icon">
                <img className="socialMedia" src="/images/fb.png" />
              </div>
              <div>
                <div className="label">Facebook</div>
                <div className="value">Find us on Facebook</div>
              </div>
            </div></a>
          

          <a href="https://www.google.com/search?q=instagram&sxsrf=ANbL-n709acrv1sJClBn1rwgMJiaOESvKQ%3A1777213955709" target="_blank" rel="noopener noreferrer"><div className="card">
              <div className="icon">
                <img className="socialMedia" src="/images/ig.png" />
              </div>
              <div>
                <div className="label">Instagram</div>
                <div className="value">Find us on Instagram</div>
              </div>
            </div></a>
            </div>
        </section>

        {/* APPOINTMENT */}
        <section className="section-appointment">
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(1.3rem, 2.2vw, 2.5rem)",
              marginBottom: "2rem",
              color: "#1e40af" /* Kept consistent with your other headings */,
            }}
          >
            Book an Appointment
          </h2>
          <div className="appointmentBox">
            {/* This wrapper div ensures the inner component centers itself */}
            <div style={{ width: "100%", maxWidth: "800px" }}>
              <AppointmentSection />
            </div>
          </div>
        </section>

        {/* MAP */}
        <section className="section map">
          <h2>Find Us Here</h2>
          <div className="mapBox">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1766.6864772580295!2d85.3654504362405!3d27.67486566437954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b3eb720aa73%3A0xbd155722b5862ea1!2sBhaktapur%20International%20Hospital!5e0!3m2!1sne!2snp!4v1767370171204!5m2!1sne!2snp"
              width="100%"
              height="100%"
              loading="lazy"
              title="map"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
