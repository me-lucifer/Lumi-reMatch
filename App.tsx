import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  ArrowRight, 
  Star, 
  MapPin, 
  ChevronLeft, 
  Check, 
  Calendar,
  Sparkles,
  Heart,
  Plus,
  X,
  Palette
} from 'lucide-react';
import { MOCK_PHOTOGRAPHERS, INITIAL_ANALYSIS_STEPS } from './constants';
import { Photographer, MatchResult, AppView, AnalysisState, MoodboardAnalysis } from './types';
import { fileToGenerativePart, findMatchingPhotographers } from './services/geminiService';

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  icon: Icon
}: { 
  children?: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; 
  className?: string;
  disabled?: boolean;
  icon?: React.ElementType;
}) => {
  const baseStyle = "px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-900/10",
    secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
    outline: "border-2 border-stone-200 text-stone-900 hover:border-stone-900",
    ghost: "text-stone-500 hover:text-stone-900"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Chip: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs uppercase tracking-wider font-semibold rounded-full">
    {label}
  </span>
);

const NavBar = ({ onBack, title, showBack = false }: { onBack?: () => void, title?: string, showBack?: boolean }) => (
  <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-stone-100 z-50 flex items-center justify-between px-4 sm:px-6 shadow-sm transition-all duration-300">
    <div className="flex items-center gap-2">
      {showBack && (
        <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors -ml-2">
          <ChevronLeft className="w-6 h-6 text-stone-700" />
        </button>
      )}
      <span className="font-serif text-xl font-bold text-stone-900 tracking-tight">
        {title || 'Lumière'}
      </span>
    </div>
    <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden ring-2 ring-stone-100">
      <img src="https://picsum.photos/seed/user/100/100" alt="User" />
    </div>
  </nav>
);

// --- Main Views ---

const LandingView = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="min-h-screen pt-16 pb-20 flex flex-col bg-stone-50">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto w-full">
        <div className="mb-8 relative group">
          <div className="absolute -inset-6 bg-rose-200 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>
          <Sparkles className="w-12 h-12 text-rose-500 relative z-10 animate-pulse" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-6 leading-tight">
          Curate your wedding <br/><span className="italic text-rose-500">aesthetic</span>.
        </h1>
        
        <p className="text-stone-500 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
          Upload your inspiration board. Our AI analyzes your color palette, venue, and vibe to find your perfect photographer match.
        </p>

        <Button onClick={onStart} icon={Camera} className="w-full sm:w-auto text-lg px-10 py-4 bg-stone-900 hover:scale-105 transition-transform">
          Start Matching
        </Button>

        <div className="mt-20 relative w-full h-48 max-w-md mx-auto">
           <img src="https://picsum.photos/seed/wed1/300/400" className="absolute left-0 top-0 w-32 h-40 object-cover rounded-lg rotate-[-12deg] shadow-xl border-4 border-white transform hover:scale-110 transition-transform duration-500 origin-bottom-left" alt="Insp" />
           <img src="https://picsum.photos/seed/wed2/300/400" className="absolute left-1/2 top-[-20px] -translate-x-1/2 w-36 h-48 object-cover rounded-lg z-10 shadow-2xl border-4 border-white transform hover:scale-110 transition-transform duration-500" alt="Insp" />
           <img src="https://picsum.photos/seed/wed3/300/400" className="absolute right-0 top-0 w-32 h-40 object-cover rounded-lg rotate-[12deg] shadow-xl border-4 border-white transform hover:scale-110 transition-transform duration-500 origin-bottom-right" alt="Insp" />
        </div>
      </div>
    </div>
  );
};

const UploadView = ({ onAnalyze }: { onAnalyze: (files: File[]) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Create previews
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
    
    // Cleanup
    return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
  }, [selectedFiles]);

  const handleFiles = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).slice(0, 5); // Limit to 5
      setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen pt-24 px-6 flex flex-col items-center max-w-lg mx-auto pb-24">
      <h2 className="text-3xl font-serif text-center mb-2">Build Your Moodboard</h2>
      <p className="text-stone-500 text-center mb-8">
        Add up to 5 photos that capture your dream look.
      </p>

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-2 gap-3 w-full mb-6">
        {previews.map((src, idx) => (
          <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden group shadow-md">
            <img src={src} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={() => removeFile(idx)}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {selectedFiles.length < 5 && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/4] rounded-xl border-2 border-dashed border-stone-300 hover:border-stone-900 hover:bg-stone-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-stone-600"
          >
            <Plus size={32} />
            <span className="text-xs font-medium uppercase tracking-wide">Add Photo</span>
          </div>
        )}
      </div>

      <input 
        ref={fileInputRef}
        type="file" 
        multiple
        className="hidden" 
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {selectedFiles.length > 0 && (
        <div className="fixed bottom-6 left-6 right-6 max-w-lg mx-auto">
          <Button 
            onClick={() => onAnalyze(selectedFiles)} 
            className="w-full text-lg shadow-xl shadow-rose-900/10"
          >
            Analyze Moodboard ({selectedFiles.length})
          </Button>
        </div>
      )}
    </div>
  );
};

const AnalysisLoader = ({ analysisState, coverImage }: { analysisState: AnalysisState, coverImage: string }) => {
  return (
    <div className="min-h-screen pt-16 flex flex-col items-center justify-center px-6 bg-stone-900 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 blur-2xl scale-110 transition-transform duration-[10s] ease-linear"
        style={{ backgroundImage: `url(${coverImage})` }}
      />
      
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center shadow-2xl">
        <div className="relative w-20 h-20 mx-auto mb-6">
           <div className="absolute inset-0 border-4 border-rose-400/30 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-t-rose-400 rounded-full animate-spin"></div>
           <Sparkles className="absolute inset-0 m-auto text-white w-6 h-6 animate-pulse" />
        </div>
        
        <h3 className="text-2xl font-serif text-white mb-2 tracking-wide">Curating Your Artist</h3>
        
        <div className="h-12 flex items-center justify-center">
          <p key={analysisState.step} className="text-rose-200 font-medium animate-fade-in">
             {analysisState.step}
          </p>
        </div>
      </div>
    </div>
  );
};

const ResultsView = ({ 
  analysis, 
  onSelectPhotographer 
}: { 
  analysis: MoodboardAnalysis, 
  onSelectPhotographer: (id: string) => void 
}) => {
  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Moodboard Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 mb-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                 <div className="flex items-center gap-2 mb-2 text-rose-500 font-medium text-sm tracking-wide uppercase">
                    <Sparkles size={14} />
                    <span>Your Wedding Vibe</span>
                 </div>
                 <h2 className="text-3xl font-serif text-stone-900 mb-3">{analysis.venueType}</h2>
                 <div className="flex flex-wrap gap-2">
                    {analysis.vibeKeywords.map(k => (
                       <span key={k} className="px-3 py-1 bg-stone-100 text-stone-700 text-sm rounded-lg">{k}</span>
                    ))}
                    <span className="px-3 py-1 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-100">{analysis.lightingStyle}</span>
                 </div>
              </div>
              
              {/* Color Palette */}
              <div className="flex flex-col gap-2">
                 <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Detected Palette</span>
                 <div className="flex gap-2">
                    {analysis.colorPalette.map((color, i) => (
                       <div key={i} className="flex flex-col items-center gap-1 group">
                          <div 
                             className="w-10 h-10 rounded-full shadow-inner border border-stone-100 transition-transform group-hover:scale-110" 
                             style={{ backgroundColor: color }} 
                          />
                          <span className="text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">{color}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <h3 className="text-xl font-serif text-stone-900 mb-6 pl-2">Curated Artists for You</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysis.matches.map((match) => {
            const photographer = MOCK_PHOTOGRAPHERS.find(p => p.id === match.photographerId);
            if (!photographer) return null;

            return (
              <div 
                key={match.photographerId}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-stone-100 flex flex-col"
                onClick={() => onSelectPhotographer(match.photographerId)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={photographer.portfolio[0]} 
                    alt={photographer.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-rose-600 shadow-sm flex items-center gap-1">
                    <Sparkles size={12} />
                    {match.compatibilityScore}% Match
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-lg text-stone-900 leading-none">{photographer.name}</h4>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star size={12} fill="currentColor" />
                        <span>{photographer.rating}</span>
                      </div>
                   </div>
                   <p className="text-xs text-stone-400 mb-4">{photographer.location}</p>

                   {/* AI Insight */}
                   <div className="bg-rose-50/50 rounded-xl p-3 mb-4 border border-rose-100/50">
                      <p className="text-xs text-stone-700 italic leading-relaxed">
                        "{match.matchReason}"
                      </p>
                   </div>
                   
                   <div className="mt-auto">
                     <div className="flex flex-wrap gap-1.5 mb-3">
                       {match.keyElementsDetected.slice(0, 3).map((el, i) => (
                         <span key={i} className="text-[10px] uppercase tracking-wide bg-stone-100 px-2 py-1 rounded text-stone-500 font-medium">{el}</span>
                       ))}
                     </div>
                     <div className="pt-3 border-t border-stone-100 text-xs font-semibold text-stone-900 text-right">
                        {photographer.priceRange}
                     </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProfileView = ({ photographer, onBook }: { photographer: Photographer, onBook: () => void }) => {
  return (
    <div className="min-h-screen bg-white pt-16 pb-24">
       {/* Masonry-style Hero Portfolio */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-1 h-[50vh] md:h-[60vh]">
          {photographer.portfolio.map((img, i) => (
             <div key={i} className={`relative overflow-hidden group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Portfolio" />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
          ))}
       </div>

       <div className="max-w-4xl mx-auto px-4 md:px-6 relative -mt-20 z-10">
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl border border-stone-100">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                   <h1 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2">{photographer.name}</h1>
                   <div className="flex items-center gap-3 text-stone-500 text-sm">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {photographer.location}</span>
                      <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                      <span className="flex items-center gap-1"><Star size={14} className="text-amber-400" fill="currentColor" /> {photographer.rating} ({photographer.reviewCount})</span>
                   </div>
                </div>
                <div className="flex gap-3">
                   <button className="p-3 rounded-full border border-stone-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 transition-colors">
                      <Heart size={20} />
                   </button>
                   <Button onClick={onBook} className="hidden md:flex shadow-xl shadow-stone-900/20">
                      Request Booking
                   </Button>
                </div>
             </div>

             <div className="flex flex-wrap gap-2 mb-8">
                <Chip label={photographer.style} />
                {photographer.tags.map(t => <Chip key={t} label={t} />)}
             </div>

             <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2">
                   <h3 className="font-serif text-xl mb-4">About the Artist</h3>
                   <p className="text-stone-600 leading-relaxed text-lg font-light">
                      {photographer.description}
                   </p>
                </div>
                <div className="bg-stone-50 rounded-2xl p-6 h-fit">
                    <h3 className="font-serif text-lg mb-4">Starting At</h3>
                    <p className="text-2xl font-bold text-stone-900 mb-2">{photographer.priceRange}</p>
                    <ul className="text-sm text-stone-500 space-y-2 mb-4">
                       <li className="flex items-center gap-2"><Check size={14} className="text-green-600" /> 8 Hours Coverage</li>
                       <li className="flex items-center gap-2"><Check size={14} className="text-green-600" /> 400+ Edited Photos</li>
                       <li className="flex items-center gap-2"><Check size={14} className="text-green-600" /> Online Gallery</li>
                    </ul>
                </div>
             </div>
             
             {/* Mobile Sticky Button */}
             <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-stone-100 md:hidden z-40">
                <Button onClick={onBook} className="w-full text-lg shadow-xl">
                   Request Booking
                </Button>
             </div>
          </div>
       </div>
    </div>
  );
};

const SuccessView = ({ onReset }: { onReset: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
    <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-stone-100">
       <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-green-600" />
       </div>
       <h2 className="text-3xl font-serif text-stone-900 mb-3">Inquiry Sent!</h2>
       <p className="text-stone-500 mb-8 leading-relaxed">
         We've shared your moodboard with the photographer. They will review your aesthetic requirements and respond within 24 hours.
       </p>
       <Button onClick={onReset} variant="secondary" className="w-full">
         Start New Match
       </Button>
    </div>
  </div>
);

// --- Main App Controller ---

export default function App() {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [uploadedImages, setUploadedImages] = useState<{data: string, mimeType: string}[]>([]);
  const [analysisResult, setAnalysisResult] = useState<MoodboardAnalysis | null>(null);
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({ isAnalyzing: false, step: '' });

  const handleAnalysis = async (files: File[]) => {
    try {
      setAnalysisState({ isAnalyzing: true, step: INITIAL_ANALYSIS_STEPS[0] });
      
      // 1. Process all files
      const processedImages = await Promise.all(files.map(fileToGenerativePart));
      setUploadedImages(processedImages);

      // 2. Simulate progressive analysis steps for UX
      let stepIndex = 0;
      const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < INITIAL_ANALYSIS_STEPS.length) {
          setAnalysisState(prev => ({ ...prev, step: INITIAL_ANALYSIS_STEPS[stepIndex] }));
        } else {
          clearInterval(interval);
        }
      }, 1200);

      // 3. Call Gemini API with multiple images
      const result = await findMatchingPhotographers(processedImages);
      
      setTimeout(() => {
        clearInterval(interval);
        setAnalysisResult(result);
        setAnalysisState({ isAnalyzing: false, step: 'complete' });
        setView(AppView.RESULTS);
      }, 5000); 

    } catch (error) {
      console.error("Analysis failed", error);
      alert("Something went wrong analyzing the moodboard. Please try again.");
      setAnalysisState({ isAnalyzing: false, step: '' });
    }
  };

  const selectedPhotographer = selectedPhotographerId 
    ? MOCK_PHOTOGRAPHERS.find(p => p.id === selectedPhotographerId) 
    : null;

  // Background image for loader is the first uploaded image
  const loaderBg = uploadedImages.length > 0 
    ? `data:${uploadedImages[0].mimeType};base64,${uploadedImages[0].data}` 
    : '';

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-rose-100">
      
      {/* Navigation Logic */}
      {view !== AppView.HOME && !analysisState.isAnalyzing && (
        <NavBar 
          title={view === AppView.RESULTS ? 'Your Match' : view === AppView.PROFILE ? 'Portfolio' : 'Lumière'}
          showBack={true}
          onBack={() => {
             if (view === AppView.PROFILE) setView(AppView.RESULTS);
             else if (view === AppView.RESULTS) setView(AppView.UPLOAD);
             else setView(AppView.HOME);
          }} 
        />
      )}

      {/* Main Content Router */}
      <main>
        {view === AppView.HOME && (
          <LandingView onStart={() => setView(AppView.UPLOAD)} />
        )}

        {view === AppView.UPLOAD && !analysisState.isAnalyzing && (
          <UploadView onAnalyze={handleAnalysis} />
        )}

        {analysisState.isAnalyzing && (
          <AnalysisLoader analysisState={analysisState} coverImage={loaderBg} />
        )}

        {view === AppView.RESULTS && analysisResult && (
          <ResultsView 
            analysis={analysisResult} 
            onSelectPhotographer={(id) => {
              setSelectedPhotographerId(id);
              setView(AppView.PROFILE);
            }} 
          />
        )}

        {view === AppView.PROFILE && selectedPhotographer && (
          <ProfileView 
            photographer={selectedPhotographer} 
            onBook={() => setView(AppView.BOOKING_SUCCESS)} 
          />
        )}

        {view === AppView.BOOKING_SUCCESS && (
          <SuccessView onReset={() => {
            setUploadedImages([]);
            setAnalysisResult(null);
            setSelectedPhotographerId(null);
            setView(AppView.HOME);
          }} />
        )}
      </main>
    </div>
  );
}