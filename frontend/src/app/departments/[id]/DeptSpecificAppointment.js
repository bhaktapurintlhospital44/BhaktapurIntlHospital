"use client";
import { useState } from 'react';

export default function DeptSpecificAppointment({ departmentName }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '', 
    email: '',
    department: departmentName,
    preferredDate: '',
    problemDescription: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // Ensure your backend is running at this exact address
      const response = await fetch(`http://localhost:4000/api/appointments`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ type: 'success', msg: 'Appointment booked! Check Admin panel.' });
        // Reset form
        setFormData({ 
          fullName: '', 
          phone: '', 
          email: '', 
          department: departmentName, 
          preferredDate: '', 
          problemDescription: '' 
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server rejected the booking');
      }
    } catch (err) {
      // Logic to distinguish between "Server is Off" and "Form is Invalid"
      const errorMsg = err.message === 'Failed to fetch' 
        ? 'Connection error. Is the backend running?' 
        : err.message;
      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    // 1. Remove all non-digits
    let val = e.target.value.replace(/\D/g, "");

    // 2. Enforce length limits based on Nepal number standards
    if (val.startsWith("01")) {
      val = val.slice(0, 9); // Landline limit
    } else {
      val = val.slice(0, 10); // Mobile limit
    }

    // 3. Update State
    setFormData({ ...formData, phone: val });
  };

  return (
    <div style={{ padding: '2rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>Book {departmentName} Appointment</h3>
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>This request will be sent directly to the hospital admin.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          style={styles.input} type="text" placeholder="Full Name" required 
          value={formData.fullName} 
          onChange={e => setFormData({...formData, fullName: e.target.value})} 
        />
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="tel"
            placeholder="Phone (98... or 01...)"
            required
            pattern="^(?:(98|97)\d{8}|01\d{7})$"
            title="Mobile (98/97) must be 10 digits. Landline (01) must be 9 digits."
            value={formData.phone}
            onChange={handlePhoneChange}
            style={{ ...styles.input, flex: '1', minWidth: '200px' }}
          />

          <input 
            style={{ ...styles.input, flex: '1', minWidth: '200px' }} 
            type="email" placeholder="Email" required 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
        </div>
        
        <div style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: '#475569' }}>
           Selected Department: {departmentName}
        </div>

        <input 
          style={styles.input} type="date" required 
          value={formData.preferredDate} 
          onChange={e => setFormData({...formData, preferredDate: e.target.value})} 
        />
        
        <textarea 
          style={styles.input} placeholder="Describe your problem..." rows="3"
          value={formData.problemDescription} 
          onChange={e => setFormData({...formData, problemDescription: e.target.value})} 
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Sending...' : 'Confirm Booking'}
        </button>

        {status.msg && (
          <p style={{ textAlign: 'center', fontWeight: '500', color: status.type === 'success' ? '#10b981' : '#ef4444' }}>
            {status.msg}
          </p>
        )}
      </form>
    </div>
  );
}

const styles = {
  input: { 
    padding: '0.8rem', 
    borderRadius: '6px', 
    border: '1px solid #cbd5e1', 
    width: '100%', 
    outline: 'none', 
    fontSize: '1rem',
    boxSizing: 'border-box' 
  },
  button: { 
    padding: '1rem', 
    background: '#1e40af', 
    color: 'white', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background 0.2s'
  }
};