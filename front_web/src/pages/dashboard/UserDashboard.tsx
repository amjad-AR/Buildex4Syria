import React from "react";
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
import TapToUpButton from "../../components/ui/TapToUpButton";

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const quickActions = [
    {
      title: "Browse Projects",
      description: "Explore construction projects",
      icon: "🏗️",
      link: "/projects",
    },
    {
      title: "View Services",
      description: "Check available services",
      icon: "🔧",
      link: "/services",
    },
    {
      title: "Contact Us",
      description: "Get in touch with our team",
      icon: "💬",
      link: "/contact",
    },
    {
      title: "About Buildex",
      description: "Learn about our mission",
      icon: "📖",
      link: "/about",
    },
  ];

  const stats = [
    { label: "Saved Projects", value: "0", icon: "📁" },
    { label: "Inquiries", value: "0", icon: "📝" },
    { label: "Messages", value: "0", icon: "✉️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-black text-slate-900">B</span>
            </div>
            <span className="text-xl font-bold text-white">
              Buildex<span className="text-amber-400">4</span>Syria
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-lg">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-sm font-medium">
                  {user?.username}
                </p>
                <p className="text-slate-400 text-xs capitalize">
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
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back,{" "}
            <span className="text-amber-400">{user?.username}</span>!
          </h1>
          <p className="text-slate-400">
            Here's what's happening with your account today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={stat.label} className="bg-slate-800/50 border-slate-700">
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <Link to={action.link}>
                  <Card className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-all duration-300 cursor-pointer group h-full">
                    <CardHeader>
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                        {action.icon}
                      </div>
                      <CardTitle className="text-white group-hover:text-amber-400 transition-colors">
                        {action.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {action.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Account Information</CardTitle>
              <CardDescription className="text-slate-400">
                Your account details and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Username</p>
                    <p className="text-white font-medium">{user?.username}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Email</p>
                    <p className="text-white font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Role</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-400 capitalize mt-1">
                      {user?.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Account Status</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 mt-1">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <TapToUpButton />
    </div>
  );
};

export default UserDashboard;
