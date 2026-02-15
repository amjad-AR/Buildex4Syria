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
import TapToUpButton from "../../components/ui/TapToUpButton";

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const stats = [
    {
      label: "Total Users",
      value: "--",
      icon: "👥",
      change: "+12%",
      color: "text-blue-400",
    },
    {
      label: "Providers",
      value: "--",
      icon: "🏢",
      change: "+5%",
      color: "text-emerald-400",
    },
    {
      label: "Active Projects",
      value: "--",
      icon: "🏗️",
      change: "+8%",
      color: "text-amber-400",
    },
    {
      label: "Total Orders",
      value: "--",
      icon: "📦",
      change: "+15%",
      color: "text-purple-400",
    },
  ];

  const adminActions = [
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: "👤",
      action: "users",
    },
    {
      title: "Manage Providers",
      description: "Verify and manage providers",
      icon: "🏢",
      action: "providers",
    },
    {
      title: "Manage Projects",
      description: "Oversee all projects",
      icon: "🏗️",
      action: "projects",
    },
    {
      title: "Manage Orders",
      description: "View and process orders",
      icon: "📦",
      action: "orders",
    },
    {
      title: "Manage Materials",
      description: "Update material catalog",
      icon: "🧱",
      action: "materials",
    },
    {
      title: "System Settings",
      description: "Configure system settings",
      icon: "⚙️",
      action: "settings",
    },
  ];

  const recentActivities = [
    { type: "user", message: "New user registration", time: "5 min ago" },
    {
      type: "provider",
      message: "Provider verification pending",
      time: "12 min ago",
    },
    { type: "order", message: "New order #1234 placed", time: "1 hour ago" },
    {
      type: "project",
      message: 'Project "Damascus Tower" updated',
      time: "2 hours ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-black text-white">A</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white">Admin Panel</span>
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
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-lg text-white font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-sm font-medium">
                  {user?.username}
                </p>
                <p className="text-red-400 text-xs font-semibold uppercase">
                  {user?.role}
                </p>
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-slate-400">
            Welcome back,{" "}
            <span className="text-red-400 font-medium">{user?.username}</span>.
            Manage your platform from here.
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
                    <p className={`text-sm mt-2 ${stat.color}`}>
                      {stat.change} this week
                    </p>
                  </div>
                  <span className="text-4xl opacity-50">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

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
              value="actions"
              className="data-[state=active]:bg-slate-700"
            >
              Quick Actions
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-slate-700"
            >
              Recent Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* System Status */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span>🖥️</span> System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-slate-300">API Server</span>
                    <span className="flex items-center gap-2 text-emerald-400">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-slate-300">Database</span>
                    <span className="flex items-center gap-2 text-emerald-400">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-slate-300">Storage</span>
                    <span className="text-slate-400">-- GB used</span>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Tasks */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span>📋</span> Pending Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <span className="text-slate-300">
                      Provider Verifications
                    </span>
                    <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-sm">
                      -- pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <span className="text-slate-300">Order Reviews</span>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
                      -- pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <span className="text-slate-300">Support Tickets</span>
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-sm">
                      -- open
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="actions">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {adminActions.map((action, index) => (
                <motion.div
                  key={action.action}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-red-500/50 transition-all duration-300 cursor-pointer group h-full">
                    <CardHeader>
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                        {action.icon}
                      </div>
                      <CardTitle className="text-white group-hover:text-red-400 transition-colors">
                        {action.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {action.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="activity">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-400">
                    Latest actions and events on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              activity.type === "user"
                                ? "bg-blue-500/20 text-blue-400"
                                : activity.type === "provider"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : activity.type === "order"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {activity.type === "user"
                              ? "👤"
                              : activity.type === "provider"
                              ? "🏢"
                              : activity.type === "order"
                              ? "📦"
                              : "🏗️"}
                          </div>
                          <span className="text-slate-300">
                            {activity.message}
                          </span>
                        </div>
                        <span className="text-slate-500 text-sm">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
      <TapToUpButton />
    </div>
  );
};

export default AdminDashboard;
