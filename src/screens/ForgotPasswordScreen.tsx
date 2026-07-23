import { useState } from 'react'
import NavBar from '../components/NavBar'
import { C } from '../colors'
import type { Screen } from '../App'

type Props = { onNavigate: (s: Screen) => void }

export default function ForgotPasswordScreen({ onNavigate }: Props) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!email) return
    setSent(true)
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={C.muted} strokeWidth="1.8" />
                <path d="M22 6l-10 7L2 6" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl" style={{ color: C.text }}>Reset your password</h1>
              <p className="text-xs" style={{ color: C.muted }}>We'll send a reset link to your email.</p>
            </div>
          </div>

          {!sent ? (
            <div className="mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: C.text }}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@proofx.com"
                  className="w-full px-3 py-2 rounded-md text-sm"
                  style={{ border: `1px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
                />
              </div>
              <button
                onClick={handleSend}
                className="w-full py-2.5 rounded-md text-sm font-semibold text-white"
                style={{ backgroundColor: C.navy, opacity: email ? 1 : 0.5, cursor: email ? 'pointer' : 'not-allowed' }}
              >
                Send reset link
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
                  <p className="text-sm font-semibold" style={{ color: C.green }}>Check your inbox</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                    A reset link has been sent to <span className="font-medium" style={{ color: C.text }}>{email}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('password-reset')}
                className="w-full py-2.5 rounded-md text-sm font-semibold text-white"
                style={{ backgroundColor: C.navy }}
              >
                Set new password →
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
          )}
        </div>
      </div>

      <footer className="text-center pb-6">
        <p className="text-xs" style={{ color: C.muted }}>ProofX · Label Compliance</p>
      </footer>
    </div>
  )
}
