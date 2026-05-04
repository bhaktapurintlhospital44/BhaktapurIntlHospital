const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  missionVision: {
    type: String,
    default: "Our mission is to provide high quality, patient-centered healthcare services to the community of Bhaktapur and beyond. Our vision is to be a leading healthcare institution recognized for clinical excellence, innovation, and compassionate care."
  },
  hospitalProfile: {
    type: String,
    default: "Bhaktapur International Hospital is a multidisciplinary hospital offering a wide range of inpatient and outpatient services, advanced diagnostic facilities, and specialized departments staffed by experienced professionals."
  },
  hospitalPhoto: {
    type: String,
    default: '/images/hospital-default.jpg'
  },
  chairmanMessage: {
    type: String,
    default: '"We are committed to delivering healthcare services that meet international standards while staying rooted in our community values." – Chairman'
  },
  chairmanPhoto: {
    type: String,
    default: '/images/chairman-default.jpg'
  },
  chairmanName: {
    type: String,
    default: 'Chairman Name'
  },
  medicalDirectorMessage: {
    type: String,
    default: '"Our medical team continuously strives to improve patient outcomes through evidence-based practices and continuous learning." – Medical Director'
  },
  medicalDirectorPhoto: {
    type: String,
    default: '/images/medical-director-default.jpg'
  },
  medicalDirectorName: {
    type: String,
    default: 'Medical Director Name'
  },
  boardOfDirectors: [{
    name: {
      type: String,
      default: 'Director Name'
    },
    photo: {
      type: String,
      default: '/images/director-default.jpg'
    }
  }],
  managementTeam: [{
    name: {
      type: String,
      default: 'Team Member Name'
    },
    photo: {
      type: String,
      default: '/images/team-member-default.jpg'
    }
  }],
  awards: [{
    title: {
      type: String,
      default: 'Award Title'
    },
    description: {
      type: String,
      default: 'Award description'
    },
    photo: {
      type: String,
      default: '/images/award-default.jpg'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

aboutContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now;
  next();
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);