"use client";

import { useState, useEffect } from "react";
import AppointmentSection from "@/components/home/AppointmentSection";
import "./page.css";

export default function EditContactPage() {
  const [contactInfo, setContactInfo] = useState({
    phone: "+977-1-XXXX-XXXX",
    address: "Bhaktapur International Hospital, Street Name, Bhaktapur",
    email: "info@bihospital.com.np",
  });

  const handleInputChange = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert("Contact information saved successfully!");
  };

  return (
    <div className="contact-container">
      <h2 className="page-title">Edit Contact Page</h2>

      {/* Contact Info */}
      <div className="card contact-card">
        <h3 className="section-title">Contact Information</h3>

        <div className="grid">
          <div className="info-box">
            <span className="icon">
              <img className="phone" src="/images/phone.png" />
            </span>
            <div className="field">
              <label>Phone Number</label>
              <input
                value={contactInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="info-box">
            <span className="icon">
              <img className="address" src="/images/address.png" />
            </span>
            <div className="field">
              <label>Address</label>
              <input
                value={contactInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
          </div>

          <div className="info-box">
            <span className="icon">
              <img className="email" src="/images/email.png" />
            </span>
            <div className="field">
              <label>Email</label>
              <input
                value={contactInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="info-box">
            <span className="icon">
              <img className="socialMedia" src="/images/fb.png" />
            </span>
            <div className="field">
              <label>Facebook</label>
              <input
                value={contactInfo.socialMedia}
                onChange={(e) => handleInputChange("socialMedia", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appointment */}
      <div className="card">
        <h3 className="section-title">Appointment Form</h3>
        <div className="inner-card">
          <AppointmentSection />
        </div>
      </div>

      {/* Map */}
      <div className="card">
        <h3 className="section-title green">Location Map</h3>
        <div className="map-box">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1766.6864772580295!2d85.3654504362405!3d27.67486566437954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b3eb720aa73%3A0xbd155722b5862ea1!2sBhaktapur%20International%20Hospital!5e0!3m2!1sne!2snp!4v1767370171204!5m2!1sne!2snp"
            width="100%"
            height="100%"
          />
        </div>
      </div>

      {/* Feedback */}
      <div className="card">
        <h3 className="section-title red">Feedback Form</h3>

        <form className="form">
          <input placeholder="Name" />
          <input placeholder="Email" />
          <input placeholder="Subject" />
          <textarea placeholder="Message" rows={5} />

          <button type="submit">Submit Feedback</button>
        </form>
      </div>

      {/* Save */}
      <div className="save-wrapper">
        <button onClick={handleSave} className="save-btn">
          Save Changes
        </button>
      </div>
    </div>
  );
}
