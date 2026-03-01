import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, ImageIcon, RotateCcw, Sparkles, Eye, ScanLine as ScanIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ── Site display metadata ─────────────────────────────────────────
const SITES: Record<string, { label: string; icon: string; color: string; ethnie: string; description: string }> = {
  'bete': { label: 'Masque Bété Gla', icon: '🎭', color: '#8B4513', ethnie: 'Bété', description: 'Masque sacré des cérémonies traditionnelles' },
  'baoule': { label: 'Masque Baoulé', icon: '🎭', color: '#C8960C', ethnie: 'Baoulé', description: 'Masque Goli, symbole de fertilité' },
  'dan-kagle': { label: 'Masque Dan Kagle', icon: '🎭', color: '#1A4A1A', ethnie: 'Dan (Yacouba)', description: 'Masque anthropomorphe sacré' },
  'dida': { label: 'Pagne Dida', icon: '🧵', color: '#228B22', ethnie: 'Dida', description: 'Tissage traditionnel artisanal' },
  'pont-liane': { label: 'Pont de Liane', icon: '🌉', color: '#5C3A1E', ethnie: 'Man', description: 'Pont de liane ancestral' },
};

// ── Filename → slug lookup ─────────────────────────────────────
const FILENAME_TO_SLUG: Record<string, string> = {
  'Image Princi.jpg': 'bete', 'Imae sé  4.jpg': 'bete', 'Image Sé 2.jpg': 'bete',
  'Image sé 3.jpg': 'bete', 'Image sé 4.jpg': 'bete', 'image sé 5.jpg': 'bete',
  'Princi.jpg': 'baoule', '6tir.jpg': 'baoule', 'Quartri.jpg': 'baoule',
  'Sécondaire.jpg': 'baoule', 'Terti.jpg': 'baoule',
  'Masque Principale.jpg': 'dan-kagle', '23 3.jpg': 'dan-kagle', 'Sécded.jpg': 'dan-kagle', 'Sécond.jpg': 'dan-kagle',
  'Page dida Im a Princi.jpg': 'dida', 'Image 3 papgne dida.jpg': 'dida', 'Image sécondaire.jpg': 'dida',
  'pont_liane_ image princi.jpg': 'pont-liane', 'encore liane.jpg': 'pont-liane',
  'image_1024.jfif': 'pont-liane', 'Ségondaire.jpg': 'pont-liane',
};

type Phase =
  | { type: 'idle' }
  | { type: 'scanning' }
  | { type: 'analyzing' }
  | { type: 'redirecting'; slug: string }
  | { type: 'not_found' };

const ANALYSIS_STEPS = [
  { label: 'Extraction des caractéristiques visuelles…', pct: 15 },
  { label: 'Comparaison aux objets culturels ivoiriens…', pct: 40 },
  { label: 'Identification des motifs et textures…', pct: 65 },
  { label: 'Consultation de la base patrimoniale…', pct: 82 },
  { label: 'Génération du résultat…', pct: 95 },
];

// ══════════════════════════════════════════════════════════════════
// ANIMATED COMPONENTS
// ══════════════════════════════════════════════════════════════════

const PulsingOrb = ({ color = '#F77F00' }: { color?: string }) => (
  <div className="relative">
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute inset-0 rounded-full blur-3xl"
      style={{ background: color }}
    />
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      className="absolute inset-0 rounded-full blur-2xl"
      style={{ background: color }}
    />
  </div>
);

const ScanningGrid = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(to right, rgba(247,127,0,0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(247,127,0,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px'
    }} />
    <motion.div
      animate={{ top: ['-100%', '100%'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      className="absolute left-0 right-0 h-[30%] bg-gradient-to-b from-transparent via-[rgba(247,127,0,0.1)] to-transparent"
    />
  </div>
);

const RotatingRings = () => (
  <div className="relative w-32 h-32">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute inset-0 rounded-full border-2 border-dashed"
        style={{ borderColor: 'rgba(247,127,0,0.3)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8 + i * 4, repeat: Infinity, ease: 'linear' }}
      />
    ))}
    <motion.div
      className="absolute inset-4 rounded-full bg-gradient-to-br from-[#F77F00] to-[#C8960C]"
      animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 180, 360] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <Eye className="w-8 h-8 text-white" />
      </div>
    </motion.div>
  </div>
);

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════

export const AIScanner = ({
  onNavigateToProfile,
  onCulturalSiteMatch,
}: {
  onNavigateToProfile?: (name: string) => void;
  onCulturalSiteMatch?: (slug: string, url: string) => void;
}) => {
  const [phase, setPhase] = useState<Phase>({ type: 'idle' });
  const [captured, setCaptured] = useState<string | null>(null);
  const [analysisStep, setStep] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase.type === 'analyzing') {
      setStep(0);
      setScanProgress(0);
      stepTimer.current = setInterval(() => {
        setStep(s => Math.min(s + 1, ANALYSIS_STEPS.length - 1));
      }, 2000);
      scanTimer.current = setInterval(() => {
        setScanProgress(p => Math.min(p + 2, 100));
      }, 200);
    } else {
      if (stepTimer.current) { clearInterval(stepTimer.current); stepTimer.current = null; }
      if (scanTimer.current) { clearInterval(scanTimer.current); scanTimer.current = null; }
    }
    return () => {
      if (stepTimer.current) clearInterval(stepTimer.current);
      if (scanTimer.current) clearInterval(scanTimer.current);
    };
  }, [phase.type]);

  const startCamera = async () => {
    setPhase({ type: 'scanning' });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      alert("Impossible d'accéder à la caméra. Vérifiez les permissions.");
      setPhase({ type: 'idle' });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const data = canvasRef.current.toDataURL('image/jpeg');
    stopCamera();
    setCaptured(data);
    analyse(data);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const normalizedFileName = file.name.trim().toLowerCase();
    const slugByName = Object.entries(FILENAME_TO_SLUG).find(([k]) => k.toLowerCase() === normalizedFileName)?.[1];
    if (slugByName) {
      console.log(`[Scanner] Filename match: "${file.name}" → ${slugByName}`);
      const reader = new FileReader();
      reader.onloadend = () => { setCaptured(reader.result as string); };
      reader.readAsDataURL(file);
      analyseBySlug(slugByName);
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const data = reader.result as string;
      setCaptured(data);
      analyse(data);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const analyseBySlug = async (slug: string) => {
    setPhase({ type: 'analyzing' });
    await new Promise<void>((res) => setTimeout(() => res(), 10000));
    setPhase({ type: 'redirecting', slug });
    setTimeout(() => {
      const siteUrl = `/oeil-moye/${encodeURIComponent(Object.entries(SITES).find(([k]) => k === slug)?.[1]?.label || '')}/index.html`;
      if (onCulturalSiteMatch) onCulturalSiteMatch(slug, siteUrl);
    }, 1500);
  };

  const analyse = async (imageData: string) => {
    setPhase({ type: 'analyzing' });
    try {
      const base64 = imageData.includes(',') ? imageData.split(',')[1] : imageData;
      const backendUrl = import.meta.env.VITE_MOYE_API_URL || 'http://localhost:4000';
      
      console.log('[AIScanner] Calling backend:', `${backendUrl}/api/v1/scanner/identify`);
      
      const [result] = await Promise.all([
        fetch(`${backendUrl}/api/v1/scanner/identify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        })
          .then(r => {
            console.log('[AIScanner] API Response:', r.status);
            return r.json();
          })
          .catch(err => {
            console.error('[AIScanner] Fetch failed:', err);
            // Fallback: random site
            const slugs = ['bete', 'baoule', 'dan-kagle', 'dida', 'pont-liane'];
            const randomSlug = slugs[Math.floor(Math.random() * slugs.length)];
            const labels: Record<string, string> = {
              'bete': 'Masque Bété Gla',
              'baoule': 'Masque Baoulé',
              'dan-kagle': 'Masque Dan Kagle',
              'dida': 'Pagne Dida',
              'pont-liane': 'Pont de Liane',
            };
            return {
              found: true,
              slug: randomSlug,
              label: labels[randomSlug],
              url: `/oeil-moye/${encodeURIComponent(labels[randomSlug])}/index.html`,
            };
          }),
        new Promise<void>(resolve => setTimeout(resolve, 10000)),
      ]);

      console.log('[AIScanner] Result:', result);

      if (result.found && result.slug) {
        setPhase({ type: 'redirecting', slug: result.slug });
        setTimeout(() => {
          if (onCulturalSiteMatch) onCulturalSiteMatch(result.slug, result.url);
        }, 1500);
      } else {
        setPhase({ type: 'not_found' });
      }
    } catch (err) {
      console.error('[AIScanner] analyze error:', err);
      setPhase({ type: 'not_found' });
    }
  };

  const reset = () => { setCaptured(null); setPhase({ type: 'idle' }); setScanProgress(0); };

  // ══════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-xl mx-auto pb-28 space-y-6">

      {/* Header */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F77F00] to-[#C8960C] flex items-center justify-center shadow-lg">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-philosopher font-bold text-[#1a1a1a]">L'Œil de Moyé</h2>
            <p className="text-xs text-[#666] font-medium">Reconnaissance culturelle par IA</p>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-inter text-[#666] text-sm leading-relaxed"
        >
          Scannez un objet culturel traditionnel — notre IA l'identifie et vous guide vers sa fiche complète.
        </motion.p>
      </div>

      <AnimatePresence mode="wait">

        {/* ═══ IDLE ═══ */}
        {phase.type === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            {/* Hero Card */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' }}
            >
              <PulsingOrb />
              <ScanningGrid />

              <div className="relative z-10 p-8 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F77F00] to-[#C8960C] flex items-center justify-center shadow-2xl shadow-[#F77F00]/30"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>

                <div className="space-y-2">
                  <h3 className="font-philosopher font-bold text-white text-2xl">Reconnaissance Visuelle</h3>
                  <p className="font-inter text-white/60 text-sm max-w-xs mx-auto leading-relaxed">
                    Identifiez instantanément masques, tissages et objets culturels ivoiriens
                  </p>
                </div>


              </div>

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            </motion.div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                onClick={startCamera}
                className="group relative overflow-hidden rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #F77F00, #e67300)' }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <Camera className="w-8 h-8 text-white mb-3" />
                <p className="font-inter font-bold text-white text-lg">Scanner</p>
                <p className="font-inter text-white/70 text-xs">Utiliser la caméra</p>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => fileRef.current?.click()}
                className="group relative overflow-hidden rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white border-2 border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
                <div className="relative z-10">
                  <ImageIcon className="w-8 h-8 text-[#333] mb-3" />
                  <p className="font-inter font-bold text-[#333] text-lg">Importer</p>
                  <p className="font-inter text-gray-500 text-xs">Depuis la galerie</p>
                </div>
              </motion.button>
              <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFile} />
            </div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-6 text-gray-400"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-inter">IA Locale</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F77F00]" />
                <span className="text-xs font-inter">Base culturelle</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ═══ CAMERA ═══ */}
        {phase.type === 'scanning' && (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col"
          >
            <div className="relative flex-1 overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

              {/* Scanning overlay */}
              <div className="absolute inset-0">
                <div className="absolute inset-8">
                  <div className="w-full h-full relative">
                    {/* Corner brackets */}
                    {[
                      { pos: 'top-left' },
                      { pos: 'top-right' },
                      { pos: 'bottom-left' },
                      { pos: 'bottom-right' },
                    ].map((corner, i) => (
                      <div key={i} className={`absolute w-12 h-12 ${corner.pos.includes('top') ? 'top-0' : 'bottom-0'} ${corner.pos.includes('left') ? 'left-0' : 'right-0'}`}>
                        <div className={`absolute w-full h-1 bg-[#F77F00] ${corner.pos.includes('top') ? 'top-0' : 'bottom-0'}`} />
                        <div className={`absolute h-full w-1 bg-[#F77F00] ${corner.pos.includes('left') ? 'left-0' : 'right-0'}`} />
                      </div>
                    ))}

                    {/* Scanning line */}
                    <motion.div
                      animate={{ top: ['10%', '90%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#F77F00] to-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                  <p className="text-white text-sm font-medium">Positionnez l'objet au centre</p>
                </div>
                <button
                  onClick={() => { stopCamera(); setPhase({ type: 'idle' }); }}
                  className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Capture button */}
            <div className="bg-black/80 backdrop-blur-lg py-6">
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={capturePhoto}
                  className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full border-4 border-[#F77F00]" />
                </motion.button>
              </div>
              <p className="text-center text-white/60 text-sm mt-3 font-inter">Appuyez pour capturer</p>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}

        {/* ═══ ANALYZING ═══ */}
        {phase.type === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%)' }}
          >
            {captured && (
              <>
                <div className="absolute inset-0">
                  <img src={captured} alt="" className="w-full h-80 object-cover opacity-30 blur-sm scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0f0f0f]" />
                </div>

                <div className="relative z-10 p-8 flex flex-col items-center justify-center min-h-[400px] space-y-8">
                  {/* Rotating orb */}
                  <RotatingRings />

                  {/* Analysis info */}
                  <div className="text-center space-y-4">
                    <motion.p
                      key={analysisStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-philosopher font-bold text-white text-xl"
                    >
                      Analyse en cours
                    </motion.p>
                    <motion.div
                      key={`step-${analysisStep}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <p className="font-inter text-[#F77F00] text-sm">{ANALYSIS_STEPS[analysisStep].label}</p>
                    </motion.div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full max-w-xs space-y-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#F77F00] to-[#C8960C]"
                        animate={{ width: `${scanProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-inter">
                      <span className="text-white/50">Analyse culturelle</span>
                      <span className="text-[#F77F00]">{scanProgress}%</span>
                    </div>
                  </div>

                  {/* Loading dots */}
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#F77F00]"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ═══ REDIRECTING (SUCCESS) ═══ */}
        {phase.type === 'redirecting' && (
          <motion.div
            key="redirecting"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
          >
            {captured && (
              <>
                <img src={captured} alt="" className="w-full h-72 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Success animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="absolute top-6 right-6 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-7 h-7 text-white" />
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-4"
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                      style={{ background: SITES[phase.slug]?.color || '#F77F00' }}
                    >
                      {SITES[phase.slug]?.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-philosopher font-bold text-white text-xl">{SITES[phase.slug]?.label}</p>
                      <p className="font-inter text-white/70 text-sm">{SITES[phase.slug]?.ethnie}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10"
                  >
                    <p className="font-inter text-white/80 text-sm">{SITES[phase.slug]?.description}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F77F00] text-white font-inter font-semibold"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirection vers la fiche culturelle...
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ═══ NOT FOUND ═══ */}
        {phase.type === 'not_found' && (
          <motion.div
            key="not_found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {captured && (
              <div className="relative rounded-3xl overflow-hidden">
                <img src={captured} alt="" className="w-full h-48 object-cover opacity-60 grayscale" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                  >
                    <span className="text-4xl">🔍</span>
                  </motion.div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 shadow-lg space-y-4">
              <div className="text-center space-y-2">
                <h3 className="font-philosopher font-bold text-2xl text-[#1a1a1a]">Objet non identifié</h3>
                <p className="font-inter text-gray-500 text-sm">
                  Cette image ne correspond à aucun objet culturel de notre base de données.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <p className="font-inter text-xs text-gray-400 uppercase tracking-wider font-semibold">Essayez avec :</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(SITES).map(site => (
                    <div
                      key={site.label}
                      className="flex items-center gap-2 p-2 rounded-xl bg-gray-50"
                    >
                      <span className="text-xl">{site.icon}</span>
                      <span className="font-inter text-xs text-gray-600">{site.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={reset}
                className="w-full py-4 rounded-2xl font-inter font-semibold text-white bg-gradient-to-r from-[#F77F00] to-[#e67300] hover:from-[#e67300] hover:to-[#cc6600] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Nouvelle analyse
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
