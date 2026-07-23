import { useState } from 'react'
import NavBar from '../components/NavBar'
import { C } from '../colors'
import type { Screen } from '../App'

type Props = { onNavigate: (s: Screen) => void }

export default function PasswordResetScreen({ onNavigate }: Props) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [done, setDone] = useState(false)

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword
  const valid = newPassword.length >= 6 && newPassword === confirmPassword

  const handleReset = () => {
    if (!valid) return
    setDone(true)
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: C.bg }}>
      <NavBar subtitle="Label proofing reading tool" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div
          className="w-full rounded-xl p-8"
          style={{
            maxWidth: 420,
            backgroundColor: C.white,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          {/* Icon */}
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 36, height: 36, backgroundColor: C.grayBg }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke={C.muted} strokeWidth="1.8" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1.5" fill={C.muted} />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl" style={{ color: C.text }}>Set a new password</h1>
              <p className="text-xs" style={{ color: C.muted }}>Choose a strong password for your account.</p>
            </div>
          </div>

          {!done ? (
            <div className="mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.text }}>New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-3 py-2 rounded-md text-sm"
                  style={{ border: `1px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.text }}>Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full px-3 py-2 rounded-md text-sm"
                  style={{
                    border: `1.5px solid ${mismatch ? C.red : confirmPassword && !mismatch ? C.green : C.border}`,
                    color: C.text,
                    backgroundColor: C.white,
                  }}
                />
                {mismatch && (
                  <p className="text-xs mt-1" style={{ color: C.red }}>Passwords do not match</p>
                )}
              </div>
              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-md text-sm font-semibold text-white"
                style={{ backgroundColor: C.navy, opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'not-allowed' }}
              >
                Reset password
              </button>
              <div className="text-center">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-xs font-medium"
                  style={{ color: C.orange }}
                >
                  ← Back to login
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              <div
                className="flex items-start gap-3 p-4 rounded-lg"
                style={{ backgroundColor: C.greenLight, border: `1px solid ${C.green}20` }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" stroke={C.green} strokeWidth="1.8" />
                  <path d="M8 12l3 3 5-5" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.green }}>Password updated</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>You can now sign in with your new password.</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 rounded-md text-sm font-semibold text-white"
                style={{ backgroundColor: C.navy }}
              >
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center pb-6">
        <p className="text-xs" style={{ color: C.muted }}>ProofX · Label Compliance</p>
      </footer>
    </div>
  )
}
