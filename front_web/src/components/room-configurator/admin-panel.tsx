import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  LogIn,
  LogOut,
  Database,
  Palette,
  Image,
  RefreshCw,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Layers,
  LayoutGrid,
  Box,
  Upload,
  Loader2,
} from "lucide-react";

// ========== أنواع البيانات ==========
interface Material {
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
}

interface Stats {
  materials: number;
  projects: number;
  users: number;
  walls: number;
  floors: number;
  ceilings: number;
}

const API_URL = "http://localhost:5000/api";

// ========== مكون لوحة التحكم ==========
export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("admin@buildex4syria.com");
  const [password, setPassword] = useState("admin123");
  const [loginError, setLoginError] = useState("");

  const [materials, setMaterials] = useState<Material[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"wall" | "floor" | "ceiling">(
    "wall"
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ========== رفع الصورة ==========
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const res = await fetch(`${API_URL}/upload/texture`, {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();

      if (res.ok) {
        // Use the backend URL for the uploaded file
        const fullUrl = `http://localhost:5000${data.url}`;
        setFormData((prev) => ({ ...prev, textureUrl: fullUrl }));
        showNotification("success", "تم رفع الصورة بنجاح");
      } else {
        showNotification("error", data.error || "فشل في رفع الصورة");
      }
    } catch (error) {
      showNotification("error", "حدث خطأ أثناء رفع الصورة");
    }
    setUploading(false);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ========== نموذج الخامة ==========
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    type: "wall" as "wall" | "floor" | "ceiling",
    category: "modern",
    materialType: "color" as "texture" | "color",
    textureUrl: "",
    color: "#ffffff",
    roughness: 0.5,
    metalness: 0,
    tileSize: 1.5,
    tags: "",
    isActive: true,
    displayOrder: 0,
  });

  // ========== تسجيل الدخول ==========
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
        setIsLoggedIn(true);
        localStorage.setItem("admin_token", data.token);
        fetchMaterials();
        fetchStats();
      } else {
        setLoginError(data.error || "فشل تسجيل الدخول");
      }
    } catch (error) {
      setLoginError("خطأ في الاتصال بالخادم");
    }
  };

  // ========== جلب الخامات ==========
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/materials`);
      const data = await res.json();
      setMaterials(data);
    } catch (error) {
      showNotification("error", "فشل في جلب الخامات");
    }
    setLoading(false);
  };

  // ========== جلب الإحصائيات ==========
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  // ========== إظهار الإشعارات ==========
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // ========== إضافة/تعديل خامة ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const materialData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    };

    try {
      const url = editingMaterial
        ? `${API_URL}/materials/${editingMaterial._id}`
        : `${API_URL}/materials`;

      const res = await fetch(url, {
        method: editingMaterial ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(materialData),
      });

      if (res.ok) {
        showNotification(
          "success",
          editingMaterial ? "تم تعديل الخامة" : "تم إضافة الخامة"
        );
        fetchMaterials();
        fetchStats();
        resetForm();
      } else {
        const data = await res.json();
        showNotification("error", data.error || "حدث خطأ");
      }
    } catch (error) {
      showNotification("error", "فشل في حفظ الخامة");
    }
  };

  // ========== حذف خامة ==========
  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخامة؟")) return;

    try {
      const res = await fetch(`${API_URL}/materials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showNotification("success", "تم حذف الخامة");
        fetchMaterials();
        fetchStats();
      }
    } catch (error) {
      showNotification("error", "فشل في حذف الخامة");
    }
  };

  // ========== تبديل حالة الخامة ==========
  const toggleActive = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/materials/${id}/toggle-active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchMaterials();
      }
    } catch (error) {
      showNotification("error", "فشل في تحديث الحالة");
    }
  };

  // ========== إعادة تعيين النموذج ==========
  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      type: activeTab,
      category: "modern",
      materialType: "color",
      textureUrl: "",
      color: "#ffffff",
      roughness: 0.5,
      metalness: 0,
      tileSize: 1.5,
      tags: "",
      isActive: true,
      displayOrder: 0,
    });
    setShowAddForm(false);
    setEditingMaterial(null);
  };

  // ========== تعديل خامة ==========
  const startEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      nameEn: material.nameEn,
      type: material.type,
      category: material.category,
      materialType: material.materialType,
      textureUrl: material.textureUrl || "",
      color: material.color || "#ffffff",
      roughness: material.roughness,
      metalness: material.metalness,
      tileSize: material.tileSize,
      tags: material.tags.join(", "),
      isActive: material.isActive,
      displayOrder: material.displayOrder,
    });
    setShowAddForm(true);
  };

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      fetchMaterials();
      fetchStats();
    }
  }, []);

  // تصفية الخامات حسب التبويب النشط
  const filteredMaterials = materials.filter((m) => m.type === activeTab);

  // ========== صفحة تسجيل الدخول ==========
  if (!isLoggedIn) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Database size={40} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
              <p className="text-slate-400 mt-2">
                BUILDEX4SYRIA - إدارة الخامات
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="admin@buildex4syria.com"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl">
                  <AlertCircle size={16} />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                <LogIn size={18} />
                تسجيل الدخول
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              <p>بيانات الدخول الافتراضية:</p>
              <p className="text-slate-400">admin@buildex4syria.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== لوحة التحكم الرئيسية ==========
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* الإشعارات */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in ${
            notification.type === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}>
          {notification.type === "success" ? (
            <Check size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {notification.message}
        </div>
      )}

      {/* الهيدر */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Database size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg">لوحة التحكم</h1>
              <p className="text-xs text-slate-400">
                إدارة خامات BUILDEX4SYRIA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                fetchMaterials();
                fetchStats();
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="تحديث">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setToken("");
                localStorage.removeItem("admin_token");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
              <LogOut size={16} />
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* الإحصائيات */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            {[
              {
                label: "إجمالي الخامات",
                value: stats.materials,
                icon: <Database size={18} />,
                color: "from-indigo-500 to-purple-600",
              },
              {
                label: "المشاريع",
                value: stats.projects,
                icon: <Save size={18} />,
                color: "from-emerald-500 to-teal-600",
              },
              {
                label: "الجدران",
                value: stats.walls,
                icon: <Layers size={18} />,
                color: "from-amber-500 to-orange-600",
              },
              {
                label: "الأرضيات",
                value: stats.floors,
                icon: <LayoutGrid size={18} />,
                color: "from-cyan-500 to-blue-600",
              },
              {
                label: "الأسقف",
                value: stats.ceilings,
                icon: <Box size={18} />,
                color: "from-pink-500 to-rose-600",
              },
              {
                label: "المستخدمين",
                value: stats.users,
                icon: <LogIn size={18} />,
                color: "from-violet-500 to-purple-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* التبويبات */}
        <div className="flex gap-2 mb-6">
          {[
            {
              key: "wall" as const,
              label: "جدران",
              icon: <Layers size={16} />,
            },
            {
              key: "floor" as const,
              label: "أرضيات",
              icon: <LayoutGrid size={16} />,
            },
            { key: "ceiling" as const, label: "أسقف", icon: <Box size={16} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                resetForm();
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
                  : "bg-slate-800/50 hover:bg-slate-700/50"
              }`}>
              {tab.icon}
              {tab.label}
              <span className="text-xs opacity-70">
                ({materials.filter((m) => m.type === tab.key).length})
              </span>
            </button>
          ))}

          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
              setFormData((prev) => ({ ...prev, type: activeTab }));
            }}
            className="mr-auto flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold transition-all">
            <Plus size={18} />
            إضافة خامة جديدة
          </button>
        </div>

        {/* نموذج الإضافة/التعديل */}
        {showAddForm && (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {editingMaterial ? "تعديل الخامة" : "إضافة خامة جديدة"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-white/10 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  الاسم بالعربية
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  الاسم بالإنجليزية
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) =>
                    setFormData({ ...formData, nameEn: e.target.value })
                  }
                  className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  الفئة
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="modern">عصري</option>
                  <option value="classic">كلاسيكي</option>
                  <option value="industrial">صناعي</option>
                  <option value="luxury">فاخر</option>
                  <option value="minimal">بسيط</option>
                  <option value="rustic">ريفي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  نوع الخامة
                </label>
                <select
                  value={formData.materialType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      materialType: e.target.value as "color" | "texture",
                    })
                  }
                  className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="color">لون صلب</option>
                  <option value="texture">صورة/خامة</option>
                </select>
              </div>

              {formData.materialType === "color" ? (
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    اللون
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="w-14 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="flex-1 p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-300 mb-2">
                    رفع صورة / رابط الصورة
                  </label>

                  {/* File Upload Section */}
                  <div className="space-y-3">
                    {/* Upload Button */}
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="texture-upload"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-3 bg-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-500/30 transition-colors disabled:opacity-50">
                        {uploading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            جاري الرفع...
                          </>
                        ) : (
                          <>
                            <Upload size={18} />
                            رفع صورة
                          </>
                        )}
                      </button>
                      <input
                        type="text"
                        value={formData.textureUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            textureUrl: e.target.value,
                          })
                        }
                        className="flex-1 p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="أو أدخل رابط الصورة مباشرة..."
                      />
                    </div>

                    {/* Preview */}
                    {formData.textureUrl && (
                      <div className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-xl border border-white/5">
                        <img
                          src={formData.textureUrl}
                          alt="معاينة"
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23374151" width="100" height="100"/><text x="50" y="50" text-anchor="middle" fill="%239ca3af" dy=".3em">!</text></svg>';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-400 truncate">
                            {formData.textureUrl}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, textureUrl: "" })
                          }
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  الخشونة (0-1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.roughness}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roughness: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  اللمعان المعدني (0-1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.metalness}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metalness: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  حجم البلاطة (متر)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.tileSize}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tileSize: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  ترتيب العرض
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-300 mb-2">
                  الوسوم (مفصولة بفاصلة)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full p-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="أبيض, نظيف, عصري..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="isActive" className="text-sm">
                  نشط (ظاهر للمستخدمين)
                </label>
              </div>

              <div className="md:col-span-3 flex gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2">
                  <Save size={18} />
                  {editingMaterial ? "حفظ التعديلات" : "إضافة الخامة"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-slate-700 rounded-xl font-bold hover:bg-slate-600 transition-all">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* قائمة الخامات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMaterials.map((material) => (
            <div
              key={material._id}
              className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border transition-all ${
                material.isActive
                  ? "border-white/10"
                  : "border-red-500/30 opacity-60"
              }`}>
              {/* معاينة الخامة */}
              <div className="h-32 relative">
                {material.materialType === "color" ? (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: material.color }}
                  />
                ) : (
                  <img
                    src={material.textureUrl}
                    alt={material.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23374151" width="100" height="100"/><text x="50" y="50" text-anchor="middle" fill="%239ca3af" dy=".3em">No Image</text></svg>';
                    }}
                  />
                )}

                {/* شارة النوع */}
                <div
                  className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold ${
                    material.materialType === "color"
                      ? "bg-purple-500/80 text-white"
                      : "bg-blue-500/80 text-white"
                  }`}>
                  {material.materialType === "color" ? (
                    <span className="flex items-center gap-1">
                      <Palette size={12} /> لون
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Image size={12} /> صورة
                    </span>
                  )}
                </div>

                {/* حالة النشاط */}
                {!material.isActive && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/80 rounded-lg text-xs font-bold flex items-center gap-1">
                    <EyeOff size={12} /> مخفي
                  </div>
                )}
              </div>

              {/* معلومات الخامة */}
              <div className="p-4">
                <h3 className="font-bold text-lg">{material.name}</h3>
                <p className="text-sm text-slate-400">{material.nameEn}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {material.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => startEdit(material)}
                    className="flex-1 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors flex items-center justify-center gap-1">
                    <Edit3 size={14} />
                    تعديل
                  </button>
                  <button
                    onClick={() => toggleActive(material._id)}
                    className={`py-2 px-3 rounded-lg transition-colors ${
                      material.isActive
                        ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    }`}
                    title={material.isActive ? "إخفاء" : "إظهار"}>
                    {material.isActive ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(material._id)}
                    className="py-2 px-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    title="حذف">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Database size={48} className="mx-auto mb-4 opacity-50" />
            <p>لا توجد خامات في هذه الفئة</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 text-indigo-400 hover:text-indigo-300">
              إضافة خامة جديدة
            </button>
          </div>
        )}
      </div>

      {/* أنماط CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
