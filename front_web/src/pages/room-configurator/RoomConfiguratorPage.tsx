import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RoomDesignStudio from '@/components/room-configurator/room-configurator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const RoomConfiguratorPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isUser } = useAuth();

  // Redirect if not a regular user
  React.useEffect(() => {
    if (!user || !isUser()) {
      navigate('/login');
    }
  }, [user, isUser, navigate]);

  if (!user || !isUser()) {
    return null;
  }

  return (
    <div className="relative w-full h-screen" style={{ direction: 'ltr' }}>
      {/* Isolated 3D Configurator Container */}
      <div className="room-configurator-wrapper" dir="rtl" style={{ width: '100%', height: '100%', isolation: 'isolate' }}>
        <RoomDesignStudio />
      </div>
      
      {/* Back button at middle left */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 z-50" style={{ direction: 'ltr' }}>
        <Button
          variant="outline"
          onClick={() => navigate('/projects')}
          className="bg-[#022d37]/80 backdrop-blur-md border-[#084C5C]/50 text-[#ffedd8] hover:bg-[#022d37] hover:border-[#084C5C] shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      </div>
    </div>
  );
};

export default RoomConfiguratorPage;
