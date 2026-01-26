import express from 'express';
import User from '../models/User.js';
import Test from '../models/Test.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/leaderboard
 * Umumiy reyting - top 100
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const { region, timeRange = 'all' } = req.query;

        // Query filter
        const filter = {};
        if (region) {
            filter.region = region;
        }

        // Vaqt oralig'i
        let dateFilter = {};
        if (timeRange === 'week') {
            dateFilter = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        } else if (timeRange === 'month') {
            dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        }

        // Agar vaqt oralig'i berilgan bo'lsa, testlardan aggregation qilish
        if (timeRange !== 'all') {
            const leaderboard = await Test.aggregate([
                {
                    $match: {
                        status: 'completed',
                        completedAt: dateFilter
                    }
                },
                {
                    $group: {
                        _id: '$userId',
                        averageScore: { $avg: '$score' },
                        testsCompleted: { $sum: 1 },
                        totalXP: { $sum: '$xpEarned' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $match: region ? { 'user.region': region } : {}
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        username: '$user.username',
                        region: '$user.region',
                        level: '$user.level',
                        xp: '$totalXP',
                        streak: '$user.streak',
                        averageScore: { $round: ['$averageScore', 0] },
                        testsCompleted: 1
                    }
                },
                { $sort: { averageScore: -1, testsCompleted: -1 } },
                { $limit: 100 }
            ]);

            // Rank qo'shish
            const rankedLeaderboard = leaderboard.map((user, index) => ({
                ...user,
                rank: index + 1
            }));

            return res.json(rankedLeaderboard);
        }

        // All-time leaderboard
        const users = await User.find(filter)
            .select('username region level xp streak statistics.averageScore statistics.totalTests')
            .sort({ 'statistics.averageScore': -1, 'statistics.totalTests': -1 })
            .limit(100);

        const leaderboard = users.map((user, index) => ({
            id: user._id,
            rank: index + 1,
            username: user.username,
            region: user.region || 'Noma\'lum',
            level: user.level,
            xp: user.xp,
            streak: user.streak,
            averageScore: user.statistics?.averageScore || 0,
            testsCompleted: user.statistics?.totalTests || 0
        }));

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server xatosi', error: error.message });
    }
});

/**
 * GET /api/leaderboard/region/:region
 * Viloyat bo'yicha reyting
 */
router.get('/region/:region', authenticate, async (req, res) => {
    try {
        const { region } = req.params;

        const users = await User.find({ region })
            .select('username region level xp streak statistics.averageScore statistics.totalTests')
            .sort({ 'statistics.averageScore': -1, 'statistics.totalTests': -1 })
            .limit(100);

        const leaderboard = users.map((user, index) => ({
            id: user._id,
            rank: index + 1,
            username: user.username,
            region: user.region,
            level: user.level,
            xp: user.xp,
            streak: user.streak,
            averageScore: user.statistics?.averageScore || 0,
            testsCompleted: user.statistics?.totalTests || 0
        }));

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server xatosi', error: error.message });
    }
});

/**
 * GET /api/leaderboard/user-rank
 * Joriy foydalanuvchining reytingini olish
 */
router.get('/user-rank', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
        }

        // Global rank
        const globalRank = await User.countDocuments({
            'statistics.averageScore': { $gt: user.statistics?.averageScore || 0 }
        }) + 1;

        // Regional rank
        let regionalRank = null;
        if (user.region) {
            regionalRank = await User.countDocuments({
                region: user.region,
                'statistics.averageScore': { $gt: user.statistics?.averageScore || 0 }
            }) + 1;
        }

        res.json({
            globalRank,
            regionalRank,
            region: user.region,
            averageScore: user.statistics?.averageScore || 0,
            totalTests: user.statistics?.totalTests || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server xatosi', error: error.message });
    }
});

export default router;
