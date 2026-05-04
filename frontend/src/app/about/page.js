"use client";

import { useState, useEffect } from "react";
import styles from './about.module.css';
import AppointmentSection from "@/components/home/AppointmentSection";

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/about-content');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setAboutContent(data);
          } else {
            // Fallback to default content if no data from API
            setAboutContent({
              missionVision: "Our mission is to provide high quality, patient-centered healthcare services to the community of Bhaktapur and beyond. Our vision is to be a leading healthcare institution recognized for clinical excellence, innovation, and compassionate care.",
              hospitalProfile: "Bhaktapur International Hospital is a multidisciplinary hospital offering a wide range of inpatient and outpatient services, advanced diagnostic facilities, and specialized departments staffed by experienced professionals.",
              hospitalPhoto: "/images/hospital-default.jpg",
              chairmanMessage: '"We are committed to delivering healthcare services that meet international standards while staying rooted in our community values." – Chairman',
              medicalDirectorMessage: '"Our medical team continuously strives to improve patient outcomes through evidence-based practices and continuous learning." – Medical Director',
              boardOfDirectors: ["Director 1", "Director 2", "Director 3"],
              managementTeam: ["CEO", "Hospital Administrator", "Nursing Director"],
              awards: ["Example Award 1", "Example Award 2"]
            });
          }
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
        // Fallback to default content if API fails
        setAboutContent({
          missionVision: "Our mission is to provide high quality, patient-centered healthcare services to the community of Bhaktapur and beyond. Our vision is to be a leading healthcare institution recognized for clinical excellence, innovation, and compassionate care.",
          hospitalProfile: "Bhaktapur International Hospital is a multidisciplinary hospital offering a wide range of inpatient and outpatient services, advanced diagnostic facilities, and specialized departments staffed by experienced professionals.",
          chairmanMessage: '"We are committed to delivering healthcare services that meet international standards while staying rooted in our community values." – Chairman',
          medicalDirectorMessage: '"Our medical team continuously strives to improve patient outcomes through evidence-based practices and continuous learning." – Medical Director',
          boardOfDirectors: ["Director 1", "Director 2", "Director 3"],
          managementTeam: ["CEO", "Hospital Administrator", "Nursing Director"],
          awards: ["Example Award 1", "Example Award 2"]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span>Loading about content...</span>
      </div>
    );
  }

  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutTitle}>About Us</h1>
      
      <section className={`${styles.section} ${styles.missionVisionSection}`}>
        <h2 className={styles.sectionTitle}>Mission & Vision</h2>
        <p className={styles.sectionContent}>
          {aboutContent?.missionVision || "Our mission is to provide high quality, patient-centered healthcare services to the community of Bhaktapur and beyond. Our vision is to be a leading healthcare institution recognized for clinical excellence, innovation, and compassionate care."}
        </p>
      </section>
      
      <section className={`${styles.section} ${styles.hospitalProfileSection}`}>
        <h2 className={styles.sectionTitle}>Hospital Profile</h2>
        <div className={styles.hospitalProfileContent}>
          <div className={styles.hospitalContent}>
            <img 
              src={aboutContent?.hospitalPhoto || '/images/hospital-default.jpg'} 
              alt="Hospital" 
              className={styles.hospitalPhotoInline}
              onError={(e) => {
                e.target.src = '/images/hospital-default.jpg';
                e.target.onerror = null; // Prevents infinite loop if default image also fails
              }}
            />
            <p className={styles.sectionContent}>
              {aboutContent?.hospitalProfile || "Bhaktapur International Hospital is a multidisciplinary hospital offering a wide range of inpatient and outpatient services, advanced diagnostic facilities, and specialized departments staffed by experienced professionals."}
            </p>
          </div>
        </div>
      </section>
      
      <section className={`${styles.section} ${styles.messageSection}`}>
        <h2 className={styles.sectionTitle}>Message from the Chairman</h2>
        <div className={styles.messageWithPhoto}>
          <div className={styles.messagePhotoContainer}>
            <img 
              src={aboutContent?.chairmanPhoto || '/images/chairman-default.jpg'} 
              alt="Chairman" 
              className={styles.messagePhoto}
              onError={(e) => {
                e.target.src = '/images/chairman-default.jpg';
                e.target.onerror = null; // Prevents infinite loop if default image also fails
              }}
            />
            <p className={styles.chairmanName}>
              {aboutContent?.chairmanName || 'Chairman Name'}
            </p>
          </div>
          <div className={styles.messageContent}>
            <p className={styles.sectionContent}>
              {aboutContent?.chairmanMessage || '"We are committed to delivering healthcare services that meet international standards while staying rooted in our community values." – Chairman'}
            </p>
          </div>
        </div>
      </section>
      
      <section className={`${styles.section} ${styles.boardDirectorsSection}`}>
        <h2 className={styles.sectionTitle}>Board of Directors</h2>
        <div className={styles.directorsGrid}>
          {(aboutContent?.boardOfDirectors && aboutContent.boardOfDirectors.length > 0) 
            ? aboutContent.boardOfDirectors.map((director, index) => (
                <div key={index} className={styles.directorCard}>
                  <img 
                    src={director.photo || '/images/director-default.jpg'} 
                    alt={director.name || `Director ${index + 1}`}
                    className={styles.directorPhoto}
                    onError={(e) => {
                      e.target.src = '/images/director-default.jpg';
                      e.target.onerror = null; // Prevents infinite loop if default image also fails
                    }}
                  />
                  <p className={styles.directorName}>{director.name || 'Director Name'}</p>
                </div>
              ))
            : [
                <div key="0" className={styles.directorCard}>
                  <img 
                    src="/images/director-default.jpg" 
                    alt="Director 1" 
                    className={styles.directorPhoto}
                  />
                  <p className={styles.directorName}>Director 1</p>
                </div>,
                <div key="1" className={styles.directorCard}>
                  <img 
                    src="/images/director-default.jpg" 
                    alt="Director 2" 
                    className={styles.directorPhoto}
                  />
                  <p className={styles.directorName}>Director 2</p>
                </div>,
                <div key="2" className={styles.directorCard}>
                  <img 
                    src="/images/director-default.jpg" 
                    alt="Director 3" 
                    className={styles.directorPhoto}
                  />
                  <p className={styles.directorName}>Director 3</p>
                </div>
              ]}
        </div>
      </section>
      
      <section className={`${styles.section} ${styles.messageSection}`}>
        <h2 className={styles.sectionTitle}>Message from the Medical Director</h2>
        <div className={styles.messageWithPhoto}>
          <div className={styles.messagePhotoContainer}>
            <img 
              src={aboutContent?.medicalDirectorPhoto || '/images/medical-director-default.jpg'} 
              alt="Medical Director" 
              className={styles.messagePhoto}
              onError={(e) => {
                e.target.src = '/images/medical-director-default.jpg';
                e.target.onerror = null; // Prevents infinite loop if default image also fails
              }}
            />
            <p className={styles.chairmanName}>
              {aboutContent?.medicalDirectorName || 'Medical Director Name'}
            </p>
          </div>
          <div className={styles.messageContent}>
            <p className={styles.sectionContent}>
              {aboutContent?.medicalDirectorMessage || '"Our medical team continuously strives to improve patient outcomes through evidence-based practices and continuous learning." – Medical Director'}
            </p>
          </div>
        </div>
      </section>
      
      <section className={`${styles.section} ${styles.managementTeamSection}`}>
        <h2 className={styles.sectionTitle}>Management Team</h2>
        <div className={styles.directorsGrid}>
          {(aboutContent?.managementTeam && aboutContent.managementTeam.length > 0)
            ? aboutContent.managementTeam.map((member, index) => (
                <div key={index} className={styles.directorCard}>
                  <img 
                    src={member.photo || '/images/team-member-default.jpg'} 
                    alt={member.name || `Team Member ${index + 1}`}
                    className={styles.directorPhoto}
                    onError={(e) => {
                      e.target.src = '/images/team-member-default.jpg';
                      e.target.onerror = null; // Prevents infinite loop if default image also fails
                    }}
                  />
                  <p className={styles.directorName}>{member.name || 'Team Member Name'}</p>
                </div>
              ))
            : [
                <div key="0" className={styles.directorCard}>
                  <img 
                    src="/images/team-member-default.jpg" 
                    alt="CEO" 
                    className={styles.directorPhoto}
                  />
                  <p className={styles.directorName}>CEO</p>
                </div>,
                <div key="1" className={styles.directorCard}>
                  <img 
                    src="/images/team-member-default.jpg" 
                    alt="Hospital Administrator" 
                    className={styles.directorPhoto}
                  />
                  <p className={styles.directorName}>Hospital Administrator</p>
                </div>,
                <div key="2" className={styles.directorCard}>
                  <img 
                    src="/images/team-member-default.jpg" 
                    alt="Nursing Director" 
                    className={styles.directorPhoto}
                  />
                  <p className={styles.directorName}>Nursing Director</p>
                </div>
              ]}
        </div>
      </section>
      
      <section className={`${styles.section} ${styles.awardsSection}`}>
        <h2 className={styles.sectionTitle}>Awards & Recognitions</h2>
        <div className={styles.awardsList}>
          {(aboutContent?.awards && aboutContent.awards.length > 0)
            ? aboutContent.awards.map((award, index) => (
                <div key={index} className={styles.awardItem}>
                  <img 
                    src={award.photo || '/images/award-default.jpg'} 
                    alt={award.title || `Award ${index + 1}`}
                    className={styles.awardPhotoRow}
                    onError={(e) => {
                      e.target.src = '/images/award-default.jpg';
                      e.target.onerror = null; // Prevents infinite loop if default image also fails
                    }}
                  />
                  <div className={styles.awardText}>
                    <h3 className={styles.awardTitle}>{award.title || 'Award Title'}</h3>
                    <p className={styles.awardDescription}>{award.description || 'Award description'}</p>
                  </div>
                </div>
              ))
            : [
                <div key="0" className={styles.awardItem}>
                  <img 
                    src="/images/award-default.jpg" 
                    alt="Example Award 1" 
                    className={styles.awardPhotoRow}
                  />
                  <div className={styles.awardText}>
                    <h3 className={styles.awardTitle}>Example Award 1</h3>
                    <p className={styles.awardDescription}>Description for Example Award 1</p>
                  </div>
                </div>,
                <div key="1" className={styles.awardItem}>
                  <img 
                    src="/images/award-default.jpg" 
                    alt="Example Award 2" 
                    className={styles.awardPhotoRow}
                  />
                  <div className={styles.awardText}>
                    <h3 className={styles.awardTitle}>Example Award 2</h3>
                    <p className={styles.awardDescription}>Description for Example Award 2</p>
                  </div>
                </div>
              ]}
        </div>
      </section>
      
      {/* Appointment Form Section with Map */}
      <section className={`${styles.section} ${styles.appointmentSection}`} style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)' }}>
        <h2 className={styles.sectionTitle} style={{ fontSize: '2.5rem', color: '#0b7ac4', marginBottom: '2rem', textAlign: 'center' }}>Book an Appointment</h2>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-start', 
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            flex: '1',
            minWidth: '300px',
            maxWidth: '600px'
          }}>
            <AppointmentSection />
          </div>
          
          <div style={{ 
            flex: '1', 
            minWidth: '300px', 
            maxWidth: '600px', 
            height: '500px', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', 
            border: '1px solid #e2e8f0'
          }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1766.6864772580295!2d85.3654504362405!3d27.67486566437954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b3eb720aa73%3A0xbd155722b5862ea1!2sBhaktapur%20International%20Hospital!5e0!3m2!1sne!2snp!4v1767370171204!5m2!1sne!2snp" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Bhaktapur International Hospital Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
