import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Ruler,
  Sun,
  Moon,
  Lamp,
  Sparkles,
  Palette,
  Sofa,
  FolderOpen,
  Maximize2,
  Send,
  Menu,
  X,
  Home,
  Settings,
  Camera,
  RotateCcw,
  Check,
  Star,
} from "lucide-react";

// ========== Types ==========
interface Dimensions {
  width: number;
  length: number;
  height: number;
}

interface AccordionSidebarProps {
  dimensions: Dimensions;
  onDimensionsChange: (dims: Dimensions) => void;
  lightingMode: string;
  onLightingChange: (mode: string) => void;
  selectedMaterial: string;
  onMaterialChange: (material: string) => void;
  onAiPrompt?: (prompt: string) => void;
  onScreenshot?: () => void;
  onResetCamera?: () => void;
}

// ========== Material Options ==========
const MATERIALS = [
  { id: "ice-blue", name: "أزرق جليدي", color: "#E0F4FF", category: "cool" },
  { id: "peach", name: "خوخي", color: "#FFDAB9", category: "warm" },
  { id: "mint", name: "نعناعي", color: "#E8FFF0", category: "nature" },
  { id: "lavender", name: "لافندر", color: "#E6E6FA", category: "cool" },
  { id: "coral", name: "مرجاني", color: "#FF7F7F", category: "warm" },
  { id: "navy", name: "كحلي", color: "#1B3A57", category: "dark" },
  { id: "slate", name: "رمادي", color: "#708090", category: "neutral" },
  { id: "cream", name: "كريمي", color: "#FFFDD0", category: "warm" },
  { id: "purple", name: "بنفسجي", color: "#8B5CF6", category: "cool" },
  { id: "violet", name: "بنفسجي فاتح", color: "#DDA0DD", category: "cool" },
  { id: "pink", name: "وردي", color: "#FFB6C1", category: "warm" },
  { id: "olive", name: "زيتوني", color: "#6B8E23", category: "nature" },
  { id: "charcoal", name: "فحمي", color: "#36454F", category: "dark" },
  { id: "brown", name: "بني", color: "#8B4513", category: "warm" },
  { id: "gold", name: "ذهبي", color: "#FFD700", category: "luxury" },
  { id: "teal", name: "تركوازي", color: "#008080", category: "cool" },
];

// ========== Lighting Presets ==========
const LIGHTING_PRESETS = [
  {
    id: "day",
    name: "نهاري",
    icon: Sun,
    color: "#FEF3C7",
    gradient: "from-yellow-400 to-orange-400",
  },
  {
    id: "evening",
    name: "مسائي",
    icon: Moon,
    color: "#C4B5FD",
    gradient: "from-purple-400 to-indigo-500",
  },
  {
    id: "warm",
    name: "دافئ",
    icon: Lamp,
    color: "#FBBF24",
    gradient: "from-orange-400 to-red-400",
  },
  {
    id: "cool",
    name: "بارد",
    icon: Sparkles,
    color: "#7DD3FC",
    gradient: "from-cyan-400 to-blue-500",
  },
];

// ========== Furniture Items ==========
const FURNITURE_ITEMS = [
  { id: "sofa", name: "كنبة", icon: "🛋️", color: "#8B7355" },
  { id: "table", name: "طاولة", icon: "🪑", color: "#A0522D" },
  { id: "bed", name: "سرير", icon: "🛏️", color: "#4A5568" },
  { id: "lamp", name: "مصباح", icon: "💡", color: "#ECC94B" },
  { id: "cabinet", name: "خزانة", icon: "🗄️", color: "#2D3748" },
  { id: "plant", name: "نبتة", icon: "🪴", color: "#48BB78" },
  { id: "rug", name: "سجادة", icon: "🟫", color: "#C53030" },
  { id: "mirror", name: "مرآة", icon: "🪞", color: "#E2E8F0" },
];

// ========== Sample Projects ==========
const SAMPLE_PROJECTS = [
  { id: 1, name: "غرفة المعيشة", date: "2024-12-01", thumbnail: "🏠" },
  { id: 2, name: "غرفة النوم", date: "2024-11-28", thumbnail: "🛏️" },
  { id: 3, name: "المكتب", date: "2024-11-15", thumbnail: "💼" },
];

// ========== Slider Component ==========
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  color?: string;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  color = "purple",
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
          {label}
        </span>
        <span
          className={`text-sm font-bold bg-gradient-to-r from-${color}-400 to-pink-400 bg-clip-text text-transparent`}>
          {value} {unit}
        </span>
      </div>
      <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className={`absolute h-full bg-gradient-to-r from-${color}-500 to-pink-500 rounded-full transition-all duration-200`}
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

// ========== Section Header Component ==========
interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  preview?: React.ReactNode;
  badge?: string | number;
}

function SectionHeader({
  title,
  icon,
  isOpen,
  onToggle,
  preview,
  badge,
}: SectionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        w-full flex items-center justify-between p-4 rounded-2xl
        transition-all duration-500 ease-out transform
        ${
          isOpen
            ? "bg-gradient-to-l from-purple-600/40 via-pink-600/30 to-purple-600/40 border border-purple-400/40 shadow-lg shadow-purple-500/20 scale-[1.02]"
            : "bg-slate-800/40 hover:bg-slate-700/50 border border-slate-700/30 hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/10"
        }
        backdrop-blur-xl active:scale-[0.98]
      `}>
      <div className="flex items-center gap-3">
        <div
          className={`
          p-2.5 rounded-xl transition-all duration-500
          ${
            isOpen
              ? "bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/40 rotate-0"
              : "bg-slate-700/60 text-slate-400 group-hover:text-purple-400"
          }
        `}>
          {icon}
        </div>
        <div className="text-right">
          <span
            className={`font-semibold block transition-colors ${
              isOpen ? "text-white" : "text-slate-200"
            }`}>
            {title}
          </span>
          {!isOpen && preview && (
            <span className="text-xs text-slate-500">{preview}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {badge && !isOpen && (
          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full">
            {badge}
          </span>
        )}
        <div
          className={`
          p-1.5 rounded-lg transition-all duration-500
          ${isOpen ? "bg-purple-500/30 rotate-180" : "bg-slate-700/50"}
        `}>
          <ChevronDown
            size={16}
            className={`transition-colors ${
              isOpen ? "text-purple-300" : "text-slate-500"
            }`}
          />
        </div>
      </div>
    </button>
  );
}

// ========== Main Component ==========
export default function AccordionSidebar({
  dimensions,
  onDimensionsChange,
  lightingMode,
  onLightingChange,
  selectedMaterial,
  onMaterialChange,
  onAiPrompt,
  onScreenshot,
  onResetCamera,
}: AccordionSidebarProps) {
  const [openSection, setOpenSection] = useState<string | null>("materials");
  const [aiInput, setAiInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const handleAiSubmit = () => {
    if (aiInput.trim() && onAiPrompt) {
      onAiPrompt(aiInput);
      setAiInput("");
    }
  };

  const area = dimensions.width * dimensions.length;
  const volume = area * dimensions.height;

  // Sidebar Content
  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-l from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              BUILDEX4SYRIA
            </h1>
            <p className="text-slate-500 text-xs md:text-sm">
              مساعد التصميم الذكي ✨
            </p>
          </div>
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>

        {/* AI Input */}
        <div className="relative">
          <div className="flex items-center gap-2 p-2.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 focus-within:border-purple-500/50 focus-within:shadow-lg focus-within:shadow-purple-500/10 transition-all">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`
                p-2.5 rounded-xl transition-all duration-300 flex-shrink-0
                ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50"
                    : "bg-slate-700 text-slate-400 hover:bg-purple-500/30 hover:text-purple-400"
                }
              `}>
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAiSubmit()}
              placeholder="اكتب وصفاً للتصميم..."
              className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 focus:outline-none min-w-0"
            />
            <button
              onClick={handleAiSubmit}
              disabled={!aiInput.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={onScreenshot}
            className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-slate-800/50 hover:bg-purple-500/20 rounded-xl text-slate-400 hover:text-purple-400 transition-all text-xs">
            <Camera size={14} />
            <span className="hidden sm:inline">لقطة</span>
          </button>
          <button
            onClick={onResetCamera}
            className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-slate-800/50 hover:bg-purple-500/20 rounded-xl text-slate-400 hover:text-purple-400 transition-all text-xs">
            <RotateCcw size={14} />
            <span className="hidden sm:inline">إعادة</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 p-2.5 bg-slate-800/50 hover:bg-purple-500/20 rounded-xl text-slate-400 hover:text-purple-400 transition-all text-xs">
            <Home size={14} />
            <span className="hidden sm:inline">الرئيسية</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 scrollbar-thin">
        {/* Room Dimensions */}
        <div>
          <SectionHeader
            title="أبعاد الغرفة"
            icon={<Ruler size={18} />}
            isOpen={openSection === "dimensions"}
            onToggle={() => toggleSection("dimensions")}
            preview={`${area.toFixed(0)} م²`}
          />
          <div
            className={`
            overflow-hidden transition-all duration-500 ease-out
            ${
              openSection === "dimensions"
                ? "max-h-[400px] opacity-100 mt-3"
                : "max-h-0 opacity-0"
            }
          `}>
            <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/20 space-y-5">
              <Slider
                label="العرض"
                value={dimensions.width}
                min={2}
                max={15}
                step={0.5}
                unit="م"
                onChange={(v) =>
                  onDimensionsChange({ ...dimensions, width: v })
                }
              />
              <Slider
                label="الطول"
                value={dimensions.length}
                min={2}
                max={15}
                step={0.5}
                unit="م"
                onChange={(v) =>
                  onDimensionsChange({ ...dimensions, length: v })
                }
              />
              <Slider
                label="الارتفاع"
                value={dimensions.height}
                min={2.4}
                max={5}
                step={0.1}
                unit="م"
                onChange={(v) =>
                  onDimensionsChange({ ...dimensions, height: v })
                }
              />

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/30">
                <div className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl text-center border border-purple-500/20">
                  <Maximize2
                    size={16}
                    className="mx-auto text-purple-400 mb-1"
                  />
                  <p className="text-[10px] text-slate-500">المساحة</p>
                  <p className="text-lg font-black text-white">
                    {area.toFixed(1)}
                    <span className="text-xs text-slate-500 mr-1">م²</span>
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl text-center border border-pink-500/20">
                  <Ruler size={16} className="mx-auto text-pink-400 mb-1" />
                  <p className="text-[10px] text-slate-500">الحجم</p>
                  <p className="text-lg font-black text-white">
                    {volume.toFixed(1)}
                    <span className="text-xs text-slate-500 mr-1">م³</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lighting */}
        <div>
          <SectionHeader
            title="نمط الإضاءة"
            icon={<Sun size={18} />}
            isOpen={openSection === "lighting"}
            onToggle={() => toggleSection("lighting")}
            preview={LIGHTING_PRESETS.find((p) => p.id === lightingMode)?.name}
          />
          <div
            className={`
            overflow-hidden transition-all duration-500 ease-out
            ${
              openSection === "lighting"
                ? "max-h-[200px] opacity-100 mt-3"
                : "max-h-0 opacity-0"
            }
          `}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-800/30 rounded-2xl border border-slate-700/20">
              {LIGHTING_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = lightingMode === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onLightingChange(preset.id)}
                    className={`
                      relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300
                      ${
                        isSelected
                          ? `bg-gradient-to-br ${preset.gradient} text-white shadow-lg scale-105`
                          : "bg-slate-700/40 text-slate-400 hover:bg-slate-700/60 hover:text-white hover:scale-102"
                      }
                    `}>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Check size={12} className="text-purple-600" />
                      </div>
                    )}
                    <Icon size={20} />
                    <span className="text-xs font-medium">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Materials */}
        <div>
          <SectionHeader
            title="الخامات والألوان"
            icon={<Palette size={18} />}
            isOpen={openSection === "materials"}
            onToggle={() => toggleSection("materials")}
            badge={MATERIALS.length}
            preview={
              <div className="flex gap-1 mt-1">
                {MATERIALS.slice(0, 5).map((m) => (
                  <div
                    key={m.id}
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: m.color }}
                  />
                ))}
              </div>
            }
          />
          <div
            className={`
            overflow-hidden transition-all duration-500 ease-out
            ${
              openSection === "materials"
                ? "max-h-[400px] opacity-100 mt-3"
                : "max-h-0 opacity-0"
            }
          `}>
            <div className="p-3 bg-slate-800/30 rounded-2xl border border-slate-700/20">
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                {MATERIALS.map((material) => {
                  const isSelected = selectedMaterial === material.id;
                  return (
                    <button
                      key={material.id}
                      onClick={() => onMaterialChange(material.id)}
                      className={`
                        group relative aspect-square rounded-xl overflow-hidden transition-all duration-300
                        ${
                          isSelected
                            ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900 scale-105 shadow-lg shadow-purple-500/30"
                            : "hover:scale-105 hover:shadow-md"
                        }
                      `}>
                      <div
                        className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: material.color }}
                      />
                      <div
                        className={`
                        absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent
                        flex items-end justify-center pb-1.5
                        transition-opacity duration-300
                        ${
                          isSelected
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }
                      `}>
                        <span className="text-[9px] text-white font-medium text-center leading-tight">
                          {material.name}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Furniture */}
        <div>
          <SectionHeader
            title="الأثاث"
            icon={<Sofa size={18} />}
            isOpen={openSection === "furniture"}
            onToggle={() => toggleSection("furniture")}
            badge={FURNITURE_ITEMS.length}
          />
          <div
            className={`
            overflow-hidden transition-all duration-500 ease-out
            ${
              openSection === "furniture"
                ? "max-h-[300px] opacity-100 mt-3"
                : "max-h-0 opacity-0"
            }
          `}>
            <div className="grid grid-cols-4 gap-2 p-3 bg-slate-800/30 rounded-2xl border border-slate-700/20">
              {FURNITURE_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className="flex flex-col items-center gap-1.5 p-3 bg-slate-700/30 rounded-xl hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20 border border-transparent hover:border-purple-500/30 transition-all duration-300 group active:scale-95">
                  <span className="text-2xl group-hover:scale-125 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div>
          <SectionHeader
            title="المشاريع"
            icon={<FolderOpen size={18} />}
            isOpen={openSection === "projects"}
            onToggle={() => toggleSection("projects")}
            badge={SAMPLE_PROJECTS.length}
          />
          <div
            className={`
            overflow-hidden transition-all duration-500 ease-out
            ${
              openSection === "projects"
                ? "max-h-[300px] opacity-100 mt-3"
                : "max-h-0 opacity-0"
            }
          `}>
            <div className="space-y-2 p-3 bg-slate-800/30 rounded-2xl border border-slate-700/20">
              {SAMPLE_PROJECTS.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-3 p-3 bg-slate-700/20 rounded-xl hover:bg-purple-500/10 cursor-pointer transition-all duration-300 group active:scale-[0.98]">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-xl">
                    {project.thumbnail}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate group-hover:text-purple-300">
                      {project.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{project.date}</p>
                  </div>
                  <Star
                    size={14}
                    className="text-slate-600 group-hover:text-yellow-400 transition-colors"
                  />
                </div>
              ))}

              <button className="w-full p-3 border-2 border-dashed border-slate-600 rounded-xl text-slate-500 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/5 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]">
                <span className="text-lg">+</span>
                <span className="text-xs font-medium">مشروع جديد</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/50 bg-slate-900/50">
        <p className="text-center text-[10px] text-slate-600">
          BUILDEX4SYRIA • مدعوم بالذكاء الاصطناعي 🤖
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && !isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl text-white shadow-2xl shadow-purple-500/40 hover:scale-110 active:scale-95 transition-all duration-300">
          <Menu size={24} />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        dir="rtl"
        className={`
          ${
            isMobile
              ? `fixed inset-y-0 right-0 z-50 w-[85%] max-w-[400px] transform transition-transform duration-500 ease-out ${
                  isMobileOpen ? "translate-x-0" : "translate-x-full"
                }`
              : "relative w-[340px] lg:w-[380px]"
          }
          h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 
          border-l border-slate-800/50 shadow-2xl shadow-black/50
        `}
        style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
        <SidebarContent />
      </div>
    </>
  );
}
