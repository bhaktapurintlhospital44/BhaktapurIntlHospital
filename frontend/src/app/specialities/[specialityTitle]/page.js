'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getHomeContent } from '@/lib/api/homeContent';
import Link from 'next/link';

export default function SpecialityDetailPage() {
  const { specialityTitle } = useParams();
  const [speciality, setSpeciality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeciality = async () => {
      try {
        const data = await getHomeContent();
        if (data && data.specialities) {
          // Decode the specialityTitle and find matching speciality
          const decodedSpecialityTitle = decodeURIComponent(specialityTitle);
          
          // Find the speciality by comparing URL-friendly versions of titles
          const foundSpeciality = data.specialities.find(s => {
            // Create URL-friendly version of the speciality title
            const urlFriendlyTitle = s.title
              .toLowerCase()
              .replace(/[^a-zA-Z0-9 ]/g, ' ')  // Replace special chars with spaces
              .replace(/\s+/g, '-')           // Replace spaces with hyphens
              .replace(/-+/g, '-')            // Replace multiple hyphens with single hyphen
              .replace(/^-+|-+$/g, '');       // Remove leading/trailing hyphens
            
            const urlFriendlyParam = decodedSpecialityTitle
              .toLowerCase()
              .replace(/^-+|-+$/g, '');       // Remove leading/trailing hyphens
            
            return urlFriendlyTitle === urlFriendlyParam;
          });
          
          if (foundSpeciality) {
            setSpeciality(foundSpeciality);
          }
        }
      } catch (error) {
        console.error('Failed to fetch speciality:', error);
      } finally {
        setLoading(false);
      }
    };

    if (specialityTitle) {
      fetchSpeciality();
    }
  }, [specialityTitle]);

  if (loading) {
    return (
      <div className="site-main">
        <p>Loading speciality details...</p>
      </div>
    );
  }

  if (!speciality) {
    return (
      <div className="site-main">
        <h1>Speciality Not Found</h1>
        <p>The requested speciality could not be found.</p>
        <Link href="/#specialities">Back to Specialities</Link>
      </div>
    );
  }

  const dc = speciality.detailedContent || {
    about: `${speciality.title} is one of our specialized services at Bhaktapur International Hospital. We are committed to providing the highest quality care and treatment in this area of healthcare.`,
    aboutHeading: 'About This Speciality',
    whyChoose: `At Bhaktapur International Hospital, we pride ourselves on delivering exceptional ${speciality.title.toLowerCase()} services. Our team of specialists combines advanced medical technology with compassionate care to ensure the best possible outcomes for our patients.`,
    whyChooseHeading: `Why Choose Our ${speciality.title}?`,
    image1Path: '',
    image2Path: '',
    doctors: []
  };

  return (
    <div className="site-main" style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ position: 'relative', marginBottom: '2rem', marginTop: '1rem', padding: '20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <Link href="/#specialities" className="back-link" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: '#0b7ac4', 
            fontSize: '1.3rem',
            fontWeight: '900',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            border: '1px solid #0b7ac4',
            backgroundColor: 'rgba(11, 122, 196, 0.05)',
            cursor: 'pointer'
          }} onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(11, 122, 196, 0.1)';
            e.target.style.transform = 'translateY(-2px)';
          }} onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(11, 122, 196, 0.05)';
            e.target.style.transform = 'translateY(0)';
          }}>
            ← Back
          </Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '10px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0', color: '#0b7ac4', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.05)', letterSpacing: '-0.5px' }}>{speciality.title}</h1>
        </div>
      </div>
      
      <section className="section" style={{ maxWidth: '900px', margin: '0 auto 40px', backgroundColor: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)', border: '1px solid #e2e8f0' }}>
        <div>
          {/* Speciality Images */}
          {(dc.image1Path || dc.image2Path) && (
            <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', justifyContent: 'center', flexWrap: 'wrap', padding: '10px 0' }}>
                {dc.image1Path && (
                  <div style={{ flex: '1', minWidth: '300px', textAlign: 'center', transition: 'transform 0.3s ease' }}>
                      <img 
                        src={dc.image1Path} 
                        alt="Speciality 1" 
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', border: '1px solid #e2e8f0' }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                  </div>
                )}
                {dc.image2Path && (
                  <div style={{ flex: '1', minWidth: '300px', textAlign: 'center', transition: 'transform 0.3s ease' }}>
                      <img 
                        src={dc.image2Path} 
                        alt="Speciality 2" 
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', border: '1px solid #e2e8f0' }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                  </div>
                )}
            </div>
          )}
          
          <h2 style={{ color: '#0b7ac4', fontSize: '2rem', marginBottom: '1.5rem', paddingBottom: '15px', borderBottom: '3px solid #0b7ac4', fontWeight: '700', textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{dc.aboutHeading || 'About This Speciality'}</h2>
          <p style={{ lineHeight: '1.8', color: '#374151', marginBottom: '2.5rem', fontSize: '1.1rem', textAlign: 'justify' }}>
            {dc.about || `${speciality.title} is one of our specialized services at Bhaktapur International Hospital. We are committed to providing the highest quality care and treatment in this area of healthcare.`}
          </p>
          <h3 style={{ color: '#0b7ac4', fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: '700', marginTop: '1rem' }}>{dc.whyChooseHeading || `Why Choose Our ${speciality.title}?`}</h3>
          <p style={{ lineHeight: '1.8', color: '#374151', fontSize: '1.1rem', textAlign: 'justify' }}>
            {dc.whyChoose || `At Bhaktapur International Hospital, we pride ourselves on delivering exceptional ${speciality.title.toLowerCase()} services. Our team of specialists combines advanced medical technology with compassionate care to ensure the best possible outcomes for our patients.`}
          </p>
        </div>
      </section>
      
      {/* Doctors Section */}
      {dc.doctors && dc.doctors.length > 0 && (
        <section className="doctors-section" style={{ maxWidth: '900px', margin: '3rem auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', padding: '30px' }}>
          <div>
            <h3 style={{ color: '#0b7ac4', fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: '700', textAlign: 'center', paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>Our Doctors</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              {dc.doctors.map((doctor, index) => (
                <div key={index} style={{ textAlign: 'center', padding: '1.5rem', borderRadius: '12px', backgroundColor: '#f9fafb', border: '1px solid #e2e8f0', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'} >
                  {doctor.imageUrl && (
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', border: '3px solid #0b7ac4' }}>
                      <img 
                        src={doctor.imageUrl} 
                        alt={doctor.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <h4 style={{ color: '#0b7ac4', fontSize: '1.3rem', margin: '0.5rem 0', fontWeight: '700' }}>{doctor.name || `Doctor ${index + 1}`}</h4>
                  <p style={{ color: '#4a5568', margin: '0.25rem 0', fontSize: '1rem' }}>{doctor.speciality || speciality.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Appointment Section - Separate Box */}
      <section className="appointment-section" style={{ maxWidth: '900px', margin: '3rem auto', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0', padding: '30px' }}>
        <div>
            <h3 style={{ color: '#0b7ac4', fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '700', textAlign: 'center', paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>Need a doctor for checkup?</h3>
            <p style={{ color: '#374151', marginBottom: '1.5rem', fontSize: '1.1rem', textAlign: 'center' }}>Fill in the appointment form and we will contact you shortly.</p>
            
            <form style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Email</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Preferred Department</label>
                <select 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                >
                  <option value="">Select a department</option>
                  <option value="general">General Medicine</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="gynecology">Gynecology</option>
                  <option value="dermatology">Dermatology</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Preferred Date</label>
                <input 
                  type="date" 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
                />
              </div>
            </form>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>Briefly describe your problem</label>
              <textarea 
                placeholder="Describe your symptoms or reason for visit" 
                rows="4" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              style={{ 
                backgroundColor: '#0b7ac4', 
                color: 'white', 
                padding: '15px 30px', 
                borderRadius: '8px', 
                border: 'none', 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#09609d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#0b7ac4'}
            >
              Book Appointment
            </button>
          </div>
        </section>
    </div>
  );
}