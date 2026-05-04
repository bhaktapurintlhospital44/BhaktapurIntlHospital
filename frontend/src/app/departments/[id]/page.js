"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDepartmentById } from '@/lib/api/departments';
import DeptSpecificAppointment from "./DeptSpecificAppointment";
import Link from 'next/link';

export default function DepartmentDetailPage() {
  const params = useParams();
  const id = params?.id; 

  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getDepartmentById(id);
        if (data) {
          setDept(data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div style={styles.loader}>Loading Details...</div>;

  if (error || !dept) return (
    <div style={styles.errorContainer}>
      <h1>Department Not Found</h1>
      <Link href="/departments" style={styles.backLink}>← Return to All Departments</Link>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <Link href="/departments" style={styles.backLink}>← Back </Link>
      
      {/* 1. Department Name at the top */}
      <header style={styles.header}>
        <h1 style={styles.title}>{dept.name}</h1>
      </header>

      {/* 2. Department Photo */}
      <div style={styles.imageContainer}>
        <img src={dept.image} alt={dept.name} style={styles.mainImg} />
      </div>

      {/* 3. About Department */}
      <section style={styles.section}>
        <h2 style={styles.subHeading}>About Department</h2>
        <p style={styles.desc}>{dept.description}</p>
      </section>

      {/* Specialist Doctors Grid */}
      {dept.doctors && dept.doctors.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.subHeading}>Our Specialists</h2>
          <div style={styles.docGrid}>
            {dept.doctors.map((doc, i) => (
              <div key={i} style={styles.docCard}>
                <img src={doc.image} alt={doc.name} style={styles.docImg} />
                <h4 style={styles.docName}>{doc.name}</h4>
                <p style={styles.docDesc}>{doc.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Appointment Section */}
      <section style={styles.appointmentSection}>
        <DeptSpecificAppointment departmentName={dept.name} />
      </section>
    </div>
  );
}

const styles = {
  loader: { padding: '80px 20px', textAlign: 'center', fontSize: '1.2rem', color: '#666' },
  errorContainer: { padding: '80px 20px', textAlign: 'center' },
  wrapper: { 
    width:'70%',
    margin: '0 auto', 
    padding: '20px', 
    fontFamily: '"Inter", sans-serif', 
    backgroundColor: '#e4ecc416',
  },
  backLink: { 
    color: '#0b7ac4', 
    textDecoration: 'none', 
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'inline-block',
    marginBottom: '20px'
  },
  header: { marginBottom: '20px',  },
  title: { 
    fontSize: "clamp(0.5rem, 5vw, 2.5rem)",
    margin: 0, 
    color: '#111827',
    fontWeight: '800'
  },
  imageContainer: {
    width: '85%',
    borderRadius: '16px',
    display:'flex',
    // justifyContent: 'center',
    // alignItems: 'center',    
    overflow: 'hidden',
    marginBottom: '30px',
    // boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  mainImg: { 
    width: '40%', 
    height: 'auto', 
    maxHeight: '400px',
    objectFit: 'cover',
    display: 'block'
  },
  subHeading: {
    fontSize: '1.30rem',
    color: '#1f2937',
    marginBottom: '15px'
  },
  section: { 
    marginBottom: '40px' 
  },
  desc: { 
    lineHeight: '1.8', 
    color: '#4b5563', 
    fontSize: '1rem',
    whiteSpace: 'pre-line' // Respects line breaks in description
  },
  docGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
    gap: '20px', 
    marginTop: '20px' 
  },
  docCard: { 
    textAlign: 'center', 
    padding: '20px', 
    border: '1px solid #f3f4f6', 
    borderRadius: '16px',
    backgroundColor: '#fff',
    transition: 'transform 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  docImg: { 
    width: '120px', 
    height: '120px', 
    // borderRadius: '50%', // Circular portraits look great for specialists
    objectFit: 'cover',
    marginBottom: '15px',
   
  },
  docName: { margin: '10px 0 5px', color: '#111827' },
  docDesc: { fontSize: '0.9rem', color: '#6b7280', margin: 0 },
  appointmentSection: { 
    marginTop: '60px', 
    padding: '40px 20px',
    backgroundColor: '#f9fafb',

    border: '1px solid #e5e7eb'
  }
};