// src/app/services/page.js
'use client';

import { useState, useEffect } from 'react';
import { getHomeContent } from '@/lib/api/homeContent';

// Helper function to create URL-friendly service title
const createUrlFriendlyTitle = (title) => {
  return encodeURIComponent(
    title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, ' ')  // Replace special chars with spaces
      .replace(/\s+/g, '-')             // Replace spaces with hyphens
  );
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getHomeContent();
        if (data && data.services) {
          // Ensure services are properly formatted
          const formattedServices = data.services.map(service => {
            if (typeof service === 'object' && service !== null) {
              return {
                title: service.title || '',
                description: service.description || '',
                imageUrl: service.imageUrl || ''
              };
            } else {
              return {
                title: service || '',
                description: '',
                imageUrl: ''
              };
            }
          });
          setServices(formattedServices);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="site-main">
        <h1>Our Services</h1>
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="site-main">
      <section className="section">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="service-box" 
              style={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                padding: '1rem',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: 'white',
              }}
              onClick={() => window.location.href = `/services/${createUrlFriendlyTitle(service.title)}`}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              {service.imageUrl && (
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', marginBottom: '1rem', borderRadius: '4px', display: 'block', margin: '0 auto' }}
                />
              )}
              <h3 style={{ margin: '0.5rem 0' }}>{service.title}</h3>
              <p style={{ margin: '0.5rem 0', }}>{service.description}</p>
              <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>Index: {index}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}