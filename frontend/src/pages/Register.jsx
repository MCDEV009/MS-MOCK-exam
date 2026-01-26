import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui';

/**
 * Premium Register sahifasi
 */
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    region: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  // Viloyatlar
  const regions = [
    { value: 'toshkent', label: "Toshkent" },
    { value: 'samarqand', label: "Samarqand" },
    { value: 'buxoro', label: "Buxoro" },
    { value: 'andijon', label: "Andijon" },
    { value: 'fargona', label: "Farg'ona" },
    { value: 'namangan', label: "Namangan" },
    { value: 'xorazm', label: "Xorazm" },
    { value: 'qashqadaryo', label: "Qashqadaryo" },
    { value: 'surxondaryo', label: "Surxondaryo" },
    { value: 'navoiy', label: "Navoiy" },
    { value: 'jizzax', label: "Jizzax" },
    { value: 'sirdaryo', label: "Sirdaryo" },
    { value: 'qoraqalpogiston', label: "Qoraqalpog'iston" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Parollar mos kelmaydi!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!');
      return;
    }

    setLoading(true);

    const result = await register(formData.username, formData.email, formData.password);

    if (result.success) {
      toast.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz! 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Ro\'yxatdan o\'tishda xatolik');
    }

    setLoading(false);
  };

  // Password strength
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { level: 0, label: '', color: '' };
    if (password.length < 6) return { level: 1, label: 'Juda kuchsiz', color: 'bg-red-500' };
    if (password.length < 8) return { level: 2, label: 'Kuchsiz', color: 'bg-orange-500' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { level: 3, label: 'O\'rtacha', color: 'bg-yellow-500' };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { level: 5, label: 'Juda kuchli', color: 'bg-green-500' };
    }
    return { level: 4, label: 'Kuchli', color: 'bg-green-400' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-bold">
            <span className="animate-bounce">📐</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MS Mock
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="card-glass p-8 animate-scale-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Hisob yarating 🚀
            </h1>
            <p className="text-[var(--text-secondary)]">
              Bepul ro'yxatdan o'ting va testlarni yechishni boshlang
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-[var(--primary)]' : 'bg-[var(--border-color)]'}`} />
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-[var(--primary)]' : 'bg-[var(--border-color)]'}`} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                {/* Username */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    👤 Foydalanuvchi nomi
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input"
                    placeholder="username"
                    required
                  />
                </div>

                {/* Email */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    📧 Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="email@example.com"
                    required
                  />
                </div>

                {/* Region */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    📍 Viloyat
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Tanlang...</option>
                    {regions.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {/* Next button */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => {
                      if (!formData.username || !formData.email) {
                        toast.error('Barcha maydonlarni to\'ldiring!');
                        return;
                      }
                      setStep(2);
                    }}
                  >
                    Davom etish →
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Password */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    🔒 Parol
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded-full ${i <= passwordStrength.level ? passwordStrength.color : 'bg-[var(--border-color)]'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                    🔒 Parolni tasdiqlang
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    required
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Parollar mos kelmaydi</p>
                  )}
                </div>

                {/* Terms */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required className="mt-1 accent-[var(--primary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">
                      <a href="#" className="text-[var(--primary)] hover:underline">Foydalanish shartlari</a> va{' '}
                      <a href="#" className="text-[var(--primary)] hover:underline">Maxfiylik siyosati</a>ga roziman
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => setStep(1)}
                  >
                    ← Orqaga
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                  >
                    Ro'yxatdan o'tish
                  </Button>
                </div>
              </>
            )}
          </form>

          {/* Login link */}
          <p className="text-center mt-8 text-[var(--text-secondary)] animate-fade-in">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="text-[var(--primary)] font-semibold hover:underline">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
