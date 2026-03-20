import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Briefcase, MapPin, Link as LinkIcon,
  Code2, Upload, ArrowRight, Plus, X, Check,
  Camera, Trash2, AlertCircle, Zap
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input, { Textarea } from '../components/common/Input'
import Button from '../components/common/Button'

// ─── Config ───────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 'identity', label: 'Identity',   icon: User      },
  { id: 'work',     label: 'Work',        icon: Briefcase },
  { id: 'skills',   label: 'Skills',      icon: Code2     },
]

const POPULAR_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
  'Python', 'Go', 'Rust', 'Java', 'Kotlin', 'Swift',
  'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS',
  'GraphQL', 'REST API', 'Machine Learning', 'DevOps', 'Linux', 'Git',
]

// Gradient colours for the initial-letter avatar fallback
const AVATAR_GRADIENTS = [
  'from-brand-600 to-blue-500',
  'from-purple-600 to-pink-500',
  'from-emerald-600 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-orange-500',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGradient(name) {
  if (!name) return AVATAR_GRADIENTS[0]
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[idx]
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Reusable inline validation error */
function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1 animate-slide-up">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
    </p>
  )
}

/** Live avatar preview — photo if uploaded, else gradient + initial */
function AvatarPreview({ photoUrl, name, size = 'lg' }) {
  const dim   = size === 'lg' ? 'w-24 h-24' : 'w-16 h-16'
  const text  = size === 'lg' ? 'text-3xl'  : 'text-xl'
  const letter = (name || '?')[0].toUpperCase()
  const grad  = getGradient(name)

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt="Profile"
        className={`${dim} rounded-2xl object-cover border-2 border-dark-border shadow-lg`}
      />
    )
  }
  return (
    <div className={`
      ${dim} rounded-2xl flex-shrink-0
      bg-gradient-to-br ${grad}
      flex items-center justify-center
      border-2 border-dark-border shadow-lg
    `}>
      <span className={`${text} font-display font-bold text-white`}>{letter}</span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateProfile() {
  const { user, completeProfile } = useAuth()
  const navigate = useNavigate()

  const [step,    setStep]    = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})

  // Form state
  const [form, setForm] = useState({
    name:       user?.name     || '',
    username:   user?.username || '',
    bio:        '',
    role:       '',
    company:    '',
    location:   '',
    website:    '',
    skills:     [],
  })

  // Photo state — stores a base64 data URL (frontend only for now)
  const [photoUrl,   setPhotoUrl]   = useState(null)   // null = use initial
  const [photoError, setPhotoError] = useState('')
  const fileRef = useRef(null)

  // Skills input
  const [skillInput, setSkillInput] = useState('')

  // ── Field setter ────────────────────────────────────────────
  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }))
    setErrors(p => ({ ...p, [key]: undefined }))
  }

  // ── Photo handlers ──────────────────────────────────────────
  const handlePhotoChange = (e) => {
    setPhotoError('')
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please upload an image file (JPG, PNG, WEBP).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image must be under 5 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoUrl(ev.target.result)
    reader.readAsDataURL(file)
    // Reset input so the same file can be re-selected after removal
    e.target.value = ''
  }

  const removePhoto = () => {
    setPhotoUrl(null)
    setPhotoError('')
  }

  // ── Skills helpers ──────────────────────────────────────────
  const addSkill = useCallback((skill) => {
    const trimmed = skill.trim()
    if (!trimmed) return
    if (form.skills.includes(trimmed)) return
    if (form.skills.length >= 15) return
    setForm(p => ({ ...p, skills: [...p.skills, trimmed] }))
    setErrors(p => ({ ...p, skills: undefined }))
  }, [form.skills])

  const removeSkill = (skill) =>
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }))

  const handleSkillKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault()
      addSkill(skillInput)
      setSkillInput('')
    }
  }

  // ── Validation per step ─────────────────────────────────────
  const validateStep = (s) => {
    const e = {}
    if (s === 0) {
      if (!form.name.trim())     e.name     = 'Full name is required.'
      if (!form.username.trim()) e.username = 'Username is required.'
      else if (!/^[a-z0-9_]+$/.test(form.username))
        e.username = 'Lowercase letters, numbers and underscores only.'
      if (!form.bio.trim())      e.bio      = 'A short bio is required.'
      else if (form.bio.trim().length < 20)
        e.bio = 'Bio must be at least 20 characters.'
    }
    if (s === 1) {
      if (!form.role.trim())    e.role    = 'Job title / role is required.'
      if (!form.company.trim()) e.company = 'Company or project name is required.'
    }
    if (s === 2) {
      if (form.skills.length === 0) e.skills = 'Add at least one skill.'
    }
    return e
  }

  const goNext = () => {
    const e = validateStep(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(p => p + 1)
  }

  const goBack = () => { setErrors({}); setStep(p => p - 1) }

  // ── Final submit ────────────────────────────────────────────
  const handleFinish = async () => {
    const e = validateStep(2)
    if (Object.keys(e).length) { setErrors(e); return }

    setLoading(true)
    await completeProfile({
      ...form,
      // Use uploaded photo; otherwise the AuthContext will fall back to
      // the dicebear avatar — but we pass a flag so Profile.jsx can
      // render the initial-letter avatar instead.
      avatar: photoUrl || null,
      avatarFallback: !photoUrl,
    })
    setLoading(false)
    navigate('/', { replace: true })
  }

  // ── Derived ─────────────────────────────────────────────────
  const progressPct = ((step) / (STEPS.length - 1)) * 100

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg animate-fade-in">

        {/* ── Top badge ── */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-4">
            <Check className="w-4 h-4" /> Email verified!
          </div>
          <h1 className="font-display font-bold text-white text-3xl mb-1.5">
            Build your profile
          </h1>
          <p className="text-surface-500 text-sm">
            Help the community know who you are. Takes 2 minutes.
          </p>
        </div>

        {/* ── Step indicator ── */}
        <div className="flex items-center mb-7 px-2">
          {STEPS.map((s, i) => {
            const done    = i < step
            const current = i === step
            return (
              <React.Fragment key={s.id}>
                {/* Circle */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    text-xs font-bold transition-all duration-300 flex-shrink-0
                    ${done    ? 'bg-brand-600 text-white'
                    : current ? 'bg-brand-600 text-white ring-4 ring-brand-600/20'
                    :           'bg-dark-card border border-dark-border text-surface-600'}
                  `}>
                    {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[11px] font-medium whitespace-nowrap ${
                    current ? 'text-white' : done ? 'text-brand-400' : 'text-surface-600'
                  }`}>
                    {s.label}
                  </span>
                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-2 mb-5">
                    <div className="h-px bg-dark-border relative overflow-hidden rounded-full">
                      <div
                        className="absolute inset-y-0 left-0 bg-brand-600 transition-all duration-500"
                        style={{ width: i < step ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* ── Card ── */}
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">

          {/* Card header strip */}
          <div className={`h-1.5 bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500`}
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />

          <div className="p-6">

            {/* ═══════════════════ STEP 0 — Identity ═══════════════════ */}
            {step === 0 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="font-display font-semibold text-white text-lg">
                    Who are you?
                  </h2>
                  <p className="text-surface-500 text-sm mt-0.5">
                    Fields marked <span className="text-red-400">*</span> are required.
                  </p>
                </div>

                {/* ── Profile photo ── */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-3">
                    Profile Photo <span className="text-surface-600 font-normal">(optional)</span>
                  </label>

                  <div className="flex items-center gap-5">
                    {/* Live preview */}
                    <div className="relative flex-shrink-0">
                      <AvatarPreview photoUrl={photoUrl} name={form.name} size="lg" />
                      {/* Remove button */}
                      {photoUrl && (
                        <button
                          onClick={removePhoto}
                          className="
                            absolute -top-2 -right-2
                            w-6 h-6 rounded-full
                            bg-red-500 hover:bg-red-400
                            border-2 border-dark-card
                            flex items-center justify-center
                            transition-all shadow-md
                          "
                          title="Remove photo"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      )}
                    </div>

                    {/* Upload / fallback info */}
                    <div className="flex-1">
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="
                          flex items-center gap-2
                          px-4 py-2.5 rounded-xl
                          bg-dark-bg border border-dark-border
                          text-surface-300 hover:text-white
                          hover:border-brand-500/40 hover:bg-dark-hover
                          transition-all text-sm font-medium mb-2
                        "
                      >
                        <Camera className="w-4 h-4" />
                        {photoUrl ? 'Change photo' : 'Upload photo'}
                      </button>
                      <p className="text-xs text-surface-600 leading-relaxed">
                        JPG, PNG or WEBP · max 5 MB
                        <br />
                        {!photoUrl && (
                          <span className="text-surface-500">
                            No photo? We'll use your initial — you can add one anytime.
                          </span>
                        )}
                      </p>
                      {photoError && (
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {photoError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dark-border" />

                {/* Full name */}
                <div>
                  <Input
                    label={<>Full Name <span className="text-red-400">*</span></>}
                    icon={User}
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Arjun Sharma"
                    error={errors.name}
                    autoComplete="name"
                  />
                </div>

                {/* Username */}
                <div>
                  <Input
                    label={<>Username <span className="text-red-400">*</span></>}
                    icon={() => <span className="text-surface-500 text-sm">@</span>}
                    value={form.username}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                      setForm(p => ({ ...p, username: val }))
                      setErrors(p => ({ ...p, username: undefined }))
                    }}
                    placeholder="arjunsharma"
                    error={errors.username}
                    hint="Lowercase letters, numbers and underscores"
                    autoComplete="username"
                  />
                </div>

                {/* Bio */}
                <div>
                  <Textarea
                    label={<>Bio <span className="text-red-400">*</span></>}
                    value={form.bio}
                    onChange={set('bio')}
                    placeholder="Full-stack engineer @ Stripe. Building the future of payments. Open-source contributor. ☕ driven."
                    rows={3}
                    hint="At least 20 characters. Tell the community about yourself."
                    error={errors.bio}
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${form.bio.length > 200 ? 'text-red-400' : 'text-surface-600'}`}>
                      {form.bio.length}/250
                    </span>
                  </div>
                </div>

                {/* Location — optional */}
                <Input
                  label="Location"
                  icon={MapPin}
                  value={form.location}
                  onChange={set('location')}
                  placeholder="Bangalore, India"
                />

                {/* Website — optional */}
                <Input
                  label="Website / Portfolio"
                  icon={LinkIcon}
                  value={form.website}
                  onChange={set('website')}
                  placeholder="https://yourportfolio.dev"
                />
              </div>
            )}

            {/* ═══════════════════ STEP 1 — Work ═══════════════════════ */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="font-display font-semibold text-white text-lg">
                    Your work
                  </h2>
                  <p className="text-surface-500 text-sm mt-0.5">
                    Fields marked <span className="text-red-400">*</span> are required.
                  </p>
                </div>

                {/* Preview of avatar with name — small reminder */}
                <div className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl border border-dark-border">
                  <AvatarPreview photoUrl={photoUrl} name={form.name} size="sm" />
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {form.name || 'Your Name'}
                    </p>
                    <p className="text-xs text-surface-500 truncate">
                      @{form.username || 'username'}
                    </p>
                  </div>
                </div>

                {/* Role — mandatory */}
                <Input
                  label={<>Job Title / Role <span className="text-red-400">*</span></>}
                  icon={Briefcase}
                  value={form.role}
                  onChange={set('role')}
                  placeholder="Senior Full-Stack Engineer"
                  error={errors.role}
                />

                {/* Company — mandatory */}
                <Input
                  label={<>Company / Project <span className="text-red-400">*</span></>}
                  value={form.company}
                  onChange={set('company')}
                  placeholder="Stripe · Google · Indie Hacker · Open Source"
                  error={errors.company}
                />

                {/* Resume upload — optional */}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">
                    Resume{' '}
                    <span className="text-surface-600 font-normal">(optional)</span>
                  </label>
                  <label className="
                    flex flex-col items-center gap-2
                    border-2 border-dashed border-dark-border rounded-xl p-6
                    text-center cursor-pointer
                    hover:border-brand-500/30 hover:bg-dark-hover/50
                    transition-all group
                  ">
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" />
                    <Upload className="w-7 h-7 text-surface-600 group-hover:text-brand-400 transition-colors" />
                    <div>
                      <p className="text-sm text-surface-400 group-hover:text-surface-300 transition-colors">
                        Drop your resume or{' '}
                        <span className="text-brand-400">browse</span>
                      </p>
                      <p className="text-xs text-surface-700 mt-0.5">PDF · DOC · DOCX · max 5 MB</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* ═══════════════════ STEP 2 — Skills ══════════════════════ */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="font-display font-semibold text-white text-lg">
                    Your skills
                  </h2>
                  <p className="text-surface-500 text-sm mt-0.5">
                    Add at least <span className="text-white font-medium">1 skill</span> · max 15.
                    Used to match you with communities.
                  </p>
                </div>

                {/* Selected skill chips */}
                {form.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-3 bg-dark-bg rounded-xl border border-dark-border min-h-[48px]">
                    {form.skills.map(skill => (
                      <span
                        key={skill}
                        className="skill-tag flex items-center gap-1.5 animate-fade-in"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-400 transition-colors"
                          title={`Remove ${skill}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Error */}
                <FieldError msg={errors.skills} />

                {/* Skill text input */}
                <div className="flex items-center gap-2 bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 focus-within:ring-1 focus-within:ring-brand-500/50 transition-all">
                  <Code2 className="w-4 h-4 text-surface-600 flex-shrink-0" />
                  <input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKey}
                    placeholder="Type a skill and press Enter…"
                    className="flex-1 bg-transparent text-sm text-white placeholder-surface-600 focus:outline-none"
                  />
                  {skillInput.trim() && (
                    <button
                      onClick={() => { addSkill(skillInput); setSkillInput('') }}
                      className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
                    >
                      Add
                    </button>
                  )}
                </div>

                {/* Popular skill grid */}
                <div>
                  <p className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2">
                    Popular skills — tap to add
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SKILLS.filter(s => !form.skills.includes(s)).map(skill => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="
                          text-xs px-2.5 py-1 rounded-lg font-mono
                          bg-dark-bg border border-dark-border
                          text-surface-400
                          hover:text-brand-400 hover:border-brand-600/30 hover:bg-brand-600/5
                          flex items-center gap-1 transition-all
                        "
                      >
                        <Plus className="w-3 h-3" />
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile preview card */}
                <div className="mt-2 p-4 rounded-xl bg-dark-bg border border-dark-border">
                  <p className="text-xs text-surface-600 uppercase tracking-wider font-semibold mb-3">
                    Profile preview
                  </p>
                  <div className="flex items-center gap-3">
                    <AvatarPreview photoUrl={photoUrl} name={form.name} size="sm" />
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm truncate">
                        {form.name || 'Your Name'}
                      </p>
                      <p className="text-xs text-surface-500 truncate">
                        {form.role || 'Your Role'}
                        {form.company ? ` @ ${form.company}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Footer actions ── */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-dark-border">
              {step > 0 ? (
                <Button variant="secondary" onClick={goBack}>
                  ← Back
                </Button>
              ) : (
                <div />
              )}

              {step < STEPS.length - 1 ? (
                <Button onClick={goNext}>
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleFinish} loading={loading}>
                  <Check className="w-4 h-4" />
                  Finish Setup
                </Button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-surface-700 mt-4">
          You can update your profile anytime from your settings.
        </p>
      </div>
    </div>
  )
}