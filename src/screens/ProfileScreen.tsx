import { useState } from 'react'
import NavBar from '../components/NavBar'
import { C } from '../colors'
import type { Screen } from '../App'

type Props = { onNavigate: (s: Screen) => void; role?: 'admin' | 'proofreader' | 'workspace-admin'; previousScreen?: Screen }

export default function ProfileScreen({ onNavigate, role = 'admin', previousScreen }: Props) {
  const defaultName = role === 'admin' ? 'Admin' : role === 'workspace-admin' ? 'Dhivya' : 'Athmika'
  const defaultEmail = role === 'admin' ? 'admin@proofx.com' : role === 'workspace-admin' ? 'dhivya@novintix.com' : 'athmika@proofx.com'
  const [name, setName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [showPasswordFields, setShowPasswordFields] = useState(true)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saved, setSaved] = useState(false)

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const backDest: Screen = previousScreen || (role === 'admin' ? 'admin-dashboard' : role === 'workspace-admin' ? 'workspace-admin-dashboard' : 'proofreader-dashboard')

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: C.bg }}>
      <NavBar
        showBack
        onBack={() => onNavigate(backDest)}
        title="My Profile"
        showProfile
        onProfileClick={() => { }}
        onLogout={() => onNavigate('login')}
        profileInitials={initials}
        profileName={name}
      />

      <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center">
        <div
          className="w-full rounded-2xl overflow-hidden shrink-0"
          style={{
            maxWidth: 600,
            backgroundColor: C.white,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
          }}
        >
          {/* Profile header */}
          <div
            className="flex flex-col items-center py-8 relative"
            style={{ background: `linear-gradient(160deg, ${C.navy} 0%, #253480 100%)` }}
          >
            {/* Top right icon */}
            <div className="absolute top-4 right-4 flex gap-2">
              <div 
                title="Verified Proofreader"
                className="p-1.5 rounded-full text-white/90 bg-white/10 border border-white/20 transition-all hover:bg-white/20 cursor-pointer"
              >
                <svg className="w-5 h-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.339 16.671 2 12.226 2 7c0-.68.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div
              className="flex items-center justify-center rounded-full font-bold text-white mb-3"
              style={{ width: 72, height: 72, backgroundColor: 'rgba(255,255,255,0.18)', fontSize: 24, border: '3px solid rgba(255,255,255,0.3)' }}
            >
              {initials}
            </div>
            <p className="text-white font-bold text-lg">{name}</p>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: 'white' }}
              >
                {role === 'admin' ? 'Tenant Admin' : role === 'workspace-admin' ? 'Workspace Admin' : 'Proofreader'}
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="px-7 py-6 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ border: `1px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ border: `1px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Role</label>
                <div
                  className="px-3 py-2.5 rounded-lg flex items-center"
                  style={{ backgroundColor: C.grayBg, border: `1px solid ${C.border}` }}
                >
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: C.navyLight, color: C.navy }}
                  >
                    {role === 'admin' ? 'Tenant Admin' : role === 'workspace-admin' ? 'Workspace Admin' : 'Proofreader'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Workspace</label>
                <div
                  className="px-3 py-2.5 rounded-lg text-sm"
                  style={{ backgroundColor: C.grayBg, border: `1px solid ${C.border}`, color: C.muted }}
                >
                  {role === 'admin' ? 'All Workspaces' : 'DePuy CSV Team'}
                </div>
              </div>
            </div>

            {role === 'proofreader' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: C.text }}>Performance & Stats</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border text-center transition-all hover:shadow-sm" style={{ backgroundColor: C.navyLight, borderColor: C.border }}>
                      <div className="text-xl font-bold" style={{ color: C.navy }}>47</div>
                      <div className="text-[10px] uppercase tracking-wider font-bold mt-1" style={{ color: C.muted }}>Runs Made</div>
                    </div>
                    <div className="p-3 rounded-xl border text-center transition-all hover:shadow-sm" style={{ backgroundColor: C.greenLight, borderColor: C.border }}>
                      <div className="text-xl font-bold" style={{ color: C.green }}>38</div>
                      <div className="text-[10px] uppercase tracking-wider font-bold mt-1" style={{ color: C.muted }}>Reports Downloaded</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>System Access</label>
                    <div
                      className="px-3 py-2.5 rounded-lg flex items-center gap-2"
                      style={{ backgroundColor: C.grayBg, border: `1px solid ${C.border}` }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: C.navy }}></span>
                      <span className="text-xs font-bold" style={{ color: C.navy }}>Workspace Scope</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Last Active</label>
                    <div
                      className="px-3 py-2.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: C.grayBg, border: `1px solid ${C.border}`, color: C.grayText }}
                    >
                      Today, 2 hours ago
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: C.border }} />

            {/* Change password */}
            <div>
              <button
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="text-sm font-medium"
                style={{ color: C.orange }}
              >
                {showPasswordFields ? '↑ Hide' : 'Change Password'}
              </button>
              {showPasswordFields && (
                <div className="flex flex-col gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Old password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-sm"
                      style={{ border: `1px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>New password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-sm"
                      style={{ border: `1px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Confirm password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-sm"
                      style={{ border: `1px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
                    />
                  </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action bar */}
          <div
            className="flex items-center justify-between px-7 py-4"
            style={{ borderTop: `1px solid ${C.border}` }}
          >
            <span className="text-xs" style={{ color: C.muted }}>
              {saved ? '✓ Saved just now' : 'Last saved: Jul 22, 2026 at 9:00 AM'}
            </span>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: saved ? C.green : C.orange }}
            >
              {saved ? '✓ Saved' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center py-4 shrink-0">
        <p className="text-xs" style={{ color: C.muted }}>ProofX · Label Compliance</p>
      </footer>
    </div>
  )
}
