import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, X } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation and feedback states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [serverSuccess, setServerSuccess] = useState('');
  
  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState({ loading: false, message: '', error: '' });

  useEffect(() => {
    // Enforce pure white theme exclusively
    localStorage.setItem('wm_admin_theme', 'light');
    document.documentElement.removeAttribute('data-theme');
    if (document.body) document.body.removeAttribute('data-theme');
  }, []);

  if (!isOpen) return null;

  // Pure White Enterprise Theme Palette
  const colors = {
    bgPage: '#F8FAFC',
    bgCard: '#FFFFFF',
    bgSubtle: '#F1F5F9',
    bgInput: '#FFFFFF',
    border: '#E2E8F0',
    borderFocus: '#2563EB',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#64748B',
    textDim: '#94A3B8',
    brand: '#2563EB',
    brandHover: '#1D4ED8',
    errorBg: '#FEF2F2',
    errorBorder: '#FCA5A5',
    errorText: '#991B1B',
    successBg: '#ECFDF5',
    successBorder: '#A7F3D0',
    successText: '#065F46',
  };

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setServerError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Work email is required.');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid work email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    }

    return isValid;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError('');
    setServerSuccess('');

    try {
      // Connect to genuine server endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.data && result.data.tokens) {
        setServerSuccess('Authentication verified. Accessing secure workspace...');
        const { user, tokens } = result.data;

        // Store tokens securely in standard storage
        sessionStorage.setItem('wm_admin_token', tokens.accessToken);
        sessionStorage.setItem('wm_admin_user', JSON.stringify(user));

        if (rememberMe) {
          localStorage.setItem('wm_admin_token', tokens.accessToken);
          localStorage.setItem('wm_admin_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('wm_admin_token');
          localStorage.removeItem('wm_admin_user');
        }

        setTimeout(() => {
          onLoginSuccess && onLoginSuccess(user);
        }, 500);
      } else {
        setServerError(result.error || 'Invalid work email or password. Please verify your credentials and try again.');
      }
    } catch (err) {
      setServerError('Unable to reach the enterprise authentication server. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;

    setRecoveryStatus({ loading: true, message: '', error: '' });
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim() })
      });
      const data = await res.json().catch(() => ({}));
      setRecoveryStatus({
        loading: false,
        message: data.message || `Password reset instructions dispatched to ${recoveryEmail.trim()}.`,
        error: ''
      });
      setTimeout(() => {
        setShowForgotModal(false);
        setRecoveryStatus({ loading: false, message: '', error: '' });
      }, 2500);
    } catch (err) {
      setRecoveryStatus({
        loading: false,
        message: `Password reset request registered for ${recoveryEmail.trim()}.`,
        error: ''
      });
      setTimeout(() => {
        setShowForgotModal(false);
        setRecoveryStatus({ loading: false, message: '', error: '' });
      }, 2500);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.bgPage,
      zIndex: 99999,
      display: 'flex',
      overflowY: 'auto'
    }}>
      
      {/* Split Screen Layout */}
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        flexDirection: 'row'
      }} className="auth-split-wrapper">
        
        {/* Left Section: Brand Presentation */}
        <div style={{
          flex: '1 1 50%',
          maxWidth: '50%',
          backgroundColor: colors.bgPage,
          borderRight: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3.5rem 4rem',
          position: 'relative'
        }} className="brand-pane-desktop">
          
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/assets/images/logo.png" 
              alt="White Mist Logo" 
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => { e.currentTarget.src = '/public/assets/images/logo.png'; }}
            />
          </div>

          {/* Middle Editorial Content */}
          <div style={{ margin: 'auto 0', padding: '2rem 0' }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: colors.textPrimary,
              lineHeight: 1.2,
              marginBottom: '0.85rem'
            }}>
              Welcome to White Mist.
            </h1>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: colors.textMuted,
              maxWidth: '490px',
              marginBottom: '2.25rem'
            }}>
              Manage your store operations, products, inventory, orders, and customer experience from one secure workspace.
            </p>

            {/* Product Workspace Card */}
            <div style={{
              backgroundColor: colors.bgCard,
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
              maxWidth: '490px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                paddingBottom: '1.25rem',
                borderBottom: `1px solid ${colors.border}`
              }}>
                <img 
                  src="/assets/images/bottle_blue.png" 
                  alt="White Mist Liquid Detergent Bottle" 
                  style={{
                    width: '64px',
                    height: '72px',
                    objectFit: 'contain',
                    backgroundColor: colors.bgSubtle,
                    borderRadius: '8px',
                    padding: '6px',
                    flexShrink: 0
                  }}
                  onError={(e) => { e.currentTarget.src = '/public/assets/images/bottle_blue.png'; }}
                />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: colors.textPrimary, margin: '0 0 0.25rem 0' }}>
                    Meridian White Mist Commercial Suite
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: colors.textMuted, margin: 0, lineHeight: 1.4 }}>
                    Advanced bio-enzyme liquid detergent formulations & operational fulfillment logistics.
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                paddingTop: '1.25rem',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: colors.brand, lineHeight: 1.1 }}>48-Hr</div>
                  <div style={{ fontSize: '0.72rem', color: colors.textMuted, marginTop: '0.25rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Scent Lock
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: colors.brand, lineHeight: 1.1 }}>10x</div>
                  <div style={{ fontSize: '0.72rem', color: colors.textMuted, marginTop: '0.25rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Bio-Stain Lift
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: colors.brand, lineHeight: 1.1 }}>100%</div>
                  <div style={{ fontSize: '0.72rem', color: colors.textMuted, marginTop: '0.25rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Fabric Safe
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div style={{
            fontSize: '0.82rem',
            color: colors.textDim,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${colors.border}`,
            paddingTop: '1.5rem'
          }}>
            <span>White Mist · Official Administration Portal</span>
            <span>Build v2.4 (Enterprise)</span>
          </div>
        </div>

        {/* Right Section: Secure Login Form Card */}
        <div style={{
          flex: '1 1 50%',
          maxWidth: '50%',
          backgroundColor: colors.bgCard,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 2rem',
          position: 'relative'
        }} className="login-pane-desktop">
          
          {/* Top Right Close Control */}
          {onClose && (
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              right: '2rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: `1px solid ${colors.border}`,
                  color: colors.textSecondary,
                  padding: '0.45rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.bgSubtle; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                title="Close and return to store"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div style={{ width: '100%', maxWidth: '410px' }} className="login-card-container">
            
            {/* Mobile-Only White Mist Logo */}
            <div className="mobile-brand-header">
              <img 
                src="/assets/images/logo.png" 
                alt="White Mist Logo" 
                style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                onError={(e) => { e.currentTarget.src = '/public/assets/images/logo.png'; }}
              />
            </div>

            {/* Subtle Security Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: colors.bgSubtle,
              border: `1px solid ${colors.border}`,
              color: colors.textMuted,
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              marginBottom: '1.25rem'
            }}>
              <ShieldCheck size={13} />
              AUTHORIZED PERSONNEL ONLY
            </div>

            <h2 className="login-heading" style={{
              fontSize: '1.65rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: colors.textPrimary,
              margin: '0 0 0.4rem 0'
            }}>
              Administrator Sign In
            </h2>
            <p className="login-subheading" style={{
              fontSize: '0.9rem',
              color: colors.textMuted,
              margin: '0 0 2rem 0'
            }}>
              Sign in to access your administration workspace.
            </p>

            {/* Server Error Alert */}
            {serverError && (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                fontSize: '0.84rem',
                lineHeight: 1.45,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                backgroundColor: colors.errorBg,
                border: `1px solid ${colors.errorBorder}`,
                color: colors.errorText
              }} role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{serverError}</span>
              </div>
            )}

            {/* Server Success Alert */}
            {serverSuccess && (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                fontSize: '0.84rem',
                lineHeight: 1.45,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                backgroundColor: colors.successBg,
                border: `1px solid ${colors.successBorder}`,
                color: colors.successText
              }} role="alert">
                <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{serverSuccess}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} noValidate>
              
              {/* Email Input */}
              <div style={{ marginBottom: '1.35rem' }}>
                <label 
                  htmlFor="authWorkEmail"
                  style={{
                    display: 'block',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: colors.textPrimary,
                    marginBottom: '0.45rem',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Work email address
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '12px', color: colors.textDim, pointerEvents: 'none', display: 'flex' }}>
                    <Mail size={18} />
                  </span>
                  <input 
                    id="authWorkEmail"
                    className="auth-input-field"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="name@company.com"
                    autoComplete="username"
                    required
                    style={{
                      width: '100%',
                      height: '44px',
                      padding: '0 1rem 0 2.5rem',
                      fontSize: '0.92rem',
                      fontFamily: 'inherit',
                      color: colors.textPrimary,
                      backgroundColor: colors.bgInput,
                      border: `1px solid ${emailError ? '#DC2626' : colors.border}`,
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onFocus={(e) => {
                      if (!emailError) {
                        e.target.style.borderColor = colors.borderFocus;
                        e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!emailError) {
                        e.target.style.borderColor = colors.border;
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                </div>
                {emailError && (
                  <div style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '0.35rem' }}>
                    {emailError}
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: '1.35rem' }}>
                <label 
                  htmlFor="authPassword"
                  style={{
                    display: 'block',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: colors.textPrimary,
                    marginBottom: '0.45rem',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '12px', color: colors.textDim, pointerEvents: 'none', display: 'flex' }}>
                    <Lock size={18} />
                  </span>
                  <input 
                    id="authPassword"
                    className="auth-input-field"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    style={{
                      width: '100%',
                      height: '44px',
                      padding: '0 2.5rem 0 2.5rem',
                      fontSize: '0.92rem',
                      fontFamily: 'inherit',
                      color: colors.textPrimary,
                      backgroundColor: colors.bgInput,
                      border: `1px solid ${passwordError ? '#DC2626' : colors.border}`,
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onFocus={(e) => {
                      if (!passwordError) {
                        e.target.style.borderColor = colors.borderFocus;
                        e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!passwordError) {
                        e.target.style.borderColor = colors.border;
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      background: 'none',
                      border: 'none',
                      color: colors.textMuted,
                      cursor: 'pointer',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px'
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <div style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '0.35rem' }}>
                    {passwordError}
                  </div>
                )}
              </div>

              {/* Options Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '0.25rem 0 1.5rem 0',
                fontSize: '0.84rem'
              }}>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: colors.textSecondary,
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: colors.brand, cursor: 'pointer' }}
                  />
                  <span>Remember me</span>
                </label>

                <button 
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: colors.brand,
                    fontSize: 'inherit',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Submit Button */}
              <button 
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: colors.brand,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'background-color 0.2s ease, opacity 0.2s ease'
                }}
                onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = colors.brandHover; }}
                onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = colors.brand; }}
              >
                {isLoading && (
                  <span style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    borderTopColor: '#FFFFFF',
                    animation: 'spin 0.6s linear infinite',
                    display: 'inline-block'
                  }} />
                )}
                <span>{isLoading ? 'Signing in...' : 'Sign In to Admin Portal'}</span>
              </button>
            </form>

            {/* Security Audit Footnote */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.78rem',
              color: colors.textDim,
              marginTop: '2rem',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={13} />
              <span>Secured with 256-bit TLS encryption. Access is logged.</span>
            </div>

            {/* Back to Storefront Link */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textMuted,
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = colors.brand; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = colors.textMuted; }}
              >
                <ArrowLeft size={14} />
                <span>Return to Customer Storefront</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Forgot Password Recovery Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '1.5rem'
        }}>
          <div style={{
            backgroundColor: colors.bgCard,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            width: '100%',
            maxWidth: '440px',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
                Reset Administrator Password
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'none', border: 'none', color: colors.textDim, cursor: 'pointer', padding: '4px' }}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: colors.textMuted, lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
              Enter your authorized corporate email address. If an account is associated with this address in the enterprise directory, an automated password reset link will be dispatched immediately.
            </p>

            {recoveryStatus.message && (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                fontSize: '0.84rem',
                marginBottom: '1.25rem',
                backgroundColor: colors.successBg,
                border: `1px solid ${colors.successBorder}`,
                color: colors.successText
              }}>
                {recoveryStatus.message}
              </div>
            )}

            <form onSubmit={handleForgotSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  htmlFor="recoveryEmailInput"
                  style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: colors.textPrimary, marginBottom: '0.45rem' }}
                >
                  Authorized Work Email
                </label>
                <input 
                  id="recoveryEmailInput"
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="admin@whitemist.com"
                  required
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 1rem',
                    fontSize: '0.92rem',
                    backgroundColor: colors.bgInput,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    color: colors.textPrimary,
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  style={{
                    height: '40px',
                    padding: '0 1rem',
                    backgroundColor: colors.bgSubtle,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recoveryStatus.loading}
                  style={{
                    height: '40px',
                    padding: '0 1.25rem',
                    backgroundColor: colors.brand,
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: recoveryStatus.loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {recoveryStatus.loading ? 'Dispatching...' : 'Send Reset Instructions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive Styles Injection */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .mobile-brand-header {
          display: none;
        }

        /* Tablet Adjustments (768px - 1024px) */
        @media (min-width: 768px) and (max-width: 1024px) {
          .brand-pane-desktop {
            padding: 2.5rem 2rem !important;
          }
          .brand-pane-desktop h1 {
            font-size: 1.85rem !important;
          }
          .login-pane-desktop {
            padding: 2.5rem 2rem !important;
          }
        }

        /* Mobile Phones: 320px to 767px */
        @media (max-width: 767px) {
          .auth-split-wrapper {
            flex-direction: column !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
            min-height: 100svh !important;
            width: 100% !important;
            overflow-x: hidden !important;
          }

          /* 1. HIDE ENTIRE LEFT BRAND PRESENTATION */
          .brand-pane-desktop {
            display: none !important;
          }

          /* 2. SHOW COMPACT LOGO AT TOP OF LOGIN FORM */
          .mobile-brand-header {
            display: flex !important;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 1.25rem !important;
          }

          /* 3. FULL VIEWPORT SINGLE-COLUMN LOGIN PANE */
          .login-pane-desktop {
            flex: 1 1 100% !important;
            max-width: 100% !important;
            width: 100% !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
            min-height: 100svh !important;
            padding: max(1.5rem, env(safe-area-inset-top)) max(1.25rem, env(safe-area-inset-right)) max(1.5rem, env(safe-area-inset-bottom)) max(1.25rem, env(safe-area-inset-left)) !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            background-color: #FFFFFF !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
          }

          .login-card-container {
            width: 100% !important;
            max-width: 420px !important;
            margin: auto 0 !important;
          }

          .login-heading {
            font-size: 1.55rem !important;
            letter-spacing: -0.02em !important;
            margin-bottom: 0.35rem !important;
          }

          .login-subheading {
            font-size: 0.88rem !important;
            margin-bottom: 1.5rem !important;
          }

          /* Touch-friendly inputs: 48-52px tall, 16px font to prevent mobile safari auto-zoom */
          .auth-input-field {
            height: 50px !important;
            font-size: 16px !important;
            border-radius: 8px !important;
          }

          /* Primary sign-in button: 48-52px tall */
          .auth-submit-btn {
            height: 50px !important;
            font-size: 15px !important;
            border-radius: 8px !important;
          }
        }

        /* Very Small Screens (< 360px) */
        @media (max-width: 359px) {
          .login-pane-desktop {
            padding: 1rem 0.85rem !important;
          }
          .login-heading {
            font-size: 1.35rem !important;
          }
          .auth-input-field {
            height: 46px !important;
          }
          .auth-submit-btn {
            height: 46px !important;
          }
        }
      `}</style>
    </div>
  );
}
