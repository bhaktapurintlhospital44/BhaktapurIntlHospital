"use client";

import { useState, useEffect } from "react";
import { getHealthPackages, bookHealthPackage } from "@/lib/api/healthPackages";
import styles from "./page.css";

export default function HealthPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  // --- FIX 1: Add mounted state ---
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // --- FIX 2: Set mounted to true ---
    setMounted(true);

    const fetchPackages = async () => {
      try {
        const data = await getHealthPackages();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching health packages:", error);
        setPackages([
          {
            _id: 1,
            name: "Basic Health Checkup",
            description:
              "Includes essential blood tests, vitals check, and physician consultation.",
            price: "Rs. 2,500",
            features: [
              "Complete Blood Count",
              "Blood Pressure Check",
              "Basic Metabolic Panel",
              "General Physician Consultation",
            ],
          },
          {
            _id: 2,
            name: "Cardiac Screening Package",
            description:
              "ECG, lipid profile, cardiac evaluation, and cardiologist consultation.",
            price: "Rs. 8,500",
            features: [
              "ECG Test",
              "Lipid Profile",
              "Cardiac Enzymes",
              "Cardiologist Consultation",
            ],
          },
          {
            _id: 3,
            name: "Diabetes Care Package",
            description:
              "Blood sugar profile, HbA1c, diet counseling, and specialist review.",
            price: "Rs. 5,200",
            features: [
              "Blood Sugar Profile",
              "HbA1c Test",
              "Dietitian Consultation",
              "Endocrinologist Review",
            ],
          },
          {
            _id: 4,
            name: "Senior Citizen Package",
            description:
              "Comprehensive health screening tailored for senior citizens.",
            price: "Rs. 12,000",
            features: [
              "Complete Health Checkup",
              "Bone Density Scan",
              "Vision & Hearing Tests",
              "Geriatrician Consultation",
            ],
          },
          {
            _id: 5,
            name: "Women's Health Package",
            description: "Specialized screening for women's health needs.",
            price: "Rs. 9,800",
            features: [
              "Mammography",
              "Pap Smear",
              "Hormone Profile",
              "Gynecologist Consultation",
            ],
          },
          {
            _id: 6,
            name: "Executive Health Package",
            description:
              "Premium comprehensive health screening with advanced diagnostics.",
            price: "Rs. 25,000",
            features: [
              "Full Body MRI",
              "Advanced Cardiac Screening",
              "Cancer Markers",
              "Specialist Consultations",
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // --- FIX 3: Prevent rendering until mounted ---
  if (!mounted) return null;

  return (
    <>
      <style>{`
        .hp-outer { min-height: 100vh; background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%); padding: 2rem 1rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-sizing: border-box; }
        .hp-container { max-width: 1300px; margin: 0 auto; padding: 2rem; background-color: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; box-sizing: border-box; }
        .hp-header { text-align: center; margin-bottom: 3rem; padding: 2rem; background: linear-gradient(135deg, #0b7ac4 0%, #1e40af 100%); border-radius: 15px; color: white; box-shadow: 0 5px 15px rgba(11,122,196,0.3); }
        .hp-header h1 { font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3); margin-top: 0; }
        .hp-header p { font-size: 1.3rem; opacity: 0.9; max-width: 600px; margin: 0.5rem auto 0; }
        .hp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; margin-bottom: 2rem; }
        .hp-card { background-color: white; border-radius: 15px; padding: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; transition: transform 0.3s ease, box-shadow 0.3s ease; position: relative; overflow: hidden; box-sizing: border-box; max-height:500px; overflow:auto  }
        .hp-card:hover { transform: translateY(-10px); box-shadow: 0 15px 35px rgba(0,0,0,0.15); }
        .hp-badge { position: absolute; top: 1rem; right: 1rem; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; z-index: 1; }
        .hp-card-body { text-align: center; margin-bottom: 1.5rem;}
        .hp-card-body h3 { font-size: 1.8rem; color: #1e40af; margin-bottom: 0.5rem; font-weight: 700; margin-top: 0; }
        .hp-card-price { font-size: 1.5rem; font-weight: bold; color: #0b7ac4; margin-bottom: 1rem; }
        .hp-card-desc { color: #6b7280; line-height: 1.6; margin: 0; }
        .hp-features-title { font-size: 1.2rem; color: #1e40af; margin-bottom: 1rem; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 0; }
        .hp-features-list { list-style: none; padding: 0; margin: 0; }
        .hp-features-list li { display: flex; align-items: center; margin-bottom: 0.75rem; color: #4b5563;  }
        .hp-check { color: #10b981; margin-right: 0.5rem; font-size: 1.2rem; flex-shrink: 0; }
        .hp-book-btn { width: 100%; background-color: #0b7ac4; color: white; padding: 1rem; border-radius: 8px; border: none; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: background-color 0.3s ease; margin-top: 1rem; box-sizing: border-box; }
        .hp-book-btn:hover { background-color: #09609d; }
        .hp-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem; box-sizing: border-box; }
        .hp-modal { background-color: white; border-radius: 15px; padding: 2rem; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.3); box-sizing: border-box; }
        .hp-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 0.5rem; }
        .hp-modal-header h3 { font-size: 1.8rem; color: #1e40af; font-weight: 700; margin: 0; word-break: break-word; }
        .hp-modal-close { background-color: #ef4444; color: white; border: none; border-radius: 50%; min-width: 36px; width: 36px; height: 36px; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .hp-modal-details { margin-bottom: 1.5rem; padding: 1rem; background-color: #f8fafc; border-radius: 10px; }
        .hp-form { display: grid; gap: 1rem; }
        .hp-form label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #1e40af; }
        .hp-form input, .hp-form textarea { width: 100%; padding: 0.8rem; border-radius: 8px; border: 2px solid #e5e7eb; font-size: 1rem; transition: border-color 0.3s ease; background-color: #ffffff; box-sizing: border-box; }
        .hp-confirm-btn { background-color: #10b981; color: white; padding: 1rem; border-radius: 8px; border: none; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: background-color 0.3s ease; margin-top: 1rem; width: 100%; }
        @media (max-width: 768px) {
          .hp-outer { padding: 1rem 0.5rem; }
          .hp-container { padding: 1rem; border-radius: 12px; }
          .hp-header h1 { font-size: 2rem; }
          .hp-grid { grid-template-columns: 1fr; gap: 1.25rem; }
        }
      `}</style>

      <div className="hp-outer">
        <div className="hp-container">
          <div className="hp-header">
            <h1>Health Packages</h1>
            <p>
              Choose from our preventive health packages designed to keep you
              and your family healthy.
            </p>
          </div>

          <div className="hp-grid">
            {packages.map((pkg, index) => (
              <article key={pkg._id || index} className="hp-card">
                <div
                  className="hp-badge"
                  style={{
                    backgroundColor:
                      index === 0
                        ? "#10b981"
                        : index === 1
                          ? "#f59e0b"
                          : "#8b5cf6",
                  }}
                >
                  Popular
                </div>

                <div className="hp-card-body">
                  <h3>{pkg.name}</h3>
                  <div className="hp-card-price">{pkg.price}</div>
                  <p className="hp-card-desc">{pkg.description}</p>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 className="hp-features-title">Package Includes:</h4>
                  <ul className="hp-features-list">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className="hp-check">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className="hp-book-btn"
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setShowBookingModal(true);
                  }}
                >
                  Book Package
                </button>
              </article>
            ))}
          </div>
        </div>

        {showBookingModal && selectedPackage && (
          <div
            className="hp-modal-overlay"
            onClick={() => setShowBookingModal(false)}
          >
            <div className="hp-modal" onClick={(e) => e.stopPropagation()}>
              <div className="hp-modal-header">
                <h3>Book {selectedPackage.name}</h3>
                <button
                  className="hp-modal-close"
                  onClick={() => setShowBookingModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="hp-modal-details">
                <p style={{ fontWeight: "600", color: "#1e40af" }}>
                  Package Details:
                </p>
                <p style={{ color: "#4b5563" }}>
                  {selectedPackage.description}
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#0b7ac4",
                    fontSize: "1.2rem",
                  }}
                >
                  {selectedPackage.price}
                </p>
              </div>

              <form
                className="hp-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const bookingData = {
                    packageName: selectedPackage.name,
                    fullName: formData.get("fullName"),
                    phone: formData.get("phone"),
                    email: formData.get("email"),
                    preferredDate: formData.get("preferredDate"),
                    notes: formData.get("notes"),
                  };
                  try {
                    await bookHealthPackage(bookingData);
                    alert(
                      `Thank you! Booking request for ${selectedPackage.name} received.`,
                    );
                    setShowBookingModal(false);
                  } catch (error) {
                    alert("Error processing booking.");
                  }
                }}
              >
                <div>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label>Phone Number</label>
                  {/* for number */}
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Mobile (98/97...) or Landline (01...)"
                    required
                    /* Logic:
    (98|97)\d{8}  -> Must be exactly 10 digits
    |             -> OR
    01\d{7}       -> Must be exactly 9 digits
  */
                    pattern="^(?:(98|97)\d{8}|01\d{7})$"
                    title="Mobile numbers (98/97) must be 10 digits. Landlines (01) must be 9 digits."
                    minLength={9}
                    maxLength={10}
                    onInput={(e) => {
                      // Clean non-numeric characters
                      const val = e.currentTarget.value.replace(/\D/g, "");

                      // Logic to prevent typing an 11th digit if it's mobile,
                      // or a 10th digit if it starts with 01
                      if (val.startsWith("01")) {
                        e.currentTarget.value = val.slice(0, 9);
                      } else {
                        e.currentTarget.value = val.slice(0, 10);
                      }
                    }}
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label>Preferred Date</label>
                  <input type="date" name="preferredDate" required />
                </div>
                <div>
                  <label>Additional Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Any special requirements"
                  ></textarea>
                </div>
                <button type="submit" className="hp-confirm-btn">
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
