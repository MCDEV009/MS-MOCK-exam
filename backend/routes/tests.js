import express from 'express';
import Test from '../models/Test.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/tests/start
 * Testni boshlash
 */
router.post('/start', authenticate, async (req, res) => {
  try {
    const { category, difficulty, language = 'uzbek', count = 50 } = req.body;

    // Filter yaratish
    const filter = { status: 'approved' };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (language) filter.language = language;

    // Tasodifiy savollar olish (aggregation bilan)
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(count) } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'Savollar topilmadi. Boshqa parametrlarni tanlang.' });
    }

    // Yangi test yaratish
    const test = new Test({
      userId: req.userId,
      config: { category, difficulty, language, duration: 90 },
      questions: questions.map(q => ({
        questionId: q._id
      }))
    });

    await test.save();

    // Javoblarni jo'natmaslik (to'g'ri javob, explanation)
    const clientQuestions = questions.map(q => ({
      id: q._id,
      questionText: q.questionText,
      options: q.options,
      category: q.category,
      difficulty: q.difficulty,
      latex: q.latex,
      image: q.image
    }));

    res.status(201).json({
      message: 'Test boshlandi',
      testId: test._id,
      questions: clientQuestions,
      duration: 90 // daqiqada
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

/**
 * POST /api/tests/:id/save
 * Javoblarni saqlash (auto-save)
 */
router.post('/:id/save', authenticate, async (req, res) => {
  try {
    const { answers, currentQuestion, timeLeft } = req.body;

    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test topilmadi' });
    }

    if (test.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Bu test sizga tegishli emas' });
    }

    if (test.status === 'completed') {
      return res.status(400).json({ message: 'Test allaqachon yakunlangan' });
    }

    // Javoblarni yangilash
    for (const [questionId, answer] of Object.entries(answers || {})) {
      const questionItem = test.questions.find(
        q => q.questionId.toString() === questionId
      );
      if (questionItem) {
        questionItem.userAnswer = answer;
      }
    }

    test.currentQuestionIndex = currentQuestion || 0;
    test.timeLeftAtSave = timeLeft || 5400;
    test.lastSavedAt = new Date();

    await test.save();

    res.json({ message: 'Saqlandi', savedAt: test.lastSavedAt });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

/**
 * POST /api/tests/:id/submit
 * Testni yakunlash
 */
router.post('/:id/submit', authenticate, async (req, res) => {
  try {
    const { answers } = req.body;

    const test = await Test.findById(req.params.id).populate('questions.questionId');
    if (!test) {
      return res.status(404).json({ message: 'Test topilmadi' });
    }

    if (test.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Bu test sizga tegishli emas' });
    }

    if (test.status === 'completed') {
      return res.status(400).json({ message: 'Test allaqachon yakunlangan' });
    }

    // Javoblarni baholash
    for (let i = 0; i < test.questions.length; i++) {
      const questionItem = test.questions[i];
      const question = questionItem.questionId;
      const userAnswer = answers?.[question._id.toString()] || questionItem.userAnswer;

      if (userAnswer) {
        questionItem.userAnswer = userAnswer;
        questionItem.isCorrect = userAnswer.toUpperCase() === question.correctAnswer;
      }
    }

    // Natijalarni hisoblash
    await test.calculateResults();
    test.status = 'completed';
    test.completedAt = new Date();

    await test.save();

    // User statistikasini yangilash
    const user = await User.findById(req.userId);
    if (user) {
      // Statistika
      user.statistics.totalTests += 1;
      user.statistics.totalQuestions += test.questions.length;

      const correctCount = test.questions.filter(q => q.isCorrect).length;
      user.statistics.correctAnswers += correctCount;

      // O'rtacha ballni qayta hisoblash
      const totalScore = user.statistics.averageScore * (user.statistics.totalTests - 1) + test.percentage;
      user.statistics.averageScore = Math.round(totalScore / user.statistics.totalTests);

      if (test.percentage > user.statistics.bestScore) {
        user.statistics.bestScore = test.percentage;
      }

      // Category statistikani yangilash
      for (const [cat, scores] of Object.entries(test.categoryScores)) {
        if (user.statistics.categoryScores[cat]) {
          user.statistics.categoryScores[cat].correct += scores.correct;
          user.statistics.categoryScores[cat].total += scores.total;
        }
      }

      // XP qo'shish
      user.xp += test.xpEarned;
      user.level = user.calculateLevel();

      // Streak yangilash
      await user.updateStreak();

      await user.save();
    }

    res.json({
      message: 'Test yakunlandi',
      test: {
        id: test._id,
        score: test.score,
        percentage: test.percentage,
        correctCount: test.questions.filter(q => q.isCorrect).length,
        totalQuestions: test.questions.length,
        isPassed: test.isPassed,
        xpEarned: test.xpEarned,
        categoryScores: test.categoryScores
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

/**
 * GET /api/tests/history
 * Test tarixi
 */
router.get('/history', authenticate, async (req, res) => {
  try {
    const tests = await Test.find({ userId: req.userId })
      .select('score percentage status startedAt completedAt questions isPassed xpEarned')
      .sort({ completedAt: -1, startedAt: -1 })
      .limit(50);

    res.json(tests.map(test => ({
      id: test._id,
      score: test.score,
      percentage: test.percentage,
      status: test.status,
      startedAt: test.startedAt,
      completedAt: test.completedAt,
      totalQuestions: test.questions.length,
      isPassed: test.isPassed,
      xpEarned: test.xpEarned
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

/**
 * GET /api/tests/:id
 * Test tafsilotlari
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('questions.questionId');

    if (!test) {
      return res.status(404).json({ message: 'Test topilmadi' });
    }

    if (test.userId.toString() !== req.userId.toString() && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Bu test sizga tegishli emas' });
    }

    // Agar test yakunlanmagan bo'lsa, to'g'ri javoblarni ko'rsatmaslik
    const questions = test.questions.map(q => {
      const question = q.questionId;
      const result = {
        id: question._id,
        questionText: question.questionText,
        options: question.options,
        category: question.category,
        difficulty: question.difficulty,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect,
        isFlagged: q.isFlagged
      };

      // Faqat yakunlangan testlarda to'g'ri javob va yechimni ko'rsatish
      if (test.status === 'completed') {
        result.correctAnswer = question.correctAnswer;
        result.explanation = question.explanation;
        result.latex = question.latex;
      }

      return result;
    });

    res.json({
      id: test._id,
      status: test.status,
      score: test.score,
      percentage: test.percentage,
      isPassed: test.isPassed,
      xpEarned: test.xpEarned,
      categoryScores: test.categoryScores,
      startedAt: test.startedAt,
      completedAt: test.completedAt,
      totalTimeSpent: test.totalTimeSpent,
      questions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

/**
 * GET /api/tests/:id/resume
 * To'xtatilgan testni davom ettirish
 */
router.get('/:id/resume', authenticate, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('questions.questionId', '-correctAnswer -explanation');

    if (!test) {
      return res.status(404).json({ message: 'Test topilmadi' });
    }

    if (test.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Bu test sizga tegishli emas' });
    }

    if (test.status === 'completed') {
      return res.status(400).json({ message: 'Test allaqachon yakunlangan' });
    }

    // Mavjud javoblarni olish
    const answers = {};
    test.questions.forEach(q => {
      if (q.userAnswer) {
        answers[q.questionId._id.toString()] = q.userAnswer;
      }
    });

    res.json({
      testId: test._id,
      questions: test.questions.map(q => ({
        id: q.questionId._id,
        questionText: q.questionId.questionText,
        options: q.questionId.options,
        category: q.questionId.category,
        difficulty: q.questionId.difficulty,
        latex: q.questionId.latex,
        image: q.questionId.image
      })),
      answers,
      currentQuestionIndex: test.currentQuestionIndex,
      timeLeft: test.timeLeftAtSave,
      flaggedQuestions: test.questions
        .map((q, i) => q.isFlagged ? i : null)
        .filter(i => i !== null)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
});

export default router;
