import React from 'react';
import { WALL_MATERIALS, FLOOR_MATERIALS } from './constants';
import { AppState, UpdateStateFn } from './types';
import api from '@/lib/api';

interface SidebarProps {
  state: AppState;
  updateState: UpdateStateFn;
  hidePanel?: boolean;
  orderOnly?: boolean;
  projectId?: string;
  onSave?: () => void;
  onSaveProject?: (projectData: any) => Promise<void>;
  isSaving?: boolean;
}

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  state, 
  updateState, 
  hidePanel,
  orderOnly,
  projectId,
  onSave,
  onSaveProject,
  isSaving = false
}) => {
  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      const config = {
        timestamp: new Date().toISOString(),
        wall: WALL_MATERIALS.find(m => m.id === state.wallMaterialId)?.name,
        floor: FLOOR_MATERIALS.find(m => m.id === state.floorMaterialId)?.name,
        settings: state
      };
      console.log('💾 Configuration Saved:', config);
      alert(`Configuration saved!\n\nWall: ${config.wall}\nFloor: ${config.floor}`);
    }
  };

  const handleSendOrder = async () => {
    if (!projectId) {
      alert("Error: Project ID is missing. Cannot submit order.");
      return;
    }

    try {
      // Send order request using the API utility
      const response = await api.post(`/orders/from-project/${projectId}`, {
        roomConfig: state
      });

      if (response.ok) {
        alert('✅ Order Request Sent Successfully! We will review your design shortly.');
        // Optionally redirect user after successful order
        // window.location.href = '/projects';
      } else {
        alert(`❌ Failed to send order request: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('❌ An unexpected error occurred while sending the order.');
    }
  };

  const handleResetCamera = () => {
    updateState({ autoRotate: false });
  };
  
  if (hidePanel) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 h-full w-80 z-10 transition-transform duration-500 ease-out transform translate-x-0">
      <div className="h-full w-full bg-slate-900/60 backdrop-blur-md border-l border-white/10 shadow-2xl overflow-y-auto p-6 text-white flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Design Studio
          </h1>
          <p className="text-xs text-gray-400 mt-1">Configure your dream space</p>
        </div>

        {/* SECTION 1: WALL FINISH */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
            Wall Finish
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {WALL_MATERIALS.map((material) => (
              <button
                key={material.id}
                onClick={() => updateState({ wallMaterialId: material.id })}
                className={`relative group p-1 rounded-xl transition-all duration-300 ${
                  state.wallMaterialId === material.id 
                    ? 'ring-2 ring-blue-500 bg-white/10' 
                    : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex flex-col items-center gap-2 p-2">
                  <div 
                    className="w-12 h-12 rounded-full shadow-lg border border-white/20"
                    style={{ backgroundColor: material.previewColor }}
                  />
                  <span className="text-xs font-medium text-center text-gray-200">
                    {material.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 2: FLOOR MATERIAL */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
            Floor Material
          </h2>
          <div className="space-y-2">
            {FLOOR_MATERIALS.map((material) => (
              <button
                key={material.id}
                onClick={() => updateState({ floorMaterialId: material.id })}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  state.floorMaterialId === material.id
                    ? 'bg-blue-600/20 border border-blue-500/50'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-md shadow-sm border border-white/10" 
                  style={{ backgroundColor: material.previewColor }}
                />
                <span className="text-sm">{material.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 3: SCENE CONTROLS */}
        <section className="space-y-6 pt-4 border-t border-white/10">
          
          {/* Light Intensity */}
          <div>
            <div className="flex justify-between text-xs mb-2 text-gray-400">
              <span className="flex items-center gap-1"><SunIcon /> Light Intensity</span>
              <span>{Math.round(state.lightIntensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.lightIntensity}
              onChange={(e) => updateState({ lightIntensity: parseFloat(e.target.value) })}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Auto-Rotate Camera</span>
            <button
              onClick={() => updateState({ autoRotate: !state.autoRotate })}
              className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                state.autoRotate ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <div 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                  state.autoRotate ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 flex gap-3">
          {orderOnly ? (
            <button
              onClick={handleSendOrder}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg"
            >
              <SaveIcon /> Send Order Request
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SaveIcon /> {isSaving ? 'Saving...' : 'Save Project'}
            </button>
          )}
          
          <button
            onClick={handleResetCamera}
            className="px-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            title="Reset View"
          >
            <RefreshIcon />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
