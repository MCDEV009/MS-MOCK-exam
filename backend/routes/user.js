import express from 'express';
import User from '../models/User.js';
import Test from '../models/Test.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/user/profile
 * Foydalanuvchi profilini olish
 */
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server xatosi', error: error.message });
    }
});

/**
 * PUT /api/user/profile
 * Profilni yangilash
 */
router.put('/profile', authenticate, async (req, res) => {
    try {
        const { username, phone, region, school, avatar } = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        // Faqat ruxsat berilgan fieldlarni yangilash
        if (username) user.username = username;
        if (phone !== undefined) user.phone = phone;
        if (region !== undefined) user.region = region;
        if (school !== undefined) user.school = school;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        res.json({ message: 'Profil yangilandi', user });
    } catch (error) {
        res.status(500).json({ message: 'Server xatosi', error: error.message });
    }
});

/**
 * GET /api/user/statistics
 * Foydalanuvchi statistikasini olish
 */
router.get('/statistics', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        // Oxirgi 30 kunlik testlarni olish
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentTests = await Test.find({
            userId: req.userId,
            status: 'completed',
            completedAt: { $gte: thirtyDaysAgo }
        }).sort({ completedAt: 1 });

        // Progress data
        const progressData = recentTests.map(test => ({
            date: test.completedAt.toLocaleDateString('uz-UZ'),
            score: test.score
        }));

        // Kategoriya statistikasini hisoblash
        const categoryStats = {};
        const categories = ['algebra', 'geometriya', 'trigonometriya', 'funksiyalar', 'tenglamalar', 'ehtimollar', 'mantiq'];

        categories.forEach(cat => {
            const stats = user.statistics.categoryScores[cat];
            const percentage = stats.total > 0
                ? Math.round((stats.correct / stats.total) * 100)
                : 0;
            categoryStats[cat] = {
                correct: stats.correct,
                total: stats.total,
                percentage
            };
        });

        // Kuchli/kuchsiz tomonlarni aniqlash
        const sortedCategories = Object.entries(categoryStats)
            .filter(([_, v]) => v.total > 0)
            .sort((a, b) => b[1].percentage - a[1].percentage);

        const strongTopics = sortedCategories.slice(0, 2).map(([name, data]) => ({
            name,
            percentage: data.percentage
        }));

        const weakTopics = sortedCategories.slice(-2).reverse().map(([name, data]) => ({
            name,
            percentage: data.percentage
        }));

        res.json({
            totalTests: user.statistics.totalTests,
            averageScore: user.statistics.averageScore,
            bestScore: user.statistics.bestScore,
            totalTimeSpent: user.statistics.totalTimeSpent,
            streak: user.streak,
            longestStreak: user.longestStreak,
            xp: user.xp,
            level: user.level,
            achievements: user.achievements,
            categoryScores: categoryStats,
            progressData,
            strongTopics,
            weakTopics
        });
    } catch (error) {
        res.status(500).json({ message: 'Server xatosi', error: error.message });
    }
});

/**
 * GET /api/user/achievements
 * Yutuqlarni olish
 */
router.get('/achievements', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        // Barcha mumkin bo'lgan yutuqlar
        const allAchievements = [
            { id: 'first_test', name: 'Birinchi qadam', icon: '🎯', desc: 'Birinchi testni yakunlash' },
            { id: 'streak_7', name: 'Haftalik streak', icon: '🔥', desc: '7 kunlik streak' },
            { id: 'streak_30', name: 'Oylik streak', icon: '💪', desc: '30 kunlik streak' },
            { id: 'score_90', name: "A'lochi", icon: '⭐', desc: '90% dan yuqori ball' },
            { id: 'score_100', name: 'Perfeksionist', icon: '💯', desc: '100% ball olish' },
            { id: 'tests_10', name: '10 ta test', icon: '📝', desc: '10 ta test topshirish' },
            { id: 'tests_50', name: '50 ta test', icon: '📚', desc: '50 ta test topshirish' },
            { id: 'tests_100', name: 'Test ustasi', icon: '🏆', desc: '100 ta test topshirish' },
            { id: 'category_master', name: 'Kategoriya ustasi', icon: '🎓', desc: 'Bir kategoriyada 90%+' },
            { id: 'speed_master', name: 'Tezkor', icon: '⚡', desc: 'Testni 45 daqiqada tugatish' }
        ];

        const achievements = allAchievements.map(a => ({
            ...a,
            unlocked: user.achievements.includes(a.id)
        }));

        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: 'Server xatosi', error: error.message });
    }
});

/**
 * POST /api/user/check-achievements
 * Yutuqlarni tekshirish va yangilarini qo'shish
 */
router.post('/check-achievements', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        const newAchievements = [];

        // First test
        if (!user.achievements.includes('first_test') && user.statistics.totalTests >= 1) {
            user.achievements.push('first_test');
            newAchievements.push('first_test');
        }

        // Streak achievements
        if (!user.achievements.includes('streak_7') && user.streak >= 7) {
            user.achievements.push('streak_7');
            newAchievements.push('streak_7');
        }
        if (!user.achievements.includes('streak_30') && user.streak >= 30) {
            user.achievements.push('streak_30');
            newAchievements.push('streak_30');
        }

        // Score achievements
        if (!user.achievements.includes('score_90') && user.statistics.bestScore >= 90) {
            user.achievements.push('score_90');
            newAchievements.push('score_90');
        }
        if (!user.achievements.includes('score_100') && user.statistics.bestScore >= 100) {
            user.achievements.push('score_100');
            newAchievements.push('score_100');
        }

        // Test count achievements
        if (!user.achievements.includes('tests_10') && user.statistics.totalTests >= 10) {
            user.achievements.push('tests_10');
            newAchievements.push('tests_10');
        }
        if (!user.achievements.includes('tests_50') && user.statistics.totalTests >= 50) {
            user.achievements.push('tests_50');
            newAchievements.push('tests_50');
        }
        if (!user.achievements.includes('tests_100') && user.statistics.totalTests >= 100) {
            user.achievements.push('tests_100');
            newAchievements.push('tests_100');
        }

        if (newAchievements.length > 0) {
            await user.save();
        }

        res.json({ newAchievements });
    } catch (error) {
        res.status(500).json({ message: 'Server xatosi', error: error.message });
    }
});

export default router;
