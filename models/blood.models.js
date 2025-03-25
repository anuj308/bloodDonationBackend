import mongoose from 'mongoose';

const bloodDonationSchema = new mongoose.Schema({
  // Reference to user who donated
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Blood group with validation
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    index: true // Add index for faster queries by blood group
  },
  // Amount of blood donated (in ml)
  donationAmount: {
    type: Number,
    required: true,
    min: 100, // Minimum donation amount
    default: 450 // Standard donation amount
  },
  // Donation date
  donationDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Location of donation
  donationCenter: {
    type: String,
    required: true
  },
  // Health metrics at time of donation
  healthMetrics: {
    hemoglobin: Number,
    bloodPressure: String,
    pulse: Number,
    temperature: Number
  },
  // Status of donation (processing, available, used)
  status: {
    type: String,
    enum: ['processing', 'available', 'assigned', 'used'],
    default: 'processing'
  },
  // Expiration date (calculated based on donation date)
  expiryDate: {
    type: Date
  },
  // Additional notes
  notes: String
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Pre-save hook to calculate expiry date (typically 42 days for whole blood)
bloodDonationSchema.pre('save', function(next) {
  if (!this.expiryDate && this.donationDate) {
    // Set expiry to 42 days after donation
    this.expiryDate = new Date(this.donationDate);
    this.expiryDate.setDate(this.expiryDate.getDate() + 42);
  }
  next();
});

// Method to check if blood donation is still valid
bloodDonationSchema.methods.isValid = function() {
  return this.status === 'available' && new Date() < this.expiryDate;
};

// Static method to find available donations by blood group
bloodDonationSchema.statics.findAvailableByBloodGroup = function(bloodGroup) {
  return this.find({
    bloodGroup,
    status: 'available',
    expiryDate: { $gt: new Date() }
  }).sort({ donationDate: 1 });
};

const BloodDonation = mongoose.model('BloodDonation', bloodDonationSchema);

export default BloodDonation;