// API functions for about content management

export const getAboutContent = async () => {
  try {
    const res = await fetch('http://localhost:4000/api/about-content');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching about content:', error);
    return {
      missionVision: "Our mission is to provide high quality, patient-centered healthcare services to the community of Bhaktapur and beyond. Our vision is to be a leading healthcare institution recognized for clinical excellence, innovation, and compassionate care.",
      hospitalProfile: "Bhaktapur International Hospital is a multidisciplinary hospital offering a wide range of inpatient and outpatient services, advanced diagnostic facilities, and specialized departments staffed by experienced professionals.",
      hospitalPhoto: '/images/hospital-default.jpg',
      chairmanMessage: '"We are committed to delivering healthcare services that meet international standards while staying rooted in our community values." – Chairman',
      chairmanPhoto: '/images/chairman-default.jpg',
      chairmanName: 'Chairman Name',
      medicalDirectorMessage: '"Our medical team continuously strives to improve patient outcomes through evidence-based practices and continuous learning." – Medical Director',
      medicalDirectorPhoto: '/images/medical-director-default.jpg',
      medicalDirectorName: 'Medical Director Name',
      boardOfDirectors: [
        { name: "Director 1", photo: "/images/director-default.jpg" },
        { name: "Director 2", photo: "/images/director-default.jpg" },
        { name: "Director 3", photo: "/images/director-default.jpg" }
      ],
      managementTeam: [
        { name: "CEO", photo: "/images/team-member-default.jpg" },
        { name: "Hospital Administrator", photo: "/images/team-member-default.jpg" },
        { name: "Nursing Director", photo: "/images/team-member-default.jpg" }
      ],
      awards: [
        { title: "Example Award 1", description: "Description for Example Award 1", photo: "/images/award-default.jpg" },
        { title: "Example Award 2", description: "Description for Example Award 2", photo: "/images/award-default.jpg" }
      ]
    };
  }
};

export const saveAboutContent = async (contentData) => {
  try {
    const res = await fetch('http://localhost:4000/api/about-content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error saving about content:', error);
    throw error;
  }
};