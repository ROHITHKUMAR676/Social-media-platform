import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, RotateCcw, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const OTP_LENGTH = 6
const RESEND_COUNTDOWN = 30 // seconds

export default function VerifyOtp() {
  const { user, verifyOtp, resendOtp, isLoading } = useAuth()
  const navigate = useNavigate()

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN)
  const [canResend, setCanResend] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const inputRefs = useRef([])

  // ── Countdown timer ────────────────────────────────────────────
  useEffect(() => {
    if (countdown === 0) { setCanResend(true); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  // ── Auto-submit when all 6 digits filled ──────────────────────
  useEffect(() => {
    if (digits.every(d => d !== '')) handleVerify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits])

  useEffect(() => {
  // 🔥 only redirect if user is truly missing AND not loading
  if (!user && !isLoading) {
    navigate('/register', { replace: true })
  }
}, [user, isLoading, navigate])

  // ── Input handlers ────────────────────────────────────────────
  const handleChange = (index, value) => {
    // Accept only single digit
    const cleaned = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = cleaned
    setDigits(next)
    setError('')

    // Move focus forward
    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        // Clear current
        const next = [...digits]
        next[index] = ''
        setDigits(next)
      } else if (index > 0) {
        // Move back
        inputRefs.current[index - 1]?.focus()
        const next = [...digits]
        next[index - 1] = ''
        setDigits(next)
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const next = Array(OTP_LENGTH).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    // Focus the last filled box
    const lastIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[lastIndex]?.focus()
  }

  // ── Verify ────────────────────────────────────────────────────
const handleVerify = async () => {
  const code = digits.join('')

  if (code.length < OTP_LENGTH) {
    setError('Please enter the full 6-digit code.')
    return
  }

  setVerifying(true)
  setError('')

  const result = await verifyOtp(code)

  setVerifying(false)

  if (result.success) {
    setSuccess(true)

    setTimeout(() => {
      const isProfileDone = result.user?.profileCompleted

      if (isProfileDone) {
        navigate('/', { replace: true })
      } else {
        navigate('/create-profile', { replace: true })
      }
    }, 1000) // slightly faster, feels better UX
  } else {
    setError(result.error || 'Invalid code. Please try again.')
    setDigits(Array(OTP_LENGTH).fill(''))
    setTimeout(() => inputRefs.current[0]?.focus(), 50)
  }
}

  // ── Resend ────────────────────────────────────────────────────
  const handleResend = async () => {
    if (!canResend) return
    setCanResend(false)
    setCountdown(RESEND_COUNTDOWN)
    setDigits(Array(OTP_LENGTH).fill(''))
    setError('')
    await resendOtp()
    inputRefs.current[0]?.focus()
  }

  const maskedEmail = user?.email
    ? user.email.replace(/(.{2}).+(@.+)/, '$1•••$2')
    : 'your email'

  // ── Success state ─────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 animate-bounce-subtle">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="font-display font-bold text-white text-2xl">Email verified!</h2>
          <p className="text-surface-500 text-sm">Taking you to complete your profile…</p>
          <div className="flex gap-1 mt-2">
            {[0,1,2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Main OTP UI ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark-bg flex">

      {/* ── Left decorative panel (desktop) ── */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-brand-950 via-dark-card to-dark-bg relative overflow-hidden flex-col items-center justify-center p-12 gap-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-brand-500 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-brand-300 blur-3xl" />
        </div>

        {/* Animated shield icon */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-brand-600/20 border border-brand-600/30 flex items-center justify-center animate-pulse-slow">
            <ShieldCheck className="w-12 h-12 text-brand-400" />
          </div>
          <div className="text-center">
            <h2 className="font-display font-bold text-white text-3xl mb-3 leading-tight">
              Secure your<br />
              <span className="gradient-text">account</span>
            </h2>
            <p className="text-surface-400 text-sm leading-relaxed max-w-xs">
              We verify every developer's email to keep DevConnect a trusted community.
            </p>
          </div>

          {/* Steps visual */}
          <div className="w-full max-w-xs space-y-3">
            {[
              { num: '1', label: 'Create account',   done: true  },
              { num: '2', label: 'Verify your email', done: false },
              { num: '3', label: 'Build your profile', done: false },
            ].map(step => (
              <div key={step.num} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                step.done
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : !step.done && step.num === '2'
                  ? 'bg-brand-600/15 border-brand-600/30'
                  : 'bg-dark-card/40 border-dark-border/50'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  step.done ? 'bg-emerald-500 text-white' :
                  step.num === '2' ? 'bg-brand-600 text-white' :
                  'bg-dark-border text-surface-600'
                }`}>
                  {step.done ? '✓' : step.num}
                </div>
                <span className={`text-sm font-medium ${
                  step.done ? 'text-emerald-400' :
                  step.num === '2' ? 'text-white' :
                  'text-surface-600'
                }`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-brand-600/15 border border-brand-600/20 flex items-center justify-center mb-6">
            <Mail className="w-7 h-7 text-brand-400" />
          </div>

          <h1 className="font-display font-bold text-white text-2xl mb-1">
            Check your inbox
          </h1>
          <p className="text-surface-400 text-sm mb-2">
            We sent a 6-digit code to
          </p>
          <p className="font-semibold text-white text-sm mb-8 flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-dark-card border border-dark-border font-mono text-brand-300">
              {maskedEmail}
            </span>
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-up">
              {error}
            </div>
          )}

          {/* ── OTP digit inputs ── */}
          <div className="flex items-center gap-2.5 mb-8" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={`
                  w-full aspect-square max-w-[52px] text-center text-xl font-bold
                  rounded-xl border-2 bg-dark-card text-white
                  focus:outline-none transition-all duration-150
                  ${digit
                    ? 'border-brand-500 bg-brand-600/10 text-brand-300 shadow-glow'
                    : 'border-dark-border focus:border-brand-500/60 focus:bg-dark-hover'
                  }
                  ${error ? 'border-red-500/50 bg-red-500/5' : ''}
                `}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={verifying || digits.some(d => !d)}
            className="w-full btn-primary justify-center py-3 mb-5 disabled:opacity-50"
          >
            {verifying ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Verify Email <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          {/* Resend */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-surface-500">Didn't get a code?</span>
            {canResend ? (
              <button
                onClick={handleResend}
                className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Resend
              </button>
            ) : (
              <span className="text-surface-600 font-mono">
                Resend in {countdown}s
              </span>
            )}
          </div>

          
        </div>
      </div>
    </div>
  )
}