const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
  bannerImages: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 50;
      },
      message: props => `you can only upload up to 50 banner images. You tried ${props.value}.`  
    }
  },
  videoHeroTitle: { type: String },
  heroTitle: String,
  heroSubtitle: String,
  services: [mongoose.Schema.Types.Mixed],  // Array of service objects with title, description, imageUrl, and detailedContent

  whyChooseUs: [String],
  videoPath: String,
  rotatingTextPhrases: {
    type: [String],
    default: [
      "Caring for your health with compassion and excellence",
      "Dedicated to your wellness and recovery",
      "Providing exceptional healthcare services",
      "Your trusted partner in health"
    ]
  },

}, { timestamps: true });

module.exports = mongoose.model('HomeContent', homeContentSchema);