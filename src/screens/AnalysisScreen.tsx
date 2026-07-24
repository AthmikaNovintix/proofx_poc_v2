import { useState, useEffect, useRef } from 'react'
import NavBar from '../components/NavBar'
import { C } from '../colors'
import type { Screen } from '../App'
import { AlertTriangle, ArrowRight, Maximize2, Home, Loader2 } from 'lucide-react'

type Props = {
  onNavigate: (s: Screen) => void;
  previousScreen?: Screen;
  lrfFlowActive?: boolean;
  bulkMode?: boolean;
  masterFilename: string;
  revisedFilename: string;
}

type BBox = { x: number; y: number; w: number; h: number }

type Finding = {
  id: string
  type: 'text' | 'graphics' | 'barcode'
  summary: string
  masterHad: string
  revisedHas: string
  classification?: 'Expected' | 'Unexpected'
  master: BBox
  revised: BBox
}

// Findings for additional changes master.pdf vs revised.pdf
const findings: Finding[] = [
  {
    id: 'G1',
    type: 'graphics',
    summary: "replaced 'ec' → 'eu'",
    masterHad: 'EC Rep',
    revisedHas: 'EU Rep',
    classification: 'Expected',
    master: { x: 272, y: 92, w: 238, h: 132 },
    revised: { x: 272, y: 92, w: 238, h: 132 }
  },
  {
    id: 'T1',
    type: 'text',
    summary: "replaced 'medosinternational sarl chemin-blanc38 2400lelocle,switzerland' → '1302wrights lane east, westchester,pa19380, usa(craniomaxillofacial)'",
    masterHad: '2026-01-22 MedosInternational SARL Chemin-Blanc38 2400 Le Locle, Switzerland',
    revisedHas: '2026-01-22 1302 Wrights Lane East, West Westchester, PA 19380, USA (Craniomaxillofacial)',
    classification: 'Expected',
    master: { x: 55, y: 250, w: 402, h: 145 },
    revised: { x: 55, y: 250, w: 402, h: 145 }
  },
  {
    id: 'T2',
    type: 'text',
    summary: "replaced 'depuysynthes' → 'depuy synthes'",
    masterHad: 'DePuySynthes',
    revisedHas: 'DePuy Synthes',
    classification: 'Expected',
    master: { x: 240, y: 118, w: 92, h: 18 },
    revised: { x: 240, y: 118, w: 92, h: 18 }
  },
  {
    id: 'T3',
    type: 'text',
    summary: "replaced 'rev.a' → 'rev.b'",
    masterHad: 'REV.A',
    revisedHas: 'REV.B',
    classification: 'Unexpected',
    master: { x: 353, y: 478, w: 60, h: 18 },
    revised: { x: 353, y: 478, w: 60, h: 18 }
  },
  {
    id: 'T4',
    type: 'text',
    summary: "replaced '//www.e-ifu.com/symbols-glossary' → '//www.e-depuysynthes-ifu.com/symbols-glossary'",
    masterHad: 'www.e-ifu.com',
    revisedHas: 'www.e-depuysynthes-ifu.com',
    classification: 'Expected',
    master: { x: 68, y: 310, w: 188, h: 16 },
    revised: { x: 68, y: 310, w: 188, h: 16 }
  },
  {
    id: 'T5',
    type: 'text',
    summary: "replaced 'medosinternational sarl chemin-blanc38 2400lelocle,switzerland' → '1302wrights lane east, westchester,pa19380, usa(craniomaxillofacial)'",
    masterHad: '2026-01-22 MedosInternational SARL Chemin-Blanc38 2400 Le Locle, Switzerland',
    revisedHas: '2026-01-22 1302 Wrights Lane East, West Westchester, PA 19380, USA (Craniomaxillofacial)',
    classification: 'Expected',
    master: { x: 55, y: 250, w: 402, h: 145 },
    revised: { x: 55, y: 250, w: 402, h: 145 }
  },
  {
    id: 'T6',
    type: 'text',
    summary: "replaced 'belgium' → 'usa'",
    masterHad: 'Belguim',
    revisedHas: 'USA',
    classification: 'Unexpected',
    master: { x: 148, y: 498, w: 74, h: 16 },
    revised: { x: 148, y: 498, w: 74, h: 16 }
  },
  {
    id: 'T7',
    type: 'text',
    summary: "replaced 'rev.a' → 'rev.b'",
    masterHad: 'REV.A',
    revisedHas: 'REV.B',
    classification: 'Unexpected',
    master: { x: 353, y: 478, w: 60, h: 18 },
    revised: { x: 353, y: 478, w: 60, h: 18 }
  }
]

// Findings for Master.pdf vs Revised.pdf (from user screenshot)
const newFindingsList: Finding[] = [
  {
    id: 'T1',
    type: 'text',
    summary: "replaced 'medosinternational sarl chemin-blanc38 2400 le locle,switzerland' → '1302wrightslaneeast, westchester,pa19380, usa(craniomaxillofacial)'",
    masterHad: '2026-01-22 MedosInternational SARL Chemin-Blanc38 2400 Le Locle, Switzerland',
    revisedHas: '2020-01-22 1302WrightsLaneEast, WestChester,PA19380, USACraniomaxillofacial',
    classification: 'Expected',
    master: { x: 55, y: 250, w: 402, h: 145 },
    revised: { x: 55, y: 250, w: 402, h: 145 }
  },
  {
    id: 'T2',
    type: 'text',
    summary: "replaced 'depuysynthes' → 'depuy synthes'",
    masterHad: 'DePuySynthes',
    revisedHas: 'DePuy Synthes',
    classification: 'Expected',
    master: { x: 240, y: 118, w: 92, h: 18 },
    revised: { x: 240, y: 118, w: 92, h: 18 }
  },
  {
    id: 'T3',
    type: 'text',
    summary: "replaced '//www.e-ifu.com/symbols-glossary' → '//www.e-depuysynthes-ifu.com/symbols-glossary'",
    masterHad: '//www.e-ifu.com/symbols-glossary',
    revisedHas: '//www.e-depuysynthes-ifu.com/symbols-glossary',
    classification: 'Expected',
    master: { x: 68, y: 310, w: 188, h: 16 },
    revised: { x: 68, y: 310, w: 188, h: 16 }
  },
  {
    id: 'T4',
    type: 'text',
    summary: "replaced 'medosinternationalsarl chemin-blanc38 2400lelocle,switzerland' → '1302wrights lane east, westchester,pa19380, usa(craniomaxillofacial)'",
    masterHad: 'MedosInternationalSARL Chemin-Blanc38 2400LeLocle,Switzerland',
    revisedHas: '1302Wrights Lane East, WestChester,PA19380, USA(Craniomaxillofacial)',
    classification: 'Expected',
    master: { x: 55, y: 250, w: 402, h: 145 },
    revised: { x: 55, y: 250, w: 402, h: 145 }
  },
  {
    id: 'G1',
    type: 'graphics',
    summary: "replaced 'ec' → 'eu'",
    masterHad: 'EC REP',
    revisedHas: 'EU REP',
    classification: 'Expected',
    master: { x: 488, y: 183, w: 80, h: 44 },
    revised: { x: 488, y: 183, w: 80, h: 44 }
  }
]

const typeColors: Record<string, { bg: string; text: string; color: string }> = {
  text: { bg: '#EFF6FF', text: '#1E40AF', color: '#378ADD' },
  graphics: { bg: '#FEF2F2', text: '#991B1B', color: '#DC2626' },
  barcode: { bg: '#FFFBEB', text: '#92400E', color: '#BA7517' },
}

function LabelPanel({
  title,
  version,
  variant,
  findings,
  selectedFinding,
  zoom,
  scrollRef,
  onReset,
  fileUrl,
  loading,
}: {
  title: string
  version: string
  variant: 'master' | 'revised'
  findings: Finding[]
  selectedFinding: string | null
  zoom: number
  scrollRef: React.RefObject<HTMLDivElement | null>
  onReset: () => void
  fileUrl: string
  loading: boolean
}) {
  const scale = zoom / 100
  const headerBg = variant === 'master' ? '#FEF2F2' : '#EFF6FF'
  const dotColor = variant === 'master' ? '#E02424' : '#1A56DB'
  const versionLabel = variant === 'master' ? 'CURRENT VERSION LABEL' : 'NEW VERSION LABEL'

  // Label source dimensions are approximately 680x900 to ensure full width and height render
  const width = 680
  const height = 900

  // Click-and-drag to pan the label
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;
    const onDown = (e: MouseEvent) => {
      if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = scroller.scrollLeft;
      startTop = scroller.scrollTop;
      scroller.style.cursor = "grabbing";
      e.preventDefault();
    };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      scroller.scrollLeft = startLeft - (e.clientX - startX);
      scroller.scrollTop = startTop - (e.clientY - startY);
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      scroller.style.cursor = "";
    };
    scroller.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      scroller.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [scrollRef, loading]);

  // Intercept Ctrl+scroll at the container level
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    scroller.addEventListener("wheel", handler, { passive: false });
    return () => scroller.removeEventListener("wheel", handler);
  }, [scrollRef, loading]);

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {/* Panel header */}
      <div
        className="h-11 px-4 flex items-center justify-between flex-shrink-0"
        style={{
          backgroundColor: headerBg,
          borderBottom: `2px solid ${dotColor}`,
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
          <span className="text-sm font-bold uppercase tracking-wide flex-shrink-0" style={{ color: dotColor }}>
            {versionLabel}
          </span>
          <span className="text-xs text-[#5F6368] truncate">· {title}</span>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <button
            onClick={onReset}
            disabled={loading}
            title="Reset zoom"
            className={`h-6 w-6 flex items-center justify-center rounded border transition-colors ${loading ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            style={{ borderColor: dotColor, color: dotColor, backgroundColor: 'transparent' }}
          >
            <Maximize2 className="h-3 w-3" />
          </button>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded border" style={{ color: dotColor, borderColor: dotColor }}>
            {loading ? '—' : findings.length} ANNOTATION{findings.length !== 1 ? 'S' : ''}
          </span>
        </div>
      </div>

      {loading ? (
        /* Loading state */
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-[#F1F3F4] gap-3">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: dotColor }} />
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: dotColor }}>
            Loading Labels
          </div>
        </div>
      ) : (
        /* Canvas container */
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto bg-[#F1F3F4] p-6 no-scrollbar cursor-grab select-none">
          <div
            className="relative mx-auto bg-white rounded-lg shadow-sm overflow-hidden"
            style={{ width: width * scale, height: height * scale }}
          >
            {/* Render label image */}
            <img
              src={fileUrl}
              alt={title}
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />

          </div>
        </div>
      )}
    </div>
  )
}

function expandedIdMatch(selectedId: string | null, currentId: string): boolean {
  if (!selectedId) return false
  if (selectedId === currentId) return true
  return false
}

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string
  active: boolean
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer"
      style={{
        backgroundColor: active ? color : 'transparent',
        color: active ? '#FFFFFF' : '#5F6368',
        borderColor: active ? color : '#E0E0E0',
      }}
    >
      {label}
    </button>
  )
}

export default function AnalysisScreen({ onNavigate, previousScreen, lrfFlowActive, bulkMode, masterFilename, revisedFilename }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'text' | 'graphics' | 'barcode'>('all')
  const [activeStatus, setActiveStatus] = useState<'all' | 'expected' | 'unexpected'>('all')
  const [exporting, setExporting] = useState(false)
  const [syncScroll, setSyncScroll] = useState(true)
  
  // Separate zooms for split zoom support
  const [masterZoom, setMasterZoom] = useState(100)
  const [revisedZoom, setRevisedZoom] = useState(100)

  const masterRef = useRef<HTMLDivElement>(null)
  const revisedRef = useRef<HTMLDivElement>(null)

  const isTwoPairs = !!bulkMode && masterFilename === 'Master.pdf';
  const [activePairIdx, setActivePairIdx] = useState(1);

  // Determine actual files and paths being displayed
  const isMasterPdf = isTwoPairs ? activePairIdx === 2 : masterFilename !== 'Master.pdf';
  const activeFindingsList = isMasterPdf ? findings : newFindingsList;
  const activeMasterName = isTwoPairs ? (isMasterPdf ? 'additional changes master.pdf' : 'Master.pdf') : masterFilename;
  const activeRevisedName = isTwoPairs ? (isMasterPdf ? 'additional changes revised.pdf' : 'Revised.pdf') : revisedFilename;
  const masterPdfPath = isMasterPdf ? '/labels/additional changes master.png' : '/labels/Master.png';
  const revisedPdfPath = isMasterPdf ? '/labels/additional changes revised.png' : '/labels/Revised.png';

  // Every label pair starts loading at the same time (no click needed); each pair
  // tracks its own progress and stays disabled until its own load completes.
  // This simulation only applies in bulk mode — single-pair mode renders immediately.
  const [pairLoadState, setPairLoadState] = useState<Record<number, { loading: boolean; progress: number }>>(() => (
    isTwoPairs
      ? { 1: { loading: true, progress: 0 }, 2: { loading: true, progress: 0 } }
      : { 1: { loading: false, progress: 100 }, 2: { loading: false, progress: 100 } }
  ))

  useEffect(() => {
    if (!isTwoPairs) return
    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []

    const runLoad = (idx: number, steps: number, stepDelay: number, startDelay: number) => {
      const step = (n: number) => {
        if (cancelled) return
        if (n > steps) {
          setPairLoadState(prev => ({ ...prev, [idx]: { loading: true, progress: 100 } }))
          timeouts.push(setTimeout(() => {
            if (cancelled) return
            setPairLoadState(prev => ({ ...prev, [idx]: { loading: false, progress: 100 } }))
          }, 200))
          return
        }
        setPairLoadState(prev => ({ ...prev, [idx]: { loading: true, progress: Math.round((n / steps) * 100) } }))
        timeouts.push(setTimeout(() => step(n + 1), stepDelay))
      }
      timeouts.push(setTimeout(() => step(1), startDelay))
    }

    // Second pair starts noticeably later than the first.
    runLoad(1, 20, 150, 0)
    runLoad(2, 20, 150, 1800)

    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [isTwoPairs])

  const activePairLoad = pairLoadState[activePairIdx] ?? { loading: false, progress: 100 }
  const labelsLoading = activePairLoad.loading

  const filteredFindings = activeFindingsList
    .filter(f => activeTab === 'all' || f.type === activeTab)
    .filter(f => activeStatus === 'all' || f.classification?.toLowerCase() === activeStatus)

  // Fit zoom function helper
  const calcFit = (el: HTMLDivElement | null) => {
    if (!el) return 100
    const w = 680
    const h = 900
    const availH = el.clientHeight - 48
    const availW = el.clientWidth - 48
    if (availH > 0 && availW > 0) {
      return Math.round(Math.max(5, Math.min(200, Math.min(availW / w, availH / h) * 100)))
    }
    return 100
  }

  // Calculate and set initial fit zoom on mount and window resize
  useEffect(() => {
    const updateZoom = () => {
      const el = masterRef.current
      if (el && el.clientHeight > 100) {
        const fit = calcFit(el)
        setMasterZoom(fit)
        setRevisedZoom(fit)
      }
    }
    
    updateZoom()
    const t = setTimeout(updateZoom, 200)
    
    window.addEventListener('resize', updateZoom)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', updateZoom)
    }
  }, [])

  // Recalculate fit zoom once both labels have finished loading
  // (the canvas isn't mounted, so clientHeight isn't available, until loading completes).
  useEffect(() => {
    if (labelsLoading) return
    const t = setTimeout(() => {
      const el = masterRef.current
      if (el) {
        const fit = calcFit(el)
        setMasterZoom(fit)
        setRevisedZoom(fit)
      }
    }, 50)
    return () => clearTimeout(t)
  }, [labelsLoading])

  // Sync scroll
  useEffect(() => {
    if (!syncScroll) return
    const m = masterRef.current
    const r = revisedRef.current
    if (!m || !r) return
    let lock = false
    const sync = (a: HTMLDivElement, b: HTMLDivElement) => () => {
      if (lock) return
      lock = true
      b.scrollTop = a.scrollTop
      b.scrollLeft = a.scrollLeft
      requestAnimationFrame(() => {
        lock = false
      })
    }
    const onM = sync(m, r)
    const onR = sync(r, m)
    m.addEventListener('scroll', onM)
    r.addEventListener('scroll', onR)
    return () => {
      m.removeEventListener('scroll', onM)
      r.removeEventListener('scroll', onR)
    }
  }, [syncScroll, masterZoom, revisedZoom, labelsLoading])

  // Ctrl+wheel Zoom effect
  useEffect(() => {
    const updater = (z: number, delta: number) =>
      Math.max(10, Math.min(200, z + (delta > 0 ? -10 : 10)))
    const handler = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      setMasterZoom((z) => updater(z, e.deltaY))
      setRevisedZoom((z) => updater(z, e.deltaY))
    }
    window.addEventListener('wheel', handler, { passive: false })
    return () => window.removeEventListener('wheel', handler)
  }, [])

  const handleFindingClick = (f: Finding) => {
    const isCollapsing = expandedId === f.id
    setExpandedId(isCollapsing ? null : f.id)
    if (isCollapsing) return

    // Scroll to center finding
    setTimeout(() => {
      [masterRef.current, revisedRef.current].forEach((el, idx) => {
        if (!el) return
        const bb = idx === 0 ? f.master : f.revised
        const scale = (idx === 0 ? masterZoom : revisedZoom) / 100
        const containerW = el.clientWidth
        const containerH = el.clientHeight
        const targetX = bb.x * scale + (bb.w * scale) / 2 - containerW / 2
        const targetY = bb.y * scale + (bb.h * scale) / 2 - containerH / 2
        el.scrollTo({
          left: Math.max(0, targetX),
          top: Math.max(0, targetY),
          behavior: 'smooth'
        })
      })
    }, 50)
  }

  const handleExport = () => {
    setExporting(true)
    const reportFile = bulkMode ? '/ProofX_Bulk_Report.pdf' : '/ProofX_Report.pdf'
    const fileName = bulkMode ? 'ProofX_Bulk_Report.pdf' : 'ProofX_Report.pdf'
    const a = document.createElement('a')
    a.href = reportFile
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => setExporting(false), 1500)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F9FA]">
      <style>{`
        @keyframes bbox-pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .bbox-pulse {
          animation: bbox-pulse 1.2s infinite ease-in-out;
        }
      `}</style>

      <NavBar
        showBack
        onBack={() => onNavigate(previousScreen || 'proofreader-dashboard')}
        title={`${activeMasterName} vs ${activeRevisedName}`}
        steps={lrfFlowActive ? [
          { label: 'Label Requirement Form', done: true },
          { label: 'Upload Labels', done: true },
          { label: 'Analysis', active: true },
        ] : [
          { label: 'Upload Labels', done: true },
          { label: 'Analysis', active: true },
        ]}
        showProfile
        onProfileClick={() => onNavigate('profile')}
        onLogout={() => onNavigate('login')}
        profileName={previousScreen && previousScreen.includes('admin') ? 'Admin' : 'Athmika'}
        profileInitials="A"
        rightNode={
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate(previousScreen && previousScreen.includes('admin') ? 'admin-dashboard' : 'proofreader-dashboard')}
              title="Go to Home"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded border border-white/30 text-white/80 hover:text-white hover:border-white/60 transition-colors cursor-pointer"
            >
              <Home className="h-3.5 w-3.5" />
              HOME
            </button>
          </div>
        }
      />

      {/* Main content grid - docked side-by-side with no gap/padding */}
      <div className="flex flex-1 overflow-hidden min-h-0 min-w-0">
        {/* Left LABEL PAIRS sidebar */}
        {isTwoPairs && (
          <aside className="w-[200px] border-r border-[#E0E0E0] bg-white flex flex-col flex-shrink-0">
            <div className="px-4 py-3 border-b border-[#E0E0E0] text-xs uppercase tracking-wide text-[#5F6368]">
              Label pairs
            </div>
            <div className="flex-1 overflow-y-auto">
              {[
                { idx: 1, master: 'Master.pdf', revised: 'Revised.pdf', count: newFindingsList.length },
                { idx: 2, master: 'additional changes master.pdf', revised: 'additional changes revised.pdf', count: findings.length },
              ].map(pair => {
                const isActive = activePairIdx === pair.idx
                const state = pairLoadState[pair.idx] ?? { loading: false, progress: 100 }
                const pairLoading = state.loading
                return (
                  <button
                    key={pair.idx}
                    onClick={() => { if (!pairLoading) setActivePairIdx(pair.idx) }}
                    disabled={pairLoading}
                    className={`w-full text-left px-4 py-3 border-b border-[#E0E0E0] flex flex-col gap-2 text-sm transition-colors ${
                      pairLoading ? 'opacity-50 cursor-not-allowed' : ''
                    } ${
                      isActive
                        ? 'bg-[#F1F3F4] border-l-2 border-l-[#1C2E59]'
                        : !pairLoading ? 'hover:bg-[#F1F3F4] border-l-2 border-l-transparent cursor-pointer' : 'border-l-2 border-l-transparent'
                    }`}
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="text-[#1A1A2E] truncate">
                        {pair.master}
                        <span className="block text-[11px] text-[#5F6368] truncate">
                          vs {pair.revised}
                        </span>
                      </span>
                      <span
                        className="ml-2 text-[11px] px-1.5 py-0.5 rounded-full text-white font-medium shrink-0"
                        style={{ backgroundColor: pair.count === 0 ? '#1D9E75' : '#1C2E59' }}
                      >
                        {pair.count}
                      </span>
                    </span>
                    {pairLoading && (
                      <span className="h-1 w-full bg-white rounded-full overflow-hidden border border-[#E0E0E0] block">
                        <span
                          className="h-full rounded-full bg-[#1C2E59] transition-[width] duration-150 ease-out block"
                          style={{ width: `${state.progress}%` }}
                        />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </aside>
        )}

        {/* Left label panel */}
        <LabelPanel
          title={activeMasterName}
          version="CURRENT VERSION LABEL"
          variant="master"
          findings={filteredFindings}
          selectedFinding={expandedId}
          zoom={masterZoom}
          scrollRef={masterRef}
          fileUrl={masterPdfPath}
          loading={labelsLoading}
          onReset={() => {
            const fit = calcFit(masterRef.current)
            setMasterZoom(fit)
            masterRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            if (syncScroll) {
              setRevisedZoom(fit)
              revisedRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            }
          }}
        />

        {/* Divider */}
        <div className="w-1 flex-shrink-0 self-stretch" style={{ backgroundColor: '#1C2E59' }} aria-hidden />

        {/* Right label panel */}
        <LabelPanel
          title={activeRevisedName}
          version="NEW VERSION LABEL"
          variant="revised"
          findings={filteredFindings}
          selectedFinding={expandedId}
          zoom={revisedZoom}
          scrollRef={revisedRef}
          fileUrl={revisedPdfPath}
          loading={labelsLoading}
          onReset={() => {
            const fit = calcFit(revisedRef.current)
            setRevisedZoom(fit)
            revisedRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            if (syncScroll) {
              setMasterZoom(fit)
              masterRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            }
          }}
        />

        {/* Findings sidebar */}
        <aside className="w-[400px] border-l border-[#E0E0E0] bg-white flex flex-col flex-shrink-0">
          {/* Header section with categories */}
          <div className="px-4 py-3 shrink-0 border-b border-[#E0E0E0] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1A1A2E] text-sm">Findings</span>
              <span className="text-xs text-[#5F6368]">
                <span className="text-[#1A1A2E] font-medium">{filteredFindings.length}</span>
                {(activeTab !== 'all' || activeStatus !== 'all') && (
                  <span className="text-[#5F6368]"> / {activeFindingsList.length}</span>
                )}{' '}
                {activeFindingsList.length === 1 ? 'difference' : 'differences'}
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <FilterPill
                label="All"
                active={activeTab === 'all'}
                color="#1C2E59"
                onClick={() => setActiveTab('all')}
              />
              <FilterPill
                label="Text"
                active={activeTab === 'text'}
                color="#378ADD"
                onClick={() => setActiveTab('text')}
              />
              <FilterPill
                label="Graphics"
                active={activeTab === 'graphics'}
                color="#DC2626"
                onClick={() => setActiveTab('graphics')}
              />
              <FilterPill
                label="Barcode"
                active={activeTab === 'barcode'}
                color="#BA7517"
                onClick={() => setActiveTab('barcode')}
              />
            </div>

            {/* LRF Status tabs */}
            {lrfFlowActive && (
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5 border-t border-[#E0E0E0]">
                <span className="text-[10px] uppercase tracking-wider text-[#5F6368] mr-0.5">Status</span>
                <FilterPill
                  label="All"
                  active={activeStatus === 'all'}
                  color="#1C2E59"
                  onClick={() => setActiveStatus('all')}
                />
                <FilterPill
                  label="✓ Expected"
                  active={activeStatus === 'expected'}
                  color="#1D9E75"
                  onClick={() => setActiveStatus('expected')}
                />
                <FilterPill
                  label="⚠ Unexpected"
                  active={activeStatus === 'unexpected'}
                  color="#D97706"
                  onClick={() => setActiveStatus('unexpected')}
                />
              </div>
            )}
          </div>

          {/* Scrollable continuous list */}
          <div className="flex-1 overflow-y-auto bg-white">
            {filteredFindings.length === 0 ? (
              <div className="px-5 py-4 text-xs text-[#5F6368] italic">
                No differences found matching filters.
              </div>
            ) : (() => {
              // Group by category
              const cats = [
                { id: 'text', label: 'Text', color: '#378ADD' },
                { id: 'graphics', label: 'Graphics', color: '#DC2626' },
                { id: 'barcode', label: 'Barcode', color: '#BA7517' }
              ] as const;

              return cats.map(cat => {
                if (activeTab !== 'all' && activeTab !== cat.id) return null;
                const items = filteredFindings.filter(f => f.type === cat.id);

                return (
                  <div key={cat.id}>
                    {/* Category Divider Header */}
                    <div className="px-5 py-2.5 bg-[#F1F3F4] border-y border-[#E0E0E0] flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs uppercase tracking-wide text-[#1A1A2E] font-medium">
                        {cat.label}
                      </span>
                      <span className="text-xs text-[#5F6368]">
                        · {items.length} {items.length === 1 ? "difference" : "differences"}
                      </span>
                    </div>

                    {items.length === 0 ? (
                      <div className="px-5 py-4 text-xs text-[#5F6368] italic">
                        No differences found
                      </div>
                    ) : items.map(f => {
                      const isSelected = expandedId === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => handleFindingClick(f)}
                          className={`w-full text-left px-5 py-3.5 border-b border-[#E0E0E0] transition-colors ${
                            isSelected ? "bg-[#F1F3F4]" : "hover:bg-[#F1F3F4]"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-white flex-shrink-0"
                              style={{ backgroundColor: cat.color }}
                            >
                              {f.id}
                            </span>
                            <span className="text-sm text-[#1A1A2E] flex-1 min-w-0">{f.summary}</span>
                            {lrfFlowActive && f.classification && (
                              <span
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-white flex-shrink-0"
                                style={{
                                  backgroundColor: f.classification === 'Expected' ? '#1D9E75' : '#D97706'
                                }}
                              >
                                {f.classification}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#5F6368] leading-relaxed pl-1">
                            <div>
                              <span className="text-[#1A1A2E]/70">Master had:</span> {f.masterHad}
                            </div>
                            <div>
                              <span className="text-[#1A1A2E]/70">Revised has:</span> {f.revisedHas}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              });
            })()}
          </div>
        </aside>
      </div>

      {/* Bottom bar */}
      <footer
        className="flex items-center justify-between px-6 py-2.5 bg-white border-t border-[#E0E0E0] text-xs text-[#5F6368] shrink-0"
      >
        <div className="flex items-center gap-2 font-normal text-[#5F6368]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1C2E59]" />
          <span>
            {labelsLoading
              ? 'Loading labels…'
              : isTwoPairs ? `Pair ${activePairIdx} of 2` : 'Analysis complete'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <span>Sync scroll & zoom</span>
            <button
              onClick={() => {
                setSyncScroll((s) => {
                  if (!s) setRevisedZoom(masterZoom);
                  return !s;
                });
              }}
              className={`relative inline-flex h-4 w-7 rounded-full transition-colors ${
                syncScroll ? "bg-[#F07922]" : "bg-[#F1F3F4] border border-[#E0E0E0]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white border border-[#E0E0E0] transition-transform ${
                  syncScroll ? "translate-x-3.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMasterZoom((z) => Math.max(10, z - 10))
                setRevisedZoom((z) => Math.max(10, z - 10))
              }}
              className="h-6 w-6 rounded border border-[#E0E0E0] hover:bg-[#F1F3F4] flex items-center justify-center font-semibold text-slate-700 cursor-pointer"
            >
              −
            </button>
            {syncScroll ? (
              <span className="w-10 text-center text-[#1A1A2E] font-medium">{masterZoom}%</span>
            ) : (
              <span className="flex items-center gap-1 text-[#1A1A2E] text-[11px] font-medium">
                <span className="text-[#E02424]">{masterZoom}%</span>
                <span className="text-slate-300">/</span>
                <span className="text-[#1A56DB]">{revisedZoom}%</span>
              </span>
            )}
            <button
              onClick={() => {
                setMasterZoom((z) => Math.min(200, z + 10))
                setRevisedZoom((z) => Math.min(200, z + 10))
              }}
              className="h-6 w-6 rounded border border-[#E0E0E0] hover:bg-[#F1F3F4] flex items-center justify-center font-semibold text-slate-700 cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-7 py-2.5 text-[13px] font-bold uppercase tracking-widest rounded-lg shadow-sm bg-[#F07922] hover:bg-[#D9660C] text-white transition-colors cursor-pointer"
          >
            {exporting ? 'GENERATING PDF…' : 'EXPORT REPORT'}
          </button>
        </div>
      </footer>
    </div>
  )
}
