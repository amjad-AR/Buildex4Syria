import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import TapToUpButton from "../../components/ui/TapToUpButton";

const ProviderDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isVerified = user?.isVerified ?? false;

  const stats = [
    { label: "Active Orders", value: "--", icon: "📦", color: "text-blue-400" },
    { label: "Completed", value: "--", icon: "✅", color: "text-emerald-400" },
    { label: "Revenue", value: "--", icon: "💰", color: "text-amber-400" },
    { label: "Rating", value: "--", icon: "⭐", color: "text-purple-400" },
  ];

  const providerActions = [
    {
      title: "3D Room Designer",
      description: "Create and design room projects",
      icon: "🎨",
      action: "room-configurator",
    },
    {
      title: "My Products",
      description: "Manage your product listings",
      icon: "📦",
      action: "products",
    },
    {
      title: "Orders",
      description: "View and manage orders",
      icon: "🛒",
      action: "orders",
    },
    {
      title: "Analytics",
      description: "View sales analytics",
      icon: "📊",
      action: "analytics",
    },
    {
      title: "Profile",
      description: "Update your business profile",
      icon: "🏢",
      action: "profile",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-black text-slate-900">P</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white">
                Provider Portal
              </span>
              <span className="text-xs text-slate-500 block">
                Buildex4Syria
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-slate-400 hover:text-white transition-colors"
            >
              View Site
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-lg text-white font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "P"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-sm font-medium">
                  {user?.companyName || user?.username}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-xs font-semibold uppercase">
                    {user?.role}
                  </span>
                  {isVerified ? (
                    <span className="text-emerald-400 text-xs">✓ Verified</span>
                  ) : (
                    <span className="text-amber-400 text-xs">Pending</span>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Verification Alert */}
        {!isVerified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert className="bg-amber-500/10 border-amber-500/30">
              <AlertTitle className="text-amber-400 flex items-center gap-2">
                <span>⏳</span> Account Pending Verification
              </AlertTitle>
              <AlertDescription className="text-amber-300/80">
                Your provider account is pending admin verification. Some
                features may be limited until your account is verified. This
                usually takes 24-48 hours.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏢</span>
            <h1 className="text-3xl font-bold text-white">
              Provider Dashboard
            </h1>
          </div>
          <p className="text-slate-400">
            Welcome back,{" "}
            <span className="text-emerald-400 font-medium">
              {user?.companyName || user?.username}
            </span>
            . Manage your business from here.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <span className="text-4xl opacity-50">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="bg-slate-800/50 border border-slate-700 p-1">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-slate-700"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-slate-700"
                >
                  Recent Orders
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="data-[state=active]:bg-slate-700"
                >
                  Products
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Quick Actions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {providerActions.map((action, index) => (
                      <motion.div
                        key={action.action}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group"
                          onClick={() => {
                            if (action.action === 'room-configurator') {
                              navigate('/provider/room-configurator');
                            } else {
                              // Handle other actions
                              console.log('Action:', action.action);
                            }
                          }}
                        >
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="text-3xl group-hover:scale-110 transition-transform">
                              {action.icon}
                            </div>
                            <div>
                              <h3 className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                                {action.title}
                              </h3>
                              <p className="text-slate-400 text-sm">
                                {action.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Performance Chart Placeholder */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Sales Performance
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Your sales over the last 30 days
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 flex items-center justify-center bg-slate-900/50 rounded-lg border border-dashed border-slate-700">
                        <div className="text-center text-slate-500">
                          <span className="text-4xl block mb-2">📊</span>
                          <p>Chart data will appear here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="orders">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Recent Orders
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Your latest customer orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-slate-900/50 rounded-lg border border-dashed border-slate-700">
                        <div className="text-center text-slate-500">
                          <span className="text-4xl block mb-2">📦</span>
                          <p>No orders yet</p>
                          <p className="text-sm mt-1">
                            Orders will appear here when customers place them
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="products">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-white">
                          Your Products
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Manage your product listings
                        </CardDescription>
                      </div>
                      <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        + Add Product
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-slate-900/50 rounded-lg border border-dashed border-slate-700">
                        <div className="text-center text-slate-500">
                          <span className="text-4xl block mb-2">🏷️</span>
                          <p>No products listed</p>
                          <p className="text-sm mt-1">
                            Add your first product to get started
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Profile Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span>🏢</span> Business Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Company</p>
                  <p className="text-white font-medium">
                    {user?.companyName || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Phone</p>
                  <p className="text-white font-medium">
                    {user?.phone || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Address</p>
                  <p className="text-white font-medium">
                    {user?.address || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Status</p>
                  {isVerified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 mt-1">
                      ✓ Verified Provider
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400 mt-1">
                      ⏳ Pending Verification
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-800/50 border-emerald-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <span>💡</span> Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-slate-300">
                  ✓ Complete your profile to increase visibility
                </p>
                <p className="text-slate-300">
                  ✓ Add high-quality product images
                </p>
                <p className="text-slate-300">
                  ✓ Respond to inquiries within 24 hours
                </p>
                <p className="text-slate-300">
                  ✓ Keep your inventory up to date
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <TapToUpButton />
    </div>
  );
};

export default ProviderDashboard;
