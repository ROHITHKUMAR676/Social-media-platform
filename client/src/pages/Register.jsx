import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, AtSign, Eye, EyeOff, Zap, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

const PERKS = [
  'Connect with 50k+ developers',
  'Join exclusive tech communities',
  'Real-time messaging',
  'Build your dev portfolio',
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.username.trim()) e.username = 'Username is required'
    else if (!/^[a-z0-9_]+$/.test(form.username)) e.username = 'Lowercase, numbers & underscores only'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 8) e.password = 'At least 8 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setErrors({})
    const result = await register(form)
    setLoading(false)
    if (result.success) {
      navigate('/verify-otp')
    } else {
      setErrors({ global: result.error })
    }
  }

  const set = (key) => (e) => {
    const val = key === 'username' ? e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') : e.target.value
    setForm(p => ({ ...p, [key]: val }))
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }))
  }

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-brand-950 via-dark-card to-dark-bg relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-brand-500 blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-white text-xl">DevConnect</span>
          </div>
          <h2 className="font-display font-bold text-white text-3xl leading-tight mb-6">
            Start your<br />
            <span className="gradient-text">dev journey</span><br />
            today.
          </h2>
          <div className="space-y-3">
            {PERKS.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-400" />
                </div>
                <span className="text-surface-300 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="flex -space-x-2 mb-3">
            {['arjun', 'priya', 'rahul', 'sneha', 'karan'].map(seed => (
              <img
                key={seed}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                className="w-8 h-8 rounded-full border-2 border-dark-card bg-dark-hover"
                alt=""
              />
            ))}
          </div>
          <p className="text-surface-400 text-xs">
            <strong className="text-white">2,847</strong> developers joined this month
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-sm animate-fade-in py-8">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-white text-lg">DevConnect</span>
          </div>

          <h1 className="font-display font-bold text-white text-2xl mb-1">Create your account</h1>
          <p className="text-surface-500 text-sm mb-6">Free forever. No credit card needed.</p>

          {errors.global && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              icon={User}
              value={form.name}
              onChange={set('name')}
              placeholder="Arjun Sharma"
              error={errors.name}
              autoComplete="name"
            />
            <Input
              label="Username"
              icon={AtSign}
              value={form.username}
              onChange={set('username')}
              placeholder="arjunsharma"
              error={errors.username}
              hint="Lowercase letters, numbers, underscores"
              autoComplete="username"
            />
            <Input
              label="Email"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={set('email')}
              placeholder="you@example.com"
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              icon={Lock}
              iconRight={showPass ? EyeOff : Eye}
              value={form.password}
              onChange={set('password')}
              placeholder="Min. 8 characters"
              error={errors.password}
              autoComplete="new-password"
            />

            <Button type="submit" loading={loading} className="w-full justify-center py-3 mt-2">
              Create account <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-xs text-surface-600 mt-4">
            By creating an account, you agree to our{' '}
            <span className="text-brand-400 cursor-pointer hover:underline">Terms</span>{' '}
            and{' '}
            <span className="text-brand-400 cursor-pointer hover:underline">Privacy Policy</span>
          </p>

          <p className="text-center text-sm text-surface-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}