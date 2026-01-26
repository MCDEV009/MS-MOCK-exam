import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import apiClient from '../config/axios';
import { StatCard } from '../components/ui/Card';

/**
 * Premium Dashboard sahifasi
 * Shaxsiy kabinet va statistika
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    tests: 0,
    averageScore: 0,
    streak: 0,
    xp: 0,
    level: 1,
    rank: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get('/api/tests/history');
      const tests = response.data;
      const completedTests = tests.filter(t => t.status === 'completed');
      const avgScore = completedTests.length > 0
        ? Math.round(completedTests.reduce((sum, t) => sum + t.score, 0) / completedTests.length)
        : 0;

      setStats({
        tests: completedTests.length,
        averageScore: avgScore,
        streak: 7, // Mock
        xp: user?.xp || 2450,
        level: user?.level || 12,
        rank: 156 // Mock
      });
      setRecentTests(completedTests.slice(0, 5));
    } catch (error) {
      console.error('Dashboard xatosi:', error);
    } finally {
      setLoading(false);
    }
  };

  // Quick actions
  const quickActions = [
    {
      title: "Test boshlash",
      description: "50 ta savol, 90 daqiqa",
      icon: "📝",
      path: "/take-test",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      title: "Statistika",
      description: "Batafsil tahlil",
      icon: "📊",
      path: "/statistics",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "Reyting",
      description: "O'z o'rningiz",
      icon: "🏆",
      path: "/leaderboard",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "Savol yaratish",
      description: "AI yordamida",
      icon: "🤖",
      path: "/create-question",
      gradient: "from-pink-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8">
      <div className="container mx-auto px-4">
        {/* Welcome header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                Salom, {user?.username || 'Foydalanuvchi'}! 👋
              </h1>
              <p className="text-[var(--text-secondary)]">
                Bugun ham o'rganishni davom ettiramizmi?
              </p>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <StatCard
              title="Testlar"
              value={stats.tests}
              icon={<span className="text-xl">📝</span>}
              color="primary"
            />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <StatCard
              title="O'rtacha"
              value={`${stats.averageScore}%`}
              icon={<span className="text-xl">📈</span>}
              color="success"
            />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <StatCard
              title="Streak"
              value={stats.streak}
              icon={<span className="text-xl">🔥</span>}
              color="warning"
            />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <StatCard
              title="XP"
              value={stats.xp}
              icon={<span className="text-xl">⭐</span>}
              color="purple"
            />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <StatCard
              title="Level"
              value={stats.level}
              icon={<span className="text-xl">🎖️</span>}
              color="primary"
            />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <StatCard
              title="Reyting"
              value={`#${stats.rank}`}
              icon={<span className="text-xl">🏆</span>}
              color="success"
            />
          </div>
        </div>

        {/* Quota card */}
        <div className="card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Kunlik kvota</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Bugun yana {user?.quota - user?.usedQuota || 20} ta savol yaratishingiz mumkin
              </p>
            </div>
            <div className="flex-1 max-w-xs w-full">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--text-secondary)]">Ishlatilgan</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {user?.usedQuota || 0} / {user?.quota || 20}
                </span>
              </div>
              <div className="progress-bar h-2">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((user?.usedQuota || 0) / (user?.quota || 20)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
            ⚡ Tezkor harakatlar
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.path}
                to={action.path}
                className={`card p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {action.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-secondary)]">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent tests */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              📋 Oxirgi testlar
            </h2>
            <Link
              to="/test-history"
              className="text-[var(--primary)] hover:underline text-sm font-medium"
            >
              Barchasini ko'rish →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-16 rounded-xl"></div>
              ))}
            </div>
          ) : recentTests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-[var(--text-secondary)]">Hali test topshirmadingiz</p>
              <Link to="/take-test" className="btn btn-primary mt-4">
                Birinchi testni boshlash
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTests.map((test, index) => (
                <Link
                  key={test.id}
                  to={`/test-results/${test.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${test.score >= 80 ? 'bg-green-500' :
                        test.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                      {test.score}%
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        Test #{test.id?.slice(-6) || index + 1}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {test.totalQuestions} ta savol • {new Date(test.completedAt).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                  <div className={`badge ${test.score >= 60 ? 'badge-success' : 'badge-danger'
                    }`}>
                    {test.score >= 60 ? "O'tdi" : "O'tmadi"}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Daily tip */}
        <div className="card p-6 mt-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-1">Kunlik maslahat</h3>
              <p className="text-[var(--text-secondary)]">
                Trigonometriya savollarida asosiy formulalarni yodda tuting: sin²α + cos²α = 1.
                Bu formula juda ko'p masalalarni yechishda yordam beradi!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
