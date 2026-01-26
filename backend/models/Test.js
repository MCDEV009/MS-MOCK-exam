import mongoose from 'mongoose';

/**
 * Test model - kengaytirilgan versiya
 * Timer, flag, auto-save qo'llab-quvvatlash bilan
 */
const testSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Test turi
  type: {
    type: String,
    enum: ['mock', 'practice', 'topic'],
    default: 'mock'
  },

  // Konfiguratsiya
  config: {
    category: String,
    difficulty: String,
    language: { type: String, default: 'uzbek' },
    duration: { type: Number, default: 90 } // daqiqalarda
  },

  // Savollar
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    userAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D', null],
      default: null
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    timeSpent: {
      type: Number,
      default: 0
    }, // sekundlarda
    isFlagged: {
      type: Boolean,
      default: false
    }
  }],

  // Ball
  score: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 100
  },
  percentage: {
    type: Number,
    default: 0
  },
  isPassed: {
    type: Boolean,
    default: false
  },

  // XP ishlangan
  xpEarned: {
    type: Number,
    default: 0
  },

  // Kategoriya bo'yicha natijalar
  categoryScores: {
    algebra: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    geometriya: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    trigonometriya: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    funksiyalar: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    tenglamalar: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    ehtimollar: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    mantiq: { correct: { type: Number, default: 0 }, total: { type: Number, default: 0 } }
  },

  // Status
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'expired'],
    default: 'in_progress'
  },

  // Anti-cheat
  tabSwitchCount: {
    type: Number,
    default: 0
  },

  // Vaqt
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  totalTimeSpent: {
    type: Number,
    default: 0
  }, // sekundlarda

  // Auto-save
  lastSavedAt: {
    type: Date,
    default: Date.now
  },
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  timeLeftAtSave: {
    type: Number,
    default: 5400 // 90 daqiqa sekundlarda
  }
});

// Indekslar
testSchema.index({ userId: 1, status: 1 });
testSchema.index({ completedAt: -1 });
testSchema.index({ score: -1 });

// Natijalarni hisoblash metodi
testSchema.methods.calculateResults = async function () {
  let correctCount = 0;
  const categoryScores = {
    algebra: { correct: 0, total: 0 },
    geometriya: { correct: 0, total: 0 },
    trigonometriya: { correct: 0, total: 0 },
    funksiyalar: { correct: 0, total: 0 },
    tenglamalar: { correct: 0, total: 0 },
    ehtimollar: { correct: 0, total: 0 },
    mantiq: { correct: 0, total: 0 }
  };

  // Populate qilingan questions kerak
  for (const q of this.questions) {
    const question = q.questionId;
    if (question && question.category && categoryScores[question.category]) {
      categoryScores[question.category].total += 1;
      if (q.isCorrect) {
        correctCount += 1;
        categoryScores[question.category].correct += 1;
      }
    }
  }

  const totalQuestions = this.questions.length;
  const percentage = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  this.score = percentage;
  this.percentage = percentage;
  this.isPassed = percentage >= 60;
  this.categoryScores = categoryScores;

  // XP hisoblash
  let xp = Math.round(percentage * 1.5); // Base XP
  if (this.isPassed) xp += 20; // Bonus for passing
  if (percentage >= 90) xp += 30; // Bonus for excellence
  if (percentage === 100) xp += 50; // Perfect score bonus
  this.xpEarned = xp;

  return this;
};

// Vaqtni hisoblash
testSchema.methods.calculateTimeSpent = function () {
  if (this.completedAt && this.startedAt) {
    this.totalTimeSpent = Math.round((this.completedAt - this.startedAt) / 1000);
  }
  return this.totalTimeSpent;
};

// Pre-save hook
testSchema.pre('save', function (next) {
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
    this.calculateTimeSpent();
  }
  next();
});

export default mongoose.model('Test', testSchema);
