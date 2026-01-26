import mongoose from 'mongoose';

/**
 * Question model - kengaytirilgan versiya
 * Kategoriya tizimi, LaTeX, to'liq yechim bilan
 */
const questionSchema = new mongoose.Schema({
  // Savol matni (ko'p tilli)
  questionText: {
    type: String,
    required: true
  },
  question_uz: {
    type: String
  },
  question_ru: {
    type: String
  },

  // Javob variantlari
  options: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true }
  },
  correctAnswer: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true
  },

  // Kategoriya va mavzu
  category: {
    type: String,
    enum: ['algebra', 'geometriya', 'trigonometriya', 'funksiyalar',
      'tenglamalar', 'ehtimollar', 'mantiq'],
    required: true
  },
  subject: {
    type: String,
    required: true,
    default: 'matematika'
  },
  topic: {
    type: String,
    required: true
  },

  // Qiyinchilik
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },

  // Ball
  points: {
    type: Number,
    default: 2,
    min: 1,
    max: 5
  },

  // Til
  language: {
    type: String,
    enum: ['qoraqalpoq', 'uzbek', 'russian', 'english'],
    required: true
  },

  // LaTeX formula
  latex: {
    type: String
  },

  // Rasm URL
  image: {
    type: String
  },

  // To'liq yechim (explanation)
  explanation: {
    type: String
  },

  // Teglar
  tags: [{
    type: String,
    trim: true
  }],

  // Yaratuvchi
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'deactivated'],
    default: 'pending'
  },

  // Reyting tizimi
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    ratings: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      createdAt: { type: Date, default: Date.now }
    }]
  },

  // Shikoyatlar
  reports: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // Statistika
  statistics: {
    timesUsed: { type: Number, default: 0 },
    timesCorrect: { type: Number, default: 0 },
    timesIncorrect: { type: Number, default: 0 },
    averageTimeSpent: { type: Number, default: 0 } // sekundlarda
  },

  // Tasdiqlash ma'lumotlari
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Meta
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indekslar
questionSchema.index({ category: 1, difficulty: 1, status: 1 });
questionSchema.index({ language: 1, status: 1 });
questionSchema.index({ createdBy: 1 });
questionSchema.index({ 'rating.average': -1 });

// Reyting qo'shish metodi
questionSchema.methods.addRating = function (userId, ratingValue) {
  // Oldingi reytingni o'chirish
  this.rating.ratings = this.rating.ratings.filter(
    r => r.userId.toString() !== userId.toString()
  );

  // Yangi reyting qo'shish
  this.rating.ratings.push({
    userId,
    rating: ratingValue
  });

  // O'rtacha hisoblab chiqish
  const sum = this.rating.ratings.reduce((acc, r) => acc + r.rating, 0);
  this.rating.average = Math.round((sum / this.rating.ratings.length) * 10) / 10;
  this.rating.count = this.rating.ratings.length;

  return this.save();
};

// Statistikani yangilash
questionSchema.methods.updateStatistics = function (isCorrect, timeSpent) {
  this.statistics.timesUsed += 1;
  if (isCorrect) {
    this.statistics.timesCorrect += 1;
  } else {
    this.statistics.timesIncorrect += 1;
  }

  // O'rtacha vaqtni hisoblash
  const totalTime = this.statistics.averageTimeSpent * (this.statistics.timesUsed - 1) + timeSpent;
  this.statistics.averageTimeSpent = Math.round(totalTime / this.statistics.timesUsed);

  return this.save();
};

// Save hook
questionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Question', questionSchema);
