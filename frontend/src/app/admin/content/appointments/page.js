"use client";

import { useState, useEffect } from "react";
import {
  getAppointments,
  updateAppointmentStatus as updateAppointmentStatusAPI,
  deleteAppointment as deleteAppointmentAPI,
} from "@/lib/api/healthPackages";

import "./page.css";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatusAPI(appointmentId, newStatus);
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment,
        ),
      );
      alert(`Appointment status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating appointment status:", err);
      alert("Error updating appointment status");
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointmentAPI(appointmentId);
        setAppointments((prev) =>
          prev.filter((appointment) => appointment._id !== appointmentId),
        );
        alert("Appointment deleted successfully");
      } catch (err) {
        console.error("Error deleting appointment:", err);
        alert("Error deleting appointment");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading Appointments...</h2>
        <p>Loading appointment requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Appointments</h2>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Appointment Requests</h2>

      <div className="card-wrapper">
        <div className="header-row">
          <h3 className="section-title">All Appointment Requests</h3>

          <span className="total-badge">{appointments.length} Total</span>
        </div>

        {appointments.length === 0 ? (
          <div className="empty-state">No appointment requests found.</div>
        ) : (
          <div className="grid">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="card">
                {/* Status Badge */}
                <div className={`status-badge status-${appointment.status}`}>
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </div>

                <div>
                  <h4 className="card-title">Appointment Request</h4>

                  <p className="text text-strong">
                    Name: {appointment.fullName}
                  </p>

                  <p className="text">Phone: {appointment.phone}</p>

                  <p className="text">Email: {appointment.email}</p>

                  <p className="text">Department: {appointment.department}</p>

                  <p className="text">
                    Preferred Date:{" "}
                    {new Date(appointment.preferredDate).toLocaleDateString()}
                  </p>

                  {appointment.problemDescription && (
                    <p className="text text-italic">
                      Description: {appointment.problemDescription}
                    </p>
                  )}

                  <p className="text-muted">
                    Booked on:{" "}
                    {new Date(appointment.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="actions">
                  <select
                    value={appointment.status}
                    onChange={(e) =>
                      updateAppointmentStatus(appointment._id, e.target.value)
                    }
                    className="select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => deleteAppointment(appointment._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
