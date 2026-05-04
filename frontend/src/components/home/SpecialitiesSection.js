'use client';

import Link from 'next/link';

export default function SpecialitiesSection({ specialities = [] }) {
  if (!Array.isArray(specialities) || specialities.length === 0) {
    return null;
  }

  return (
    <section className="section" id="specialities">
      <h2 className="section-title">Specialities</h2>

      <div className="specialities-grid">
        {specialities.map((speciality, index) => {
          if (!speciality) return null;

          // ✅ Normalize data safely
          const specData =
            typeof speciality === 'object'
              ? speciality
              : { title: speciality, imageUrl: '' };

          const title = specData.title || 'Speciality';

          // ✅ SEO-safe URL slug
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, ' ')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '');

          return (
            <Link
              key={index}
              href={`/specialities/${slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="speciality-box"
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '20px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s ease',
                }}
              >
                {/* IMAGE */}
                {specData.imageUrl ? (
                  <img
                    src={specData.imageUrl}
                    alt={title}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '1rem',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      margin: '0 auto 1rem',
                      borderRadius: '12px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      color: '#888',
                    }}
                  >
                    No Image
                  </div>
                )}

                <h3 style={{ margin: 0, color: '#0b7ac4' }}>
                  {title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
