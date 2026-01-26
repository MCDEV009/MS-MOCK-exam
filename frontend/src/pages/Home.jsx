import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Premium Landing Page
 * O'zbek milliy uslubda dizayn qilingan
 */
const Home = () => {
  const { isDark, toggleTheme } = useTheme();

  // Statistika ma'lumotlari
  const stats = [
    { label: "Foydalanuvchilar", value: "10,000+", icon: "👥" },
    { label: "Savollar", value: "5,000+", icon: "📝" },
    { label: "O'tkazilgan testlar", value: "50,000+", icon: "✅" },
    { label: "O'rtacha ball", value: "72%", icon: "📊" }
  ];

  // Xususiyatlar ro'yxati
  const features = [
    {
      icon: "🎯",
      title: "Real imtihon formati",
      description: "Milliy sertifikat imtihoniga o'xshash 50 ta savol, 90 daqiqa vaqt"
    },
    {
      icon: "📊",
      title: "Batafsil tahlil",
      description: "Har bir test uchun kategoriya bo'yicha natijalar va kuchsiz tomonlar"
    },
    {
      icon: "🏆",
      title: "Reyting tizimi",
      description: "Viloyat va respublika bo'yicha o'z o'rningizni bilib oling"
    },
    {
      icon: "🤖",
      title: "AI bilan savol yaratish",
      description: "Sun'iy intellekt yordamida yangi savollar generatsiya qilish"
    },
    {
      icon: "📱",
      title: "Barcha qurilmalarda",
      description: "Telefon, planshet va kompyuterda mukammal ishlaydi"
    },
    {
      icon: "🌙",
      title: "Tungi rejim",
      description: "Ko'zlaringizni himoya qiluvchi dark mode"
    }
  ];

  // Kategoriyalar
  const categories = [
    { name: "Algebra", count: 10, color: "from-blue-500 to-blue-600" },
    { name: "Geometriya", count: 8, color: "from-green-500 to-green-600" },
    { name: "Trigonometriya", count: 6, color: "from-purple-500 to-purple-600" },
    { name: "Funksiyalar", count: 8, color: "from-orange-500 to-orange-600" },
    { name: "Tenglamalar", count: 7, color: "from-pink-500 to-pink-600" },
    { name: "Ehtimollar", count: 5, color: "from-cyan-500 to-cyan-600" },
    { name: "Mantiq", count: 6, color: "from-yellow-500 to-yellow-600" }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-90" />

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        {/* O'zbekiston bayrog'i chiziqlar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 flex">
          <div className="flex-1 bg-[#0099B5]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#1EB53A]" />
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
              <span className="text-2xl">🇺🇿</span>
              <span className="text-white font-medium">O'zbekiston Milliy Sertifikat</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              Matematika
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Mock Exam
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in-up stagger-1">
              Milliy sertifikat imtihoniga eng yaxshi tayyorgarlik platformasi.
              Real imtihon sharoitida mashq qiling va yutuqlaringizni kuzatib boring.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-2">
              <Link
                to="/register"
                className="btn btn-lg px-8 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                Bepul boshlash 🚀
              </Link>
              <Link
                to="/login"
                className="btn btn-lg px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
              >
                Kirish
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 animate-fade-in-up stagger-3">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Nima uchun bizni tanlashadi? 🎯
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Platformamiz sizga eng yaxshi tayyorgarlik tajribasini taqdim etadi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-hover p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[var(--bg-tertiary)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Matematika bo'limlari 📐
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Milliy sertifikat standartiga mos 7 ta bo'lim, jami 50 ta savol
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${cat.color} text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all cursor-pointer`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
                <p className="text-white/80 text-sm">{cat.count} ta savol</p>
              </div>
            ))}
            {/* Total */}
            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <h3 className="text-lg font-bold mb-1">Jami</h3>
              <p className="text-white/80 text-sm">50 ta savol</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Qanday ishlaydi? 🚀
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Ro'yxatdan o'ting", desc: "Email yoki telefon orqali 1 daqiqada ro'yxatdan o'ting", icon: "📝" },
                { step: "2", title: "Test boshlang", desc: "50 ta savol, 90 daqiqa - haqiqiy imtihon sharoitida", icon: "⏱️" },
                { step: "3", title: "Natijalarni tahlil qiling", desc: "Kuchli va kuchsiz tomonlaringizni bilib oling", icon: "📊" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl text-white font-bold shadow-lg">
                    {item.step}
                  </div>
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                  <p className="text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hoziroq boshlang! 🎯
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Minglab talabalar allaqachon tayyorgarlik ko'rmoqda. Siz ham qo'shiling!
          </p>
          <Link
            to="/register"
            className="inline-block btn btn-lg px-10 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            Bepul ro'yxatdan o'tish
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📐</span>
              <span className="font-bold text-[var(--text-primary)]">MS Mock Exam</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">
              © 2024 Milliy Sertifikat Mock Exam. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] transition-colors"
                title={isDark ? "Light mode" : "Dark mode"}
              >
                {isDark ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
