import { useState } from 'react'
import LoginScreen from './screens/LoginScreen'
import ProofreaderDashboardScreen from './screens/ProofreaderDashboardScreen'
import UploadComparisonScreen from './screens/UploadComparisonScreen'
import AnalysisScreen from './screens/AnalysisScreen'
import AdminDashboardScreen from './screens/AdminDashboardScreen'
import TeamMembersScreen from './screens/TeamMembersScreen'
import AdminHistoryScreen from './screens/AdminHistoryScreen'
import ProfileScreen from './screens/ProfileScreen'
import ChangeRequestFormScreen from './screens/ChangeRequestFormScreen'
import UploadLrfScreen from './screens/UploadLrfScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import PasswordResetScreen from './screens/PasswordResetScreen'
import ProofreaderHistoryScreen from './screens/ProofreaderHistoryScreen'
import WorkspaceAdminDashboardScreen from './screens/WorkspaceAdminDashboardScreen'

export type Screen =
  | 'login'
  | 'forgot-password'
  | 'password-reset'
  | 'proofreader-history'
  | 'proofreader-dashboard'
  | 'upload-comparison'
  | 'analysis'
  | 'admin-dashboard'
  | 'workspace-admin-dashboard'
  | 'team-members'
  | 'admin-history'
  | 'profile'
  | 'profile-admin'
  | 'change-request-form'
  | 'upload-lrf'

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [userRole, setUserRole] = useState<'admin' | 'workspace-admin' | 'proofreader'>('admin')
  const [profileRole, setProfileRole] = useState<'admin' | 'proofreader' | 'workspace-admin'>('admin')
  const [previousScreen, setPreviousScreen] = useState<Screen>('login')
  const [selectedProofreader, setSelectedProofreader] = useState<string | null>(null)

  // LRF states
  const [lrfFlowActive, setLrfFlowActive] = useState(false)
  const [bulkMode, setBulkMode] = useState(false)
  const [masterFilename, setMasterFilename] = useState('Master.pdf')
  const [revisedFilename, setRevisedFilename] = useState('Revised.pdf')
  const [lrfData, setLrfData] = useState<{ crNumber: string; date: string; revFrom: string; revTo: string; count: number; list: any[] }>({
    crNumber: 'CR-2026-0041',
    date: '2026-06-26',
    revFrom: 'Rev B',
    revTo: 'Rev C',
    count: 4,
    list: [
      { name: 'Logo change', category: 'GRAPHICS', changeType: 'MODIFY', fromValue: 'Old Logo', toValue: 'New Novintix Logo' },
      { name: 'Manufacturer address', category: 'TEXT', changeType: 'MODIFY', fromValue: 'Westchester pa19380', toValue: 'Westchester PA 19380' },
      { name: 'EC Rep name', category: 'TEXT', changeType: 'MODIFY', fromValue: 'EC Rep Address', toValue: 'EC Rep Address BDA' },
      { name: 'eIFU URL', category: 'TEXT', changeType: 'MODIFY', fromValue: 'www.e-ifu.com', toValue: 'www.e-depuysymbols.com' }
    ]
  })

  const navigate = (to: Screen) => {
    // Track user role based on dashboard navigated to from login
    if (to === 'admin-dashboard') {
      setUserRole('admin')
    } else if (to === 'workspace-admin-dashboard') {
      setUserRole('workspace-admin')
    } else if (to === 'proofreader-dashboard') {
      setUserRole('proofreader')
    }

    // Only track previous screen on forward navigation to detail screens
    if (to === 'analysis' || to === 'profile' || to === 'team-members' || to === 'admin-history' || to === 'proofreader-history' || to === 'upload-comparison' || to === 'change-request-form' || to === 'upload-lrf') {
      setPreviousScreen(screen)
    }

    // Reset LRF flow active flag if returning to visual flow or dashboards
    if (to === 'upload-comparison' || to === 'proofreader-dashboard' || to === 'admin-dashboard' || to === 'workspace-admin-dashboard') {
      setLrfFlowActive(false)
    }

    if (to === 'change-request-form' || to === 'upload-lrf') {
      setLrfFlowActive(true)
    }

    // Clear filter if not navigating to history
    if (to !== 'admin-history') {
      setSelectedProofreader(null)
    }

    // Track which persona navigates to profile
    if (to === 'profile') {
      if (screen === 'admin-dashboard' || screen === 'team-members' || screen === 'admin-history') {
        setProfileRole('admin')
      } else if (screen === 'workspace-admin-dashboard') {
        setProfileRole('workspace-admin')
      } else {
        setProfileRole('proofreader')
      }
    }
    setScreen(to)
  }

  switch (screen) {
    case 'login':
      return <LoginScreen onNavigate={navigate} />

    case 'proofreader-history':
      return <ProofreaderHistoryScreen onNavigate={navigate} previousScreen={previousScreen} onSetFiles={(m, r, bulk) => { setMasterFilename(m); setRevisedFilename(r); setBulkMode(!!bulk) }} onSetLrfFlowActive={setLrfFlowActive} />

    case 'forgot-password':
      return <ForgotPasswordScreen onNavigate={navigate} />

    case 'password-reset':
      return <PasswordResetScreen onNavigate={navigate} />

    case 'proofreader-dashboard':
      return <ProofreaderDashboardScreen onNavigate={navigate} onSetLrfFlowActive={setLrfFlowActive} onSetFiles={(m, r, bulk) => { setMasterFilename(m); setRevisedFilename(r); setBulkMode(!!bulk) }} />

    case 'upload-comparison':
      return <UploadComparisonScreen onNavigate={navigate} onSetFiles={(m, r, bulk) => { setMasterFilename(m); setRevisedFilename(r); setBulkMode(!!bulk); }} />

    case 'analysis':
      return (
        <AnalysisScreen
          onNavigate={navigate}
          previousScreen={previousScreen}
          lrfFlowActive={lrfFlowActive}
          bulkMode={bulkMode}
          masterFilename={masterFilename}
          revisedFilename={revisedFilename}
        />
      )

    case 'admin-dashboard':
      return <AdminDashboardScreen onNavigate={navigate} onSelectProofreader={setSelectedProofreader} onSetFiles={(m, r, bulk) => { setMasterFilename(m); setRevisedFilename(r); setBulkMode(!!bulk) }} onSetLrfFlowActive={setLrfFlowActive} />

    case 'workspace-admin-dashboard':
      return <WorkspaceAdminDashboardScreen onNavigate={navigate} onSelectProofreader={setSelectedProofreader} onSetFiles={(m, r, bulk) => { setMasterFilename(m); setRevisedFilename(r); setBulkMode(!!bulk) }} onSetLrfFlowActive={setLrfFlowActive} />

    case 'team-members':
      return <TeamMembersScreen onNavigate={navigate} onSelectProofreader={setSelectedProofreader} userRole={userRole} />

    case 'admin-history':
      return (
        <AdminHistoryScreen
          onNavigate={navigate}
          previousScreen={previousScreen}
          selectedProofreader={selectedProofreader}
          onSelectProofreader={setSelectedProofreader}
          userRole={userRole}
          onSetFiles={(m, r, bulk) => { setMasterFilename(m); setRevisedFilename(r); setBulkMode(!!bulk) }}
          onSetLrfFlowActive={setLrfFlowActive}
        />
      )

    case 'profile':
      return <ProfileScreen onNavigate={navigate} role={profileRole} previousScreen={previousScreen} />

    case 'change-request-form':
      return <ChangeRequestFormScreen onNavigate={navigate} onSaveLrf={setLrfData} />

    case 'upload-lrf':
      return <UploadLrfScreen onNavigate={navigate} lrfData={lrfData} onSetLrfFlowActive={setLrfFlowActive} onSetFiles={(m, r, bulk) => { setMasterFilename(m); setRevisedFilename(r); setBulkMode(!!bulk); }} />

    default:
      return <LoginScreen onNavigate={navigate} />
  }
}
