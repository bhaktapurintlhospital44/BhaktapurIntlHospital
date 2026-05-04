const { default: mongoose } = require("mongoose");

const feedBackSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
  },

  subject: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

});

feedBackSchema.pre('save', function(next) {
  this.updatedAt = Date.now;
  next();
});

module.exports = mongoose.model('Feed Backs', feedBackSchema);
