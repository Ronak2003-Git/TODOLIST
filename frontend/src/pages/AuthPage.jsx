import { useState } from 'react';
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoMark from '../components/LogoMark';
import PlannerIllustration from '../components/PlannerIllustration';

function FormField({ label, type = 'text', placeholder, icon: Icon, value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  return (
    <label className="form-field">
      <span>{label}</span>
      <div className="form-field__control">
        <Icon aria-hidden="true" />
        <input type={isPassword && showPassword ? 'text' : type} value={value} onChange={onChange} placeholder={placeholder} aria-invalid={Boolean(error)} autoComplete={isPassword ? 'current-password' : undefined} />
        {isPassword && <button className="password-toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>}
      </div>
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}

function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', registerNumber: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const setField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!form.email.trim()) errors.email = 'Enter your email or login ID.';
    if (!form.password) errors.password = 'Enter your password.';
    if (!isLogin) {
      if (!form.fullName.trim()) errors.fullName = 'Enter your full name.';
      if (!form.registerNumber.trim()) errors.registerNumber = 'Enter your register number.';
      if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    }
    setFieldErrors(errors);
    setError('');
    if (Object.keys(errors).length) return;
    setIsSubmitting(true);
    try {
      if (isLogin) await login({ email: form.email.trim(), password: form.password });
      else await register(form);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally { setIsSubmitting(false); }
  };

  return (
    <main className="auth-screen">
      <section className="auth-showcase">
        <LogoMark />
        <div className="auth-showcase__copy"><p className="eyebrow eyebrow--violet">STUDENT PRODUCTIVITY, SIMPLIFIED</p><h1>Make every semester<br /><em>feel more manageable.</em></h1><p>CUSAT ToDoList gives students one calm space for classes, deadlines and progress.</p></div>
        <PlannerIllustration compact />
        <p className="showcase-quote">“Plan today, feel confident tomorrow.”</p>
      </section>
      <section className="auth-form-wrap">
        <button className="back-link" type="button" onClick={() => navigate('/onboarding')}><FiArrowLeft /> Back</button>
        <div className="auth-card">
          <div className="auth-card__heading"><p className="eyebrow">WELCOME TO CUSAT TODOLIST</p><h1>{isLogin ? 'Welcome back!' : 'Create your account'}</h1><p>{isLogin ? 'Log in to continue planning your semester.' : 'Join the student community and get organized.'}</p></div>
          {error && <div className="form-alert" role="alert">{error}</div>}
          <form onSubmit={submit} noValidate>
            {!isLogin && <FormField label="Full Name" placeholder="e.g. Ananya S." icon={FiUser} value={form.fullName} onChange={setField('fullName')} error={fieldErrors.fullName} />}
            <FormField label={isLogin ? 'Email or login ID' : 'Email Address'} type={isLogin ? 'text' : 'email'} placeholder={isLogin ? 'e.g. admin or you@example.com' : 'you@example.com'} icon={FiMail} value={form.email} onChange={setField('email')} error={fieldErrors.email} />
            {!isLogin && <FormField label="Register Number" placeholder="e.g. 1234567" icon={FiUser} value={form.registerNumber} onChange={setField('registerNumber')} error={fieldErrors.registerNumber} />}
            <FormField label="Password" type="password" placeholder="Enter your password" icon={FiLock} value={form.password} onChange={setField('password')} error={fieldErrors.password} />
            {!isLogin && <FormField label="Confirm Password" type="password" placeholder="Confirm your password" icon={FiLock} value={form.confirmPassword} onChange={setField('confirmPassword')} error={fieldErrors.confirmPassword} />}
            {isLogin && <button className="forgot-link" type="button" onClick={() => setError('Password recovery will be added with account email delivery.')}>Forgot Password?</button>}
            <button className="button button--primary button--full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : isLogin ? 'Log In' : 'Sign Up'}</button>
          </form>
          <p className="auth-switch">{isLogin ? "Don't have an account?" : 'Already have an account?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Sign Up' : 'Log In'}</Link></p>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
