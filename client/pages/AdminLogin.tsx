import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, ArrowLeft, AlertCircle, CheckCircle, Globe2, Home, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginAttempt {
  timestamp: number;
  success: boolean;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (lockTimeRemaining > 0) {
        setLockTimeRemaining(prev => prev - 1);
      } else if (isLocked) {
        setIsLocked(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockTimeRemaining, isLocked]);

  const checkRateLimit = () => {
    const now = Date.now();
    const recentAttempts = loginAttempts.filter(attempt => 
      now - attempt.timestamp < 15 * 60 * 1000 // آخر 15 دقيقة
    );
    
    const failedAttempts = recentAttempts.filter(attempt => !attempt.success);
    
    if (failedAttempts.length >= 5) {
      setIsLocked(true);
      setLockTimeRemaining(300); // 5 دقائق
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isLocked) {
      setError(`تم قفل تسجيل الدخول لمدة ${Math.ceil(lockTimeRemaining / 60)} دقيقة بسبب المحاولات المتكررة`);
      return;
    }

    if (!checkRateLimit()) {
      setError('تم تجاوز عدد المحاولات المسموح. يرجى المحاولة لاحقاً');
      return;
    }

    setIsLoading(true);

    // محاكاة طلب تسجيل الدخول
    await new Promise(resolve => setTimeout(resolve, 1500));

    const attempt: LoginAttempt = {
      timestamp: Date.now(),
      success: false
    };

    if (credentials.username === 'mosab' && credentials.password === 'mosab22220') {
      attempt.success = true;
      setLoginAttempts(prev => [...prev, attempt]);
      setShowSuccess(true);
      
      // حفظ حالة تسجيل الدخول إذا كان "تذكرني" مفعل
      if (rememberMe) {
        localStorage.setItem('admin_remember', 'true');
      }
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } else {
      attempt.success = false;
      setLoginAttempts(prev => [...prev, attempt]);
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const getLocalizedText = (ar: string, en: string, fr: string) => {
    switch (language) {
      case 'ar': return ar;
      case 'en': return en;
      case 'fr': return fr;
      default: return ar;
    }
  };

  return (
    <div className="min-h-screen bg-primary from-tarhal-navy via-tarhal-blue-dark to-tarhal-blue relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/25 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 right-1/3 w-8 h-8 border border-white/15 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-tarhal-orange/5 to-transparent"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white">
          <div className="max-w-md text-center space-y-8 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-3xl flex items-center justify-center shadow-2xl">
                <Globe2 size={40} className="text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-tarhal-orange bg-clip-text text-transparent">
                  ciar
                </h1>
                <p className="text-lg text-white/80 mt-1">
                  {getLocalizedText('سياحة وسفر', 'Travel & Tourism', 'Voyage & Tourisme')}
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold leading-tight">
                {getLocalizedText(
                  'مرحباً بك في لوحة التحكم',
                  'Welcome to Admin Dashboard',
                  'Bienvenue dans le Tableau de Bord'
                )}
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                {getLocalizedText(
                  'إدارة شاملة ومتقدمة لجميع خدمات السياحة والسفر. تحكم في المحتوى، راقب الإحصائيات، وقدم أفضل تجربة للعملاء.',
                  'Comprehensive and advanced management for all travel and tourism services. Control content, monitor statistics, and provide the best customer experience.',
                  'Gestion complète et avancée de tous les services de voyage et de tourisme. Contrôlez le contenu, surveillez les statistiques et offrez la meilleure expérience client.'
                )}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-tarhal-orange" />
                </div>
                <p className="text-sm font-medium">
                  {getLocalizedText('أمان متقدم', 'Advanced Security', 'Sécurité Avancée')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <Sparkles className="h-6 w-6 text-tarhal-orange" />
                </div>
                <p className="text-sm font-medium">
                  {getLocalizedText('واجهة حديثة', 'Modern Interface', 'Interface Moderne')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                  <Clock className="h-6 w-6 text-tarhal-orange" />
                </div>
                <p className="text-sm font-medium">
                  {getLocalizedText('عمل 24/7', '24/7 Operation', 'Fonctionnement 24/7')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Header */}
            <div className="lg:hidden text-center space-y-4 animate-fade-in">
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-tarhal-orange to-tarhal-orange-dark rounded-2xl flex items-center justify-center shadow-xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white">
                {getLocalizedText('لوحة تحكم ciar', 'ciar Dashboard', 'Tableau de Bord ciar')}
              </h1>
              <p className="text-white/80">
                {getLocalizedText('تسجيل دخول المدير', 'Admin Login', 'Connexion Admin')}
              </p>
            </div>

            {/* Status Display */}
            <div className="text-center space-y-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
                <Clock size={16} />
                <span>
                  {currentTime.toLocaleTimeString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US')}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{getLocalizedText('النظام يعمل بشكل طبيعي', 'System Operating Normally', 'Système Fonctionnel')}</span>
              </div>
            </div>

            {/* Login Form */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 animate-shake backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-300" />
                      <p className="text-red-200 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {showSuccess && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 animate-scale-in backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-300" />
                      <p className="text-green-200 text-sm font-medium">
                        {getLocalizedText('تم تسجيل الدخول بنجاح! جاري التوجيه...', 'Login successful! Redirecting...', 'Connexion réussie! Redirection...')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-white font-medium text-sm">
                      {getLocalizedText('اسم المستخدم', 'Username', 'Nom d\'utilisateur')}
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5 group-focus-within:text-tarhal-orange transition-colors" />
                      <Input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleInputChange}
                        placeholder={getLocalizedText('أدخل اسم المستخدم', 'Enter username', 'Entrez nom d\'utilisateur')}
                        required
                        disabled={isLoading || isLocked}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:border-tarhal-orange focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-white font-medium text-sm">
                      {getLocalizedText('كلمة المرور', 'Password', 'Mot de passe')}
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5 group-focus-within:text-tarhal-orange transition-colors" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        placeholder={getLocalizedText('أدخل كلمة المرور', 'Enter password', 'Entrez mot de passe')}
                        required
                        disabled={isLoading || isLocked}
                        className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:border-tarhal-orange focus:bg-white/15 transition-all duration-300 backdrop-blur-sm hover:bg-white/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-tarhal-orange bg-white/10 border-white/20 rounded focus:ring-tarhal-orange focus:ring-2"
                    />
                    <label htmlFor="remember" className="text-white/80 text-sm font-medium cursor-pointer">
                      {getLocalizedText('تذكرني', 'Remember me', 'Se souvenir de moi')}
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || isLocked}
                  className="w-full bg-gradient-to-r from-tarhal-orange to-tarhal-orange-dark text-white py-4 text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      {getLocalizedText('جاري تسجيل الدخول...', 'Logging in...', 'Connexion en cours...')}
                    </div>
                  ) : isLocked ? (
                    `${getLocalizedText('مقفل لمدة', 'Locked for', 'Verrouillé pour')} ${Math.ceil(lockTimeRemaining / 60)} ${getLocalizedText('دقيقة', 'minutes', 'minutes')}`
                  ) : (
                    getLocalizedText('تسجيل الدخول', 'Sign In', 'Se connecter')
                  )}
                </Button>

                {/* Demo Credentials */}
                <div className="p-5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="h-4 w-4 text-yellow-300" />
                    </div>
                    {/* <div>
                      <h3 className="text-yellow-200 font-semibold mb-2">
                        {getLocalizedText('بيانات تجريبية:', 'Demo Credentials:', 'Identifiants de démonstration:')}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-yellow-200/90 text-sm font-mono">
                          {getLocalizedText('اسم المستخدم:', 'Username:', 'Nom d\'utilisateur:')} <span className="font-bold">admin</span>
                        </p>
                        <p className="text-yellow-200/90 text-sm font-mono">
                          {getLocalizedText('كلمة ال��رور:', 'Password:', 'Mot de passe:')} <span className="font-bold">ciar2024</span>
                        </p>
                      </div>
                    </div> */}
                  </div>
                </div>
              </form>
            </div>

            {/* Supervisor Login Link */}
            <div className="text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-medium mb-3">
                  {getLocalizedText('هل أنت مشرف دولة؟', 'Are you a Country Supervisor?', 'Êtes-vous superviseur de pays?')}
                </h3>
                <Link
                  to="/supervisor/login"
                  className="inline-flex items-center gap-3 bg-blue-600/80 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">
                    {getLocalizedText('تسجيل دخول المشرفين', 'Supervisor Login', 'Connexion Superviseur')}
                  </span>
                </Link>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center animate-fade-in" style={{ animationDelay: '700ms' }}>
              <Link
                to="/"
                className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-all duration-300 hover:scale-105 group"
              >
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                  <Home className="h-4 w-4" />
                </div>
                <span className="font-medium">
                  {getLocalizedText('العودة للموقع الرئيسي', 'Back to Main Site', 'Retour au site principal')}
                </span>
              </Link>
            </div>

            {/* Footer */}
            <div className="text-center space-y-2 text-white/60 text-sm animate-fade-in" style={{ animationDelay: '800ms' }}>
              <p>© 2024 {getLocalizedText('شركة ciar للسياحة والسفر', 'ciar Travel & Tourism Company', 'Société ciar Voyage & Tourisme')}</p>
              <p>{getLocalizedText('جميع الحقوق محفوظة', 'All Rights Reserved', 'Tous Droits Réservés')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
