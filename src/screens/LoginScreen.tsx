import { useState } from 'react'
import NavBar from '../components/NavBar'
import { C } from '../colors'
import type { Screen } from '../App'

type Props = { onNavigate: (s: Screen) => void }

export default function LoginScreen({ onNavigate }: Props) {
  const [email, setEmail] = useState('athmika@proofx.com')
  const [password, setPassword] = useState('········')

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: C.bg }}>
      <NavBar subtitle="Label proofing reading tool" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Sign-in card */}
        <div
          className="w-full rounded-xl p-8"
          style={{
            maxWidth: 420,
            backgroundColor: C.white,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 36, height: 36, backgroundColor: C.grayBg }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke={C.muted} strokeWidth="1.8"/>
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill={C.muted}/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl" style={{ color: C.text }}>Sign in</h1>
              <p className="text-xs" style={{ color: C.muted }}>Enter your credentials to access ProofX.</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: C.orangeText }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  backgroundColor: C.white,
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: C.text }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{
                  border: `1.5px solid ${C.navy}`,
                  color: C.text,
                  backgroundColor: C.white,
                }}
              />
            </div>
            <button
              className="w-full py-2.5 rounded-md text-sm font-semibold text-white"
              style={{ backgroundColor: C.navy }}
            >
              Sign in
            </button>
            <div className="text-center">
              <button
                onClick={() => onNavigate('forgot-password')}
                className="text-xs font-medium"
                style={{ color: C.orange }}
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>

        {/* Persona tiles */}
        <div className="flex gap-4 mt-6 flex-wrap" style={{ maxWidth: 660, width: '100%' }}>
          {/* Tenant Admin tile */}
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="flex-1 rounded-xl p-4 text-left cursor-pointer transition-shadow hover:shadow-md"
            style={{
              minWidth: 180,
              backgroundColor: C.white,
              border: `1px solid ${C.border}`,
              borderLeft: `4px solid ${C.navy}`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: 34, height: 34, backgroundColor: C.navyLight }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke={C.navy} strokeWidth="1.8"/>
                  <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke={C.navy} strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M18 10l2 2 3-3" stroke={C.orange} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: C.navy }}>Tenant Admin</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>Manage your team and view all runs</p>
              </div>
            </div>
          </button>

          {/* Workspace Admin tile */}
          <button
            onClick={() => onNavigate('workspace-admin-dashboard')}
            className="flex-1 rounded-xl p-4 text-left cursor-pointer transition-shadow hover:shadow-md"
            style={{
              minWidth: 180,
              backgroundColor: C.white,
              border: `1px solid ${C.border}`,
              borderLeft: `4px solid ${C.green}`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: 34, height: 34, backgroundColor: C.greenLight }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12h6v10" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: C.green }}>Workspace Admin</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>Manage your workspace and its runs</p>
              </div>
            </div>
          </button>

          {/* Proofreader tile */}
          <button
            onClick={() => onNavigate('proofreader-dashboard')}
            className="flex-1 rounded-xl p-4 text-left cursor-pointer transition-shadow hover:shadow-md"
            style={{
              minWidth: 180,
              backgroundColor: C.white,
              border: `1px solid ${C.border}`,
              borderLeft: `4px solid ${C.orange}`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: 34, height: 34, backgroundColor: C.orangeLight }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke={C.orange} strokeWidth="1.8"/>
                  <rect x="7" y="7" width="4" height="4" rx="0.5" stroke={C.orange} strokeWidth="1.5"/>
                  <rect x="13" y="7" width="4" height="4" rx="0.5" stroke={C.orange} strokeWidth="1.5"/>
                  <rect x="7" y="13" width="4" height="4" rx="0.5" stroke={C.orange} strokeWidth="1.5"/>
                  <rect x="13" y="13" width="4" height="4" rx="0.5" stroke={C.orange} strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: C.text }}>Proofreader</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>Run label comparisons and view your history</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <footer className="text-center pb-6">
        <p className="text-xs" style={{ color: C.muted }}>ProofX · Label Compliance</p>
      </footer>
    </div>
  )
}
