"use client";

import { useState, useEffect } from "react";
import {
  getBookings,
  updateBookingStatus as updateBookingStatusAPI,
  deleteBooking as deleteBookingAPI,
} from "@/lib/api/healthPackages";

import "./page.css";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id, status) => {
    await updateBookingStatusAPI(id, status);
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status } : b)),
    );
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteBookingAPI(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    }
  };

  if (loading) return <div className="center">Loading Bookings...</div>;
  if (error) return <div className="center error">Error: {error}</div>;

  return (
    <div className="container">
      <h2 className="title">Health Package Bookings</h2>

      <div className="card-wrapper">
        <div className="header">
          <h3>All Booking Requests</h3>
          <span className="badge">{bookings.length} Total</span>
        </div>

        {bookings.length === 0 ? (
          <div className="empty">No booking requests found.</div>
        ) : (
          <div className="grid">
            {bookings.map((b) => (
              <div key={b._id} className="card">
                <div className={`status ${b.status}`}>{b.status}</div>

                <h4>{b.packageName}</h4>
                <p>Name: {b.fullName}</p>
                <p>Phone: {b.phone}</p>
                <p>Email: {b.email}</p>
                <p>Date: {new Date(b.preferredDate).toLocaleDateString()}</p>

                {b.notes && <p>Notes: {b.notes}</p>}
                <p className="date">{new Date(b.createdAt).toLocaleString()}</p>

                <div className="actions">
                  <select
                    value={b.status}
                    onChange={(e) => updateBookingStatus(b._id, e.target.value)}
                  >
                    <option>pending</option>
                    <option>confirmed</option>
                    <option>completed</option>
                    <option>cancelled</option>
                  </select>

                  <button onClick={() => deleteBooking(b._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
