import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill all fields.')
      return
    }
    setLoading(true)
    setError('')
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate('/create-profile')
    } else {
      setError(result.error || 'Login failed.')
    }
  }

  const handleDemo = async () => {
    setLoading(true)
    const result = await login('demo@devconnect.io', 'demo1234')
    setLoading(false)
    if (result.success) navigate('/create-profile')
  }

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-950 via-dark-card to-dark-bg relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-brand-500 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-brand-400 blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-white text-xl">DevConnect</span>
          </div>
          <h2 className="font-display font-bold text-white text-4xl leading-tight mb-4">
            Where great<br />
            <span className="gradient-text">developers</span><br />
            connect.
          </h2>
          <p className="text-surface-400 text-base leading-relaxed max-w-sm">
            Join 50,000+ developers sharing knowledge, building careers, and shipping together.
          </p>
        </div>
        {/* Testimonial */}
        <div className="relative bg-dark-card/60 backdrop-blur-sm border border-dark-border rounded-2xl p-5">
          <p className="text-surface-300 text-sm leading-relaxed mb-3">
            "DevConnect is where I found my co-founder, my team, and my first 3 enterprise customers. It's the LinkedIn we actually wanted."
          </p>
          <div className="flex items-center gap-2.5">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=testimonial&backgroundColor=c0aede" className="w-8 h-8 rounded-full" alt="" />
            <div>
              <p className="text-sm font-semibold text-white">Aisha Patel</p>
              <p className="text-xs text-surface-500">CTO, Buildfast</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel / Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-white text-lg">DevConnect</span>
          </div>

          <h1 className="font-display font-bold text-white text-2xl mb-1">Welcome back</h1>
          <p className="text-surface-500 text-sm mb-8">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              icon={Lock}
              iconRight={showPass ? EyeOff : Eye}
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <div className="flex justify-end">
              <button type="button" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                Forgot password?
              </button>
            </div>
            <Button type="submit" loading={loading} className="w-full justify-center py-3">
              Sign in <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-dark-border" />
            <span className="text-xs text-surface-600">or</span>
            <div className="flex-1 h-px bg-dark-border" />
          </div>

          <Button
            variant="secondary"
            onClick={handleDemo}
            loading={loading}
            className="w-full justify-center py-3"
          >
            ⚡ Continue with demo account
          </Button>

          <p className="text-center text-sm text-surface-500 mt-6">
            No account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}