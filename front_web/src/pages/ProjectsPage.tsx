import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  Calendar,
  DollarSign,
  Maximize2,
  Filter,
  Search,
  LayoutGrid,
  LayoutList,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Box,
  Layers,
  ArrowUpRight,
  Sparkles,
  Clock,
  Tag,
  X,
  ShoppingCart,
  CreditCard,
  Phone,
  MapPin,
  User,
  Mail,
  CheckCircle2,
  Loader2,
  Sofa,
  PaintBucket,
  Ruler,
  Home,
  Wallet,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

// Types
interface MaterialInfo {
  materialId?: string;
  name?: string;
  nameEn?: string;
  type?: string;
  materialType?: string;
  value?: string;
  pricePerMeter?: number;
  area?: number;
  totalPrice?: number;
}

interface FurnitureItem {
  furnitureId?: string;
  id?: string;
  name?: string;
  nameEn?: string;
  color?: string;
  size?: number[];
  price?: number;
  quantity?: number;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  creatorName: string;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  pricing: {
    totalPrice: number;
    currency: string;
    materialsCost: number;
    furnitureCost: number;
    additionalCost?: number;
    discount?: number;
    taxRate?: number;
    taxAmount?: number;
  };
  calculatedAreas: {
    floorArea: number;
    ceilingArea?: number;
    wallsArea?: number;
    totalArea: number;
  };
  materials?: {
    wall?: MaterialInfo;
    floor?: MaterialInfo;
    ceiling?: MaterialInfo;
    leftWall?: MaterialInfo;
    rightWall?: MaterialInfo;
    backWall?: MaterialInfo;
    frontWall?: MaterialInfo;
  };
  furniture?: FurnitureItem[];
  status: "draft" | "in_progress" | "completed" | "archived";
  isPublic: boolean;
  views: number;
  tags: string[];
  screenshot: string;
  lightingPreset?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    city: string;
    country: string;
  };
  notes: string;
  paymentMethod: string;
}

const API_URL = "http://localhost:5000/api";

// Fallback images for gallery
const fallbackGalleryImages = [
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
];

// Mock data for demonstration when backend is unavailable
const MOCK_PROJECTS: Project[] = [
  {
    _id: "1",
    name: "Modern Living Room",
    description: "A contemporary living room design with elegant furniture and warm lighting. Perfect for family gatherings.",
    creatorName: "Ahmad Ali",
    dimensions: { width: 6, length: 8, height: 3 },
    pricing: { totalPrice: 15500, currency: "USD", materialsCost: 8500, furnitureCost: 7000 },
    calculatedAreas: { floorArea: 48, totalArea: 132 },
    status: "completed",
    isPublic: true,
    views: 245,
    tags: ["modern", "living room", "family"],
    screenshot: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-05T14:30:00Z",
  },
  {
    _id: "2",
    name: "Luxury Master Bedroom",
    description: "Spacious master bedroom with premium materials, walk-in closet space, and a cozy reading corner.",
    creatorName: "Sara Hassan",
    dimensions: { width: 5, length: 6, height: 3 },
    pricing: { totalPrice: 12800, currency: "USD", materialsCost: 6800, furnitureCost: 6000 },
    calculatedAreas: { floorArea: 30, totalArea: 96 },
    status: "completed",
    isPublic: true,
    views: 189,
    tags: ["bedroom", "luxury", "master"],
    screenshot: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
    createdAt: "2024-11-25T09:00:00Z",
    updatedAt: "2024-11-28T16:20:00Z",
  },
  {
    _id: "3",
    name: "Minimalist Kitchen",
    description: "Clean and functional kitchen design with modern appliances and efficient storage solutions.",
    creatorName: "Omar Khalil",
    dimensions: { width: 4, length: 5, height: 3 },
    pricing: { totalPrice: 18200, currency: "USD", materialsCost: 10200, furnitureCost: 8000 },
    calculatedAreas: { floorArea: 20, totalArea: 74 },
    status: "in_progress",
    isPublic: true,
    views: 156,
    tags: ["kitchen", "minimalist", "modern"],
    screenshot: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    createdAt: "2024-12-03T11:00:00Z",
    updatedAt: "2024-12-08T10:15:00Z",
  },
  {
    _id: "4",
    name: "Cozy Home Office",
    description: "Productive workspace design with ergonomic furniture, natural lighting, and inspiring decor.",
    creatorName: "Lina Mahmoud",
    dimensions: { width: 4, length: 4, height: 3 },
    pricing: { totalPrice: 8500, currency: "USD", materialsCost: 3500, furnitureCost: 5000 },
    calculatedAreas: { floorArea: 16, totalArea: 64 },
    status: "completed",
    isPublic: true,
    views: 298,
    tags: ["office", "home", "workspace"],
    screenshot: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=80",
    createdAt: "2024-11-20T08:00:00Z",
    updatedAt: "2024-11-22T12:45:00Z",
  },
  {
    _id: "5",
    name: "Kids' Playroom",
    description: "Colorful and safe playroom designed for children with interactive play zones and storage.",
    creatorName: "Rania Yousef",
    dimensions: { width: 5, length: 5, height: 3 },
    pricing: { totalPrice: 9800, currency: "USD", materialsCost: 4800, furnitureCost: 5000 },
    calculatedAreas: { floorArea: 25, totalArea: 85 },
    status: "draft",
    isPublic: true,
    views: 87,
    tags: ["kids", "playroom", "colorful"],
    screenshot: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    createdAt: "2024-12-06T14:00:00Z",
    updatedAt: "2024-12-07T09:30:00Z",
  },
  {
    _id: "6",
    name: "Elegant Dining Room",
    description: "Sophisticated dining space with a large table, statement chandelier, and warm ambiance.",
    creatorName: "Karim Nasser",
    dimensions: { width: 5, length: 7, height: 3 },
    pricing: { totalPrice: 14200, currency: "USD", materialsCost: 7200, furnitureCost: 7000 },
    calculatedAreas: { floorArea: 35, totalArea: 106 },
    status: "in_progress",
    isPublic: true,
    views: 134,
    tags: ["dining", "elegant", "family"],
    screenshot: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    createdAt: "2024-12-04T13:00:00Z",
    updatedAt: "2024-12-09T11:00:00Z",
  },
];

const statusConfig = {
  draft: {
    label: "Draft",
    labelEn: "Draft",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  in_progress: {
    label: "In Progress",
    labelEn: "In Progress",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  completed: {
    label: "Completed",
    labelEn: "Completed",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  archived: {
    label: "Archived",
    labelEn: "Archived",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

// Featured Projects Gallery Slideshow Component
interface GalleryImage {
  url: string;
  name: string;
  price?: number;
}

function FeaturedProjectsGallery({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Filter projects that have valid screenshots
  const projectsWithImages = projects.filter(p => {
    if (!p.screenshot) return false;
    const s = p.screenshot.trim();
    return s.startsWith('data:image') || s.startsWith('http') || s.startsWith('/');
  });

  const usingFallback = projectsWithImages.length === 0;

  const images: GalleryImage[] = !usingFallback
    ? projectsWithImages.map(p => ({
        url: p.screenshot,
        name: p.name,
        price: p.pricing?.totalPrice
      }))
    : fallbackGalleryImages.map((url, i) => ({ 
        url, 
        name: `Design ${i + 1}`, 
        price: undefined 
      }));

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-advance slideshow
  useEffect(() => {
    if (isHovered || images.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered, images.length]);

  if (images.length === 0) return null;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Gallery Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Large Image */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl aspect-[16/10] bg-petroleum/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={images[currentIndex].url}
                alt={images[currentIndex].name}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-petroleum/80 via-petroleum/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Project Info Overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="absolute bottom-0 left-0 right-0 p-6"
            >
              <h4 className="font-display font-semibold text-cream text-2xl mb-2 drop-shadow-lg">
                {images[currentIndex].name}
              </h4>
              {images[currentIndex].price && (
                <p className="font-mono text-cream/80 text-lg">
                  ${images[currentIndex].price.toLocaleString()}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.5 }}
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ChevronLeft size={24} />
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.5 }}
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ChevronRight size={24} />
              </motion.button>
            </>
          )}

          {/* Badge */}
          <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-mono text-sm shadow-lg flex items-center gap-2 ${
            usingFallback 
              ? 'bg-petroleum/80 text-cream/80' 
              : 'bg-petroleum-accent text-cream'
          }`}>
            <Image size={16} />
            {usingFallback ? 'Gallery' : `${projectsWithImages.length} Projects`}
          </div>
        </div>

        {/* Side Thumbnails */}
        <div className="hidden lg:flex flex-col gap-4">
          {images.slice(0, 2).map((img, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative overflow-hidden rounded-xl aspect-[16/10] transition-all duration-300 ${
                currentIndex === idx 
                  ? 'ring-4 ring-petroleum-accent shadow-lg scale-[1.02]' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-petroleum/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-cream text-sm font-medium truncate drop-shadow">{img.name}</p>
              </div>
            </motion.button>
          ))}
          
          {images.length > 2 && (
            <div className="flex-1 bg-petroleum/10 rounded-xl flex items-center justify-center border-2 border-dashed border-petroleum/20">
              <p className="text-petroleum/50 font-mono text-sm">+{images.length - 2} more</p>
            </div>
          )}
        </div>
      </div>

      {/* Dots Indicator (Mobile) */}
      {images.length > 1 && (
        <div className="flex lg:hidden justify-center gap-2 mt-4">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-8 bg-petroleum-accent' 
                  : 'bg-petroleum/30 hover:bg-petroleum/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const ProjectCard = ({
  project,
  viewMode,
  onViewDetails,
}: {
  project: Project;
  viewMode: "grid" | "list";
  onViewDetails: (project: Project) => void;
}) => {
  const statusInfo = statusConfig[project.status];
  const formattedDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (viewMode === "list") {
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ x: 4 }}
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-petroleum/5"
      >
        <div className="flex items-center gap-6 p-4">
          {/* Thumbnail */}
          <div className="relative w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden">
            {project.screenshot ? (
              <img
                src={project.screenshot}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-petroleum-accent/20 to-petroleum/10 flex items-center justify-center">
                <Box className="w-8 h-8 text-petroleum/40" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-lg text-petroleum truncate">
                  {project.name}
                </h3>
                <p className="font-body text-sm text-petroleum/60 mt-1 line-clamp-1">
                  {project.description || "No description available"}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`${statusInfo.color} font-body text-xs px-3 py-1`}
              >
                {statusInfo.labelEn}
              </Badge>
            </div>

            <div className="flex items-center gap-6 mt-3">
              <div className="flex items-center gap-1.5 text-petroleum/50">
                <Maximize2 className="w-4 h-4" />
                <span className="font-mono text-xs">
                  {project.dimensions.width}×{project.dimensions.length}×
                  {project.dimensions.height}m
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-petroleum/50">
                <Eye className="w-4 h-4" />
                <span className="font-mono text-xs">{project.views}</span>
              </div>
              <div className="flex items-center gap-1.5 text-petroleum/50">
                <Calendar className="w-4 h-4" />
                <span className="font-mono text-xs">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-mono text-xl font-bold text-petroleum-accent">
                ${project.pricing.totalPrice.toFixed(0)}
              </p>
              <p className="font-body text-xs text-petroleum/50">Total Cost</p>
            </div>
            <Button
              size="sm"
              className="bg-petroleum-accent hover:bg-petroleum text-cream rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-petroleum/5"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        {project.screenshot ? (
          <img
            src={project.screenshot}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-petroleum-accent/30 via-petroleum/20 to-cream flex items-center justify-center">
            <div className="text-center">
              <Box className="w-16 h-16 text-petroleum/30 mx-auto mb-2" />
              <p className="font-body text-sm text-petroleum/40">No Preview</p>
            </div>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-petroleum/80 via-petroleum/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="outline"
            className={`${statusInfo.color} font-body text-xs px-3 py-1.5 backdrop-blur-sm border`}
          >
            <Sparkles className="w-3 h-3 mr-1.5" />
            {statusInfo.labelEn}
          </Badge>
        </div>

        {/* Views Counter */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
          <Eye className="w-3.5 h-3.5 text-petroleum-accent" />
          <span className="font-mono text-xs text-petroleum">{project.views}</span>
        </div>

        {/* Hover Action */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <Button
            size="sm"
            onClick={() => onViewDetails(project)}
            className="bg-cream text-petroleum hover:bg-white font-body font-semibold rounded-xl shadow-lg"
          >
            View Details
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display font-semibold text-xl text-petroleum line-clamp-1 group-hover:text-petroleum-accent transition-colors">
            {project.name}
          </h3>
        </div>

        {/* Description */}
        <p className="font-body text-sm text-petroleum/60 line-clamp-2 mb-4 min-h-[2.5rem]">
          {project.description || "A beautifully designed room configuration project."}
        </p>

        {/* Dimensions & Area */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-petroleum/10">
          <div className="flex items-center gap-2 text-petroleum/70">
            <Maximize2 className="w-4 h-4" />
            <span className="font-mono text-sm">
              {project.dimensions.width}×{project.dimensions.length}×
              {project.dimensions.height}m
            </span>
          </div>
          <div className="flex items-center gap-2 text-petroleum/70">
            <Layers className="w-4 h-4" />
            <span className="font-mono text-sm">
              {project.calculatedAreas.totalArea.toFixed(0)}m²
            </span>
          </div>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-petroleum/5 text-petroleum/70 rounded-md font-body text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-petroleum-accent/20 flex items-center justify-center">
              <span className="font-display font-bold text-sm text-petroleum-accent">
                {project.creatorName?.charAt(0) || "?"}
              </span>
            </div>
            <div>
              <p className="font-body text-xs text-petroleum/50">Created by</p>
              <p className="font-body text-sm font-medium text-petroleum">
                {project.creatorName || "Unknown"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-body text-xs text-petroleum/50 flex items-center gap-1 justify-end">
              <DollarSign className="w-3 h-3" />
              Total Cost
            </p>
            <p className="font-mono text-2xl font-bold text-petroleum-accent">
              ${project.pricing.totalPrice.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-petroleum/5 text-petroleum/40">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono text-xs">{formattedDate}</span>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectCardSkeleton = ({ viewMode }: { viewMode: "grid" | "list" }) => {
  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl p-4 flex items-center gap-6">
        <Skeleton className="w-32 h-24 rounded-xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden">
      <Skeleton className="h-56 w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="space-y-1 text-right">
            <Skeleton className="h-3 w-16 ml-auto" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    totalValue: 0,
  });

  // Project Details Modal State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  // Order Form State
  const [orderForm, setOrderForm] = useState<OrderFormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: {
      address: "",
      city: "",
      country: "Syria",
    },
    notes: "",
    paymentMethod: "shamcash",
  });
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const studioUrl = import.meta.env.VITE_STUDIO_URL || "/room-configurator";

  // Handle View Details
  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    setActiveTab("details");
    setOrderSuccess(false);
    setOrderError(null);
  };

  // Handle Order Submission
  const handleSubmitOrder = async () => {
    if (!selectedProject) return;

    // Validation
    if (!orderForm.customerName.trim()) {
      setOrderError("Please enter your name");
      return;
    }
    if (!orderForm.customerPhone.trim()) {
      setOrderError("Please enter your phone number");
      return;
    }
    if (!orderForm.shippingAddress.address.trim()) {
      setOrderError("Please enter your address");
      return;
    }
    if (!orderForm.shippingAddress.city.trim()) {
      setOrderError("Please enter your city");
      return;
    }

    setOrderLoading(true);
    setOrderError(null);

    try {
      const response = await fetch(`${API_URL}/orders/from-project/${selectedProject._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: orderForm.customerName,
          customerEmail: orderForm.customerEmail,
          customerPhone: orderForm.customerPhone,
          shippingAddress: orderForm.shippingAddress,
          customerNotes: orderForm.notes,
          paymentMethod: orderForm.paymentMethod === "shamcash" ? "other" : "cash",
          internalNotes: `Payment Method: ${orderForm.paymentMethod === "shamcash" ? "Sham Cash" : "Cash"}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send order");
      }

      const order = await response.json();
      setOrderSuccess(true);
      console.log("✅ Order created:", order.orderNumber);
      
      // Reset form
      setOrderForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        shippingAddress: { address: "", city: "", country: "Syria" },
        notes: "",
        paymentMethod: "shamcash",
      });
    } catch (err: any) {
      console.error("❌ Error sending order:", err);
      setOrderError(err.message || "An error occurred while sending the order");
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [sortBy, statusFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `${API_URL}/projects?`;

      // Sort options
      if (sortBy === "price_asc") url += "sort=price_asc&";
      if (sortBy === "price_desc") url += "sort=price_desc&";
      if (sortBy === "name") url += "sort=name&";
      if (sortBy === "oldest") url += "sort=oldest&";

      // Status filter
      if (statusFilter !== "all") url += `status=${statusFilter}&`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch projects");

      const data = await response.json();
      updateProjectsData(data);
    } catch (err: any) {
      // Use mock data when API is unavailable
      console.log("API unavailable, using mock data:", err.message);
      let filteredMockData = [...MOCK_PROJECTS];
      
      // Apply status filter to mock data
      if (statusFilter !== "all") {
        filteredMockData = filteredMockData.filter(p => p.status === statusFilter);
      }
      
      // Apply sorting to mock data
      if (sortBy === "price_asc") {
        filteredMockData.sort((a, b) => a.pricing.totalPrice - b.pricing.totalPrice);
      } else if (sortBy === "price_desc") {
        filteredMockData.sort((a, b) => b.pricing.totalPrice - a.pricing.totalPrice);
      } else if (sortBy === "name") {
        filteredMockData.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "oldest") {
        filteredMockData.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else {
        // newest first (default)
        filteredMockData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      updateProjectsData(filteredMockData);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDesigning = () => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    // Only allow regular users to access the room configurator from projects page
    if (user.role === 'user') {
      navigate("/room-configurator");
    }
  };

  const updateProjectsData = (data: Project[]) => {
    setProjects(data);

    // Calculate stats
    const completed = data.filter(
      (p: Project) => p.status === "completed"
    ).length;
    const inProgress = data.filter(
      (p: Project) => p.status === "in_progress"
    ).length;
    const totalValue = data.reduce(
      (sum: number, p: Project) => sum + (p.pricing?.totalPrice || 0),
      0
    );

    setStats({
      total: data.length,
      completed,
      inProgress,
      totalValue,
    });
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.creatorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-petroleum via-petroleum-accent to-petroleum" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Animated Orbs */}
          <motion.div
            className="absolute top-20 right-20 w-72 h-72 bg-cream/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-96 h-96 bg-petroleum-accent/30 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block font-mono text-sm text-cream/70 bg-cream/10 px-4 py-2 rounded-full mb-6">
              Project Gallery
            </span>
            <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-cream mb-6">
              Explore Our{" "}
              <span className="font-semibold">Design Projects</span>
            </h1>
            <p className="font-body text-lg text-cream/70 max-w-2xl mx-auto">
              Discover stunning room configurations created with our platform. Get
              inspired by real projects and their cost breakdowns.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/10">
              <p className="font-mono text-3xl font-bold text-petroleum">{stats.total}</p>
              <p className="font-body text-sm text-cream/60 mt-1">Total Projects</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/10">
              <p className="font-mono text-3xl font-bold text-emerald-300">
                {stats.completed}
              </p>
              <p className="font-body text-sm text-cream/60 mt-1">Completed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/10">
              <p className="font-mono text-3xl font-bold text-blue-300">
                {stats.inProgress}
              </p>
              <p className="font-body text-sm text-cream/60 mt-1">In Progress</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/10">
              <p className="font-mono text-3xl font-bold text-amber-300">
                ${(stats.totalValue / 1000).toFixed(1)}K
              </p>
              <p className="font-body text-sm text-cream/60 mt-1">Total Value</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Gallery Section */}
      <section className="py-16 bg-cream relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="inline-block font-mono text-sm text-petroleum-accent bg-petroleum-accent/10 px-4 py-2 rounded-full mb-4">
              Featured Works
            </span>
            <h2 className="font-display font-light text-2xl sm:text-3xl text-petroleum mb-3">
              Browse <span className="font-semibold">Latest Projects</span>
            </h2>
            <p className="font-body text-petroleum/60 max-w-xl mx-auto">
              Discover outstanding designs created with our platform
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FeaturedProjectsGallery projects={projects} />
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-cream relative">
        {/* Subtle Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23022d37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-6 lg:px-8 relative">
          {/* Filters & Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-petroleum/5"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-petroleum/40" />
                <Input
                  placeholder="Search projects by name, description, or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-petroleum/10 focus:border-petroleum-accent font-body"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-petroleum/50" />
                  <span className="font-body text-sm text-petroleum/70">Filter:</span>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 h-10 rounded-lg border-petroleum/10 font-body">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 h-10 rounded-lg border-petroleum/10 font-body">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price_desc">Highest Price</SelectItem>
                    <SelectItem value="price_asc">Lowest Price</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="flex items-center bg-petroleum/5 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "grid"
                        ? "bg-petroleum text-cream"
                        : "text-petroleum/60 hover:text-petroleum"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "list"
                        ? "bg-petroleum text-cream"
                        : "text-petroleum/60 hover:text-petroleum"
                    }`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Projects Grid/List */}
          {loading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-4"
              }
            >
              {[...Array(6)].map((_, i) => (
                <ProjectCardSkeleton key={i} viewMode={viewMode} />
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Box className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-petroleum mb-3">
                Failed to Load Projects
              </h3>
              <p className="font-body text-petroleum/60 mb-6">{error}</p>
              <Button
                onClick={fetchProjects}
                className="bg-petroleum-accent hover:bg-petroleum text-cream font-body"
              >
                Try Again
              </Button>
            </motion.div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-petroleum/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-petroleum/30" />
              </div>
              <h3 className="font-display font-semibold text-2xl text-petroleum mb-3">
                No Projects Found
              </h3>
              <p className="font-body text-petroleum/60">
                {searchQuery
                  ? "Try adjusting your search query or filters."
                  : "No projects available at the moment."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-4"
              }
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    viewMode={viewMode}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Results Count */}
          {!loading && !error && filteredProjects.length > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center font-body text-petroleum/50 mt-8"
            >
              Showing {filteredProjects.length} of {projects.length} projects
            </motion.p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-petroleum to-petroleum-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cream/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-display font-light text-3xl sm:text-4xl text-cream mb-6">
              Ready to Create Your Own{" "}
              <span className="font-semibold">Dream Room?</span>
            </h2>
            <p className="font-body text-lg text-cream/70 mb-8">
              Start designing your perfect space today with our 3D room
              configurator and get accurate cost estimates.
            </p>
            {/* Show button only for regular users */}
            {isAuthenticated && user && user.role === 'user' && (
              <Button
                size="lg"
                className="bg-cream text-petroleum hover:bg-cream/90 font-body font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                onClick={handleStartDesigning}
              >
                Start Designing
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Button>
            )}
            {(!isAuthenticated || !user || user.role !== 'user') && (
              <Button
                size="lg"
                className="bg-cream text-petroleum hover:bg-cream/90 font-body font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                onClick={() => navigate('/login')}
              >
                Login to Start Designing
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Project Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-cream p-0">
          {selectedProject && (
            <div>
              {/* Header with Image */}
              <div className="relative h-64 overflow-hidden">
                {selectedProject.screenshot ? (
                  <img
                    src={selectedProject.screenshot}
                    alt={selectedProject.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-petroleum-accent/30 to-petroleum/20 flex items-center justify-center">
                    <Box className="w-20 h-20 text-petroleum/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-petroleum/80 via-petroleum/40 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-petroleum" />
                </button>

                {/* Project Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge
                    variant="outline"
                    className={`${statusConfig[selectedProject.status].color} mb-3`}
                  >
                    {statusConfig[selectedProject.status].labelEn}
                  </Badge>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
                    {selectedProject.name}
                  </h2>
                  <p className="font-body text-white/80 mt-2">
                    {selectedProject.description || "A beautifully designed room configuration project."}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
                <TabsList className="grid w-full grid-cols-2 bg-petroleum/5 p-1 rounded-xl">
                  <TabsTrigger
                    value="details"
                    className="rounded-lg font-body data-[state=active]:bg-petroleum data-[state=active]:text-cream"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Project Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="order"
                    className="rounded-lg font-body data-[state=active]:bg-petroleum data-[state=active]:text-cream"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Place Order
                  </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="mt-6 space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <Ruler className="w-6 h-6 text-petroleum-accent mx-auto mb-2" />
                      <p className="font-mono text-lg font-bold text-petroleum">
                        {selectedProject.dimensions.width}×{selectedProject.dimensions.length}×{selectedProject.dimensions.height}m
                      </p>
                      <p className="font-body text-xs text-petroleum/60">Dimensions</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <Layers className="w-6 h-6 text-petroleum-accent mx-auto mb-2" />
                      <p className="font-mono text-lg font-bold text-petroleum">
                        {selectedProject.calculatedAreas.totalArea.toFixed(0)}m²
                      </p>
                      <p className="font-body text-xs text-petroleum/60">Total Area</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <Eye className="w-6 h-6 text-petroleum-accent mx-auto mb-2" />
                      <p className="font-mono text-lg font-bold text-petroleum">
                        {selectedProject.views}
                      </p>
                      <p className="font-body text-xs text-petroleum/60">Views</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <DollarSign className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                      <p className="font-mono text-lg font-bold text-emerald-600">
                        ${selectedProject.pricing.totalPrice.toFixed(0)}
                      </p>
                      <p className="font-body text-xs text-petroleum/60">Total Price</p>
                    </div>
                  </div>

                  {/* Materials Section */}
                  {selectedProject.materials && Object.keys(selectedProject.materials).length > 0 && (
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                      <h3 className="font-display font-semibold text-lg text-petroleum mb-4 flex items-center gap-2">
                        <PaintBucket className="w-5 h-5 text-petroleum-accent" />
                        Materials Used
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(selectedProject.materials).map(([key, material]) => {
                          if (!material || !material.name) return null;
                          return (
                            <div
                              key={key}
                              className="flex items-center justify-between py-2 border-b border-petroleum/5 last:border-0"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-lg border border-petroleum/10"
                                  style={{
                                    background: material.materialType === "color"
                                      ? material.value
                                      : `url(${material.value}) center/cover`,
                                  }}
                                />
                                <div>
                                  <p className="font-body font-medium text-petroleum">
                                    {material.name || material.nameEn}
                                  </p>
                                  <p className="font-body text-xs text-petroleum/50">
                                    {key === "floor" ? "Floor" :
                                     key === "ceiling" ? "Ceiling" :
                                     key === "wall" || key.includes("Wall") ? "Walls" : key}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-mono text-sm font-semibold text-petroleum">
                                  ${(material.totalPrice || 0).toFixed(0)}
                                </p>
                                <p className="font-body text-xs text-petroleum/50">
                                  {(material.area || 0).toFixed(1)}m²
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Furniture Section */}
                  {selectedProject.furniture && selectedProject.furniture.length > 0 && (
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                      <h3 className="font-display font-semibold text-lg text-petroleum mb-4 flex items-center gap-2">
                        <Sofa className="w-5 h-5 text-petroleum-accent" />
                        Furniture ({selectedProject.furniture.length} items)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedProject.furniture.map((item, index) => (
                          <div
                            key={item.id || index}
                            className="flex items-center justify-between p-3 bg-petroleum/5 rounded-lg"
                          >
                            <div>
                              <p className="font-body font-medium text-petroleum">
                                {item.name || item.nameEn}
                              </p>
                              <p className="font-body text-xs text-petroleum/50">
                                Quantity: {item.quantity || 1}
                              </p>
                            </div>
                            <p className="font-mono text-sm font-semibold text-petroleum-accent">
                              ${((item.price || 0) * (item.quantity || 1)).toFixed(0)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Summary */}
                  <div className="bg-gradient-to-br from-petroleum to-petroleum-accent rounded-xl p-5 text-white">
                    <h3 className="font-display font-semibold text-lg mb-4">Cost Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-body text-white/80">Materials Cost</span>
                        <span className="font-mono">${(selectedProject.pricing.materialsCost || 0).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-body text-white/80">Furniture Cost</span>
                        <span className="font-mono">${(selectedProject.pricing.furnitureCost || 0).toFixed(0)}</span>
                      </div>
                      {selectedProject.pricing.additionalCost > 0 && (
                        <div className="flex justify-between">
                          <span className="font-body text-white/80">Additional Costs</span>
                          <span className="font-mono">${selectedProject.pricing.additionalCost.toFixed(0)}</span>
                        </div>
                      )}
                      {selectedProject.pricing.discount > 0 && (
                        <div className="flex justify-between text-emerald-300">
                          <span className="font-body">Discount</span>
                          <span className="font-mono">-${selectedProject.pricing.discount.toFixed(0)}</span>
                        </div>
                      )}
                      <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-display font-semibold text-lg">Total</span>
                          <span className="font-mono text-2xl font-bold">
                            ${selectedProject.pricing.totalPrice.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setActiveTab("order")}
                      className="w-full mt-6 bg-cream text-petroleum hover:bg-white font-body font-semibold py-6 rounded-xl"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Order Now
                    </Button>
                  </div>
                </TabsContent>

                {/* Order Tab */}
                <TabsContent value="order" className="mt-6">
                  {orderSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h3 className="font-display font-bold text-2xl text-petroleum mb-3">
                        Your order has been sent successfully! 🎉
                      </h3>
                      <p className="font-body text-petroleum/70 mb-6">
                        We will contact you soon to confirm the order and arrange payment via Sham Cash
                      </p>
                      <Button
                        onClick={() => {
                          setOrderSuccess(false);
                          setIsModalOpen(false);
                        }}
                        className="bg-petroleum hover:bg-petroleum-accent text-cream font-body"
                      >
                        Close
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      {/* Order Summary */}
                      <div className="bg-petroleum/5 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-body text-sm text-petroleum/60">Project</p>
                            <p className="font-display font-semibold text-petroleum">{selectedProject.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-body text-sm text-petroleum/60">Total Amount</p>
                            <p className="font-mono text-xl font-bold text-petroleum-accent">
                              ${selectedProject.pricing.totalPrice.toFixed(0)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-4">
                        <h4 className="font-display font-semibold text-petroleum flex items-center gap-2">
                          <User className="w-5 h-5 text-petroleum-accent" />
                          Customer Information
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-body text-sm text-petroleum/70 mb-1.5 block">
                              Full Name *
                            </label>
                            <Input
                              value={orderForm.customerName}
                              onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                              placeholder="Enter your full name"
                              className="bg-white border-petroleum/20 focus:border-petroleum-accent"
                            />
                          </div>
                          <div>
                            <label className="font-body text-sm text-petroleum/70 mb-1.5 block">
                              Phone Number *
                            </label>
                            <Input
                              value={orderForm.customerPhone}
                              onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                              placeholder="+963 9XX XXX XXX"
                              className="bg-white border-petroleum/20 focus:border-petroleum-accent"
                              dir="ltr"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-body text-sm text-petroleum/70 mb-1.5 block">
                            Email (Optional)
                          </label>
                          <Input
                            value={orderForm.customerEmail}
                            onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                            placeholder="email@example.com"
                            type="email"
                            className="bg-white border-petroleum/20 focus:border-petroleum-accent"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="space-y-4">
                        <h4 className="font-display font-semibold text-petroleum flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-petroleum-accent" />
                          Shipping Address
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-body text-sm text-petroleum/70 mb-1.5 block">
                              City *
                            </label>
                            <Select
                              value={orderForm.shippingAddress.city}
                              onValueChange={(value) =>
                                setOrderForm({
                                  ...orderForm,
                                  shippingAddress: { ...orderForm.shippingAddress, city: value },
                                })
                              }
                            >
                              <SelectTrigger className="bg-white border-petroleum/20">
                                <SelectValue placeholder="Select City" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Damascus">Damascus</SelectItem>
                                <SelectItem value="Aleppo">Aleppo</SelectItem>
                                <SelectItem value="Homs">Homs</SelectItem>
                                <SelectItem value="Latakia">Latakia</SelectItem>
                                <SelectItem value="Tartus">Tartus</SelectItem>
                                <SelectItem value="Hama">Hama</SelectItem>
                                <SelectItem value="Deir ez-Zor">Deir ez-Zor</SelectItem>
                                <SelectItem value="Raqqa">Raqqa</SelectItem>
                                <SelectItem value="As-Suwayda">As-Suwayda</SelectItem>
                                <SelectItem value="Daraa">Daraa</SelectItem>
                                <SelectItem value="Idlib">Idlib</SelectItem>
                                <SelectItem value="Al-Hasakah">Al-Hasakah</SelectItem>
                                <SelectItem value="Qamishli">Qamishli</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="font-body text-sm text-petroleum/70 mb-1.5 block">
                              Country
                            </label>
                            <Input
                              value={orderForm.shippingAddress.country}
                              disabled
                              className="bg-petroleum/5 border-petroleum/10"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-body text-sm text-petroleum/70 mb-1.5 block">
                            Detailed Address *
                          </label>
                          <Textarea
                            value={orderForm.shippingAddress.address}
                            onChange={(e) =>
                              setOrderForm({
                                ...orderForm,
                                shippingAddress: { ...orderForm.shippingAddress, address: e.target.value },
                              })
                            }
                            placeholder="Neighborhood, Street, Building Number, Floor..."
                            className="bg-white border-petroleum/20 focus:border-petroleum-accent resize-none"
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-4">
                        <h4 className="font-display font-semibold text-petroleum flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-petroleum-accent" />
                          Payment Method
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div
                            onClick={() => setOrderForm({ ...orderForm, paymentMethod: "shamcash" })}
                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                              orderForm.paymentMethod === "shamcash"
                                ? "border-petroleum-accent bg-petroleum-accent/10"
                                : "border-petroleum/10 bg-white hover:border-petroleum/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-display font-semibold text-petroleum">Sham Cash</p>
                                <p className="font-body text-xs text-petroleum/60">Secure Electronic Payment</p>
                              </div>
                            </div>
                            {orderForm.paymentMethod === "shamcash" && (
                              <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                                <p className="font-body text-xs text-emerald-700">
                                  A payment link via Sham Cash will be sent to your phone number after order confirmation
                                </p>
                              </div>
                            )}
                          </div>

                          <div
                            onClick={() => setOrderForm({ ...orderForm, paymentMethod: "cash" })}
                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                              orderForm.paymentMethod === "cash"
                                ? "border-petroleum-accent bg-petroleum-accent/10"
                                : "border-petroleum/10 bg-white hover:border-petroleum/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-display font-semibold text-petroleum">Cash on Delivery</p>
                                <p className="font-body text-xs text-petroleum/60">Cash upon delivery</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="font-body text-sm text-petroleum/70 mb-1.5 block">
                          Additional Notes (Optional)
                        </label>
                        <Textarea
                          value={orderForm.notes}
                          onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                          placeholder="Any special delivery or order instructions..."
                          className="bg-white border-petroleum/20 focus:border-petroleum-accent resize-none"
                          rows={3}
                        />
                      </div>

                      {/* Error Message */}
                      {orderError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                          <p className="font-body text-red-600 text-sm">{orderError}</p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        onClick={handleSubmitOrder}
                        disabled={orderLoading}
                        className="w-full bg-gradient-to-r from-petroleum to-petroleum-accent hover:from-petroleum-accent hover:to-petroleum text-cream font-body font-semibold py-6 rounded-xl transition-all duration-300"
                      >
                        {orderLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending order...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Send Order - ${selectedProject.pricing.totalPrice.toFixed(0)}
                          </>
                        )}
                      </Button>

                      <p className="text-center font-body text-xs text-petroleum/50">
                        By clicking "Send Order" you agree to the usage policy and terms of service
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

