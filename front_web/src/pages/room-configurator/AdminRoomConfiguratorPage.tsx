import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminPanel from '@/components/room-configurator/admin-panel';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AdminRoomConfiguratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Redirect if not an admin
  React.useEffect(() => {
    if (!user || !isAdmin()) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="relative w-full min-h-screen" style={{ direction: 'ltr' }}>
      {/* Header with back button */}
      <div className="absolute top-4 left-4 z-50" style={{ direction: 'ltr' }}>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/dashboard')}
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Isolated Admin Panel Container */}
      <div className="room-configurator-wrapper" dir="rtl" style={{ width: '100%', minHeight: '100vh', isolation: 'isolate' }}>
        <AdminPanel />
      </div>
    </div>
  );
};

export default AdminRoomConfiguratorPage;
