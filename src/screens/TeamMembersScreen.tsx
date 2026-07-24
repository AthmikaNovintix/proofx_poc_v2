import { useState } from 'react'
import NavBar from '../components/NavBar'
import AdminSidebar from '../components/AdminSidebar'
import { C } from '../colors'
import type { Screen } from '../App'
import { Search, Plus, Filter, Users, Briefcase, ChevronRight } from 'lucide-react'

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
  workspace: string
}

type WorkspaceGroup = {
  teamName: string
  leadName: string
  color: string
  lightColor: string
  members: { name: string; email: string; status: 'LEAD' | 'ACTIVE' | 'INACTIVE'; runs: number }[]
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
type InviteForm = { email: string; workspace: string; role: 'LEAD' | 'ACTIVE' }

function AddMemberModal({
  state,
  form,
  onFormChange,
  onCancel,
  onSend,
  workspaceNames,
  workspaces,
  isWorkspaceAdmin,
}: {
  state: ModalState
  form: InviteForm
  onFormChange: (f: InviteForm) => void
  onCancel: () => void
  onSend: () => void
  workspaceNames: string[]
  workspaces: WorkspaceGroup[]
  isWorkspaceAdmin?: boolean
}) {
  if (state === 'closed') return null

  // Calculate active members count in target workspace
  const targetWs = workspaces.find(w => w.teamName === form.workspace)
  const activeCount = targetWs ? targetWs.members.filter(m => m.status !== 'INACTIVE').length : 0
  const isWorkspaceFull = activeCount >= 5

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in"
      style={{ backgroundColor: 'rgba(14,20,48,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        className="w-full flex flex-col border border-slate-200 rounded-xl overflow-hidden shadow-2xl"
        style={{ maxWidth: 480, backgroundColor: C.white }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-bold text-base text-slate-800">Add Team Member</h2>
          <button
            onClick={onCancel}
            className="flex items-center justify-center hover:opacity-60 cursor-pointer text-xl text-slate-400 rounded-full"
            style={{ width: 28, height: 28 }}
          >
            ×
          </button>
        </div>

        {/* Capacity Warning Banner */}
        {isWorkspaceFull && state !== 'sent' && (
          <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex items-start gap-2">
            <span className="font-bold shrink-0">⚠️</span>
            <div>
              <strong>Workspace Capacity Reached ({activeCount}/5 Active).</strong> To invite a new member here, deactivate an active member or choose a different workspace.
            </div>
          </div>
        )}

        {state === 'sent' ? (
          <div className="flex flex-col items-center py-10 px-6 text-center">
            <div className="flex items-center justify-center mb-4 w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M4 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-bold text-base mb-1 text-slate-850">Invite sent successfully!</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              An invitation to sign up has been dispatched to <strong>{form.email}</strong> for the <strong>{form.workspace}</strong> workspace.
            </p>
            <button
              onClick={onCancel}
              className="mt-6 px-6 py-2 text-xs font-semibold cursor-pointer border border-slate-200 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-750">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. sarah@novintix.com"
                  value={form.email}
                  onChange={e => onFormChange({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg"
                  style={{ color: C.text, backgroundColor: C.white }}
                  autoFocus
                />
              </div>
              
              {!isWorkspaceAdmin && (
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-750">Assign Workspace</label>
                  <select
                    value={form.workspace}
                    onChange={e => onFormChange({ ...form, workspace: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg cursor-pointer bg-white"
                  >
                    {workspaceNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-750">Role</label>
                <select
                  value={form.role}
                  onChange={e => onFormChange({ ...form, role: e.target.value as 'LEAD' | 'ACTIVE' })}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg cursor-pointer bg-white"
                >
                  <option value="ACTIVE">Proofreader</option>
                  <option value="LEAD">Workspace Lead</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={onCancel}
                className="flex-1 py-2 text-xs font-semibold cursor-pointer border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={onSend}
                disabled={!form.email || isWorkspaceFull}
                className="flex-1 py-2 text-xs font-semibold text-white cursor-pointer rounded-lg hover:opacity-95"
                style={{ 
                  backgroundColor: (form.email && !isWorkspaceFull) ? C.navy : '#1C2E5960', 
                  cursor: (form.email && !isWorkspaceFull) ? 'pointer' : 'not-allowed' 
                }}
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
  const [activeTab, setActiveTab] = useState<'workspaces' | 'members'>('workspaces')
  const [modalState, setModalState] = useState<ModalState>('closed')
  const [form, setForm] = useState<InviteForm>({ email: '', workspace: initialWorkspaces[0].teamName, role: 'ACTIVE' })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWorkspaceFilter, setSelectedWorkspaceFilter] = useState<string>('ALL')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL')
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [newWorkspaceAdmin, setNewWorkspaceAdmin] = useState('')
  const [deleteWorkspaceName, setDeleteWorkspaceName] = useState<string | null>(null)

  const isWorkspaceAdmin = userRole === 'workspace-admin'
  const workspaceNames = workspaces.map(ws => ws.teamName)

  // Flatten workspaces to a flat members list for the table
  const allMembers: Member[] = workspaces.flatMap(ws => 
    ws.members.map(m => ({
      ...m,
      workspace: ws.teamName
    }))
  )

  const handleSend = () => {
    if (!form.email) return
    const emailPrefix = form.email.split('@')[0]
    const capitalizedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)
    
    // Safety check active count before inviting
    const targetWs = workspaces.find(w => w.teamName === form.workspace)
    const activeCount = targetWs ? targetWs.members.filter(m => m.status !== 'INACTIVE').length : 0
    if (activeCount >= 5) {
      alert(`Cannot invite member. The workspace "${form.workspace}" has reached its limit of 5 active members.`)
      return
    }

    setWorkspaces(prev =>
      prev.map(ws =>
        ws.teamName === form.workspace
          ? { 
              ...ws, 
              members: [...ws.members, { name: capitalizedName, email: form.email, status: form.role, runs: 0 }] 
            }
          : ws
      )
    )
    setModalState('sent')
  }

  const handleClose = () => {
    setModalState('closed')
    setForm({ email: '', workspace: workspaceNames[0] ?? '', role: 'ACTIVE' })
  }

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return
    
    // Safety check workspace limit (Max 5)
    if (workspaces.length >= 5) {
      alert("Cannot create workspace. Maximum limit of 5 workspaces reached.")
      return
    }

    const leadEmail = newWorkspaceAdmin.trim()
    let derivedName = '—'
    let leadMembersList: WorkspaceGroup['members'] = []

    if (leadEmail) {
      const emailPrefix = leadEmail.split('@')[0]
      derivedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)
      leadMembersList = [{ name: derivedName, email: leadEmail, status: 'LEAD', runs: 0 }]
    }

    const newWs: WorkspaceGroup = {
      teamName: newWorkspaceName.trim(),
      leadName: derivedName,
      color: '#6366f1',
      lightColor: '#ede9fe',
      members: leadMembersList,
    }
    setWorkspaces(prev => [...prev, newWs])
    setShowCreateWorkspace(false)
    setNewWorkspaceName('')
    setNewWorkspaceAdmin('')
  }

  const handleDeleteWorkspace = (workspaceName: string) => {
    if (workspaces.length <= 1) {
      alert("Cannot delete workspace. There must be at least one active workspace in the system.")
      return
    }

    setDeleteWorkspaceName(workspaceName)
  }

  const toggleMemberStatus = (memberName: string, workspaceName: string) => {
    const wsObj = workspaces.find(ws => ws.teamName === workspaceName)
    if (!wsObj) return
    const mObj = wsObj.members.find(m => m.name === memberName)
    if (!mObj) return

    // If activating (changing status from INACTIVE to ACTIVE/LEAD)
    if (mObj.status === 'INACTIVE') {
      const activeCount = wsObj.members.filter(m => m.status !== 'INACTIVE').length
      if (activeCount >= 5) {
        alert(`Cannot activate ${memberName}. The workspace "${workspaceName}" is already at full capacity (5/5 active members).`)
        return
      }
    }

    setWorkspaces(prev =>
      prev.map(ws => {
        if (ws.teamName === workspaceName) {
          return {
            ...ws,
            members: ws.members.map(m => {
              if (m.name === memberName) {
                return {
                  ...m,
                  status: m.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE'
                }
              }
              return m
            })
          }
        }
        return ws
      })
    )
  }

  const handleReassign = (memberName: string, currentWorkspace: string, targetWorkspace: string) => {
    if (currentWorkspace === targetWorkspace) return

    const targetWs = workspaces.find(ws => ws.teamName === targetWorkspace)
    if (!targetWs) return

    const currentWs = workspaces.find(ws => ws.teamName === currentWorkspace)
    const member = currentWs?.members.find(m => m.name === memberName)
    if (!member) return

    // Verify limit in target workspace if member is active
    if (member.status !== 'INACTIVE') {
      const activeCount = targetWs.members.filter(m => m.status !== 'INACTIVE').length
      if (activeCount >= 5) {
        alert(`Cannot reassign ${memberName}. The workspace "${targetWorkspace}" is already full (5/5 active members).`)
        return
      }
    }

    setWorkspaces(prev => {
      // 1. Remove from current workspace
      const cleanPrev = prev.map(ws => {
        if (ws.teamName === currentWorkspace) {
          return {
            ...ws,
            members: ws.members.filter(m => m.name !== memberName)
          }
        }
        return ws
      })

      // 2. Add to target workspace
      return cleanPrev.map(ws => {
        if (ws.teamName === targetWorkspace) {
          return {
            ...ws,
            members: [...ws.members, { ...member, workspace: targetWorkspace }]
          }
        }
        return ws
      })
    })
  }

  // Filter members list based on query and dropdown filters
  const filteredMembers = allMembers.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesWorkspace = 
      selectedWorkspaceFilter === 'ALL' || m.workspace === selectedWorkspaceFilter
    
    const matchesStatus = 
      selectedStatusFilter === 'ALL' || m.status === selectedStatusFilter

    const matchesAdminScope = 
      !isWorkspaceAdmin || m.workspace === 'DePuy CSV Team'

    return matchesSearch && matchesWorkspace && matchesStatus && matchesAdminScope
  })

  const visibleWorkspaces = isWorkspaceAdmin
    ? workspaces.filter(ws => ws.teamName === 'DePuy CSV Team')
    : workspaces

  const filteredWorkspaces = visibleWorkspaces.filter(ws => 
    ws.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ws.leadName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: C.bg }}>
      <NavBar
        title="Team Members"
        showProfile
        onProfileClick={() => onNavigate('profile')}
        onLogout={() => onNavigate('login')}
        profileName={isWorkspaceAdmin ? 'Dhivya' : 'Admin'}
        profileInitials={isWorkspaceAdmin ? 'D' : 'A'}
      />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar active="team-members" userRole={isWorkspaceAdmin ? 'workspace-admin' : 'admin'} onNavigate={onNavigate} />
        
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-7" style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="font-bold text-xl text-slate-800">Team Members</h1>
                <p className="text-xs mt-0.5 text-slate-500">
                  Manage active workspaces and team members
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setModalState('open')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1C2E59] text-white text-xs font-semibold cursor-pointer rounded-lg hover:opacity-95 shadow-sm"
                >
                  <Plus size={14} /> Add Team Member
                </button>
                {!isWorkspaceAdmin && (
                  <div className="flex items-center gap-2">
                    {workspaceNames.length >= 5 && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-250 px-2.5 py-1.5 rounded-lg shadow-sm">
                        Limit: 5/5 Workspaces
                      </span>
                    )}
                    <button
                      onClick={() => setShowCreateWorkspace(true)}
                      disabled={workspaceNames.length >= 5}
                      className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-700 text-xs font-semibold cursor-pointer rounded-lg hover:bg-slate-50 shadow-sm"
                      style={{
                        opacity: workspaceNames.length >= 5 ? 0.5 : 1,
                        cursor: workspaceNames.length >= 5 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Create Workspace
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isWorkspaceAdmin ? (
              /* Previous Design for Workspace Admin: Single Card with direct expanded member list */
              <div className="flex flex-col gap-6">
                {/* Search Bar */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search members..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-2 w-full text-xs border border-slate-200 rounded-lg focus:outline-none bg-white text-slate-800"
                    />
                  </div>
                </div>

                {visibleWorkspaces.map(workspace => {
                  const filteredMembers = workspace.members.filter(m =>
                    !searchQuery ||
                    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    m.email.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  const totalRuns = workspace.members.reduce((acc, m) => acc + m.runs, 0)
                  const activeCount = workspace.members.filter(m => m.status !== 'INACTIVE').length

                  return (
                    <div
                      key={workspace.teamName}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                    >
                      {/* Workspace Header */}
                      <div
                        className="px-6 py-5 flex items-center justify-between border-b border-slate-100"
                        style={{ borderLeft: `4px solid ${workspace.color}` }}
                      >
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Workspace</span>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-slate-800">{workspace.teamName}</h3>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-650 border border-slate-200/60">
                              {activeCount}/5 Active Users
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                            Workspace Lead: {workspace.leadName}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-500">{totalRuns} total runs</span>
                        </div>
                      </div>

                      {/* Roster Table */}
                      <div className="px-5">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="py-3 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Member</th>
                              <th className="py-3 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Email</th>
                              <th className="py-3 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Status</th>
                              <th className="py-3 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Runs</th>
                              <th className="py-3 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredMembers.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-xs italic text-slate-400">
                                  No members match your search criteria.
                                </td>
                              </tr>
                            ) : (
                              filteredMembers.map((m, i) => {
                                const isLead = m.status === 'LEAD'
                                return (
                                  <tr
                                    key={i}
                                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                                  >
                                    {/* Name / Avatar */}
                                    <td className="py-3 px-3">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className="w-8 h-8 flex items-center justify-center font-bold text-xs text-white rounded-full"
                                          style={{ backgroundColor: isLead ? '#1C2E59' : '#1C2E5980' }}
                                        >
                                          {m.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <button
                                            onClick={() => { onSelectProofreader(m.name); onNavigate('admin-history') }}
                                            className="text-xs font-bold text-slate-800 hover:underline cursor-pointer text-left"
                                          >
                                            {m.name}
                                          </button>
                                          {isLead && (
                                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-md tracking-wider uppercase">
                                              Lead
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    
                                    {/* Email */}
                                    <td className="py-3 px-3 text-xs text-slate-500">{m.email}</td>
                                    
                                    {/* Status */}
                                    <td className="py-3 px-3">
                                      <span
                                        className="text-[9px] font-bold px-2 py-0.5 border rounded-full uppercase"
                                        style={{
                                          backgroundColor: m.status !== 'INACTIVE' ? C.greenLight : C.grayBg,
                                          color: m.status !== 'INACTIVE' ? C.green : C.muted,
                                          borderColor: m.status !== 'INACTIVE' ? `${C.green}20` : C.border,
                                        }}
                                      >
                                        {m.status === 'INACTIVE' ? 'Inactive' : 'Active'}
                                      </span>
                                    </td>
                                    
                                    {/* Runs */}
                                    <td className="py-3 px-3 text-xs font-semibold text-slate-800">{m.runs} runs</td>
                                    
                                    {/* Actions */}
                                    <td className="py-3 px-3 text-right">
                                      <button
                                        onClick={() => toggleMemberStatus(m.name, workspace.teamName)}
                                        className="text-[11px] font-bold cursor-pointer transition-colors px-2 py-1 rounded hover:bg-slate-100"
                                        style={{
                                          color: m.status === 'INACTIVE' ? C.green : C.red,
                                        }}
                                      >
                                        {m.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}
                                      </button>
                                    </td>
                                  </tr>
                                )
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* Super Admin tabbed workspaces / team members views */
              <>
                {/* Inner Dashboard Tabs */}
                <div className="flex border-b border-slate-200 mb-6 gap-6">
                  <button
                    onClick={() => { setActiveTab('workspaces'); setSearchQuery('') }}
                    className={`pb-3 text-sm font-semibold transition-all cursor-pointer relative ${
                      activeTab === 'workspaces' ? 'text-[#1C2E59]' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase size={16} /> Workspaces ({visibleWorkspaces.length})
                    </span>
                    {activeTab === 'workspaces' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1C2E59]" />
                    )}
                  </button>
                  <button
                    onClick={() => { setActiveTab('members'); setSearchQuery('') }}
                    className={`pb-3 text-sm font-semibold transition-all cursor-pointer relative ${
                      activeTab === 'members' ? 'text-[#1C2E59]' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Users size={16} /> Team Members ({allMembers.length})
                    </span>
                    {activeTab === 'members' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1C2E59]" />
                    )}
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder={activeTab === 'workspaces' ? 'Search workspaces...' : 'Search by name, email...'}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-2 w-full text-xs border border-slate-200 rounded-lg focus:outline-none bg-white text-slate-800"
                    />
                  </div>

                  {activeTab === 'members' && (
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Filter size={12} />
                        <span>Filter:</span>
                      </div>
                      
                      {!isWorkspaceAdmin && (
                        <select
                          value={selectedWorkspaceFilter}
                          onChange={e => setSelectedWorkspaceFilter(e.target.value)}
                          className="px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg cursor-pointer text-slate-700"
                        >
                          <option value="ALL">All Workspaces</option>
                          {workspaceNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      )}

                      <select
                        value={selectedStatusFilter}
                        onChange={e => setSelectedStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs border border-slate-200 bg-white rounded-lg cursor-pointer text-slate-700"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="LEAD">Workspace Lead</option>
                        <option value="ACTIVE">Active Proofreader</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  )}
                </div>

                {activeTab === 'workspaces' ? (
                  /* Workspaces Tab view */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredWorkspaces.length === 0 ? (
                      <div className="col-span-2 py-12 text-center text-xs italic text-slate-400 bg-white border border-slate-200 rounded-xl">
                        No workspaces match your search criteria.
                      </div>
                    ) : (
                      filteredWorkspaces.map(ws => {
                        const totalRuns = ws.members.reduce((acc, m) => acc + m.runs, 0)
                        const activeCount = ws.members.filter(m => m.status !== 'INACTIVE').length
                        return (
                          <div
                            key={ws.teamName}
                            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                          >
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Workspace</span>
                                  <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ws.color }} />
                                    {ws.teamName}
                                  </h3>
                                  <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                                    Workspace Lead: {ws.leadName}
                                  </p>
                                </div>
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-650 border border-slate-200/60">
                                  {activeCount}/5 Active Users
                                </span>
                              </div>

                              <div className="flex items-center gap-4 py-4 border-t border-slate-100">
                                <div>
                                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Total Runs</span>
                                  <span className="text-lg font-bold text-slate-800">{totalRuns}</span>
                                </div>
                                <div className="w-px h-8 bg-slate-100" />
                                <div>
                                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Members</span>
                                  <p className="text-xs text-slate-500 font-medium truncate max-w-[280px]">
                                    {ws.members.map(m => m.name).join(', ')}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                              <button
                                onClick={() => { setSelectedWorkspaceFilter(ws.teamName); setActiveTab('members') }}
                                className="text-xs font-semibold text-[#1C2E59] hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                View Members <ChevronRight size={12} />
                              </button>
                              {!isWorkspaceAdmin && (
                                <button
                                  onClick={() => handleDeleteWorkspace(ws.teamName)}
                                  className="text-xs font-semibold text-slate-400 hover:text-red-600 cursor-pointer transition-colors"
                                >
                                  Delete Workspace
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                ) : (
                  /* Team Members Tab view */
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="py-3 px-5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Member</th>
                          <th className="py-3 px-5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Email</th>
                          <th className="py-3 px-5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Workspace</th>
                          <th className="py-3 px-5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Status</th>
                          <th className="py-3 px-5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Total Runs</th>
                          <th className="py-3 px-5 text-[10px] font-bold tracking-wider text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-xs italic text-slate-400">
                              No team members match your filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredMembers.map((m, idx) => {
                            const isLead = m.status === 'LEAD'
                            return (
                              <tr
                                key={idx}
                                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                              >
                                {/* Name / Avatar */}
                                <td className="py-3 px-5">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-8 h-8 flex items-center justify-center font-bold text-xs text-white rounded-full"
                                      style={{ backgroundColor: isLead ? '#1C2E59' : '#1C2E5980' }}
                                    >
                                      {m.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => { onSelectProofreader(m.name); onNavigate('admin-history') }}
                                        className="text-xs font-bold text-slate-800 hover:underline cursor-pointer text-left"
                                      >
                                        {m.name}
                                      </button>
                                      {isLead && (
                                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-md tracking-wider uppercase">
                                          Lead
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                
                                {/* Email */}
                                <td className="py-3 px-5 text-xs text-slate-500">{m.email}</td>
                                
                                {/* Workspace (Reassign dropdown) */}
                                <td className="py-3 px-5">
                                  <select
                                    value={m.workspace}
                                    onChange={e => handleReassign(m.name, m.workspace, e.target.value)}
                                    className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded p-1 cursor-pointer focus:outline-none"
                                  >
                                    {workspaceNames.map(name => (
                                      <option key={name} value={name}>{name}</option>
                                    ))}
                                  </select>
                                </td>
                                
                                {/* Role / Status Badge */}
                                <td className="py-3 px-5">
                                  <span
                                    className="text-[9px] font-bold px-2 py-0.5 border rounded-full uppercase"
                                    style={{
                                      backgroundColor: m.status !== 'INACTIVE' ? C.greenLight : C.grayBg,
                                      color: m.status !== 'INACTIVE' ? C.green : C.muted,
                                      borderColor: m.status !== 'INACTIVE' ? `${C.green}20` : C.border,
                                    }}
                                  >
                                    {m.status === 'INACTIVE' ? 'Inactive' : 'Active'}
                                  </span>
                                </td>
                                
                                {/* Runs count */}
                                <td className="py-3 px-5 text-xs font-semibold text-slate-800">{m.runs} runs</td>
                                
                                {/* Actions */}
                                <td className="py-3 px-5 text-right">
                                  <button
                                    onClick={() => toggleMemberStatus(m.name, m.workspace)}
                                    className="text-[11px] font-bold cursor-pointer transition-colors px-2 py-1 rounded hover:bg-slate-100"
                                    style={{
                                      color: m.status === 'INACTIVE' ? C.green : C.red,
                                    }}
                                  >
                                    {m.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}
                                  </button>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>

      <AddMemberModal
        state={modalState}
        form={form}
        onFormChange={setForm}
        onCancel={handleClose}
        onSend={handleSend}
        workspaceNames={workspaceNames}
        workspaces={workspaces}
        isWorkspaceAdmin={isWorkspaceAdmin}
      />

      {/* Create Workspace Modal */}
      {showCreateWorkspace && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
          style={{ backgroundColor: 'rgba(15,23,42,0.45)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreateWorkspace(false) }}
        >
          <div className="w-[480px] overflow-hidden bg-white border border-slate-200 rounded-xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-base text-slate-800">Create Workspace</h2>
                <p className="text-[11px] text-slate-400">Set up a new team workspace for proofreaders</p>
              </div>
              <button
                onClick={() => setShowCreateWorkspace(false)}
                className="text-xl text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-750">Workspace Name</label>
                <input
                  type="text"
                  placeholder="e.g. Depuy Orthopaedics"
                  value={newWorkspaceName}
                  onChange={e => setNewWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-750">Workspace Lead Email (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. ananya@novintix.com"
                  value={newWorkspaceAdmin}
                  onChange={e => setNewWorkspaceAdmin(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowCreateWorkspace(false)}
                className="flex-1 py-2 text-xs font-semibold border border-slate-200 bg-white text-slate-700 cursor-pointer rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkspace}
                disabled={!newWorkspaceName.trim()}
                className="flex-1 py-2 text-xs font-semibold text-white cursor-pointer rounded-lg hover:opacity-95"
                style={{ backgroundColor: newWorkspaceName.trim() ? C.navy : '#1C2E5960' }}
              >
                Create Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Workspace Confirmation Modal */}
      {deleteWorkspaceName && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
          style={{ backgroundColor: 'rgba(15,23,42,0.45)' }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteWorkspaceName(null) }}
        >
          <div className="w-[440px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 text-red-650 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center font-bold text-base text-red-600">
                  ⚠️
                </div>
                <h3 className="font-bold text-base text-slate-800">Delete Workspace</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete the workspace <strong>{deleteWorkspaceName}</strong>? All associated team members will be permanently removed.
              </p>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setDeleteWorkspaceName(null)}
                className="flex-1 py-2 text-xs font-semibold border border-slate-200 bg-white text-slate-700 cursor-pointer rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setWorkspaces(prev => prev.filter(ws => ws.teamName !== deleteWorkspaceName))
                  setDeleteWorkspaceName(null)
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-red-600 cursor-pointer rounded-lg hover:bg-red-700"
              >
                Delete Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
