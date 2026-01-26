import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User model - kengaytirilgan versiya
 * Gamification, streak, level tizimi bilan
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },

  // Rol va ruxsatlar
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },

  // Viloyat va maktab
  region: {
    type: String,
    enum: ['toshkent', 'samarqand', 'buxoro', 'andijon', 'fargona',
      'namangan', 'xorazm', 'qashqadaryo', 'surxondaryo',
      'navoiy', 'jizzax', 'sirdaryo', 'qoraqalpogiston', ''],
    default: ''
  },
  school: {
    type: String,
    trim: true
  },

  // Kvota tizimi
  quota: {
    type: Number,
    default: 20
  },
  usedQuota: {
    type: Number,
    default: 0
  },
  quotaResetDate: {
    type: Date,
    default: Date.now
  },

  // Gamification
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },

  // Yutuqlar
  achievements: [{
    type: String,
    enum: ['first_test', 'streak_7', 'streak_30', 'score_90', 'score_100',
      'tests_10', 'tests_50', 'tests_100', 'category_master', 'speed_master']
  }],

  // Statistika
  statistics: {
    totalTests: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // sekundlarda
    categoryScores: {
      algebra: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
      geometriya: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
      trigonometriya: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
      funksiyalar: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
      tenglamalar: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
      ehtimollar: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
      mantiq: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } }
    }
  },

  // Profil rasmi
  avatar: {
    type: String,
    default: null
  },

  // Hisobni yaratilgan sana
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Parolni hashlash
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.updatedAt = new Date();
  next();
});

// Parolni tekshirish
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Level hisoblash (XP asosida)
userSchema.methods.calculateLevel = function () {
  // Har 500 XP uchun 1 level
  return Math.floor(this.xp / 500) + 1;
};

// XP qo'shish va level yangilash
userSchema.methods.addXP = function (amount) {
  this.xp += amount;
  this.level = this.calculateLevel();
  return this.save();
};

// Streak yangilash
userSchema.methods.updateStreak = function () {
  const today = new Date();
  const lastActive = new Date(this.lastActiveDate);
  const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Ketma-ket kun
    this.streak += 1;
    if (this.streak > this.longestStreak) {
      this.longestStreak = this.streak;
    }
  } else if (diffDays > 1) {
    // Streak uzildi
    this.streak = 1;
  }
  // diffDays === 0 bo'lsa, hech narsa qilmaymiz

  this.lastActiveDate = today;
  return this.save();
};

// Kvotani tekshirish va reset qilish
userSchema.methods.checkAndResetQuota = function () {
  const today = new Date();
  const resetDate = new Date(this.quotaResetDate);

  // Agar yangi kun bo'lsa, kvotani reset qilish
  if (today.toDateString() !== resetDate.toDateString()) {
    this.usedQuota = 0;
    this.quotaResetDate = today;
    return this.save();
  }
  return Promise.resolve(this);
};

// JSON ga eksport qilishda parolni olib tashlash
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);
