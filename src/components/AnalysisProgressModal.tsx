import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, Loader2, Scan } from "lucide-react";

const STEPS = [
  "Rendering files",
  "Calibrating resolution",
  "Aligning pages",
  "Detecting changes",
  "Classifying findings",
  "Compiling report",
];

const STEP_DURATION_MS = 1400; // slightly faster cosmetic pacing for smooth prototyping

interface Props {
  isOpen: boolean;
  sessionLabel: string;
  uploadComplete?: boolean;
  apiDone?: boolean;
  onComplete?: () => void;
}

export default function AnalysisProgressModal({
  isOpen,
  sessionLabel,
  uploadComplete = true,
  apiDone = true,
  onComplete,
}: Props) {
  // -1 = uploading; 0 to STEPS.length-1 = active steps; STEPS.length = all done
  const [activeStep, setActiveStep] = useState(-1);
  const activeStepRef = useRef(-1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setActiveStep(-1);
      activeStepRef.current = -1;
      return;
    }

    if (!uploadComplete) {
      setActiveStep(-1);
      activeStepRef.current = -1;
      return;
    }

    // Start steps animation
    setActiveStep(0);
    activeStepRef.current = 0;

    timerRef.current = setInterval(() => {
      const next = activeStepRef.current + 1;
      activeStepRef.current = next;
      setActiveStep(Math.min(next, STEPS.length));

      if (next >= STEPS.length) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
      }
    }, STEP_DURATION_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, uploadComplete]);

  // Completion gate
  useEffect(() => {
    if (!isOpen) return;
    if (apiDone && activeStep >= STEPS.length) {
      const timeout = setTimeout(() => {
        onComplete?.();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [apiDone, activeStep, isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[120] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-7 w-[480px] flex flex-col gap-5">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scan className="h-4 w-4 text-[#F07922] animate-spin" style={{ animationDuration: "2.2s" }} />
            <span className="text-xs font-bold tracking-tight uppercase text-[#F07922]">ProofX</span>
          </div>
          <div className="text-lg font-semibold text-[#1A1A2E]">
            Pre-processing
          </div>
          {sessionLabel && (
            <div className="text-xs text-[#5F6368] mt-0.5 truncate">
              {sessionLabel}
            </div>
          )}
        </div>

        {/* Step checklist */}
        <div className="flex flex-col gap-3">
          {/* Upload step */}
          <div className="flex items-center gap-3">
            {!uploadComplete ? (
              <Loader2 className="h-4 w-4 text-[#F07922] animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
            )}
            <span className={`text-sm ${!uploadComplete ? "text-[#F07922] font-semibold" : "text-[#1A1A2E] font-medium"}`}>
              Uploading files
            </span>
          </div>

          {/* Pre-process / Analysis steps */}
          {STEPS.map((step, si) => {
            const isDone = si < activeStep;
            const isActive = si === activeStep;
            return (
              <div key={si} className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 text-[#F07922] animate-spin shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-200 shrink-0" />
                )}
                <span className={`text-sm ${
                  isDone ? "text-[#1A1A2E] font-medium"
                  : isActive ? "text-[#F07922] font-semibold"
                  : "text-slate-400"
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400 mt-1">
          Deterministic · No ML · Audit-ready
        </div>

      </div>
    </div>
  );
}
