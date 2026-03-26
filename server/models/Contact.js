const mongoose = require('mongoose');

/**
 * Contact Mongoose Schema
 * Defines the data structure and validation rules for a contact document.
 */
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    countryCode: {
      type: String, // e.g., "+91"
      trim: true,
      default: '',
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    // Hex color for the initials avatar background, auto-assigned
    avatarColor: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    versionKey: false,
  }
);

// Pre-save hook: assign a deterministic avatar color based on name initial
const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316',
  '#14b8a6', '#06b6d4', '#84cc16', '#f43f5e',
];

contactSchema.pre('save', async function () {
  if (!this.avatarColor && this.name) {
    const idx = this.name.charCodeAt(0) % AVATAR_COLORS.length;
    this.avatarColor = AVATAR_COLORS[idx];
  }
});

// Virtual: returns the contact's initials (up to 2 chars)
contactSchema.virtual('initials').get(function () {
  if (!this.name) return '?';
  return this.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
});

// Ensure virtuals are included when converting to JSON
contactSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Contact', contactSchema);
