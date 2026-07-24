import React, { useState } from 'react'
import { C } from '../colors'
import type { Screen } from '../App'
import { 
  LayoutDashboard, 
  Users, 
  History, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Briefcase
} from 'lucide-react'

type ActivePage = 'dashboard' | 'team-members' | 'history' | 'profile'
type UserRole = 'admin' | 'workspace-admin'

type Props = {
  active: ActivePage
  userRole: UserRole
  onNavigate: (s: Screen) => void
}

interface NavItem {
  id: ActivePage
  label: string
  getScreen: (role: UserRole) => Screen
  icon: (active: boolean) => React.ReactNode
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    getScreen: (role) => role === 'admin' ? 'admin-dashboard' : 'workspace-admin-dashboard',
    icon: (active) => (
      <LayoutDashboard 
        size={18} 
        className={`transition-transform duration-300 ${active ? 'scale-110 text-[#1C2E59]' : 'text-gray-400 group-hover:scale-105 group-hover:text-slate-700'}`}
      />
    ),
  },
  {
    id: 'team-members',
    label: 'Team Members',
    getScreen: () => 'team-members',
    icon: (active) => (
      <Users 
        size={18} 
        className={`transition-transform duration-300 ${active ? 'scale-110 text-[#1C2E59]' : 'text-gray-400 group-hover:scale-105 group-hover:text-slate-700'}`}
      />
    ),
  },
  {
    id: 'history',
    label: 'History',
    getScreen: () => 'admin-history',
    icon: (active) => (
      <History 
        size={18} 
        className={`transition-transform duration-300 ${active ? 'scale-110 text-[#1C2E59]' : 'text-gray-400 group-hover:scale-105 group-hover:text-slate-700'}`}
      />
    ),
  },
]

const profileConfig: Record<UserRole, { name: string; role: string; initials: string }> = {
  'admin':           { name: 'Admin',  role: 'Tenant Admin',     initials: 'A'  },
  'workspace-admin': { name: 'Dhivya', role: 'Workspace Admin',  initials: 'D'  },
}

export default function AdminSidebar({ active, userRole, onNavigate }: Props) {
  const profile = profileConfig[userRole]
  const isProfileActive = active === 'profile'
  
  // Persist sidebar state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next))
      } catch (e) {
        console.error(e)
      }
      return next
    })
  }

  return (
    <div
      className="flex flex-col shrink-0 h-full relative transition-all duration-300 ease-in-out select-none border-r"
      style={{
        width: isCollapsed ? 76 : 240,
        backgroundColor: C.white,
        borderColor: C.border,
      }}
    >
      {/* Sidebar Toggle Handle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-8 flex items-center justify-center w-6 h-6 border bg-white text-gray-500 hover:text-slate-800 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 z-50 hover:scale-105"
        style={{ borderColor: C.border }}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header/Brand badge */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 overflow-hidden">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-tr from-[#1C2E59] to-[#3B5492] text-white shrink-0 shadow-sm">
          {userRole === 'admin' ? <Shield size={16} /> : <Briefcase size={16} />}
        </div>
        <div className={`flex flex-col transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
          <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
            {userRole === 'admin' ? 'Admin Portal' : 'DePuy CSV Team'}
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase whitespace-nowrap">
            {userRole === 'admin' ? 'SYSTEM CONSOLE' : 'WORKSPACE CONSOLE'}
          </span>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1.5 p-3 flex-1 overflow-y-auto no-scrollbar">
        {navItems.map(item => {
          const isActive = item.id === active
          return (
            <div key={item.id} className="relative group/item">
              <button
                onClick={() => onNavigate(item.getScreen(userRole))}
                className="flex items-center gap-3 px-3 py-2.5 w-full text-left cursor-pointer group transition-all duration-200"
                style={{
                  backgroundColor: isActive ? C.navyLight : 'transparent',
                  color: isActive ? C.navy : C.muted,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(28, 46, 89, 0.04)'
                    ;(e.currentTarget as HTMLElement).style.color = '#1C2E59'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = C.muted
                  }
                }}
              >
                <div className="flex items-center justify-center shrink-0 w-5">
                  {item.icon(isActive)}
                </div>
                
                <span 
                  className={`text-sm font-medium transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 overflow-hidden pointer-events-none' : 'opacity-100'
                  }`}
                >
                  {item.label}
                </span>

                {/* Accent glow line on the left for active element */}
                {isActive && (
                  <div 
                    className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#1C2E59] transition-all duration-300"
                  />
                )}
              </button>

              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-[85px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity duration-200 shadow-md whitespace-nowrap z-50">
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 bg-slate-800" style={{ left: '-3px' }} />
                  {item.label}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Profile — pinned to bottom */}
      <div className="border-t border-slate-100 relative group/profile">
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-3 w-full px-4 py-4 cursor-pointer transition-all duration-200"
          style={{
            backgroundColor: isProfileActive ? C.navyLight : 'transparent',
          }}
          onMouseEnter={e => {
            if (!isProfileActive) {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(28, 46, 89, 0.04)'
            }
          }}
          onMouseLeave={e => {
            if (!isProfileActive) {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }
          }}
        >
          <div
            className="flex items-center justify-center text-white text-xs font-bold shrink-0 transition-transform duration-300 hover:scale-105 shadow-sm"
            style={{ width: 36, height: 36, backgroundColor: C.navy }}
          >
            {profile.initials}
          </div>
          
          <div className={`text-left min-w-0 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            <p className="text-sm font-semibold truncate" style={{ color: isProfileActive ? C.navy : C.text }}>
              {profile.name}
            </p>
            <p className="text-xs truncate" style={{ color: C.muted }}>{profile.role}</p>
          </div>

          {/* Left accent line for profile active state */}
          {isProfileActive && (
            <div 
              className="absolute left-0 top-4 bottom-4 w-1.5 bg-[#1C2E59]"
            />
          )}
        </button>

        {/* Profile tooltip for collapsed mode */}
        {isCollapsed && (
          <div className="absolute left-[85px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium opacity-0 pointer-events-none group-hover/profile:opacity-100 transition-opacity duration-200 shadow-md whitespace-nowrap z-50">
            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 bg-slate-800" style={{ left: '-3px' }} />
            <div className="font-semibold">{profile.name}</div>
            <div className="text-[10px] text-slate-400">{profile.role}</div>
          </div>
        )}
      </div>
    </div>
  )
}

