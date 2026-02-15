import React, {
  useState,
  useRef,
  Suspense,
  useEffect,
  useCallback,
  useMemo,
  Component,
  ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  useTexture,
  Html,
  Environment,
  ContactShadows,
  Preload,
} from "@react-three/drei";
import * as THREE from "three";
import {
  Camera,
  Save,
  Download,
  Trash2,
  Plus,
  Sparkles,
  Settings,
  Mic,
  MicOff,
  Sun,
  Moon,
  Lamp,
  Volume2,
  RotateCcw,
  Eye,
  Palette,
  LayoutGrid,
  Box,
  Layers,
  Zap,
  ChevronLeft,
  ChevronRight,
  Home,
  Maximize2,
  Info,
  Check,
  X,
  RefreshCw,
  Database,
  Image,
  Undo2,
  Redo2,
  Paintbrush,
  ImageIcon,
} from "lucide-react";

// ========== API Configuration ==========
const API_URL = "http://localhost:5000/api";

// ========== أنواع البيانات ==========
interface DBMaterial {
  _id: string;
  name: string;
  nameEn: string;
  type: "wall" | "floor" | "ceiling";
  category: string;
  materialType: "texture" | "color";
  textureUrl?: string;
  color?: string;
  roughness: number;
  metalness: number;
  tileSize: number;
  tags: string[];
  isActive: boolean;
  displayOrder: number;
  pricePerMeter?: number;
  currency?: string;
  stock?: number;
  brand?: string;
}

interface FurnitureItem {
  id: string;
  name: string;
  color: string;
  size: [number, number, number];
  x: number;
  z: number;
  rotation?: number;
}

// ========== نظام التراجع والإعادة ==========
type ActionType = 'add_furniture' | 'remove_furniture' | 'move_furniture' | 'rotate_furniture' | 'change_furniture_color';

interface HistoryAction {
  type: ActionType;
  timestamp: number;
  furnitureIndex?: number;
  previousState?: FurnitureItem;
  newState?: FurnitureItem;
  allFurniture?: FurnitureItem[];
}

// ========== إعدادات الخلفية ==========
interface BackgroundSettings {
  type: 'color' | 'texture';
  value: string;
}

const BACKGROUND_TEXTURES = [
  { id: 'wood', name: 'خشب داكن', url: '/textures/wood-dark.jpg' },
  { id: 'brick', name: 'جدار طوب', url: '/textures/brick-white.jpg' },
];

const BACKGROUND_COLORS = [
  { id: 'orange', name: 'برتقالي', color: '#c2410c' },
  { id: 'slate', name: 'رمادي داكن', color: '#0f172a' },
  { id: 'emerald', name: 'أخضر زمردي', color: '#065f46' },
  { id: 'indigo', name: 'نيلي', color: '#312e81' },
  { id: 'rose', name: 'وردي', color: '#9f1239' },
  { id: 'amber', name: 'عنبري', color: '#92400e' },
];

interface Dimensions {
  width: number;
  length: number;
  height: number;
}

interface SelectedMaterial {
  id: string;
  type: "texture" | "color";
  value: string; // URL للصورة أو كود اللون
  roughness: number;
  metalness: number;
  tileSize: number;
}

interface SelectedMaterials {
  wall: SelectedMaterial;
  floor: SelectedMaterial;
  ceiling: SelectedMaterial;
  leftWall?: SelectedMaterial;
  rightWall?: SelectedMaterial;
  backWall?: SelectedMaterial;
  frontWall?: SelectedMaterial;
}

// ========== واجهات الجدار الشبكي ==========
interface WallCellMaterial {
  row: number;
  col: number;
  material: SelectedMaterial;
}

interface WallGridSettings {
  enabled: boolean;
  rows: number;
  cols: number;
}

interface WallCellsState {
  back: WallCellMaterial[];
  front: WallCellMaterial[];
  left: WallCellMaterial[];
  right: WallCellMaterial[];
}

interface SelectedCellInfo {
  wallType: string;
  row: number;
  col: number;
}

interface LightingPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  ambient: number;
  directional: number;
  color: string;
  description: string;
}

// ========== الخامات الافتراضية (Fallback) ==========
const DEFAULT_MATERIALS: DBMaterial[] = [
  // ألوان الجدران الافتراضية
  {
    _id: "c1",
    name: "أبيض كلاسيكي",
    nameEn: "Classic White",
    type: "wall",
    category: "minimal",
    materialType: "color",
    color: "#FFFFFF",
    roughness: 0.9,
    metalness: 0,
    tileSize: 4,
    tags: ["white", "clean"],
    isActive: true,
    displayOrder: 1,
  },
  {
    _id: "c2",
    name: "بيج دافئ",
    nameEn: "Warm Beige",
    type: "wall",
    category: "classic",
    materialType: "color",
    color: "#F5E6D3",
    roughness: 0.85,
    metalness: 0,
    tileSize: 4,
    tags: ["beige", "warm"],
    isActive: true,
    displayOrder: 2,
  },
  {
    _id: "c3",
    name: "رمادي فاتح",
    nameEn: "Light Gray",
    type: "wall",
    category: "modern",
    materialType: "color",
    color: "#E8E8E8",
    roughness: 0.8,
    metalness: 0.1,
    tileSize: 4,
    tags: ["gray", "neutral"],
    isActive: true,
    displayOrder: 3,
  },
  {
    _id: "c4",
    name: "أزرق سماوي",
    nameEn: "Sky Blue",
    type: "wall",
    category: "modern",
    materialType: "color",
    color: "#87CEEB",
    roughness: 0.85,
    metalness: 0,
    tileSize: 4,
    tags: ["blue", "calm"],
    isActive: true,
    displayOrder: 4,
  },
  {
    _id: "c5",
    name: "أخضر زيتوني",
    nameEn: "Olive Green",
    type: "wall",
    category: "classic",
    materialType: "color",
    color: "#808000",
    roughness: 0.85,
    metalness: 0,
    tileSize: 4,
    tags: ["green", "natural"],
    isActive: true,
    displayOrder: 5,
  },
  {
    _id: "c6",
    name: "وردي فاتح",
    nameEn: "Light Pink",
    type: "wall",
    category: "modern",
    materialType: "color",
    color: "#FFB6C1",
    roughness: 0.85,
    metalness: 0,
    tileSize: 4,
    tags: ["pink", "soft"],
    isActive: true,
    displayOrder: 6,
  },
  {
    _id: "c7",
    name: "أزرق داكن",
    nameEn: "Navy Blue",
    type: "wall",
    category: "classic",
    materialType: "color",
    color: "#1B3A57",
    roughness: 0.8,
    metalness: 0.05,
    tileSize: 4,
    tags: ["navy", "elegant"],
    isActive: true,
    displayOrder: 7,
  },
  // أرضيات
  {
    _id: "f1",
    name: "أبيض لامع",
    nameEn: "Glossy White",
    type: "floor",
    category: "modern",
    materialType: "color",
    color: "#FAFAFA",
    roughness: 0.2,
    metalness: 0.3,
    tileSize: 2,
    tags: ["white", "glossy"],
    isActive: true,
    displayOrder: 1,
  },
  {
    _id: "f2",
    name: "بني خشبي",
    nameEn: "Wooden Brown",
    type: "floor",
    category: "classic",
    materialType: "color",
    color: "#8B4513",
    roughness: 0.7,
    metalness: 0,
    tileSize: 1.5,
    tags: ["brown", "wooden"],
    isActive: true,
    displayOrder: 2,
  },
  {
    _id: "f3",
    name: "رمادي داكن",
    nameEn: "Dark Gray",
    type: "floor",
    category: "industrial",
    materialType: "color",
    color: "#3D3D3D",
    roughness: 0.6,
    metalness: 0.15,
    tileSize: 2,
    tags: ["gray", "dark"],
    isActive: true,
    displayOrder: 3,
  },
  // أسقف
  {
    _id: "s1",
    name: "أبيض مطفي",
    nameEn: "Matte White",
    type: "ceiling",
    category: "minimal",
    materialType: "color",
    color: "#FFFFFF",
    roughness: 0.95,
    metalness: 0,
    tileSize: 4,
    tags: ["white", "matte"],
    isActive: true,
    displayOrder: 1,
  },
  {
    _id: "s2",
    name: "كريمي دافئ",
    nameEn: "Warm Cream",
    type: "ceiling",
    category: "classic",
    materialType: "color",
    color: "#FDF5E6",
    roughness: 0.9,
    metalness: 0,
    tileSize: 4,
    tags: ["cream", "warm"],
    isActive: true,
    displayOrder: 2,
  },
];

// قوالب الأثاث
const FURNITURE_TEMPLATES = [
  {
    id: "sofa",
    name: "كنبة",
    nameEn: "Sofa",
    color: "#5D4E37",
    size: [1.8, 0.75, 0.85] as [number, number, number],
    icon: "🛋️",
  },
  {
    id: "table",
    name: "طاولة",
    nameEn: "Table",
    color: "#8B7355",
    size: [1.5, 0.7, 1] as [number, number, number],
    icon: "🪑",
  },
  {
    id: "chair",
    name: "كرسي",
    nameEn: "Chair",
    color: "#6B5344",
    size: [0.45, 0.85, 0.45] as [number, number, number],
    icon: "💺",
  },
  {
    id: "bed",
    name: "سرير",
    nameEn: "Bed",
    color: "#4A5568",
    size: [2, 0.5, 2.5] as [number, number, number],
    icon: "🛏️",
  },
  {
    id: "cabinet",
    name: "خزانة",
    nameEn: "Cabinet",
    color: "#2D3748",
    size: [1.2, 2, 0.5] as [number, number, number],
    icon: "🗄️",
  },
  {
    id: "lamp",
    name: "مصباح",
    nameEn: "Lamp",
    color: "#ECC94B",
    size: [0.3, 1.5, 0.3] as [number, number, number],
    icon: "💡",
  },
];

// أنماط الإضاءة
const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: "day",
    name: "نهاري",
    icon: <Sun size={16} />,
    ambient: 0.8,
    directional: 1.2,
    color: "#ffffff",
    description: "إضاءة نهارية طبيعية",
  },
  {
    id: "evening",
    name: "مسائي",
    icon: <Moon size={16} />,
    ambient: 0.4,
    directional: 0.6,
    color: "#ffd89b",
    description: "إضاءة مسائية دافئة",
  },
  {
    id: "warm",
    name: "دافئ",
    icon: <Lamp size={16} />,
    ambient: 0.5,
    directional: 0.8,
    color: "#ff9f43",
    description: "إضاءة دافئة مريحة",
  },
  {
    id: "cool",
    name: "بارد",
    icon: <Sparkles size={16} />,
    ambient: 0.6,
    directional: 1.0,
    color: "#74b9ff",
    description: "إضاءة باردة عصرية",
  },
];

// ========== دالة UV Mapping الذكية ==========
function calculateSmartUV(
  surfaceWidth: number,
  surfaceHeight: number,
  tileSize: number
): { repeatX: number; repeatY: number } {
  const repeatX = surfaceWidth / tileSize;
  const repeatY = surfaceHeight / tileSize;
  return { repeatX, repeatY };
}

// ========== مكون جدار بلون صلب ==========
interface ColorWallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  color: string;
  roughness: number;
  metalness: number;
  wallType: string;
  onWallClick?: (wallType: string) => void;
  isSelected?: boolean;
}

function ColorWall({
  position,
  rotation,
  size,
  color,
  roughness,
  metalness,
  wallType,
  onWallClick,
  isSelected,
}: ColorWallProps) {
  const [hovered, setHovered] = useState(false);

  const wallNames: Record<string, string> = {
    back: "الجدار الخلفي",
    front: "الجدار الأمامي",
    left: "الجدار الأيسر",
    right: "الجدار الأيمن",
  };

  return (
    <mesh
      position={position}
      rotation={rotation}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onWallClick?.(wallType);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={hovered ? "#1e3a5f" : isSelected ? "#1e40af" : "#000000"}
        emissiveIntensity={hovered ? 0.2 : isSelected ? 0.15 : 0}
        roughness={roughness}
        metalness={metalness}
      />
      {(hovered || isSelected) && (
        <Html center distanceFactor={10}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl backdrop-blur whitespace-nowrap border border-white/20">
            <span className="flex items-center gap-2">
              {isSelected && <Check size={14} />}
              {wallNames[wallType]}
            </span>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ========== مكون جدار بخامة صورة ==========

// Error Boundary for texture loading failures
interface TextureErrorBoundaryProps {
  children: ReactNode;
  fallbackColor: string;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  roughness: number;
  metalness: number;
  wallType: string;
  onWallClick?: (wallType: string) => void;
  isSelected?: boolean;
}

interface TextureErrorBoundaryState {
  hasError: boolean;
}

class TextureErrorBoundary extends Component<
  TextureErrorBoundaryProps,
  TextureErrorBoundaryState
> {
  constructor(props: TextureErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): TextureErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn(
      "Texture loading failed, falling back to solid color:",
      error.message
    );
  }

  render() {
    if (this.state.hasError) {
      // Render fallback ColorWall when texture fails to load
      return (
        <ColorWall
          position={this.props.position}
          rotation={this.props.rotation}
          size={this.props.size}
          color={this.props.fallbackColor}
          roughness={this.props.roughness}
          metalness={this.props.metalness}
          wallType={this.props.wallType}
          onWallClick={this.props.onWallClick}
          isSelected={this.props.isSelected}
        />
      );
    }

    return this.props.children;
  }
}

interface TextureWallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  textureUrl: string;
  tileSize: number;
  roughness: number;
  metalness: number;
  wallType: string;
  onWallClick?: (wallType: string) => void;
  isSelected?: boolean;
}

function TextureWall({
  position,
  rotation,
  size,
  textureUrl,
  tileSize,
  roughness,
  metalness,
  wallType,
  onWallClick,
  isSelected,
}: TextureWallProps) {
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(textureUrl);

  useEffect(() => {
    const [width, height] = size;
    const uv = calculateSmartUV(width, height, tileSize);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(uv.repeatX, uv.repeatY);
    texture.anisotropy = 16;
    texture.needsUpdate = true;
  }, [texture, size, tileSize]);

  const wallNames: Record<string, string> = {
    back: "الجدار الخلفي",
    front: "الجدار الأمامي",
    left: "الجدار الأيسر",
    right: "الجدار الأيمن",
  };

  return (
    <mesh
      position={position}
      rotation={rotation}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onWallClick?.(wallType);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        map={texture}
        emissive={hovered ? "#1e3a5f" : isSelected ? "#1e40af" : "#000000"}
        emissiveIntensity={hovered ? 0.2 : isSelected ? 0.15 : 0}
        roughness={roughness}
        metalness={metalness}
      />
      {(hovered || isSelected) && (
        <Html center distanceFactor={10}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl backdrop-blur whitespace-nowrap border border-white/20">
            <span className="flex items-center gap-2">
              {isSelected && <Check size={14} />}
              {wallNames[wallType]}
            </span>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ========== مكون الجدار الموحد ==========
interface WallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  material: SelectedMaterial;
  wallType: string;
  onWallClick?: (wallType: string) => void;
  isSelected?: boolean;
}

function Wall({
  position,
  rotation,
  size,
  material,
  wallType,
  onWallClick,
  isSelected,
}: WallProps) {
  // List of domains known to block CORS requests
  const blockedDomains = [
    "pinimg.com",
    "pinterest.com",
    "pin.it",
    "fbcdn.net",
    "facebook.com",
    "instagram.com",
  ];

  // Check if URL is from a CORS-blocked domain
  const isBlockedUrl = (url: string): boolean => {
    try {
      return blockedDomains.some((domain) =>
        url.toLowerCase().includes(domain)
      );
    } catch {
      return false;
    }
  };

  // Get safe texture URL - replace blocked URLs with local fallback
  const getSafeTextureUrl = (url: string): string => {
    if (isBlockedUrl(url)) {
      // Use local fallback texture
      return "/textures/brick-white.jpg";
    }
    return url;
  };

  if (material.type === "color") {
    return (
      <ColorWall
        position={position}
        rotation={rotation}
        size={size}
        color={material.value}
        roughness={material.roughness}
        metalness={material.metalness}
        wallType={wallType}
        onWallClick={onWallClick}
        isSelected={isSelected}
      />
    );
  }

  // Use safe URL for textures
  const safeTextureUrl = getSafeTextureUrl(material.value);

  return (
    <Suspense
      fallback={
        <mesh position={position} rotation={rotation}>
          <planeGeometry args={size} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      }>
      <TextureErrorBoundary
        fallbackColor="#777777"
        position={position}
        rotation={rotation}
        size={size}
        roughness={material.roughness}
        metalness={material.metalness}
        wallType={wallType}
        onWallClick={onWallClick}
        isSelected={isSelected}>
        <TextureWall
          position={position}
          rotation={rotation}
          size={size}
          textureUrl={safeTextureUrl}
          tileSize={material.tileSize}
          roughness={material.roughness}
          metalness={material.metalness}
          wallType={wallType}
          onWallClick={onWallClick}
          isSelected={isSelected}
        />
      </TextureErrorBoundary>
    </Suspense>
  );
}

// ========== مكون خلية واحدة في الجدار الشبكي ==========
interface GridCellProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  material: SelectedMaterial;
  row: number;
  col: number;
  wallType: string;
  onCellClick?: (wallType: string, row: number, col: number) => void;
  isSelected?: boolean;
}

function GridCell({
  position,
  rotation,
  size,
  material,
  row,
  col,
  wallType,
  onCellClick,
  isSelected,
}: GridCellProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onCellClick?.(wallType, row, col);
  };

  // لون أو خامة الخلية
  if (material.type === "color") {
    return (
      <mesh
        position={position}
        rotation={rotation}
        receiveShadow
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}>
        <planeGeometry args={size} />
        <meshStandardMaterial
          color={material.value}
          emissive={hovered ? "#4338ca" : isSelected ? "#1e40af" : "#000000"}
          emissiveIntensity={hovered ? 0.35 : isSelected ? 0.25 : 0}
          roughness={material.roughness}
          metalness={material.metalness}
        />
        {(hovered || isSelected) && (
          <Html center distanceFactor={8}>
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl whitespace-nowrap border border-white/30">
              <span className="flex items-center gap-1.5">
                {isSelected && <Check size={12} />}
                خلية {row + 1},{col + 1}
              </span>
            </div>
          </Html>
        )}
      </mesh>
    );
  }

  // خامة صورة
  return (
    <Suspense
      fallback={
        <mesh position={position} rotation={rotation}>
          <planeGeometry args={size} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      }>
      <TextureGridCell
        position={position}
        rotation={rotation}
        size={size}
        material={material}
        row={row}
        col={col}
        wallType={wallType}
        onCellClick={onCellClick}
        isSelected={isSelected}
      />
    </Suspense>
  );
}

function TextureGridCell({
  position,
  rotation,
  size,
  material,
  row,
  col,
  wallType,
  onCellClick,
  isSelected,
}: GridCellProps) {
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(material.value);

  useEffect(() => {
    const [width, height] = size;
    const uv = calculateSmartUV(width, height, material.tileSize);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(uv.repeatX, uv.repeatY);
    texture.anisotropy = 16;
    texture.needsUpdate = true;
  }, [texture, size, material.tileSize]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onCellClick?.(wallType, row, col);
  };

  return (
    <mesh
      position={position}
      rotation={rotation}
      receiveShadow
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        map={texture}
        emissive={hovered ? "#4338ca" : isSelected ? "#1e40af" : "#000000"}
        emissiveIntensity={hovered ? 0.35 : isSelected ? 0.25 : 0}
        roughness={material.roughness}
        metalness={material.metalness}
      />
      {(hovered || isSelected) && (
        <Html center distanceFactor={8}>
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl whitespace-nowrap border border-white/30">
            <span className="flex items-center gap-1.5">
              {isSelected && <Check size={12} />}
              خلية {row + 1},{col + 1}
            </span>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ========== مكون الجدار الشبكي ==========
interface GridWallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  baseMaterial: SelectedMaterial;
  wallType: string;
  gridSettings: WallGridSettings;
  cellMaterials: WallCellMaterial[];
  onCellClick?: (wallType: string, row: number, col: number) => void;
  selectedCell?: SelectedCellInfo | null;
  onWallClick?: (wallType: string) => void;
  isWallSelected?: boolean;
}

function GridWall({
  position,
  rotation,
  size,
  baseMaterial,
  wallType,
  gridSettings,
  cellMaterials,
  onCellClick,
  selectedCell,
  onWallClick,
  isWallSelected,
}: GridWallProps) {
  const [width, height] = size;
  const { rows, cols, enabled } = gridSettings;

  // إذا كانت الشبكة غير مفعلة، اعرض الجدار كقطعة واحدة
  if (!enabled || rows <= 1 || cols <= 1) {
    return (
      <Wall
        position={position}
        rotation={rotation}
        size={size}
        material={baseMaterial}
        wallType={wallType}
        onWallClick={onWallClick}
        isSelected={isWallSelected}
      />
    );
  }

  // حساب أبعاد كل خلية
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  // إنشاء مصفوفة الخلايا
  const cells = useMemo(() => {
    const cellsArray = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // حساب موضع الخلية النسبي للجدار
        // الموضع يبدأ من الزاوية اليسرى السفلية للجدار
        const localX = (col - (cols - 1) / 2) * cellWidth;
        const localY = (row - (rows - 1) / 2) * cellHeight;
        
        // البحث عن خامة مخصصة لهذه الخلية
        const customCell = cellMaterials.find(
          (c) => c.row === row && c.col === col
        );
        const cellMaterial = customCell?.material || baseMaterial;

        // تحقق مما إذا كانت هذه الخلية محددة
        const isCellSelected =
          selectedCell?.wallType === wallType &&
          selectedCell?.row === row &&
          selectedCell?.col === col;

        cellsArray.push({
          row,
          col,
          localX,
          localY,
          material: cellMaterial,
          isSelected: isCellSelected,
        });
      }
    }
    
    return cellsArray;
  }, [rows, cols, cellWidth, cellHeight, cellMaterials, baseMaterial, selectedCell, wallType]);

  // تحويل الموضع المحلي إلى موضع عالمي
  const rotationMatrix = useMemo(() => {
    const matrix = new THREE.Matrix4();
    const euler = new THREE.Euler(rotation[0], rotation[1], rotation[2]);
    matrix.makeRotationFromEuler(euler);
    return matrix;
  }, [rotation]);

  return (
    <group position={position} rotation={rotation}>
      {cells.map(({ row, col, localX, localY, material, isSelected }) => (
        <GridCell
          key={`${wallType}-${row}-${col}`}
          position={[localX, localY, 0]}
          rotation={[0, 0, 0]}
          size={[cellWidth - 0.01, cellHeight - 0.01]} // فجوة صغيرة بين الخلايا
          material={material}
          row={row}
          col={col}
          wallType={wallType}
          onCellClick={onCellClick}
          isSelected={isSelected}
        />
      ))}
    </group>
  );
}

// ========== مكون الأرضية ==========
interface FloorProps {
  dimensions: Dimensions;
  material: SelectedMaterial;
}

function Floor({ dimensions, material }: FloorProps) {
  if (material.type === "color") {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[dimensions.width, dimensions.length]} />
        <meshStandardMaterial
          color={material.value}
          roughness={material.roughness}
          metalness={material.metalness}
        />
      </mesh>
    );
  }

  return (
    <Suspense
      fallback={
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[dimensions.width, dimensions.length]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      }>
      <TextureFloor dimensions={dimensions} material={material} />
    </Suspense>
  );
}

function TextureFloor({ dimensions, material }: FloorProps) {
  const texture = useTexture(material.value);

  useEffect(() => {
    const uv = calculateSmartUV(
      dimensions.width,
      dimensions.length,
      material.tileSize
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(uv.repeatX, uv.repeatY);
    texture.anisotropy = 16;
    texture.needsUpdate = true;
  }, [texture, dimensions, material.tileSize]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[dimensions.width, dimensions.length]} />
      <meshStandardMaterial
        map={texture}
        roughness={material.roughness}
        metalness={material.metalness}
      />
    </mesh>
  );
}

// ========== مكون السقف ==========
interface CeilingProps {
  dimensions: Dimensions;
  material: SelectedMaterial;
}

function Ceiling({ dimensions, material }: CeilingProps) {
  if (material.type === "color") {
    return (
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, dimensions.height, 0]}>
        <planeGeometry args={[dimensions.width, dimensions.length]} />
        <meshStandardMaterial
          color={material.value}
          side={THREE.DoubleSide}
          roughness={material.roughness}
          metalness={material.metalness}
        />
      </mesh>
    );
  }

  return (
    <Suspense
      fallback={
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, dimensions.height, 0]}>
          <planeGeometry args={[dimensions.width, dimensions.length]} />
          <meshStandardMaterial color="#374151" side={THREE.DoubleSide} />
        </mesh>
      }>
      <TextureCeiling dimensions={dimensions} material={material} />
    </Suspense>
  );
}

function TextureCeiling({ dimensions, material }: CeilingProps) {
  const texture = useTexture(material.value);

  useEffect(() => {
    const uv = calculateSmartUV(
      dimensions.width,
      dimensions.length,
      material.tileSize
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(uv.repeatX, uv.repeatY);
    texture.anisotropy = 16;
    texture.needsUpdate = true;
  }, [texture, dimensions, material.tileSize]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, dimensions.height, 0]}>
      <planeGeometry args={[dimensions.width, dimensions.length]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={material.roughness}
        metalness={material.metalness}
      />
    </mesh>
  );
}

// ========== مكون الأثاث ==========
interface FurnitureProps {
  item: FurnitureItem;
  onRemove?: () => void;
  onPositionChange?: (x: number, z: number) => void;
  onRotationChange?: (rotation: number) => void;
  roomDimensions?: { width: number; length: number };
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onSelect?: () => void;
}

function Furniture({
  item,
  onRemove,
  onPositionChange,
  onRotationChange,
  roomDimensions,
  onDragStart,
  onDragEnd,
  onSelect,
}: FurnitureProps) {
  const [showToolbar, setShowToolbar] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const clickStartTime = useRef<number>(0);
  const { camera, gl, raycaster } = useThree();
  const floorPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    []
  );
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);

  // Handle global pointer move for dragging
  const handleGlobalPointerMove = useCallback((e: PointerEvent) => {
    if (dragging && onPositionChange) {
      e.stopPropagation();
      e.preventDefault();
      setHasMoved(true);

      // Calculate mouse position in normalized device coordinates
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      // Update raycaster with mouse position
      raycaster.setFromCamera(mouse, camera);

      // Find intersection with floor plane
      raycaster.ray.intersectPlane(floorPlane, intersectPoint);

      if (intersectPoint) {
        let newX = intersectPoint.x;
        let newZ = intersectPoint.z;

        // Constrain to room bounds if dimensions provided
        if (roomDimensions) {
          const halfWidth = roomDimensions.width / 2 - item.size[0] / 2 - 0.1;
          const halfLength = roomDimensions.length / 2 - item.size[2] / 2 - 0.1;
          newX = Math.max(-halfWidth, Math.min(halfWidth, newX));
          newZ = Math.max(-halfLength, Math.min(halfLength, newZ));
        }

        onPositionChange(newX, newZ);
      }
    }
  }, [dragging, onPositionChange, gl, camera, raycaster, floorPlane, intersectPoint, roomDimensions, item.size]);

  // Handle global pointer up for ending drag
  const handleGlobalPointerUp = useCallback((e: PointerEvent) => {
    if (dragging) {
      const clickDuration = Date.now() - clickStartTime.current;

      setDragging(false);
      onDragEnd?.();

      // If clicked quickly without moving, show/toggle the toolbar
      if (clickDuration < 200 && !hasMoved) {
        setShowToolbar(prev => !prev); // Toggle toolbar visibility on click
      }

      gl.domElement.style.cursor = "auto";
    }
  }, [dragging, hasMoved, onDragEnd, onRemove, gl]);

  // Add and remove global event listeners
  useEffect(() => {
    if (dragging) {
      window.addEventListener('pointermove', handleGlobalPointerMove);
      window.addEventListener('pointerup', handleGlobalPointerUp);
      return () => {
        window.removeEventListener('pointermove', handleGlobalPointerMove);
        window.removeEventListener('pointerup', handleGlobalPointerUp);
      };
    }
  }, [dragging, handleGlobalPointerMove, handleGlobalPointerUp]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(showToolbar || dragging || isHovering ? 1.02 : 1);
    }
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovering(true);
    if (!dragging) {
      gl.domElement.style.cursor = "pointer";
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setIsHovering(false);
    if (!dragging && !showToolbar) {
      gl.domElement.style.cursor = "auto";
    }
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (e.button === 0) {
      clickStartTime.current = Date.now();
      setHasMoved(false);
      setDragging(true);
      gl.domElement.style.cursor = "grabbing";
      onDragStart?.();
    }
  };

  const emissiveColor = showToolbar || dragging || isHovering ? "#3b82f6" : "#000000";
  const emissiveIntensity = showToolbar || dragging || isHovering ? 0.3 : 0;

  // Render different furniture based on type
  const renderFurniture = () => {
    const [width, height, depth] = item.size;

    switch (item.name) {
      case "كنبة": // Sofa
        const sofaSeatHeight = 0.42; // ارتفاع المقعد من الأرض (42 سم)
        const sofaSeatThickness = 0.18;
        const sofaLegHeight = 0.08;
        const sofaBackHeight = 0.35;
        const sofaArmHeight = 0.25;
        
        return (
          <group position={[0, -height / 2, 0]}>
            {/* Base/Frame - القاعدة */}
            <mesh position={[0, sofaLegHeight + sofaSeatThickness / 2, 0]} castShadow>
              <boxGeometry args={[width, sofaSeatThickness, depth]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.8}
                metalness={0}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Back - ظهر الكنبة */}
            <mesh position={[0, sofaLegHeight + sofaSeatThickness + sofaBackHeight / 2, -depth / 2 + 0.08]} castShadow>
              <boxGeometry args={[width - 0.16, sofaBackHeight, 0.15]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.8}
                metalness={0}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Left Armrest - مسند اليد الأيسر */}
            <mesh position={[-width / 2 + 0.08, sofaLegHeight + sofaSeatThickness / 2 + sofaArmHeight / 2, 0]} castShadow>
              <boxGeometry args={[0.12, sofaSeatThickness + sofaArmHeight, depth - 0.1]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.8}
                metalness={0}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Right Armrest - مسند اليد الأيمن */}
            <mesh position={[width / 2 - 0.08, sofaLegHeight + sofaSeatThickness / 2 + sofaArmHeight / 2, 0]} castShadow>
              <boxGeometry args={[0.12, sofaSeatThickness + sofaArmHeight, depth - 0.1]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.8}
                metalness={0}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Cushions - الوسائد */}
            <mesh position={[-width / 4, sofaLegHeight + sofaSeatThickness + 0.06, 0.05]} castShadow>
              <boxGeometry args={[width / 2 - 0.2, 0.1, depth - 0.25]} />
              <meshStandardMaterial
                color="#e8e8e8"
                roughness={0.9}
                metalness={0}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity * 0.5}
              />
            </mesh>
            <mesh position={[width / 4, sofaLegHeight + sofaSeatThickness + 0.06, 0.05]} castShadow>
              <boxGeometry args={[width / 2 - 0.2, 0.1, depth - 0.25]} />
              <meshStandardMaterial
                color="#e8e8e8"
                roughness={0.9}
                metalness={0}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity * 0.5}
              />
            </mesh>
            {/* Legs - الأرجل */}
            {[
              [-width / 2 + 0.12, -depth / 2 + 0.12],
              [width / 2 - 0.12, -depth / 2 + 0.12],
              [-width / 2 + 0.12, depth / 2 - 0.12],
              [width / 2 - 0.12, depth / 2 - 0.12],
            ].map((pos, i) => (
              <mesh key={i} position={[pos[0], sofaLegHeight / 2, pos[1]]} castShadow>
                <boxGeometry args={[0.06, sofaLegHeight, 0.06]} />
                <meshStandardMaterial
                  color="#2d2d2d"
                  roughness={0.5}
                  metalness={0.3}
                />
              </mesh>
            ))}
          </group>
        );

      case "طاولة": // Table
        return (
          <group>
            {/* Tabletop */}
            <mesh position={[0, height / 2 - 0.03, 0]} castShadow>
              <boxGeometry args={[width, 0.06, depth]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.4}
                metalness={0.1}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Legs */}
            {[
              [-width / 2 + 0.08, -depth / 2 + 0.08],
              [width / 2 - 0.08, -depth / 2 + 0.08],
              [-width / 2 + 0.08, depth / 2 - 0.08],
              [width / 2 - 0.08, depth / 2 - 0.08],
            ].map((pos, i) => (
              <mesh key={i} position={[pos[0], 0, pos[1]]} castShadow>
                <cylinderGeometry args={[0.05, 0.06, height - 0.06, 8]} />
                <meshStandardMaterial
                  color="#3d3d3d"
                  roughness={0.3}
                  metalness={0.5}
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity}
                />
              </mesh>
            ))}
          </group>
        );

      case "كرسي": // Chair
        const seatHeight = 0.45; // ارتفاع المقعد من الأرض (45 سم)
        const seatThickness = 0.05;
        const legHeight = seatHeight - seatThickness / 2;
        const backrestHeight = 0.35;
        
        return (
          <group position={[0, -height / 2, 0]}>
            {/* Seat - المقعد */}
            <mesh position={[0, seatHeight, 0]} castShadow>
              <boxGeometry args={[width, seatThickness, depth]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.7}
                metalness={0}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Backrest - ظهر الكرسي */}
            <mesh position={[0, seatHeight + backrestHeight / 2 + seatThickness / 2, -depth / 2 + 0.03]} castShadow>
              <boxGeometry args={[width - 0.02, backrestHeight, 0.04]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.7}
                metalness={0}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Legs - الأرجل */}
            {[
              [-width / 2 + 0.04, -depth / 2 + 0.04],
              [width / 2 - 0.04, -depth / 2 + 0.04],
              [-width / 2 + 0.04, depth / 2 - 0.04],
              [width / 2 - 0.04, depth / 2 - 0.04],
            ].map((pos, i) => (
              <mesh key={i} position={[pos[0], legHeight / 2, pos[1]]} castShadow>
                <boxGeometry args={[0.04, legHeight, 0.04]} />
                <meshStandardMaterial
                  color={item.color}
                  roughness={0.6}
                  metalness={0.1}
                  emissive={emissiveColor}
                  emissiveIntensity={emissiveIntensity}
                />
              </mesh>
            ))}
          </group>
        );

      case "سرير": // Bed
        return (
          <group>
            {/* Mattress */}
            <mesh position={[0, 0.15, 0.1]} castShadow>
              <boxGeometry args={[width - 0.1, 0.25, depth - 0.3]} />
              <meshStandardMaterial
                color="#f5f5f5"
                roughness={0.9}
                metalness={0}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity * 0.5}
              />
            </mesh>
            {/* Frame */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[width, 0.15, depth]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.6}
                metalness={0.1}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Headboard */}
            <mesh position={[0, 0.4, -depth / 2 + 0.05]} castShadow>
              <boxGeometry args={[width, 0.7, 0.08]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.6}
                metalness={0.1}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Pillows */}
            <mesh position={[-width / 4, 0.32, -depth / 2 + 0.35]} castShadow>
              <boxGeometry args={[0.5, 0.1, 0.35]} />
              <meshStandardMaterial
                color="#e8e8e8"
                roughness={0.95}
                metalness={0}
              />
            </mesh>
            <mesh position={[width / 4, 0.32, -depth / 2 + 0.35]} castShadow>
              <boxGeometry args={[0.5, 0.1, 0.35]} />
              <meshStandardMaterial
                color="#e8e8e8"
                roughness={0.95}
                metalness={0}
              />
            </mesh>
            {/* Legs */}
            {[
              [-width / 2 + 0.1, -depth / 2 + 0.1],
              [width / 2 - 0.1, -depth / 2 + 0.1],
              [-width / 2 + 0.1, depth / 2 - 0.1],
              [width / 2 - 0.1, depth / 2 - 0.1],
            ].map((pos, i) => (
              <mesh key={i} position={[pos[0], -0.15, pos[1]]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.12, 8]} />
                <meshStandardMaterial
                  color="#2d2d2d"
                  roughness={0.4}
                  metalness={0.4}
                />
              </mesh>
            ))}
          </group>
        );

      case "خزانة": // Cabinet
        return (
          <group>
            {/* Main body */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[width, height, depth]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.5}
                metalness={0.1}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Left door */}
            <mesh position={[-width / 4, 0, depth / 2 + 0.01]} castShadow>
              <boxGeometry args={[width / 2 - 0.02, height - 0.1, 0.02]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.4}
                metalness={0.15}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Right door */}
            <mesh position={[width / 4, 0, depth / 2 + 0.01]} castShadow>
              <boxGeometry args={[width / 2 - 0.02, height - 0.1, 0.02]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.4}
                metalness={0.15}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Door handles */}
            <mesh position={[-0.08, 0, depth / 2 + 0.04]} castShadow>
              <boxGeometry args={[0.02, 0.15, 0.02]} />
              <meshStandardMaterial
                color="#C0C0C0"
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            <mesh position={[0.08, 0, depth / 2 + 0.04]} castShadow>
              <boxGeometry args={[0.02, 0.15, 0.02]} />
              <meshStandardMaterial
                color="#C0C0C0"
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            {/* Top decoration */}
            <mesh position={[0, height / 2 + 0.02, 0]} castShadow>
              <boxGeometry args={[width + 0.02, 0.03, depth + 0.02]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.4}
                metalness={0.2}
              />
            </mesh>
          </group>
        );

      case "مصباح": // Lamp
        return (
          <group>
            {/* Base */}
            <mesh position={[0, -height / 2 + 0.05, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.15, 0.08, 16]} />
              <meshStandardMaterial
                color="#2d2d2d"
                roughness={0.3}
                metalness={0.6}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Pole */}
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, height - 0.4, 8]} />
              <meshStandardMaterial
                color="#5d5d5d"
                roughness={0.3}
                metalness={0.7}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {/* Shade */}
            <mesh position={[0, height / 2 - 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.18, 0.25, 16]} />
              <meshStandardMaterial
                color={item.color}
                roughness={0.8}
                metalness={0}
                emissive={item.color}
                emissiveIntensity={0.3}
                transparent
                opacity={0.9}
              />
            </mesh>
            {/* Light bulb glow */}
            <pointLight
              position={[0, height / 2 - 0.15, 0]}
              intensity={0.5}
              color="#fff8e7"
              distance={2}
            />
          </group>
        );

      default:
        // Default box for unknown furniture
        return (
          <mesh castShadow>
            <boxGeometry args={item.size} />
            <meshStandardMaterial
              color={item.color}
              roughness={0.7}
              metalness={0.1}
              emissive={emissiveColor}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={[item.x, item.size[1] / 2, item.z]}
      rotation={[0, item.rotation || 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}>
      {renderFurniture()}
      {(showToolbar || dragging) && (
        <Html center>
          <div className="flex flex-col items-center gap-3">
            {/* شريط الأدوات - يظهر عند النقر */}
            {!dragging && showToolbar && (
              <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur px-3 py-2 rounded-xl shadow-xl border border-white/10">
                {/* زر الحذف */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.();
                  }}
                  className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-red-500/80 hover:bg-red-400 active:bg-red-600 rounded-lg transition-colors text-white font-bold touch-manipulation"
                  title="حذف">
                  <span className="text-lg">🗑️</span>
                </button>
                
                {/* زر تغيير اللون */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.();
                  }}
                  className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-purple-500/80 hover:bg-purple-400 active:bg-purple-600 rounded-lg transition-colors text-white font-bold touch-manipulation"
                  title="تغيير اللون">
                  <span className="text-lg">🎨</span>
                </button>
                
                {/* أزرار التدوير */}
                {onRotationChange && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRotationChange((item.rotation || 0) - Math.PI / 36);
                      }}
                      className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-indigo-500/80 hover:bg-indigo-400 active:bg-indigo-600 rounded-lg transition-colors text-white font-bold touch-manipulation"
                      title="تدوير لليسار">
                      <span className="text-lg">↺</span>
                    </button>
                    <span className="text-white/60 text-sm px-1">تدوير</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRotationChange((item.rotation || 0) + Math.PI / 36);
                      }}
                      className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-indigo-500/80 hover:bg-indigo-400 active:bg-indigo-600 rounded-lg transition-colors text-white font-bold touch-manipulation"
                      title="تدوير لليمين">
                      <span className="text-lg">↻</span>
                    </button>
                  </>
                )}
              </div>
            )}
            {/* رسالة الحالة - تظهر فقط عند السحب */}
            {dragging && (
              <div className="bg-blue-500/90 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-xl flex items-center gap-3 whitespace-nowrap">
                📍 اسحب لتحريك الأثاث
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// ========== مكون الغرفة الكامل ==========
interface RoomProps {
  dimensions: Dimensions;
  materials: SelectedMaterials;
  furniture: FurnitureItem[];
  onWallClick?: (wallType: string) => void;
  selectedWall?: string | null;
  onFurnitureRemove?: (index: number) => void;
  onFurniturePositionChange?: (index: number, x: number, z: number) => void;
  onFurnitureRotationChange?: (index: number, rotation: number) => void;
  onFurnitureDragStart?: () => void;
  onFurnitureDragEnd?: () => void;
  onFurnitureSelect?: (index: number) => void;
  // خصائص الشبكة
  gridSettings?: WallGridSettings;
  wallCells?: WallCellsState;
  onCellClick?: (wallType: string, row: number, col: number) => void;
  selectedCell?: SelectedCellInfo | null;
}

function Room({
  dimensions,
  materials,
  furniture,
  onWallClick,
  selectedWall,
  onFurnitureRemove,
  onFurniturePositionChange,
  onFurnitureRotationChange,
  onFurnitureDragStart,
  onFurnitureDragEnd,
  onFurnitureSelect,
  gridSettings,
  wallCells,
  onCellClick,
  selectedCell,
}: RoomProps) {
  const { width, length, height } = dimensions;

  // الإعدادات الافتراضية للشبكة
  const defaultGridSettings: WallGridSettings = {
    enabled: false,
    rows: 3,
    cols: 4,
  };
  const activeGridSettings = gridSettings || defaultGridSettings;

  // الخلايا الافتراضية
  const defaultCells: WallCellsState = {
    back: [],
    front: [],
    left: [],
    right: [],
  };
  const activeCells = wallCells || defaultCells;

  return (
    <group>
      <Floor dimensions={dimensions} material={materials.floor} />
      <Ceiling dimensions={dimensions} material={materials.ceiling} />

      <GridWall
        position={[0, height / 2, -length / 2]}
        rotation={[0, 0, 0]}
        size={[width, height]}
        baseMaterial={materials.backWall || materials.wall}
        wallType="back"
        gridSettings={activeGridSettings}
        cellMaterials={activeCells.back}
        onCellClick={onCellClick}
        selectedCell={selectedCell}
        onWallClick={onWallClick}
        isWallSelected={selectedWall === "back"}
      />

      <GridWall
        position={[0, height / 2, length / 2]}
        rotation={[0, Math.PI, 0]}
        size={[width, height]}
        baseMaterial={materials.frontWall || materials.wall}
        wallType="front"
        gridSettings={activeGridSettings}
        cellMaterials={activeCells.front}
        onCellClick={onCellClick}
        selectedCell={selectedCell}
        onWallClick={onWallClick}
        isWallSelected={selectedWall === "front"}
      />

      <GridWall
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[length, height]}
        baseMaterial={materials.leftWall || materials.wall}
        wallType="left"
        gridSettings={activeGridSettings}
        cellMaterials={activeCells.left}
        onCellClick={onCellClick}
        selectedCell={selectedCell}
        onWallClick={onWallClick}
        isWallSelected={selectedWall === "left"}
      />

      <GridWall
        position={[width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[length, height]}
        baseMaterial={materials.rightWall || materials.wall}
        wallType="right"
        gridSettings={activeGridSettings}
        cellMaterials={activeCells.right}
        onCellClick={onCellClick}
        selectedCell={selectedCell}
        onWallClick={onWallClick}
        isWallSelected={selectedWall === "right"}
      />

      {furniture.map((item, idx) => (
        <Furniture
          key={`${item.id}-${idx}`}
          item={item}
          onRemove={() => onFurnitureRemove?.(idx)}
          onPositionChange={(x, z) => onFurniturePositionChange?.(idx, x, z)}
          onRotationChange={(rotation) => onFurnitureRotationChange?.(idx, rotation)}
          roomDimensions={{ width, length }}
          onDragStart={onFurnitureDragStart}
          onDragEnd={onFurnitureDragEnd}
          onSelect={() => onFurnitureSelect?.(idx)}
        />
      ))}

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.5}
        scale={25}
        blur={2.5}
        far={12}
      />
    </group>
  );
}

// ========== نظام الإضاءة ==========
function Lighting({ preset }: { preset: LightingPreset }) {
  return (
    <>
      <ambientLight intensity={preset.ambient} color={preset.color} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={preset.directional}
        color={preset.color}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <pointLight
        position={[0, 4, 0]}
        intensity={preset.ambient * 0.4}
        color={preset.color}
      />
      <hemisphereLight intensity={0.35} groundColor="#5d4a3a" color="#b4c6e7" />
    </>
  );
}

// ========== مكون التقاط الصورة ==========
function ScreenshotHelper({
  onCapture,
}: {
  onCapture: (dataUrl: string) => void;
}) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const handleCapture = () => {
      gl.render(scene, camera);
      onCapture(gl.domElement.toDataURL("image/png"));
    };
    (window as any).captureScreenshot = handleCapture;
    return () => {
      delete (window as any).captureScreenshot;
    };
  }, [gl, scene, camera, onCapture]);

  return null;
}

// ========== مكون الخلفية ==========
function SceneBackground({ settings }: { settings: BackgroundSettings }) {
  const { scene } = useThree();
  
  useEffect(() => {
    if (settings.type === 'color') {
      scene.background = new THREE.Color(settings.value);
    } else {
      // للنسيج نستخدم لون بسيط كبديل مؤقت
      // يمكن تحسينه لاحقاً باستخدام CubeTextureLoader
      scene.background = new THREE.Color('#1a1a2e');
    }
  }, [scene, settings]);
  
  return null;
}

// ========== مكون معاينة الخامة ==========
interface MaterialPreviewProps {
  material: DBMaterial;
  isSelected: boolean;
  onClick: () => void;
}

function MaterialPreview({
  material,
  isSelected,
  onClick,
}: MaterialPreviewProps) {
  const [isLoaded, setIsLoaded] = useState(material.materialType === "color");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative cursor-pointer group overflow-hidden rounded-xl
        transition-all duration-300 ease-out
        ${
          isSelected
            ? "ring-2 ring-[#084C5C] ring-offset-2 ring-offset-[#022d37] scale-[1.02]"
            : "hover:scale-105 hover:shadow-xl hover:shadow-[#084C5C]/30"
        }
      `}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {material.materialType === "color" ? (
          <div
            className="w-full h-full"
            style={{ backgroundColor: material.color }}
          />
        ) : (
          <>
            {!isLoaded && (
              <div className="absolute inset-0 bg-[#011a20] animate-pulse flex items-center justify-center">
                <RefreshCw size={20} className="text-[#084C5C] animate-spin" />
              </div>
            )}
            <img
              src={material.textureUrl}
              alt={material.name}
              className={`w-full h-full object-cover transition-opacity ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsLoaded(true)}
            />
          </>
        )}

        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#022d37]/90 via-[#022d37]/30 to-transparent transition-opacity ${
            isHovered || isSelected ? "opacity-100" : "opacity-60"
          }`}
        />

        {isSelected && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-[#084C5C] rounded-full flex items-center justify-center">
            <Check size={14} className="text-[#ffedd8]" />
          </div>
        )}

        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[10px] font-bold ${
            material.materialType === "color"
              ? "bg-[#084C5C]/80 text-[#ffedd8]"
              : "bg-[#0a6275]/80 text-[#ffedd8]"
          }`}>
          {material.materialType === "color" ? (
            <span className="flex items-center gap-1">
              <Palette size={10} />
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Image size={10} />
            </span>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-[#ffedd8] font-semibold text-sm">{material.name}</p>
        <p className="text-[#ffedd8]/60 text-xs">{material.nameEn}</p>
      </div>
    </div>
  );
}

export default function RoomDesignStudio() {
  // Auth context
  const { isProvider } = useAuth();
  
  // الحالات
  const [apiKey, setApiKey] = useState(import.meta.env.GEMINI_API_KEY || "");
  const [showSettings, setShowSettings] = useState(false);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 5,
    length: 5,
    height: 3,
  });

  // خامات من قاعدة البيانات
  const [dbMaterials, setDbMaterials] =
    useState<DBMaterial[]>(DEFAULT_MATERIALS);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  // الخامات المحددة
  const defaultMaterial: SelectedMaterial = {
    id: "c1",
    type: "color",
    value: "#FFFFFF",
    roughness: 0.9,
    metalness: 0,
    tileSize: 4,
  };

  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterials>(
    {
      wall: defaultMaterial,
      floor: {
        ...defaultMaterial,
        id: "f1",
        value: "#FAFAFA",
        roughness: 0.2,
        metalness: 0.3,
        tileSize: 2,
      },
      ceiling: {
        ...defaultMaterial,
        id: "s1",
        value: "#FFFFFF",
        roughness: 0.95,
      },
    }
  );

  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  // Provider-only: إدارة قائمة الأثاث المتاحة والتحكم بظهورها
  const [availableFurniture, setAvailableFurniture] = useState(FURNITURE_TEMPLATES);
  const [furnitureVisibility, setFurnitureVisibility] = useState<Record<string, boolean>>(
    FURNITURE_TEMPLATES.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
  );
  const [showProductControlPanel, setShowProductControlPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"wall" | "floor" | "ceiling">(
    "wall"
  );
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [currentProjectName, setCurrentProjectName] = useState("New Project");
  const [creatorName, setCreatorName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [selectedWall, setSelectedWall] = useState<string | null>(null);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>(
    LIGHTING_PRESETS[0]
  );
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [isDraggingFurniture, setIsDraggingFurniture] = useState(false);
  const [suggestedColors, setSuggestedColors] = useState<
    { name: string; hex: string; reason: string }[]
  >([]);

  // ========== نظام التراجع والإعادة ==========
  const [actionHistory, setActionHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const MAX_HISTORY = 5;

  // ========== إعدادات الخلفية ==========
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    type: 'color',
    value: '#c2410c', // برتقالي افتراضي كما في الصورة
  });
  const [showBackgroundPanel, setShowBackgroundPanel] = useState(false);

  // ========== منتقي ألوان الأثاث ==========
  const [selectedFurnitureIndex, setSelectedFurnitureIndex] = useState<number | null>(null);
  const [showFurnitureColorPicker, setShowFurnitureColorPicker] = useState(false);

  // ========== إعدادات الشبكة للجدران ==========
  const [wallGridSettings, setWallGridSettings] = useState<WallGridSettings>({
    enabled: false,
    rows: 3,
    cols: 4,
  });
  const [wallCells, setWallCells] = useState<WallCellsState>({
    back: [],
    front: [],
    left: [],
    right: [],
  });
  const [selectedCell, setSelectedCell] = useState<SelectedCellInfo | null>(null);
  const [showGridControls, setShowGridControls] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // جلب الخامات من API
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoadingMaterials(true);
      try {
        const res = await fetch(`${API_URL}/materials?isActive=true`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setDbMaterials(data);
            setApiConnected(true);

            // تعيين الخامات الافتراضية من قاعدة البيانات
            const defaultWall = data.find((m: DBMaterial) => m.type === "wall");
            const defaultFloor = data.find(
              (m: DBMaterial) => m.type === "floor"
            );
            const defaultCeiling = data.find(
              (m: DBMaterial) => m.type === "ceiling"
            );

            if (defaultWall) {
              setSelectedMaterials((prev) => ({
                ...prev,
                wall: materialToSelected(defaultWall),
              }));
            }
            if (defaultFloor) {
              setSelectedMaterials((prev) => ({
                ...prev,
                floor: materialToSelected(defaultFloor),
              }));
            }
            if (defaultCeiling) {
              setSelectedMaterials((prev) => ({
                ...prev,
                ceiling: materialToSelected(defaultCeiling),
              }));
            }
          }
        }
      } catch (error) {
        console.log("API غير متاح، استخدام البيانات المحلية");
        setApiConnected(false);
      }
      setIsLoadingMaterials(false);
    };

    fetchMaterials();
    loadApiKey();
    loadProjects();
  }, []);

  // تحويل خامة من قاعدة البيانات إلى الصيغة المستخدمة
  const materialToSelected = (m: DBMaterial): SelectedMaterial => {
    // إذا كانت الخامة texture لكن textureUrl غير موجود، نستخدم اللون كبديل
    const isValidTexture =
      m.materialType === "texture" &&
      m.textureUrl &&
      m.textureUrl.trim() !== "";

    return {
      id: m._id,
      type: isValidTexture ? "texture" : "color",
      value: isValidTexture ? m.textureUrl! : m.color || "#FFFFFF",
      roughness: m.roughness,
      metalness: m.metalness,
      tileSize: m.tileSize,
    };
  };

  // تصفية الخامات حسب النوع
  const filteredMaterials = useMemo(() => {
    return dbMaterials.filter((m) => m.type === activeTab && m.isActive);
  }, [dbMaterials, activeTab]);

  const loadApiKey = async () => {
    try {
      const saved = localStorage.getItem("gemini_api_key");
      if (saved) setApiKey(saved);
    } catch (error) {
      console.log("لا يوجد API key محفوظ");
    }
  };

  const saveApiKey = () => {
    localStorage.setItem("gemini_api_key", apiKey);
    setShowSettings(false);
  };

  // ========== تحميل المشاريع من قاعدة البيانات ==========
  const loadProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      if (res.ok) {
        const data = await res.json();
        setSavedProjects(data);
      } else {
        // fallback إلى localStorage
      const saved = localStorage.getItem("room_projects");
      if (saved) setSavedProjects(JSON.parse(saved));
      }
    } catch (error) {
      console.log("فشل في تحميل المشاريع من قاعدة البيانات");
      const saved = localStorage.getItem("room_projects");
      if (saved) setSavedProjects(JSON.parse(saved));
    }
  };

  // ========== حساب تكاليف المشروع ==========
  const calculateProjectCosts = () => {
    const { width, length, height } = dimensions;
    const floorArea = width * length;
    const ceilingArea = width * length;
    const wallsArea = 2 * (width * height) + 2 * (length * height);
    const singleWallArea = wallsArea / 4;

    // أسعار افتراضية للخامات (سعر المتر المربع)
    const DEFAULT_PRICES: Record<string, Record<string, number>> = {
      wall: { color: 12, texture: 18 },
      floor: { color: 35, texture: 45 },
      ceiling: { color: 15, texture: 22 }
    };

    // دالة للبحث عن الخامة في قاعدة البيانات
    const findMaterial = (matId: string) => {
      return dbMaterials.find(m => m._id === matId || m._id === matId);
    };

    // دالة للحصول على سعر الخامة
    const getMaterialPrice = (mat: SelectedMaterial, surfaceType: 'wall' | 'floor' | 'ceiling'): number => {
      const dbMat = findMaterial(mat.id);
      if (dbMat && dbMat.pricePerMeter && dbMat.pricePerMeter > 0) {
        return dbMat.pricePerMeter;
      }
      // استخدام السعر الافتراضي
      return DEFAULT_PRICES[surfaceType]?.[mat.type] || 10;
    };

    // حساب تكلفة الخامات
    let materialsCost = 0;
    const materialsDetails: any = {};

    // خامات الجدران
    const wallMaterials = ['wall', 'backWall', 'frontWall', 'leftWall', 'rightWall'];
    for (const key of wallMaterials) {
      const mat = selectedMaterials[key as keyof typeof selectedMaterials];
      if (mat) {
        const dbMat = findMaterial(mat.id);
        const pricePerMeter = getMaterialPrice(mat, 'wall');
        const area = key === 'wall' ? wallsArea : singleWallArea;
        const totalPrice = pricePerMeter * area;
        materialsCost += totalPrice;
        
        materialsDetails[key] = {
          materialId: mat.id,
          name: dbMat?.name || 'خامة مخصصة',
          nameEn: dbMat?.nameEn || 'Custom Material',
          type: 'wall',
          materialType: mat.type,
          value: mat.value,
          pricePerMeter,
          area,
          totalPrice
        };
      }
    }

    // خامة الأرضية
    const floorMat = selectedMaterials.floor;
    if (floorMat) {
      const dbMat = findMaterial(floorMat.id);
      const pricePerMeter = getMaterialPrice(floorMat, 'floor');
      const totalPrice = pricePerMeter * floorArea;
      materialsCost += totalPrice;
      
      materialsDetails.floor = {
        materialId: floorMat.id,
        name: dbMat?.name || 'خامة مخصصة',
        nameEn: dbMat?.nameEn || 'Custom Material',
        type: 'floor',
        materialType: floorMat.type,
        value: floorMat.value,
        pricePerMeter,
        area: floorArea,
        totalPrice
      };
    }

    // خامة السقف
    const ceilingMat = selectedMaterials.ceiling;
    if (ceilingMat) {
      const dbMat = findMaterial(ceilingMat.id);
      const pricePerMeter = getMaterialPrice(ceilingMat, 'ceiling');
      const totalPrice = pricePerMeter * ceilingArea;
      materialsCost += totalPrice;
      
      materialsDetails.ceiling = {
        materialId: ceilingMat.id,
        name: dbMat?.name || 'خامة مخصصة',
        nameEn: dbMat?.nameEn || 'Custom Material',
        type: 'ceiling',
        materialType: ceilingMat.type,
        value: ceilingMat.value,
        pricePerMeter,
        area: ceilingArea,
        totalPrice
      };
    }

    // حساب تكلفة الأثاث
    let furnitureCost = 0;
    const furnitureWithPrices = furniture.map(item => {
      const template = FURNITURE_TEMPLATES.find(t => t.name === item.name);
      // أسعار افتراضية للأثاث
      const prices: Record<string, number> = {
        'كنبة': 850,
        'طاولة': 650,
        'كرسي': 280,
        'سرير': 1200,
        'خزانة': 950,
        'مصباح': 180
      };
      const price = prices[item.name] || 100;
      furnitureCost += price;
      
      return {
        ...item,
        price,
        quantity: 1
      };
    });

    const totalPrice = materialsCost + furnitureCost;

    return {
      materials: materialsDetails,
      furniture: furnitureWithPrices,
      calculatedAreas: {
        floorArea,
        ceilingArea,
        wallsArea,
        totalArea: floorArea + ceilingArea + wallsArea
      },
      pricing: {
        materialsCost,
        furnitureCost,
        additionalCost: 0,
        discount: 0,
        taxRate: 0,
        taxAmount: 0,
        totalPrice,
        currency: 'USD'
      }
    };
  };

  // ========== حفظ المشروع في قاعدة البيانات ==========
  const saveProject = async () => {
    if (!currentProjectName.trim()) {
      setSaveError("يرجى إدخال اسم المشروع");
      return;
    }

    setIsSavingProject(true);
    setSaveError("");

    try {
      // التقاط صورة المشروع
      let screenshot = "";
      if ((window as any).captureScreenshot) {
        await new Promise<void>((resolve) => {
          const originalCapture = (window as any).captureScreenshot;
          (window as any).captureScreenshot = () => {
            originalCapture();
          };
          // التقاط الصورة
          const canvas = document.querySelector('canvas');
          if (canvas) {
            screenshot = canvas.toDataURL('image/jpeg', 0.7);
          }
          resolve();
        });
      }

      // حساب التكاليف
      const costs = calculateProjectCosts();

      // تحويل إعدادات الخلفية للصيغة المطلوبة
      const backgroundData = {
        bgType: backgroundSettings.type,
        bgValue: backgroundSettings.value
      };

    const projectData = {
        name: currentProjectName,
        description: projectDescription,
        creatorName: creatorName || 'مجهول',
        dimensions,
        materials: costs.materials,
        furniture: costs.furniture,
        lightingPreset: lightingPreset.id,
        background: backgroundData,
        screenshot: screenshot ? screenshot.substring(0, 500000) : '', // تقليل حجم الصورة
        calculatedAreas: costs.calculatedAreas,
        pricing: costs.pricing,
        status: 'draft',
        isPublic: false,
        tags: [lightingPreset.name, `${dimensions.width}x${dimensions.length}`]
      };

      console.log("📤 جاري إرسال المشروع...", { name: projectData.name, hasScreenshot: !!screenshot });

      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (res.ok) {
        const savedProject = await res.json();
        setSavedProjects(prev => [savedProject, ...prev]);
        setShowSaveDialog(false);
        setCurrentProjectName("New Project");
        setCreatorName("");
        setProjectDescription("");
        console.log("✅ تم حفظ المشروع بنجاح!", savedProject);
      } else {
        const errorData = await res.json();
        console.error("❌ خطأ من الخادم:", errorData);
        setSaveError(errorData.details || errorData.error || "فشل في حفظ المشروع");
      }
    } catch (error: any) {
      console.error("خطأ في حفظ المشروع:", error);
      setSaveError("فشل في الاتصال بالخادم");
      
      // Fallback إلى localStorage
      const localProject = {
      id: Date.now(),
      name: currentProjectName,
        creatorName: creatorName || 'مجهول',
      dimensions,
      materials: selectedMaterials,
      furniture,
      lightingPreset: lightingPreset.id,
      timestamp: new Date().toISOString(),
    };
      const updated = [...savedProjects, localProject];
    localStorage.setItem("room_projects", JSON.stringify(updated));
    setSavedProjects(updated);
    setShowSaveDialog(false);
    } finally {
      setIsSavingProject(false);
    }
  };

  // ========== تحميل مشروع ==========
  const loadProject = (project: any) => {
    setDimensions(project.dimensions);
    
    // تحميل الخامات
    if (project.materials) {
      const newMaterials: any = { ...selectedMaterials };
      for (const [key, mat] of Object.entries(project.materials) as any) {
        if (mat && mat.value) {
          newMaterials[key] = {
            id: mat.materialId || mat.id,
            type: mat.materialType || mat.type,
            value: mat.value,
            roughness: mat.roughness || 0.8,
            metalness: mat.metalness || 0,
            tileSize: mat.tileSize || 2
          };
        }
      }
      setSelectedMaterials(newMaterials);
    }
    
    // تحميل الأثاث
    if (project.furniture) {
      setFurniture(project.furniture.map((f: any) => ({
        id: f.id,
        name: f.name,
        color: f.color,
        size: f.size,
        x: f.x,
        z: f.z,
        rotation: f.rotation
      })));
    }
    
    setCurrentProjectName(project.name);
    if (project.creatorName) setCreatorName(project.creatorName);
    if (project.description) setProjectDescription(project.description);
    
    // تحميل إعدادات الخلفية
    if (project.background) {
      setBackgroundSettings({
        type: project.background.bgType || project.background.type || 'color',
        value: project.background.bgValue || project.background.value || '#c2410c'
      });
    }
    
    const preset = LIGHTING_PRESETS.find(p => p.id === project.lightingPreset);
    if (preset) setLightingPreset(preset);
  };

  // ========== حذف مشروع ==========
  const deleteProject = async (id: string | number) => {
    try {
      // محاولة الحذف من قاعدة البيانات
      const res = await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSavedProjects(prev => prev.filter(p => p._id !== id && p.id !== id));
      }
    } catch (error) {
      // Fallback: حذف من localStorage
      const updated = savedProjects.filter((p) => p.id !== id && p._id !== id);
    localStorage.setItem("room_projects", JSON.stringify(updated));
    setSavedProjects(updated);
    }
  };

  // ========== التسجيل الصوتي ==========
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) =>
        audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setAiPrompt("غرفة معيشة عصرية بألوان محايدة وإضاءة طبيعية");
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("لا يمكن الوصول إلى الميكروفون");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // ========== تحليل AI ==========
  const analyzeWithGemini = async () => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    if (!aiPrompt.trim()) return;

    setIsAnalyzing(true);
    setAiResponse("جاري التحليل بواسطة الذكاء الاصطناعي...");

    // إضافة timeout للطلب
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 ثانية

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `أنت مصمم ديكور داخلي محترف. بناءً على الوصف التالي، اقترح 3 ألوان فقط للجدران.

الوصف: "${aiPrompt}"

أعطني JSON فقط بهذا الشكل:
{
  "colors": [
    {
      "name": "اسم اللون بالعربية",
      "hex": "#XXXXXX",
      "reason": "سبب مختصر للاقتراح"
    },
    {
      "name": "اسم اللون الثاني",
      "hex": "#XXXXXX", 
      "reason": "سبب مختصر"
    },
    {
      "name": "اسم اللون الثالث",
      "hex": "#XXXXXX",
      "reason": "سبب مختصر"
    }
  ],
  "lightingPreset": "day/evening/warm/cool"
}

ملاحظات مهمة:
- اختر ألوان متناسقة مع بعضها
- راعي طبيعة الغرفة والأجواء المطلوبة
- استخدم أكواد HEX صحيحة`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts[0]?.text) {
        const jsonMatch =
          data.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const suggestions = JSON.parse(jsonMatch[0]);

          // تطبيق نمط الإضاءة
          if (suggestions.lightingPreset) {
            const preset = LIGHTING_PRESETS.find(
              (p) => p.id === suggestions.lightingPreset
            );
            if (preset) setLightingPreset(preset);
          }

          // تنسيق الرد مع الألوان المقترحة
          if (suggestions.colors && suggestions.colors.length > 0) {
            const colorsList = suggestions.colors
              .map(
                (c: { name: string; hex: string; reason: string }, i: number) =>
                  `${i + 1}. ${c.name} (${c.hex})\n   💡 ${c.reason}`
              )
              .join("\n\n");

            setAiResponse(
              `🎨 الألوان المقترحة:\n\n${colorsList}\n\n✨ انقر على أي لون لتطبيقه على الجدران`
            );

            // حفظ الألوان المقترحة للاستخدام لاحقاً
            setSuggestedColors(suggestions.colors);
          } else {
            setAiResponse("تعذر الحصول على اقتراحات. جرب مرة أخرى.");
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        setAiResponse(
          "⏱️ انتهت مهلة الطلب. تأكد من اتصالك بالإنترنت وحاول مرة أخرى."
        );
      } else {
        setAiResponse("❌ حدث خطأ: " + error.message);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsAnalyzing(false);
    }
  };

  // معالجة اختيار خامة
  const handleMaterialSelect = (material: DBMaterial) => {
    const selected = materialToSelected(material);
    const key =
      activeTab === "wall"
        ? "wall"
        : activeTab === "floor"
        ? "floor"
        : "ceiling";

    if (selectedWall && activeTab === "wall") {
      const wallKey = `${selectedWall}Wall` as keyof SelectedMaterials;
      setSelectedMaterials((prev) => ({ ...prev, [wallKey]: selected }));
    } else {
      setSelectedMaterials((prev) => ({ ...prev, [key]: selected }));
    }
  };

  const handleWallClick = (wallType: string) => {
    setSelectedWall((prev) => (prev === wallType ? null : wallType));
    setActiveTab("wall");
  };

  const addFurniture = (template: (typeof FURNITURE_TEMPLATES)[0]) => {
    const newItem: FurnitureItem = {
      ...template,
      x: Math.random() * 2 - 1,
      z: Math.random() * 2 - 1,
      rotation: Math.random() * Math.PI * 2,
    };
    
    addToHistory({
      type: 'add_furniture',
      timestamp: Date.now(),
      furnitureIndex: furniture.length,
      newState: newItem,
    });
    
    setFurniture([...furniture, newItem]);
  };

  // ========== حذف الأثاث مع التاريخ ==========
  const removeFurnitureWithHistory = (index: number) => {
    const previousState = { ...furniture[index] };
    
    addToHistory({
      type: 'remove_furniture',
      timestamp: Date.now(),
      furnitureIndex: index,
      previousState,
    });
    
    setFurniture(prev => prev.filter((_, i) => i !== index));
    setSelectedFurnitureIndex(null);
    setShowFurnitureColorPicker(false);
  };

  // ========== تحريك الأثاث مع التاريخ ==========
  const moveFurnitureWithHistory = (index: number, x: number, z: number) => {
    const previousState = { ...furniture[index] };
    const newState = { ...furniture[index], x, z };
    
    // نضيف فقط إذا كان التغيير كبيراً بما يكفي
    const distance = Math.sqrt(
      Math.pow(newState.x - previousState.x, 2) + 
      Math.pow(newState.z - previousState.z, 2)
    );
    
    if (distance > 0.5) {
      addToHistory({
        type: 'move_furniture',
        timestamp: Date.now(),
        furnitureIndex: index,
        previousState,
        newState,
      });
    }
    
    setFurniture(prev =>
      prev.map((item, i) => (i === index ? { ...item, x, z } : item))
    );
  };

  // ========== تدوير الأثاث مع التاريخ ==========
  const rotateFurnitureWithHistory = (index: number, rotation: number) => {
    const previousState = { ...furniture[index] };
    const newState = { ...furniture[index], rotation };
    
    addToHistory({
      type: 'rotate_furniture',
      timestamp: Date.now(),
      furnitureIndex: index,
      previousState,
      newState,
    });
    
    setFurniture(prev =>
      prev.map((item, i) => (i === index ? { ...item, rotation } : item))
    );
  };

  const captureScreenshot = () => {
    if ((window as any).captureScreenshot) (window as any).captureScreenshot();
  };

  const handleScreenshotCapture = (dataUrl: string) => {
    const link = document.createElement("a");
    link.download = `buildex4syria-room-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const resetRoom = () => {
    setDimensions({ width: 5, length: 5, height: 3 });
    setSelectedMaterials({
      wall: defaultMaterial,
      floor: {
        ...defaultMaterial,
        id: "f1",
        value: "#FAFAFA",
        roughness: 0.2,
        metalness: 0.3,
        tileSize: 2,
      },
      ceiling: {
        ...defaultMaterial,
        id: "s1",
        value: "#FFFFFF",
        roughness: 0.95,
      },
    });
    setFurniture([]);
    setSelectedWall(null);
    setLightingPreset(LIGHTING_PRESETS[0]);
    setActionHistory([]);
    setHistoryIndex(-1);
  };

  // ========== وظائف التراجع والإعادة ==========
  const addToHistory = useCallback((action: HistoryAction) => {
    setActionHistory(prev => {
      // إزالة أي إجراءات بعد المؤشر الحالي
      const newHistory = prev.slice(0, historyIndex + 1);
      // إضافة الإجراء الجديد
      newHistory.push(action);
      // الاحتفاظ بآخر MAX_HISTORY إجراءات فقط
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex < 0 || actionHistory.length === 0) return;
    
    const action = actionHistory[historyIndex];
    
    switch (action.type) {
      case 'add_furniture':
        if (action.furnitureIndex !== undefined) {
          setFurniture(prev => prev.filter((_, i) => i !== action.furnitureIndex));
        }
        break;
      case 'remove_furniture':
        if (action.previousState) {
          setFurniture(prev => {
            const newFurniture = [...prev];
            if (action.furnitureIndex !== undefined) {
              newFurniture.splice(action.furnitureIndex, 0, action.previousState!);
            }
            return newFurniture;
          });
        }
        break;
      case 'move_furniture':
      case 'rotate_furniture':
      case 'change_furniture_color':
        if (action.previousState && action.furnitureIndex !== undefined) {
          setFurniture(prev => 
            prev.map((item, i) => i === action.furnitureIndex ? action.previousState! : item)
          );
        }
        break;
    }
    
    setHistoryIndex(prev => prev - 1);
  }, [historyIndex, actionHistory]);

  const redo = useCallback(() => {
    if (historyIndex >= actionHistory.length - 1) return;
    
    const action = actionHistory[historyIndex + 1];
    
    switch (action.type) {
      case 'add_furniture':
        if (action.newState) {
          setFurniture(prev => [...prev, action.newState!]);
        }
        break;
      case 'remove_furniture':
        if (action.furnitureIndex !== undefined) {
          setFurniture(prev => prev.filter((_, i) => i !== action.furnitureIndex));
        }
        break;
      case 'move_furniture':
      case 'rotate_furniture':
      case 'change_furniture_color':
        if (action.newState && action.furnitureIndex !== undefined) {
          setFurniture(prev => 
            prev.map((item, i) => i === action.furnitureIndex ? action.newState! : item)
          );
        }
        break;
    }
    
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex, actionHistory]);

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < actionHistory.length - 1;

  // ========== تغيير لون الأثاث ==========
  const changeFurnitureColor = (index: number, newColor: string) => {
    const previousState = { ...furniture[index] };
    const newState = { ...furniture[index], color: newColor };
    
    addToHistory({
      type: 'change_furniture_color',
      timestamp: Date.now(),
      furnitureIndex: index,
      previousState,
      newState,
    });
    
    setFurniture(prev => 
      prev.map((item, i) => i === index ? { ...item, color: newColor } : item)
    );
  };

  // ========== التحكم بخلايا الجدار ==========
  const handleCellClick = useCallback((wallType: string, row: number, col: number) => {
    setSelectedCell({ wallType, row, col });
    setSelectedWall(null); // إلغاء تحديد الجدار الكامل عند تحديد خلية
  }, []);

  const applyCellMaterial = useCallback((material: DBMaterial) => {
    if (!selectedCell) return;
    
    const { wallType, row, col } = selectedCell;
    const newCellMaterial: WallCellMaterial = {
      row,
      col,
      material: materialToSelected(material),
    };

    setWallCells(prev => {
      const wallKey = wallType as keyof WallCellsState;
      const existingCells = prev[wallKey].filter(
        c => !(c.row === row && c.col === col)
      );
      return {
        ...prev,
        [wallKey]: [...existingCells, newCellMaterial],
      };
    });
  }, [selectedCell]);

  const clearCellMaterial = useCallback(() => {
    if (!selectedCell) return;
    
    const { wallType, row, col } = selectedCell;
    setWallCells(prev => {
      const wallKey = wallType as keyof WallCellsState;
      return {
        ...prev,
        [wallKey]: prev[wallKey].filter(
          c => !(c.row === row && c.col === col)
        ),
      };
    });
    setSelectedCell(null);
  }, [selectedCell]);

  const clearAllCells = useCallback((wallType?: string) => {
    if (wallType) {
      const wallKey = wallType as keyof WallCellsState;
      setWallCells(prev => ({
        ...prev,
        [wallKey]: [],
      }));
    } else {
      setWallCells({
        back: [],
        front: [],
        left: [],
        right: [],
      });
    }
    setSelectedCell(null);
  }, []);

  const wallNames: Record<string, string> = {
    back: "الجدار الخلفي",
    front: "الجدار الأمامي",
    left: "الجدار الأيسر",
    right: "الجدار الأيمن",
  };

  return (
    <div
      className="w-full h-screen bg-[#ffedd8] flex overflow-hidden font-cairo">
      {/* لوحة التحكم الجانبية */}
      <div
        className={`
        ${sidebarCollapsed ? "w-0 opacity-0" : "w-[400px] opacity-100"}
        bg-gradient-to-b from-[#022d37] via-[#022d37] to-[#011a20]
        backdrop-blur-2xl text-white flex flex-col
        border-l border-[#084C5C]/30 shadow-2xl
        overflow-hidden transition-all duration-500
      `}>
        {/* رأس اللوحة */}
        <div className="p-6 border-b border-[#084C5C]/30 bg-gradient-to-l from-[#084C5C]/20 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <span className="text-gradient">Buildex Studio</span>
                <Sparkles className="text-[#ffedd8] w-5 h-5" />
              </h1>
              <p className="text-sm text-[#ffedd8]/70 mt-1 flex items-center gap-2">
                Design your perfect room
                {apiConnected && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Database size={10} /> Connected
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              {isProvider() && (
                <a
                  href="/admin/room-configurator"
                  className="p-2.5 hover:bg-[#084C5C]/30 rounded-xl transition-all group"
                  title="Control Panel">
                  <Database
                    size={18}
                    className="text-[#ffedd8]/60 group-hover:text-[#ffedd8]"
                  />
                </a>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2.5 hover:bg-[#084C5C]/30 rounded-xl transition-all group">
                <Settings
                  size={18}
                  className="text-[#ffedd8]/60 group-hover:text-[#ffedd8] group-hover:rotate-90 transition-all duration-300"
                />
              </button>
            </div>
          </div>
        </div>

        {/* المحتوى */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* إعدادات API */}
          {showSettings && (
            <div className="p-5 glass rounded-2xl animate-fade-in">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-[#ffedd8]">
                <Zap size={16} />
                Gemini AI Settings
              </h3>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Gemini API Key"
                className="w-full p-3 bg-[#011a20] border border-[#084C5C]/30 rounded-xl text-sm focus:ring-2 focus:ring-[#084C5C] outline-none text-white placeholder:text-white/40"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={saveApiKey}
                  className="flex-1 bg-gradient-to-l from-[#084C5C] to-[#0a6275] py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all">
                  حفظ
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-white/10 py-2.5 rounded-xl text-sm font-bold hover:bg-white/15 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* محلل AI */}
          <div className="p-5 bg-gradient-to-br from-[#084C5C]/30 to-[#022d37]/20 rounded-2xl border border-[#084C5C]/30">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffedd8] to-[#f5dfc5] flex items-center justify-center">
                <Sparkles size={16} className="text-[#022d37]" />
              </div>
              <span>AI Design Assistant</span>
            </h2>

            <div className="relative">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe the room... Example: A calm bedroom with blue colors"
                className="w-full p-4 pr-12 bg-[#011a20] rounded-xl text-sm h-24 border border-[#084C5C]/30 focus:ring-2 focus:ring-[#084C5C] outline-none resize-none text-white placeholder:text-white/40"
                disabled={isAnalyzing}
              />
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`absolute left-3 top-3 p-2.5 rounded-lg ${
                  isRecording
                    ? "bg-red-500 animate-pulse"
                    : "bg-[#084C5C]/30 hover:bg-[#084C5C]/50"
                }`}>
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            <button
              onClick={analyzeWithGemini}
              disabled={isAnalyzing || !aiPrompt.trim()}
              className="mt-4 w-full bg-gradient-to-l from-[#084C5C] via-[#0a6275] to-[#084C5C] py-3.5 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#084C5C]/30 transition-all">
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> تحليل واقتراح ألوان
                </>
              )}
            </button>

            {aiResponse && (
              <div className="mt-4 p-4 bg-[#011a20] rounded-xl text-sm border border-[#084C5C]/30">
                <p className="text-[#ffedd8]/80">{aiResponse}</p>
              </div>
            )}
          </div>

          {/* أبعاد الغرفة */}
          <div className="p-5 glass rounded-2xl">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#084C5C] to-[#0a6275] flex items-center justify-center">
                <LayoutGrid size={16} className="text-[#ffedd8]" />
              </div>
              Room Dimensions
            </h2>

            <div className="space-y-5">
              {[
                {
                  key: "width" as const,
                  label: "Width",
                  min: 3,
                  max: 12,
                  icon: "↔️",
                },
                {
                  key: "length" as const,
                  label: "Length",
                  min: 3,
                  max: 12,
                  icon: "↕️",
                },
                {
                  key: "height" as const,
                  label: "Height",
                  min: 2.5,
                  max: 5,
                  icon: "⬆️",
                },
              ].map(({ key, label, min, max, icon }) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-[#ffedd8]/70 flex items-center gap-2">
                      <span>{icon}</span>
                      {label}
                    </label>
                    <span className="text-sm font-bold text-[#ffedd8] bg-[#084C5C]/30 px-3 py-1 rounded-lg">
                      {dimensions[key]} م
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step="0.5"
                    value={dimensions[key]}
                    onChange={(e) =>
                      setDimensions((prev) => ({
                        ...prev,
                        [key]: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 bg-[#011a20] rounded-xl grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-[#ffedd8]/50 mb-1">المساحة</p>
                <p className="text-xl font-black text-gradient">
                  {(dimensions.width * dimensions.length).toFixed(1)} م²
                </p>
              </div>
              <div>
                <p className="text-xs text-[#ffedd8]/50 mb-1">الحجم</p>
                <p className="text-xl font-black text-gradient-warm">
                  {(
                    dimensions.width *
                    dimensions.length *
                    dimensions.height
                  ).toFixed(1)}{" "}
                  م³
                </p>
              </div>
            </div>
          </div>

          {/* الإضاءة */}
          <div className="p-5 glass rounded-2xl">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffedd8] to-[#f5dfc5] flex items-center justify-center">
                <Sun size={16} className="text-[#022d37]" />
              </div>
              Lighting Mode
            </h2>

            <div className="grid grid-cols-4 gap-2">
              {LIGHTING_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setLightingPreset(preset)}
                  className={`p-3 rounded-xl transition-all ${
                    lightingPreset.id === preset.id
                      ? "bg-gradient-to-br from-[#084C5C] to-[#0a6275] shadow-lg scale-105"
                      : "bg-white/5 hover:bg-[#084C5C]/30 border border-[#084C5C]/30"
                  }`}>
                  <div className="flex flex-col items-center gap-1.5">
                    {preset.icon}
                    <span className="text-xs font-medium">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* تحكم شبكة الجدران */}
          <div className="p-5 glass rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <LayoutGrid size={16} className="text-white" />
                </div>
                Wall Grid
              </h2>
              <button
                onClick={() => setWallGridSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  wallGridSettings.enabled
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg"
                    : "bg-white/10 hover:bg-white/20 text-[#ffedd8]/70"
                }`}>
                {wallGridSettings.enabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            {wallGridSettings.enabled && (
              <div className="space-y-4 animate-fade-in">
                {/* عدد الصفوف */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-[#ffedd8]/70">Rows</label>
                    <span className="text-sm font-bold text-[#ffedd8] bg-violet-500/30 px-3 py-1 rounded-lg">
                      {wallGridSettings.rows}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={wallGridSettings.rows}
                    onChange={(e) => setWallGridSettings(prev => ({ ...prev, rows: parseInt(e.target.value) }))}
                    className="w-full accent-violet-500"
                  />
                </div>

                {/* عدد الأعمدة */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-[#ffedd8]/70">Columns</label>
                    <span className="text-sm font-bold text-[#ffedd8] bg-violet-500/30 px-3 py-1 rounded-lg">
                      {wallGridSettings.cols}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={wallGridSettings.cols}
                    onChange={(e) => setWallGridSettings(prev => ({ ...prev, cols: parseInt(e.target.value) }))}
                    className="w-full accent-violet-500"
                  />
                </div>

                {/* معلومات الخلية المحددة */}
                {selectedCell && (
                  <div className="p-4 bg-gradient-to-r from-violet-500/20 to-indigo-600/20 rounded-xl border border-violet-500/30 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-violet-300 flex items-center gap-2">
                        <Check size={14} />
                        Selected Cell: {wallNames[selectedCell.wallType]} ({selectedCell.row + 1}, {selectedCell.col + 1})
                      </span>
                      <button
                        onClick={() => setSelectedCell(null)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-all">
                        <X size={14} className="text-violet-300" />
                      </button>
                    </div>
                    <p className="text-xs text-[#ffedd8]/60 mb-3">
                      Select a material from the section below to apply to this cell
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={clearCellMaterial}
                        className="flex-1 py-2 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg flex items-center justify-center gap-1.5 transition-all">
                        <Trash2 size={12} />
                        Remove Cell Material
                      </button>
                    </div>
                  </div>
                )}

                {/* أزرار التحكم */}
                <div className="flex gap-2">
                  <button
                    onClick={() => clearAllCells()}
                    className="flex-1 py-2.5 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Trash2 size={14} />
                    Clear All Cells
                  </button>
                </div>

                <p className="text-xs text-[#ffedd8]/50 text-center">
                  Click on any cell in the wall to select and change its material
                </p>
              </div>
            )}
          </div>

          {/* الخامات */}
          <div className="p-5 glass rounded-2xl">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#084C5C] to-[#0a6275] flex items-center justify-center">
                <Palette size={16} className="text-[#ffedd8]" />
              </div>
              Materials & Colors
              {selectedCell && wallGridSettings.enabled ? (
                <span className="text-xs bg-gradient-to-r from-violet-500/30 to-indigo-600/30 text-violet-300 px-3 py-1 rounded-lg mr-auto flex items-center gap-1 border border-violet-500/30">
                  <LayoutGrid size={12} />
                  Cell {selectedCell.row + 1},{selectedCell.col + 1}
                </span>
              ) : selectedWall ? (
                <span className="text-xs bg-[#084C5C]/20 text-[#ffedd8] px-3 py-1 rounded-lg mr-auto flex items-center gap-1">
                  <Check size={12} />
                  {wallNames[selectedWall]}
                </span>
              ) : null}
            </h2>

            {/* إشعار وضع تطبيق الخامة */}
            {selectedCell && wallGridSettings.enabled && activeTab === "wall" && (
              <div className="mb-4 p-3 bg-gradient-to-r from-violet-500/10 to-indigo-600/10 rounded-xl border border-violet-500/20 animate-fade-in">
                <p className="text-xs text-violet-300 flex items-center gap-2">
                  <Paintbrush size={14} />
                  Select a material to apply to the selected cell
                </p>
              </div>
            )}

            <div className="flex gap-2 mb-4">
              {[
                {
                  key: "wall" as const,
                  label: "Walls",
                  icon: <Layers size={14} />,
                },
                {
                  key: "floor" as const,
                  label: "Floors",
                  icon: <LayoutGrid size={14} />,
                },
                {
                  key: "ceiling" as const,
                  label: "Ceilings",
                  icon: <Box size={14} />,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === tab.key
                      ? "bg-gradient-to-l from-[#084C5C] to-[#0a6275] shadow-lg"
                      : "bg-white/5 hover:bg-[#084C5C]/30 border border-[#084C5C]/30"
                  }`}>
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {isLoadingMaterials ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw size={24} className="animate-spin text-[#ffedd8]" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto custom-scrollbar">
                {filteredMaterials.map((material) => (
                  <MaterialPreview
                    key={material._id}
                    material={material}
                    isSelected={
                      selectedMaterials[activeTab]?.id === material._id
                    }
                    onClick={() => {
                      // إذا كانت هناك خلية محددة وفي وضع الجدران، طبق على الخلية
                      if (selectedCell && wallGridSettings.enabled && activeTab === "wall") {
                        applyCellMaterial(material);
                      } else {
                        handleMaterialSelect(material);
                      }
                    }}
                  />
                ))}
              </div>
            )}

            {selectedWall && (
              <button
                onClick={() => setSelectedWall(null)}
                className="mt-4 w-full py-2.5 text-sm text-[#ffedd8] bg-[#084C5C]/20 hover:bg-[#084C5C]/30 rounded-xl flex items-center justify-center gap-2">
                <X size={14} />
                Clear Wall Selection
              </button>
            )}
          </div>

          {/* الأثاث */}
          <div className="p-5 glass rounded-2xl">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#084C5C] to-[#0a6275] flex items-center justify-center">
                <Box size={16} className="text-[#ffedd8]" />
              </div>
              Furniture
              {furniture.length > 0 && (
                <span className="text-xs bg-[#084C5C]/20 text-[#ffedd8] px-2 py-1 rounded-lg mr-auto">
                  {furniture.length} items
                </span>
              )}
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {availableFurniture
                .filter(item => furnitureVisibility[item.id] !== false)
                .map((item) => (
                <button
                  key={item.id}
                  onClick={() => addFurniture(item)}
                  className="p-3 bg-white/5 hover:bg-[#084C5C]/30 border border-[#084C5C]/30 rounded-xl transition-all hover:scale-105">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs block mt-1">{item.name}</span>
                </button>
              ))}
            </div>

            {furniture.length > 0 && (
              <button
                onClick={() => setFurniture([])}
                className="mt-4 w-full py-2.5 text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl flex items-center justify-center gap-2">
                <Trash2 size={14} />
                Clear All Furniture
              </button>
            )}
          </div>

          {/* لوحة تحكم المنتجات - مزود الخدمة فقط */}
          {isProvider() && (
            <div className="p-5 glass rounded-2xl border-2 border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Layers size={16} className="text-white" />
                  </div>
                  Product Management
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg">
                    Provider
                  </span>
                </h2>
                <button
                  onClick={() => setShowProductControlPanel(!showProductControlPanel)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    showProductControlPanel
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                      : "bg-white/10 hover:bg-white/20 text-[#ffedd8]/70"
                  }`}>
                  {showProductControlPanel ? "Hide" : "Show"}
                </button>
              </div>

              {showProductControlPanel && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-[#ffedd8]/60 mb-4">
                    Manage available furniture list and control their visibility in the scene
                  </p>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {availableFurniture.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-[#084C5C]/30">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <p className="text-sm font-bold text-[#ffedd8]">{item.name}</p>
                            <p className="text-xs text-[#ffedd8]/50">{item.nameEn}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setFurnitureVisibility(prev => ({
                                ...prev,
                                [item.id]: !prev[item.id]
                              }));
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              furnitureVisibility[item.id]
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}>
                            {furnitureVisibility[item.id] ? "Visible" : "Hidden"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#084C5C]/30">
                    <button
                      onClick={() => {
                        const allVisible = Object.values(furnitureVisibility).every(v => v);
                        setFurnitureVisibility(
                          availableFurniture.reduce((acc, item) => ({
                            ...acc,
                            [item.id]: !allVisible
                          }), {})
                        );
                      }}
                      className="flex-1 py-2 text-xs bg-[#084C5C]/20 hover:bg-[#084C5C]/30 text-[#ffedd8] rounded-lg transition-all">
                      {Object.values(furnitureVisibility).every(v => v) ? "Hide All" : "Show All"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* المشاريع */}
          <div className="p-5 glass rounded-2xl">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#084C5C] to-[#0a6275] flex items-center justify-center">
                <Save size={16} className="text-[#ffedd8]" />
              </div>
              Projects
              {savedProjects.length > 0 && (
                <span className="text-xs bg-[#084C5C]/20 text-[#ffedd8] px-2 py-1 rounded-lg mr-auto">
                  {savedProjects.length}
                </span>
              )}
            </h2>

            <button
              onClick={() => setShowSaveDialog(true)}
              className="w-full mb-4 p-3 bg-gradient-to-l from-[#084C5C] to-[#0a6275] rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#084C5C]/30 transition-all">
              <Save size={16} />
              Save Project
            </button>

            {savedProjects.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                {savedProjects.map((project) => (
                  <div
                    key={project._id || project.id}
                    className="p-3 bg-[#011a20] rounded-xl group hover:bg-[#022d37] transition-all border border-[#084C5C]/20">
                    {/* صورة المشروع */}
                    {project.screenshot && (
                      <div className="mb-2 rounded-lg overflow-hidden h-20">
                        <img 
                          src={project.screenshot} 
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                      <p className="text-sm font-semibold">{project.name}</p>
                        {project.creatorName && (
                          <p className="text-xs text-[#ffedd8]/70">
                            👤 {project.creatorName}
                          </p>
                        )}
                      <p className="text-xs text-[#ffedd8]/50">
                          {new Date(project.createdAt || project.timestamp).toLocaleDateString("ar-SA")}
                        </p>
                        {/* عرض السعر */}
                        {project.pricing?.totalPrice > 0 && (
                          <p className="text-xs text-emerald-400 font-bold mt-1">
                            💰 ${project.pricing.totalPrice.toFixed(2)}
                          </p>
                        )}
                        {/* عرض الأبعاد */}
                        {project.dimensions && (
                          <p className="text-xs text-[#ffedd8]/60 mt-1">
                            📐 {project.dimensions.width}×{project.dimensions.length}×{project.dimensions.height} م
                          </p>
                        )}
                    </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => loadProject(project)}
                          className="p-2 bg-[#084C5C] rounded-lg hover:bg-[#0a6275]"
                          title="Load Project">
                        <Download size={14} />
                      </button>
                      <button
                          onClick={() => deleteProject(project._id || project.id)}
                          className="p-2 bg-red-600/80 rounded-lg hover:bg-red-500"
                          title="Delete Project">
                        <Trash2 size={14} />
                      </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#ffedd8]/50 text-center py-4">
                No saved projects
              </p>
            )}
          </div>
        </div>
      </div>

      {/* زر طي اللوحة */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`absolute top-1/2 -translate-y-1/2 z-20 ${
          sidebarCollapsed ? "right-4" : "right-[388px]"
        } w-8 h-16 bg-[#022d37]/95 hover:bg-[#084C5C] rounded-l-xl flex items-center justify-center transition-all duration-500 border border-[#084C5C]/30 text-[#ffedd8]`}>
        {sidebarCollapsed ? (
          <ChevronLeft size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </button>

      {/* منطقة العرض 3D */}
      <div className="flex-1 relative">
        <Canvas
          shadows
          camera={{ position: [8, 6, 8], fov: 50 }}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}>
          <SceneBackground settings={backgroundSettings} />
          <PerspectiveCamera makeDefault position={[8, 6, 8]} />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={4}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.1}
            enabled={!isDraggingFurniture}
          />
          <Lighting preset={lightingPreset} />
          <Suspense fallback={null}>
            <Room
              dimensions={dimensions}
              materials={selectedMaterials}
              furniture={furniture}
              onWallClick={handleWallClick}
              selectedWall={selectedWall}
              onFurnitureRemove={(idx) => removeFurnitureWithHistory(idx)}
              onFurniturePositionChange={(idx, x, z) => moveFurnitureWithHistory(idx, x, z)}
              onFurnitureRotationChange={(idx, rotation) => rotateFurnitureWithHistory(idx, rotation)}
              onFurnitureSelect={(idx) => {
                setSelectedFurnitureIndex(idx);
                setShowFurnitureColorPicker(true);
              }}
              onFurnitureDragStart={() => setIsDraggingFurniture(true)}
              onFurnitureDragEnd={() => setIsDraggingFurniture(false)}
              gridSettings={wallGridSettings}
              wallCells={wallCells}
              onCellClick={handleCellClick}
              selectedCell={selectedCell}
            />
            <ScreenshotHelper onCapture={handleScreenshotCapture} />
            <Preload all />
          </Suspense>
          <gridHelper
            args={[30, 30, 0x1a1a2e, 0x16163a]}
            position={[0, -0.01, 0]}
          />
          <Environment preset="apartment" />
        </Canvas>

        {/* شريط الأدوات */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          <div className="glass px-5 py-4 rounded-2xl shadow-xl pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#084C5C] to-[#0a6275] flex items-center justify-center">
                <Home size={20} className="text-[#ffedd8]" />
              </div>
              <div>
                <p className="font-bold text-white">{currentProjectName}</p>
                <p className="text-xs text-[#ffedd8]/60">
                  {dimensions.width}م × {dimensions.length}م ×{" "}
                  {dimensions.height}م
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pointer-events-auto">
            {/* أزرار التراجع والإعادة */}
            <div className="flex gap-1 glass rounded-xl p-1">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all touch-manipulation ${
                  canUndo 
                    ? 'hover:bg-[#084C5C]/30 text-[#ffedd8]' 
                    : 'opacity-40 cursor-not-allowed text-gray-500'
                }`}
                title="تراجع">
                <Undo2 size={18} />
                <span className="text-xs hidden sm:inline">تراجع</span>
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all touch-manipulation ${
                  canRedo 
                    ? 'hover:bg-[#084C5C]/30 text-[#ffedd8]' 
                    : 'opacity-40 cursor-not-allowed text-gray-500'
                }`}
                title="إعادة">
                <Redo2 size={18} />
                <span className="text-xs hidden sm:inline">إعادة</span>
              </button>
            </div>
            
            {/* زر الخلفية */}
            <button
              onClick={() => setShowBackgroundPanel(!showBackgroundPanel)}
              className={`glass min-w-[44px] min-h-[44px] px-4 py-3 rounded-xl group flex items-center gap-2 touch-manipulation text-[#ffedd8] ${
                showBackgroundPanel ? 'bg-[#084C5C]/40 ring-2 ring-[#084C5C]' : 'hover:bg-[#084C5C]/30'
              }`}
              title="تغيير الخلفية">
              <ImageIcon size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm hidden sm:inline">الخلفية</span>
            </button>
            
            <button
              onClick={resetRoom}
              className="glass hover:bg-[#084C5C]/30 min-w-[44px] min-h-[44px] px-4 py-3 rounded-xl group touch-manipulation text-[#ffedd8]">
              <RotateCcw
                size={18}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
            </button>
            <button
              onClick={captureScreenshot}
              className="bg-gradient-to-l from-[#084C5C] to-[#0a6275] min-h-[44px] px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#084C5C]/30 touch-manipulation text-[#ffedd8] hover:shadow-lg hover:shadow-[#084C5C]/40 transition-all">
              <Camera size={18} />
              التقاط صورة
            </button>
          </div>
        </div>

        {/* نصائح */}
        {showTips && (
          <div className="absolute bottom-4 left-4 glass p-4 rounded-2xl shadow-xl max-w-xs">
            <button
              onClick={() => setShowTips(false)}
              className="absolute top-2 left-2 p-1 hover:bg-[#084C5C]/30 rounded-lg text-[#ffedd8]">
              <X size={14} />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#084C5C] to-[#0a6275] flex items-center justify-center">
                <Info size={18} className="text-[#ffedd8]" />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1 text-white">التحكم</p>
                <p className="text-xs text-[#ffedd8]/60">
                  • اسحب للتدوير
                  <br />
                  • عجلة الماوس للتقريب
                  <br />• انقر على جدار لتخصيصه
                </p>
              </div>
            </div>
          </div>
        )}

        {/* لوحة إعدادات الخلفية */}
        {showBackgroundPanel && (
          <div className="absolute top-20 left-4 glass p-5 rounded-2xl shadow-xl w-72 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <ImageIcon size={18} className="text-[#ffedd8]" />
                خلفية المشهد
              </h3>
              <button
                onClick={() => setShowBackgroundPanel(false)}
                className="p-1.5 hover:bg-[#084C5C]/30 rounded-lg text-[#ffedd8]">
                <X size={16} />
              </button>
            </div>
            
            {/* اختيار اللون */}
            <div className="mb-4">
              <p className="text-sm text-[#ffedd8]/60 mb-2 flex items-center gap-2">
                <Paintbrush size={14} />
                لون صلب
              </p>
              <div className="grid grid-cols-6 gap-2">
                {BACKGROUND_COLORS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setBackgroundSettings({ type: 'color', value: bg.color })}
                    className={`w-9 h-9 rounded-lg transition-all touch-manipulation ${
                      backgroundSettings.type === 'color' && backgroundSettings.value === bg.color
                        ? 'ring-2 ring-[#ffedd8] ring-offset-2 ring-offset-[#022d37] scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: bg.color }}
                    title={bg.name}
                  />
                ))}
              </div>
              
              {/* منتقي لون مخصص */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundSettings.type === 'color' ? backgroundSettings.value : '#c2410c'}
                  onChange={(e) => setBackgroundSettings({ type: 'color', value: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-2 border-[#084C5C]/50"
                  title="اختر لون مخصص"
                />
                <span className="text-xs text-[#ffedd8]/60">لون مخصص</span>
              </div>
            </div>
            
            {/* اختيار النسيج */}
            <div>
              <p className="text-sm text-[#ffedd8]/60 mb-2 flex items-center gap-2">
                <Image size={14} />
                نسيج
              </p>
              <div className="grid grid-cols-2 gap-2">
                {BACKGROUND_TEXTURES.map((tex) => (
                  <button
                    key={tex.id}
                    onClick={() => setBackgroundSettings({ type: 'texture', value: tex.url })}
                    className={`p-3 rounded-xl text-sm transition-all touch-manipulation ${
                      backgroundSettings.type === 'texture' && backgroundSettings.value === tex.url
                        ? 'bg-[#084C5C]/40 ring-2 ring-[#084C5C]'
                        : 'bg-white/5 hover:bg-[#084C5C]/30'
                    }`}>
                    {tex.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* منتقي ألوان الأثاث */}
        {showFurnitureColorPicker && selectedFurnitureIndex !== null && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 glass p-5 rounded-2xl shadow-xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center gap-2 text-white">
                <Palette size={18} className="text-[#ffedd8]" />
                تغيير لون الأثاث
              </h3>
              <button
                onClick={() => {
                  setShowFurnitureColorPicker(false);
                  setSelectedFurnitureIndex(null);
                }}
                className="p-1.5 hover:bg-[#084C5C]/30 rounded-lg text-[#ffedd8]">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              {/* ألوان سريعة */}
              {['#5D4E37', '#8B7355', '#6B5344', '#4A5568', '#2D3748', '#ECC94B', '#E53E3E', '#38A169', '#3182CE', '#805AD5'].map((color) => (
                <button
                  key={color}
                  onClick={() => changeFurnitureColor(selectedFurnitureIndex, color)}
                  className={`min-w-[40px] min-h-[40px] w-10 h-10 rounded-lg transition-all touch-manipulation ${
                    furniture[selectedFurnitureIndex]?.color === color
                      ? 'ring-2 ring-[#ffedd8] ring-offset-2 ring-offset-[#022d37] scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              
              {/* منتقي لون مخصص */}
              <input
                type="color"
                value={furniture[selectedFurnitureIndex]?.color || '#5D4E37'}
                onChange={(e) => changeFurnitureColor(selectedFurnitureIndex, e.target.value)}
                className="min-w-[40px] min-h-[40px] w-10 h-10 rounded-lg cursor-pointer bg-transparent border-2 border-[#084C5C]/50"
                title="اختر لون مخصص"
              />
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 pointer-events-none">
          <h2 className="text-[#022d37]/[0.08] text-8xl font-black tracking-tighter select-none">
            BUILDEX4SYRIA
          </h2>
        </div>
      </div>

      {/* نافذة الحفظ المحسّنة */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#022d37] p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-[#084C5C]/30 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#084C5C] to-[#0a6275] flex items-center justify-center">
                <Save size={24} className="text-[#ffedd8]" />
              </div>
              Save Project
            </h3>
            
            {/* اسم المشروع */}
            <div className="mb-4">
              <label className="block text-sm text-[#ffedd8]/70 mb-2">Project Name *</label>
            <input
              type="text"
              value={currentProjectName}
              onChange={(e) => setCurrentProjectName(e.target.value)}
                placeholder="Example: Modern living room"
                className="w-full p-4 bg-[#011a20] rounded-xl border border-[#084C5C]/30 focus:ring-2 focus:ring-[#084C5C] outline-none text-white placeholder:text-white/40"
              autoFocus
            />
            </div>
            
            {/* اسم المنشئ */}
            <div className="mb-4">
              <label className="block text-sm text-[#ffedd8]/70 mb-2">Designer Name</label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Your name"
                className="w-full p-4 bg-[#011a20] rounded-xl border border-[#084C5C]/30 focus:ring-2 focus:ring-[#084C5C] outline-none text-white placeholder:text-white/40"
              />
            </div>
            
            {/* وصف المشروع */}
            <div className="mb-4">
              <label className="block text-sm text-[#ffedd8]/70 mb-2">Project Description</label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Brief project description..."
                className="w-full p-4 bg-[#011a20] rounded-xl border border-[#084C5C]/30 focus:ring-2 focus:ring-[#084C5C] outline-none h-20 resize-none text-white placeholder:text-white/40"
              />
            </div>
            
            {/* ملخص التكاليف */}
            <div className="mb-6 p-4 bg-gradient-to-br from-[#084C5C]/30 to-[#022d37]/20 rounded-xl border border-[#084C5C]/30">
              <h4 className="text-sm font-bold text-[#ffedd8] mb-3 flex items-center gap-2">
                💰 Cost Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#ffedd8]/70">مساحة الغرفة:</span>
                  <span className="font-bold text-white">{(dimensions.width * dimensions.length).toFixed(1)} م²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ffedd8]/70">قطع الأثاث:</span>
                  <span className="font-bold text-white">{furniture.length} قطعة</span>
                </div>
                {(() => {
                  const costs = calculateProjectCosts();
                  return (
                    <>
                      <div className="flex justify-between text-[#ffedd8]/80">
                        <span>تكلفة الخامات:</span>
                        <span>${costs.pricing.materialsCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[#ffedd8]/80">
                        <span>تكلفة الأثاث:</span>
                        <span>${costs.pricing.furnitureCost.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-[#084C5C]/30 pt-2 mt-2 flex justify-between text-lg font-bold text-emerald-400">
                        <span>الإجمالي:</span>
                        <span>${costs.pricing.totalPrice.toFixed(2)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            
            {/* رسالة الخطأ */}
            {saveError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                ⚠️ {saveError}
              </div>
            )}
            
            <div className="flex gap-4">
              <button
                onClick={saveProject}
                disabled={isSavingProject}
                className="flex-1 bg-gradient-to-l from-[#084C5C] to-[#0a6275] py-4 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 text-[#ffedd8] hover:shadow-lg hover:shadow-[#084C5C]/30 transition-all">
                {isSavingProject ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Project
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setSaveError("");
                }}
                disabled={isSavingProject}
                className="flex-1 bg-[#011a20] py-4 rounded-xl font-bold disabled:opacity-50 text-[#ffedd8] border border-[#084C5C]/30 hover:bg-[#022d37] transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
