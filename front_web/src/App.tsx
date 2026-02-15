import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute, AdminRoute, ProviderRoute, PublicOnlyRoute } from "./components/auth/PrivateRoute";

// Eagerly load main pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import ProjectsPage from "./pages/ProjectsPage";

// Lazy load auth pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const ProviderRegisterPage = lazy(() => import("./pages/auth/ProviderRegisterPage"));

// Lazy load dashboard pages
const UserDashboard = lazy(() => import("./pages/dashboard/UserDashboard"));
const AdminDashboard = lazy(() => import("./pages/dashboard/AdminDashboard"));
const ProviderDashboard = lazy(() => import("./pages/dashboard/ProviderDashboard"));

// Lazy load room configurator pages
const RoomConfiguratorPage = lazy(() => import("./pages/room-configurator/RoomConfiguratorPage"));
const ProviderRoomConfiguratorPage = lazy(() => import("./pages/room-configurator/ProviderRoomConfiguratorPage"));
const AdminRoomConfiguratorPage = lazy(() => import("./pages/room-configurator/AdminRoomConfiguratorPage"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Auth Routes - Only accessible when not logged in */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register/provider"
            element={
              <PublicOnlyRoute>
                <ProviderRegisterPage />
              </PublicOnlyRoute>
            }
          />

          {/* User Dashboard - Accessible by all authenticated users */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <UserDashboard />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/room-configurator"
            element={
              <AdminRoute>
                <AdminRoomConfiguratorPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Provider Routes */}
          <Route
            path="/provider/dashboard"
            element={
              <ProviderRoute>
                <ProviderDashboard />
              </ProviderRoute>
            }
          />
          <Route
            path="/provider/room-configurator"
            element={
              <ProviderRoute>
                <ProviderRoomConfiguratorPage />
              </ProviderRoute>
            }
          />
          <Route
            path="/provider/*"
            element={
              <ProviderRoute>
                <ProviderDashboard />
              </ProviderRoute>
            }
          />

          {/* Room Configurator Routes */}
          <Route
            path="/room-configurator"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <RoomConfiguratorPage />
              </PrivateRoute>
            }
          />

          {/* Catch-all redirect to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
