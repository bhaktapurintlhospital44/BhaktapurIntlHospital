"use client";

import { useState, useEffect } from "react";
import { getFeedBacks } from "@/lib/api/healthPackages";

export default function FeedBacksPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedBacks = async () => {
      try {
        const data = await getFeedBacks();
        // Ensure we always have an array, even if data is null
        setFeedbacks(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedBacks();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3>Loading Feedback...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        <h3>Error: {error}</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "2rem", color: "#0b7ac4" }}>User Feedbacks</h2>
        <span style={{ background: "#0b7ac4", color: "white", padding: "5px 15px", borderRadius: "20px" }}>
          {feedbacks.length} Messages
        </span>
      </div>

      {feedbacks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#f8fafc", borderRadius: "12px" }}>
          No feedback has been submitted yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {feedbacks.map((f) => (
            <div 
              key={f._id} 
              style={{ 
                background: "white", 
                padding: "1.5rem", 
                borderRadius: "12px", 
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                border: "1px solid #e2e8f0" 
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px", marginBottom: "15px" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.2rem", color: "#1e293b" }}>{f.name}</h4>
                  <small style={{ color: "#64748b" }}>{f.email}</small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <small style={{ color: "#94a3b8" }}>
                    {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "Date N/A"}
                  </small>
                </div>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <strong style={{ color: "#0b7ac4", display: "block", fontSize: "0.9rem" }}>SUBJECT:</strong>
                <p style={{ margin: "5px 0", fontWeight: "600" }}>{f.subject}</p>
              </div>

              <div>
                <strong style={{ color: "#0b7ac4", display: "block", fontSize: "0.9rem" }}>MESSAGE:</strong>
                <p style={{ margin: "5px 0", lineHeight: "1.6", color: "#334155" }}>{f.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}