import { useState, useRef, useEffect, type ReactNode } from 'react'
import { ArrowLeft, ScanLine, LogOut, User } from 'lucide-react'

export type StepItem = {
  label: string
  active?: boolean
  done?: boolean
}

type NavBarProps = {
  showBack?: boolean
  onBack?: () => void
  title?: string
  steps?: StepItem[]
  showProfile?: boolean
  onProfileClick?: () => void
  onLogout?: () => void
  profileName?: string
  rightNode?: ReactNode
  subtitle?: string
  profileInitials?: string
}

export default function NavBar({
  showBack,
  onBack,
  title,
  steps,
  showProfile,
  onProfileClick,
  onLogout,
  profileName,
  rightNode,
  subtitle,
  profileInitials = 'A',
}: NavBarProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showMenu) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMenu])

  return (
    <nav
      style={{ backgroundColor: "#1C2E59", height: 52 }}
      className="sticky top-0 z-40 text-white px-6 flex items-center justify-between shadow-md flex-shrink-0 w-full select-none"
    >
      <div className="flex items-center gap-4 h-[52px]">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 border-r border-white/20 pr-4 h-full text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">BACK</span>
          </button>
        )}
        <div className="flex items-center gap-2">
          <ScanLine size={18} />
          <span className="text-sm font-bold tracking-tight uppercase">ProofX</span>
          <span className="text-white/30 mx-1">|</span>
          <img src="/novintix-logo.png" alt="Novintix" className="h-7 w-auto" style={{ mixBlendMode: "screen" }} />
          {(title || subtitle) && (
            <>
              <span className="text-white/30 mx-1">|</span>
              <span className="text-xs text-white/70 font-medium">{title || subtitle}</span>
            </>
          )}
        </div>
      </div>

      {/* Steps */}
      {steps && steps.length > 0 && (
        <div className="flex items-center h-full">
          {steps.map((step, i) => {
            const stepNum = i + 1;
            const isDone = step.done;
            const isActive = step.active;
            return (
              <div key={i} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                    isActive
                       ? "text-white border-b-2 border-white"
                      : isDone
                      ? "text-white/80"
                      : "text-white/35"
                  }`}
                  style={{
                    borderBottomColor: 'white',
                    borderBottomWidth: isActive ? 2 : 0,
                    marginTop: isActive ? '2px' : '0px'
                  }}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                      isActive
                        ? "bg-white text-[#1C2E59] border-white"
                        : isDone
                        ? "bg-white/20 text-white border-white/40"
                        : "bg-transparent text-white/35 border-white/25"
                    }`}
                  >
                    {isDone ? "✓" : stepNum}
                  </span>
                  {step.label}
                </div>
                {i < steps.length - 1 && (
                  <span className="text-white/30 text-[10px] mx-1">›</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Custom right node / profile avatar */}
      <div className="flex items-center gap-3">
        {rightNode}
        {showProfile && (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowMenu(prev => !prev)}
              className="flex items-center justify-center rounded-full font-bold cursor-pointer"
              style={{
                width: 32,
                height: 32,
                backgroundColor: showMenu ? 'rgba(255,255,255,0.24)' : 'rgba(255,255,255,0.14)',
                color: 'white',
                border: '1.5px solid rgba(255,255,255,0.28)',
                fontSize: 12,
              }}
            >
              {profileInitials}
            </button>

            {showMenu && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {/* Name section */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">My Profile</p>
                  <p className="text-sm font-semibold text-gray-800">{profileName ?? profileInitials}</p>
                </div>

                {/* View profile */}
                <button
                  onClick={() => { setShowMenu(false); onProfileClick?.(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4 text-gray-400" />
                  View profile
                </button>

                {/* Divider */}
                <div className="border-t border-gray-100" />

                {/* Logout */}
                <button
                  onClick={() => { setShowMenu(false); onLogout?.(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
