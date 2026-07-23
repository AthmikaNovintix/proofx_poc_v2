import { useState, useCallback, useEffect, useRef } from "react";
import { Save, ArrowLeft, ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import LRFCategoryTabs from "@/components/LRFCategoryTabs";
import LRFAttributeGroup from "@/components/LRFAttributeGroup";
import LRFSummaryBar from "@/components/LRFSummaryBar";
import {
  LRF_CATEGORIES,
  LRF_ATTRIBUTE_LOOKUP,
  type LRFCategoryId,
  type LRFAttributeDef,
} from "@/data/lrfAttributes";
import type { LRFChangeData } from "@/types/lrf";
import { C } from "../colors";
import type { Screen } from "../App";

interface Props {
  onNavigate: (s: Screen) => void;
  onSaveLrf: (data: { crNumber: string; sku: string; productName: string; date: string; revFrom: string; revTo: string; requestedBy: string; count: number; list: any[] }) => void;
}

const DRAFT_KEY = "proofx_lrf_draft";

export default function ChangeRequestFormScreen({ onNavigate, onSaveLrf }: Props) {
  const [crNumber,      setCrNumber]      = useState("CR-2026-0041");
  const [partNumber,    setPartNumber]    = useState("");
  const [productName,   setProductName]   = useState("");
  const [labelVersion,  setLabelVersion]  = useState("Rev B → Rev C");
  const [requestedBy,   setRequestedBy]   = useState("Athmika");
  const [date,          setDate]          = useState("2026-07-22");

  // Label version split into two boxes (like LabelIQ)
  const parsedFrom = labelVersion.includes("→") ? labelVersion.split("→")[0].trim() : labelVersion;
  const parsedTo   = labelVersion.includes("→") ? labelVersion.split("→")[1]?.trim() ?? "" : "";
  const [labelFrom, setLabelFrom] = useState("Rev B");
  const [labelTo,   setLabelTo]   = useState("Rev C");

  // Sync the two boxes → combined labelVersion
  useEffect(() => {
    setLabelVersion(labelFrom || labelTo ? `${labelFrom} → ${labelTo}` : "");
  }, [labelFrom, labelTo]);

  const [activeCategory,    setActiveCategory]    = useState<LRFCategoryId | null>("text");
  const [showDraftBanner,   setShowDraftBanner]   = useState(false);

  // Prefilled change request list
  const [changeList, setChangeList] = useState<any[]>([
    {
      id: 'txt_1',
      category: 'TEXT',
      name: 'Manufacture Address',
      changeType: 'Modify',
      fromValue: 'Medos International SARL Chemin-Blanc38 2400LeLocle,Switzerland',
      toValue: '1302 Wrights Lane East, West Chester,PA19380, USA(Craniomaxillofacial)'
    },
    {
      id: 'txt_2',
      category: 'TEXT',
      name: 'EC Rep Name',
      changeType: 'Modify',
      fromValue: 'EC',
      toValue: 'EU'
    },
    {
      id: 'txt_3',
      category: 'TEXT',
      name: 'eIFU URL',
      changeType: 'Modify',
      fromValue: 'www.e-ifu.com/symbols-glossary',
      toValue: 'www.e-depuysynthes-ifu.com/symbols-glossary'
    },
    {
      id: 'gfx_1',
      category: 'GRAPHICS',
      name: 'Company logo',
      changeType: 'Modify',
      fromValue: '',
      toValue: ''
    }
  ]);

  const attributePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem(DRAFT_KEY)) setShowDraftBanner(true);
  }, []);

  const restoreDraft = () => {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      if (draft.metadata) {
        setCrNumber(draft.metadata.crNumber ?? "");
        setPartNumber(draft.metadata.partNumber ?? "");
        setProductName(draft.metadata.productName ?? "");
        setRequestedBy(draft.metadata.requestedBy ?? "");
        setDate(draft.metadata.date ?? "");
        const from = draft.metadata.labelVersion?.split("→")[0]?.trim() ?? "";
        const to   = draft.metadata.labelVersion?.split("→")[1]?.trim() ?? "";
        setLabelFrom(from); setLabelTo(to);
      }
      if (draft.changeList) {
        setChangeList(draft.changeList);
      }
    } catch {}
    setShowDraftBanner(false);
  };

  const saveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      metadata: { crNumber, partNumber, labelVersion, productName, requestedBy, date },
      changeList
    }));
  };

  const changeCounts: Record<LRFCategoryId, number> = {
    text:     changeList.filter(c => c.category === 'TEXT').length,
    graphics: changeList.filter(c => c.category === 'GRAPHICS').length,
    barcode:  changeList.filter(c => c.category === 'BARCODE').length,
  };
  const totalChanges = Object.values(changeCounts).reduce((a, b) => a + b, 0);

  const handleCategorySelect = (cat: LRFCategoryId) => {
    const next = cat === activeCategory ? null : cat;
    setActiveCategory(next);
    if (next) {
      setTimeout(() => {
        attributePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handleNext = () => {
    const list = changeList.map(c => ({
      name: c.name || 'Custom Attribute',
      category: c.category,
      changeType: c.changeType.toUpperCase(),
      fromValue: c.changeType === 'Add' ? '' : c.fromValue,
      toValue: c.changeType === 'Delete' ? '' : c.toValue,
    }));

    onSaveLrf({
      crNumber: crNumber || 'CR-2026-0041',
      sku: partNumber || '2440-00-511',
      productName: productName || 'QUICKSET STD Tissue Protector',
      date,
      revFrom: labelFrom || 'Rev B',
      revTo: labelTo || 'Rev C',
      requestedBy: requestedBy || 'Athmika',
      count: list.length || 4,
      list: list
    });
    onNavigate('upload-lrf');
  };

  const activeCat = activeCategory ? LRF_CATEGORIES[activeCategory] : null;

  const renderCategoryChanges = (catId: LRFCategoryId) => {
    const categoryUpper = catId.toUpperCase();
    const items = changeList.filter(item => item.category === categoryUpper);

    return (
      <div ref={attributePanelRef} className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 shadow-sm p-6 space-y-4 border-t-2 border-[#1C2E59]">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Change Request</span>
              <button
                onClick={() => {
                  setChangeList(prev => prev.filter(c => c.id !== item.id));
                }}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                Delete
              </button>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Attribute name (optional)
              </label>
              <input
                value={item.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setChangeList(prev => prev.map(c => c.id === item.id ? { ...c, name: val } : c));
                }}
                placeholder="e.g. Product identification"
                className="h-10 w-full border border-gray-300 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C2E59]/25 rounded-md"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Change type
                </label>
                <select
                  value={item.changeType}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setChangeList(prev => prev.map(c => c.id === item.id ? { ...c, changeType: val } : c));
                  }}
                  className="h-10 w-full border border-gray-300 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C2E59]/25 rounded-md"
                >
                  <option value="Add">Add</option>
                  <option value="Delete">Delete</option>
                  <option value="Modify">Modify</option>
                </select>
              </div>

              {item.changeType === "Modify" ? (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Old Value
                    </label>
                    <input
                      value={item.fromValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setChangeList(prev => prev.map(c => c.id === item.id ? { ...c, fromValue: val } : c));
                      }}
                      placeholder="Old value"
                      className="h-10 w-full border border-gray-300 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C2E59]/25 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      New Value
                    </label>
                    <input
                      value={item.toValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setChangeList(prev => prev.map(c => c.id === item.id ? { ...c, toValue: val } : c));
                      }}
                      placeholder="New value"
                      className="h-10 w-full border border-gray-300 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C2E59]/25 rounded-md"
                    />
                  </div>
                </>
              ) : item.changeType === "Add" ? (
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    New Value
                  </label>
                  <input
                    value={item.toValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      setChangeList(prev => prev.map(c => c.id === item.id ? { ...c, toValue: val } : c));
                    }}
                    placeholder="New value"
                    className="h-10 w-full border border-gray-300 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C2E59]/25 rounded-md"
                  />
                </div>
              ) : (
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Old Value
                  </label>
                  <input
                    value={item.fromValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      setChangeList(prev => prev.map(c => c.id === item.id ? { ...c, fromValue: val } : c));
                    }}
                    placeholder="Old value"
                    className="h-10 w-full border border-gray-300 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C2E59]/25 rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => {
            const newId = `custom_${catId}_${Date.now()}`;
            setChangeList(prev => [
              ...prev,
              {
                id: newId,
                category: categoryUpper as any,
                name: '',
                changeType: 'Modify',
                fromValue: '',
                toValue: ''
              }
            ]);
          }}
          className="w-full py-3 border border-dashed border-gray-300 hover:border-gray-400 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white flex items-center justify-center gap-2 cursor-pointer rounded-lg transition-colors"
        >
          + Add Parameter Change
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col animate-fade-in" style={{ height: "100vh", overflow: "hidden", backgroundColor: C.bg }}>
      {/* Navbar */}
      <NavBar
        showBack
        onBack={() => onNavigate('proofreader-dashboard')}
        title="Label Requirement Form"
        steps={[
          { label: 'Label Requirement Form', active: true },
          { label: 'Upload Labels' },
          { label: 'Analysis' },
        ]}
        showProfile
        onProfileClick={() => onNavigate('profile')}
        onLogout={() => onNavigate('login')}
        profileName="Athmika"
        profileInitials="A"
      />

      {/* Draft banner */}
      {showDraftBanner && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5 flex items-center justify-between shrink-0">
          <span className="text-sm text-blue-800 font-medium">
            A saved draft was found. Would you like to restore it?
          </span>
          <div className="flex gap-2">
            <button onClick={restoreDraft} className="rounded bg-[#1C2E59] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer">
              Restore Draft
            </button>
            <button onClick={() => setShowDraftBanner(false)} className="rounded border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8 space-y-5">

          {/* Metadata Card */}
          <div className="bg-white border border-gray-200 shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50/50">
              <div>
                <h1 className="text-base font-bold text-gray-900 uppercase tracking-wider">
                  Label Requirement Form
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Define required changes to be validated against comparator output
                </p>
              </div>
              {totalChanges > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1C2E59]/10 border border-[#1C2E59]/20 px-3 py-1 text-xs font-bold text-[#1C2E59] uppercase tracking-wider">
                  {totalChanges} change{totalChanges !== 1 ? "s" : ""} defined
                </span>
              )}
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Document Metadata</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                {/* CR Number */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">CR</label>
                  <input
                    value={crNumber} onChange={(e) => setCrNumber(e.target.value)}
                    placeholder="e.g. CR-2026-0041"
                    className="h-9 w-full border border-gray-300 hover:border-gray-400 px-3 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C2E59]/25"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Date</label>
                  <input
                    type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    className="h-9 w-full border border-gray-300 hover:border-gray-400 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C2E59]/25"
                  />
                </div>

                {/* Label Revision */}
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Label Revision
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      value={labelFrom} onChange={(e) => setLabelFrom(e.target.value)}
                      placeholder="Current rev. e.g. Rev B"
                      className="h-9 flex-1 border border-gray-300 hover:border-gray-400 px-3 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C2E59]/25"
                    />
                    <div className="flex items-center justify-center w-10 h-9 bg-gray-50 border border-gray-200 shrink-0">
                      <span className="text-[#1C2E59] font-bold">→</span>
                    </div>
                    <input
                      value={labelTo} onChange={(e) => setLabelTo(e.target.value)}
                      placeholder="New rev. e.g. Rev C"
                      className="h-9 flex-1 border border-gray-300 hover:border-gray-400 px-3 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C2E59]/25"
                    />
                  </div>
                </div>

                {/* Requested By */}
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Requested By
                  </label>
                  <input
                    value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)}
                    placeholder="Name or department"
                    className="h-9 w-full border border-gray-300 hover:border-gray-400 px-3 text-sm text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1C2E59]/25"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category Selection — sticky tabs */}
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden sticky top-0 z-30">
            <LRFCategoryTabs
              activeCategory={activeCategory}
              changeCounts={changeCounts}
              onSelect={handleCategorySelect}
            />
            {activeCat && activeCategory && (
              <div className="bg-gray-50 flex items-center justify-between px-5 py-2.5 border-t border-gray-200">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  {activeCat.label} Attributes
                </span>
                <span className="text-xs text-gray-400">
                  Select an attribute to define its expected change
                </span>
              </div>
            )}
          </div>

          {/* Attribute Groups */}
          {activeCat && activeCategory && (
            renderCategoryChanges(activeCategory)
          )}

          <LRFSummaryBar counts={changeCounts} />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-[#e2e8f0] bg-white px-8 py-2.5 flex items-center justify-between gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => onNavigate('proofreader-dashboard')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Skip for now
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={saveDraft}
            className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors uppercase tracking-wider rounded-lg shadow-sm cursor-pointer"
          >
            <Save size={14} />
            Save Draft
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-[#1C2E59] px-8 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity uppercase tracking-wider rounded-lg shadow-md cursor-pointer"
          >
            Next: Upload Labels
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
