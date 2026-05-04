const mongoose = require('mongoose');
const HomeContent = require('../models/HomeContent');
require('dotenv').config();

async function updateSpecialities() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital');
    console.log('Connected to MongoDB');

    // Find all home content documents
    const contents = await HomeContent.find({});
    
    for (const content of contents) {
      let updated = false;
      
      if (content.specialities && Array.isArray(content.specialities)) {
        content.specialities = content.specialities.map(speciality => {
          // If speciality doesn't have detailedContent, add it with default structure
          if (!speciality.detailedContent) {
            console.log(`Adding detailedContent to speciality: ${speciality.title || 'Untitled'}`);
            updated = true;
            return {
              ...speciality,
              detailedContent: {
                about: speciality.title ? `${speciality.title} is one of our specialized services...` : 'Speciality description',
                aboutHeading: speciality.title ? `About ${speciality.title}` : 'About This Speciality',
                whyChoose: speciality.title ? `We provide expert care in ${speciality.title} with advanced technology...` : 'Why choose our services',
                whyChooseHeading: speciality.title ? `Why Choose Our ${speciality.title}?` : 'Why Choose Our Services?',
                image1Path: '',
                image2Path: '',
                doctors: []
              }
            };
          }
          // If detailedContent exists but is missing fields, add defaults
          else if (typeof speciality.detailedContent === 'object') {
            updated = true;
            return {
              ...speciality,
              detailedContent: {
                about: speciality.detailedContent.about || (speciality.title ? `${speciality.title} is one of our specialized services...` : 'Speciality description'),
                aboutHeading: speciality.detailedContent.aboutHeading || (speciality.title ? `About ${speciality.title}` : 'About This Speciality'),
                whyChoose: speciality.detailedContent.whyChoose || (speciality.title ? `We provide expert care in ${speciality.title} with advanced technology...` : 'Why choose our services'),
                whyChooseHeading: speciality.detailedContent.whyChooseHeading || (speciality.title ? `Why Choose Our ${speciality.title}?` : 'Why Choose Our Services?'),
                image1Path: speciality.detailedContent.image1Path || '',
                image2Path: speciality.detailedContent.image2Path || '',
                doctors: Array.isArray(speciality.detailedContent.doctors) ? speciality.detailedContent.doctors : []
              }
            };
          }
          return speciality;
        });
      }
      
      // Save the updated content if changes were made
      if (updated) {
        await content.save();
        console.log(`Updated specialities for content: ${content._id}`);
      }
    }
    
    console.log('Specialities update completed');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating specialities:', error);
    mongoose.connection.close();
  }
}

updateSpecialities();