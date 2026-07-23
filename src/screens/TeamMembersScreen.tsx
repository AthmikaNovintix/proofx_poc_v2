import { useState } from 'react'
import NavBar from '../components/NavBar'
import { C } from '../colors'
import type { Screen } from '../App'

type Props = {
  onNavigate: (s: Screen) => void;
  onSelectProofreader: (name: string | null) => void;
  userRole?: 'admin' | 'workspace-admin' | 'proofreader';
}

type Member = {
  name: string
  email: string
  status: 'LEAD' | 'ACTIVE' | 'INACTIVE'
  runs: number
}

type WorkspaceGroup = {
  teamName: string
  leadName: string
  color: string
  lightColor: string
  members: Member[]
}

const initialWorkspaces: WorkspaceGroup[] = [
  {
    teamName: 'DePuy CSV Team',
    leadName: 'Dhivya',
    color: C.navy,
    lightColor: C.navyLight,
    members: [
      { name: 'Dhivya', email: 'dhivya@novintix.com', status: 'LEAD', runs: 22 },
      { name: 'Shrvaani', email: 'shrvaani@novintix.com', status: 'ACTIVE', runs: 14 },
      { name: 'Parvatha', email: 'parvatha@novintix.com', status: 'ACTIVE', runs: 11 },
      { name: 'Athmika', email: 'athmika@novintix.com', status: 'ACTIVE', runs: 12 },
      { name: 'Rooban', email: 'rooban@novintix.com', status: 'ACTIVE', runs: 8 },
    ],
  },
  {
    teamName: 'MedTech Labeling Team',
    leadName: 'Ananya',
    color: C.orange,
    lightColor: C.orangeLight,
    members: [
      { name: 'Ananya', email: 'ananya@novintix.com', status: 'LEAD', runs: 18 },
      { name: 'Vikram', email: 'vikram@novintix.com', status: 'ACTIVE', runs: 12 },
      { name: 'Priya', email: 'priya@novintix.com', status: 'ACTIVE', runs: 8 },
    ],
  },
]

type ModalState = 'closed' | 'open' | 'sent'
type InviteForm = { email: string; workspace: string }

function AddMemberModal({
  state,
  form,
  onFormChange,
  onCancel,
  onSend,
  workspaceNames,
}: {
  state: ModalState
  form: InviteForm
  onFormChange: (f: InviteForm) => void
  onCancel: () => void
  onSend: () => void
  workspaceNames: string[]
}) {
  if (state === 'closed') return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(14,20,48,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        className="rounded-2xl w-full flex flex-col"
        style={{ maxWidth: 480, backgroundColor: C.white, boxShadow: '0 24px 64px rgba(0,0,0,0.22)' }}
      >
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <h2 className="font-bold text-base" style={{ color: C.text }}>Add Team Member</h2>
          <button
            onClick={onCancel}
            className="flex items-center justify-center rounded-full hover:opacity-60 cursor-pointer"
            style={{ width: 28, height: 28, backgroundColor: C.grayBg, color: C.muted, fontSize: 16 }}
          >
            ×
          </button>
        </div>

        {state === 'sent' ? (
          <div className="flex flex-col items-center py-10 px-6 text-center">
            <div className="flex items-center justify-center rounded-full mb-4" style={{ width: 56, height: 56, backgroundColor: C.greenLight }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M4 12l5 5L20 7" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-bold text-base mb-1" style={{ color: C.text }}>Invite sent!</h3>
            <p className="text-sm" style={{ color: C.muted }}>
              Invitation sent to <strong>{form.email}</strong> for <strong>{form.workspace}</strong>
            </p>
            <button
              onClick={onCancel}
              className="mt-6 px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
              style={{ backgroundColor: C.grayBg, color: C.text }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Email</label>
                <input
                  type="email"
                  placeholder="e.g. sarah@company.com"
                  value={form.email}
                  onChange={e => onFormChange({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ border: `1px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Workspace</label>
                <select
                  value={form.workspace}
                  onChange={e => onFormChange({ ...form, workspace: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
                  style={{ border: `1px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
                >
                  {workspaceNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4" style={{ borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
                style={{ border: `1.5px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
              >
                Cancel
              </button>
              <button
                onClick={onSend}
                disabled={!form.email}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: form.email ? C.orange : '#f2801d60', cursor: form.email ? 'pointer' : 'not-allowed' }}
              >
                Send Invite
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function TeamMembersScreen({ onNavigate, onSelectProofreader, userRole }: Props) {
  const [workspaces, setWorkspaces] = useState<WorkspaceGroup[]>(initialWorkspaces)
  const [modalState, setModalState] = useState<ModalState>('closed')
  const [form, setForm] = useState<InviteForm>({ email: '', workspace: initialWorkspaces[0].teamName })
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [newWorkspaceAdmin, setNewWorkspaceAdmin] = useState('')

  const isWorkspaceAdmin = userRole === 'workspace-admin'
  const visibleWorkspaces = isWorkspaceAdmin
    ? workspaces.filter(ws => ws.teamName === 'DePuy CSV Team')
    : workspaces

  const workspaceNames = workspaces.map(ws => ws.teamName)
  const totalMembers = workspaces.reduce((acc, ws) => acc + ws.members.length, 0)

  const openAddMember = (preselectedWorkspace?: string) => {
    setForm({ email: '', workspace: preselectedWorkspace ?? workspaceNames[0] ?? '' })
    setModalState('open')
  }

  const handleSend = () => {
    if (!form.email) return
    const emailPrefix = form.email.split('@')[0]
    const capitalizedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)
    setWorkspaces(prev =>
      prev.map(ws =>
        ws.teamName === form.workspace
          ? { ...ws, members: [...ws.members, { name: capitalizedName, email: form.email, status: 'INACTIVE' as const, runs: 0 }] }
          : ws
      )
    )
    setModalState('sent')
  }

  const handleClose = () => {
    setModalState('closed')
    setForm({ email: '', workspace: workspaceNames[0] ?? '' })
  }

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return
    const newWs: WorkspaceGroup = {
      teamName: newWorkspaceName.trim(),
      leadName: newWorkspaceAdmin.trim() || '—',
      color: '#6366f1',
      lightColor: '#ede9fe',
      members: newWorkspaceAdmin.trim()
        ? [{ name: newWorkspaceAdmin.trim(), email: `${newWorkspaceAdmin.trim().toLowerCase().replace(/\s+/g, '.')}@novintix.com`, status: 'LEAD', runs: 0 }]
        : [],
    }
    setWorkspaces(prev => [...prev, newWs])
    setShowCreateWorkspace(false)
    setNewWorkspaceName('')
    setNewWorkspaceAdmin('')
  }

  const getStatusStyle = (status: Member['status']) => {
    switch (status) {
      case 'LEAD':    return { backgroundColor: C.orangeLight, color: C.orangeText, border: `1.5px solid ${C.orange}30` }
      case 'ACTIVE':  return { backgroundColor: C.greenLight, color: C.green, border: `1.5px solid ${C.green}30` }
      case 'INACTIVE':return { backgroundColor: C.grayBg, color: C.muted, border: `1.5px solid ${C.border}` }
    }
  }

  return (
    <>
      <div
        className="flex flex-col h-screen overflow-hidden"
        style={{ backgroundColor: C.bg, opacity: modalState !== 'closed' || showCreateWorkspace ? 0.45 : 1, transition: 'opacity 0.2s' }}
      >
        <NavBar
          showBack
          onBack={() => onNavigate(isWorkspaceAdmin ? 'workspace-admin-dashboard' : 'admin-dashboard')}
          title="Team Members"
          showProfile
          onProfileClick={() => onNavigate('profile')}
          onLogout={() => onNavigate('login')}
          profileName={isWorkspaceAdmin ? 'Dhivya' : 'Admin'}
          profileInitials={isWorkspaceAdmin ? 'D' : 'A'}
        />

        <div className="flex-1 overflow-y-auto w-full">
        <div className="px-8 py-7" style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>

          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-bold text-xl" style={{ color: C.text }}>Team Members</h1>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                {isWorkspaceAdmin
                  ? `${visibleWorkspaces[0]?.members.length ?? 0} members in your workspace`
                  : `${totalMembers} members across ${workspaces.length} workspaces`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none" style={{ color: C.muted }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 rounded-lg text-xs focus:outline-none transition-all"
                  style={{ border: `1px solid ${C.border}`, backgroundColor: C.white, color: C.text, width: 200 }}
                />
              </div>
              {/* New Workspace (admin only) */}
              {!isWorkspaceAdmin && (
                <button
                  onClick={() => setShowCreateWorkspace(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90 cursor-pointer"
                  style={{ border: `1.5px solid ${C.border}`, backgroundColor: C.white, color: C.text }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke={C.text} strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  New Workspace
                </button>
              )}
            </div>
          </div>

          {/* Workspace cards grid */}
          <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${visibleWorkspaces.length === 1 ? 1 : 2}, 1fr)` }}>
            {visibleWorkspaces.map(workspace => {
              const filteredMembers = workspace.members.filter(m =>
                !searchQuery ||
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              const totalRuns = workspace.members.reduce((acc, m) => acc + m.runs, 0)

              return (
                <div
                  key={workspace.teamName}
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                >
                  {/* Card header */}
                  <div
                    className="px-5 py-4 flex items-center justify-between"
                    style={{ borderLeft: `4px solid ${workspace.color}`, borderBottom: `1px solid ${C.border}` }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={workspace.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 22V12h6v10" stroke={workspace.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3 className="font-bold text-sm" style={{ color: C.text }}>{workspace.teamName}</h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: workspace.lightColor, color: workspace.color }}>
                          Lead: {workspace.leadName}
                        </span>
                        <span className="text-xs" style={{ color: C.muted }}>{workspace.members.length} members</span>
                        <span style={{ color: C.border }}>·</span>
                        <span className="text-xs" style={{ color: C.muted }}>{totalRuns} runs</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openAddMember(workspace.teamName)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80 cursor-pointer"
                      style={{ backgroundColor: workspace.lightColor, color: workspace.color }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke={workspace.color} strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                      Add Member
                    </button>
                  </div>

                  {/* Member table */}
                  <div className="px-5">
                    {filteredMembers.length === 0 ? (
                      <p className="text-xs italic py-6 text-center" style={{ color: C.muted }}>
                        {searchQuery ? 'No members match your search.' : 'No members yet.'}
                      </p>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                            {['MEMBER', 'EMAIL', 'STATUS', 'RUNS', ''].map(h => (
                              <th key={h} className="py-3 text-left text-[10px] font-bold tracking-wider" style={{ color: C.muted }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembers.map((m, i) => (
                            <tr
                              key={i}
                              className="transition-colors"
                              style={{ borderBottom: i < filteredMembers.length - 1 ? `1px solid ${C.border}` : 'none' }}
                              onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.bg)}
                              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              {/* Member */}
                              <td className="py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className="flex items-center justify-center rounded-full text-white text-[10px] font-bold flex-shrink-0"
                                    style={{ width: 28, height: 28, backgroundColor: m.status === 'LEAD' ? workspace.color : `${workspace.color}80` }}
                                  >
                                    {m.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <button
                                    onClick={() => { onSelectProofreader(m.name); onNavigate('admin-history') }}
                                    className="text-sm font-semibold hover:underline cursor-pointer text-left"
                                    style={{ color: C.text }}
                                  >
                                    {m.name}
                                  </button>
                                </div>
                              </td>
                              {/* Email */}
                              <td className="py-3.5 text-xs" style={{ color: C.muted }}>{m.email}</td>
                              {/* Status */}
                              <td className="py-3.5">
                                <span
                                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block"
                                  style={getStatusStyle(m.status)}
                                >
                                  {m.status}
                                </span>
                              </td>
                              {/* Runs */}
                              <td className="py-3.5 text-sm font-semibold" style={{ color: C.text }}>{m.runs}</td>
                              {/* Actions */}
                              <td className="py-3.5 text-right">
                                <button
                                  className="text-xs font-semibold hover:opacity-70 cursor-pointer"
                                  style={{ color: C.muted }}
                                >
                                  Deactivate
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        </div>

        <footer className="text-center py-4 shrink-0">
          <p className="text-xs" style={{ color: C.muted }}>ProofX · Label Compliance</p>
        </footer>
      </div>

      <AddMemberModal
        state={modalState}
        form={form}
        onFormChange={setForm}
        onCancel={handleClose}
        onSend={handleSend}
        workspaceNames={workspaceNames}
      />

      {/* Create Workspace Modal */}
      {showCreateWorkspace && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(15,23,42,0.45)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreateWorkspace(false) }}
        >
          <div className="rounded-xl shadow-2xl w-[480px] overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div>
                <h2 className="font-bold text-base" style={{ color: C.text }}>Create Workspace</h2>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>Set up a new team workspace for proofreaders</p>
              </div>
              <button
                onClick={() => setShowCreateWorkspace(false)}
                className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-slate-100 cursor-pointer"
                style={{ color: C.muted }}
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Workspace Name</label>
                <input
                  type="text"
                  placeholder="e.g. Regulatory Affairs Team"
                  value={newWorkspaceName}
                  onChange={e => setNewWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                  style={{ border: `1px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Workspace Admin</label>
                <input
                  type="text"
                  placeholder="Email"
                  value={newWorkspaceAdmin}
                  onChange={e => setNewWorkspaceAdmin(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                  style={{ border: `1px solid ${C.border}`, color: C.text, backgroundColor: C.white }}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={() => { setShowCreateWorkspace(false); setNewWorkspaceName(''); setNewWorkspaceAdmin('') }}
                className="px-4 py-2 rounded-lg text-sm font-semibold border hover:bg-slate-50 cursor-pointer"
                style={{ borderColor: C.border, color: C.text }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkspace}
                disabled={!newWorkspaceName.trim()}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: C.orange, opacity: newWorkspaceName.trim() ? 1 : 0.5 }}
              >
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
