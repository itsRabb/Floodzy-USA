'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Eye,
  EyeOff,
  Cloud,
  MapPin,
  Navigation,
  Maximize2,
  Minimize2,
  Settings,
  AlertTriangle, // Import Alert Triangle for warning icon
  Home, // Import Home icon for shelters
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MapControlsProps {
  onFullscreenToggle: () => void;
  isFullscreen: boolean;
  onLayerChange: (layer: string) => void;
  selectedLayer: string;
  onFloodZonesToggle: () => void;
  showFloodZones: boolean;
  onWeatherToggle: () => void;
  showWeatherStations: boolean;
  onRealtimeAlertsToggle: () => void; // New property for toggling real-time alerts
  showRealtimeAlerts: boolean; // New property for real-time alerts status
  onCrowdsourcedReportsToggle: () => void; // New: Toggle for crowdsourced reports
  showCrowdsourcedReports: boolean; // New: State for crowdsourced reports visibility
  onOfficialBPBDDataToggle: () => void; // New: Toggle for official BPBD data
  showOfficialBPBDData: boolean; // New: State for official BPBD data visibility
  onSheltersToggle?: () => void; // NEW: Toggle for FEMA shelters
  showShelters?: boolean; // NEW: State for shelters visibility
  showFullscreenButton?: boolean; // New: To hide the fullscreen button
}

const mapLayers = [
  { id: 'street', name: 'Road', icon: MapPin },
  { id: 'satellite', name: 'Satellite', icon: Navigation },
  { id: 'terrain', name: 'Terrain', icon: Layers },
];

export function MapControls({
  onFullscreenToggle,
  isFullscreen,
  onLayerChange,
  selectedLayer,
  onFloodZonesToggle,
  showFloodZones,
  onWeatherToggle,
  showWeatherStations,
  onRealtimeAlertsToggle, // New property
  showRealtimeAlerts, // New property
  onCrowdsourcedReportsToggle, // New: Destructure new prop
  showCrowdsourcedReports, // New: Destructure new prop
  onOfficialBPBDDataToggle, // New: Destructure new prop
  showOfficialBPBDData, // New: Destructure new prop
  onSheltersToggle, // NEW: Destructure shelter toggle
  showShelters, // NEW: Destructure shelter state
  showFullscreenButton = true, // New: Destructure with default value
}: MapControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute top-4 left-4 z-[1001] space-y-2"
    >
      {/* Main Controls */}
      <Card className="p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-10 w-10 border-slate-400 text-slate-900 dark:border-slate-600 dark:text-slate-100"
          >
            <Settings size={16} />
          </Button>

          {showFullscreenButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={onFullscreenToggle}
              className="h-10 w-10 border-slate-400 text-slate-900 dark:border-slate-600 dark:text-slate-100"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
          )}
        </div>
      </Card>

      {/* Expanded Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {/* Layer Selection */}
            <Card className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Map Layers</h4>
                <div className="space-y-1">
                  {mapLayers.map((layer) => (
                    <Button
                      key={layer.id}
                      variant={
                        selectedLayer === layer.id ? 'secondary' : 'outline'
                      }
                      size="sm"
                      onClick={() => onLayerChange(layer.id)}
                      className="w-full justify-start h-8 text-slate-900 dark:text-slate-100 border-slate-400 dark:border-slate-600"
                    >
                      <layer.icon size={14} className="mr-2" />
                      {layer.name}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Overlay Toggles */}
            <Card className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Overlay</h4>
                <div className="space-y-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onFloodZonesToggle}
                    className="w-full justify-between h-8 text-slate-900 dark:text-slate-100 border-slate-400 dark:border-slate-600"
                  >
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2" />
                      Flood Zones
                    </div>
                    {showFloodZones ? (
                      <Eye size={14} className="text-success" />
                    ) : (
                      <EyeOff size={14} className="text-muted-foreground" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onWeatherToggle}
                    className="w-full justify-between h-8 text-slate-900 dark:text-slate-100 border-slate-400 dark:border-slate-600"
                  >
                    <div className="flex items-center">
                      <Cloud size={14} className="mr-2" />
                      Weather Stations
                    </div>
                    {showWeatherStations ? (
                      <Eye size={14} className="text-success" />
                    ) : (
                      <EyeOff size={14} className="text-muted-foreground" />
                    )}
                  </Button>

                  {/* Real-time Alerts Toggle Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRealtimeAlertsToggle}
                    className="w-full justify-between h-8 text-slate-900 dark:text-slate-100 border-slate-400 dark:border-slate-600"
                  >
                    <div className="flex items-center">
                      <AlertTriangle size={14} className="mr-2" />
                      Real-time Alerts
                    </div>
                    {showRealtimeAlerts ? (
                      <Eye size={14} className="text-success" />
                    ) : (
                      <EyeOff size={14} className="text-muted-foreground" />
                    )}
                  </Button>

                  {/* NEW: Tombol Toggle Laporan Pengguna */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCrowdsourcedReportsToggle}
                    className="w-full justify-between h-8 text-slate-900 dark:text-slate-100 border-slate-400 dark:border-slate-600"
                  >
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2" />
                      User Reports
                    </div>
                    {showCrowdsourcedReports ? (
                      <Eye size={14} className="text-success" />
                    ) : (
                      <EyeOff size={14} className="text-muted-foreground" />
                    )}
                  </Button>

                  {/* New: Official BPBD Data Toggle Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOfficialBPBDDataToggle}
                    className="w-full justify-between h-8 text-slate-900 dark:text-slate-100 border-slate-400 dark:border-slate-600"
                  >
                    <div className="flex items-center">
                      <AlertTriangle size={14} className="mr-2" />
                      Official BPBD Data
                    </div>
                    {showOfficialBPBDData ? (
                      <Eye size={14} className="text-success" />
                    ) : (
                      <EyeOff size={14} className="text-muted-foreground" />
                    )}
                  </Button>

                  {/* NEW: Emergency Shelters Toggle Button */}
                  {onSheltersToggle && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onSheltersToggle}
                      className="w-full justify-between h-8 text-slate-900 dark:text-slate-100 border-slate-400 dark:border-slate-600"
                    >
                      <div className="flex items-center">
                        <Home size={14} className="mr-2" />
                        Emergency Shelters
                      </div>
                      {showShelters ? (
                        <Eye size={14} className="text-success" />
                      ) : (
                        <EyeOff size={14} className="text-muted-foreground" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">Status</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-slate-900 dark:text-slate-100">
                    <span>Active Zones</span>
                    <Badge variant="warning" size="sm">
                      12
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-900 dark:text-slate-100">
                    <span>Alerts</span>
                    <Badge variant="danger" size="sm">
                      3
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-900 dark:text-slate-100">
                    <span>Online Stations</span>
                    <Badge variant="success" size="sm">
                      89
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

