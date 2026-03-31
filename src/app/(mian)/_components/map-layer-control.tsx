'use client';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Satellite,
  Map,
  Mountain,
} from 'lucide-react';
import { useMap } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LayerOption {
  id: string;
  name: string;
  url: string;
  attribution: string;
  icon: React.ReactNode;
  hasLabels?: boolean;
  labelsUrl?: string;
}

export const layerOptions: LayerOption[] = [
  {
    id: 'satellite',
    name: '卫星地图',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    icon: <Satellite className="h-4 w-4" />,
    hasLabels: true, // 需要标注层
    labelsUrl:
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  },
  {
    id: 'street',
    name: '标准地图',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    icon: <Map className="h-4 w-4" />,
    hasLabels: false,
  },
  {
    id: 'terrain',
    name: '地形图',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    icon: <Mountain className="h-4 w-4" />,
    hasLabels: false,
  },
];

interface MapLayerControlProps {
  onLayerChange: (layer: LayerOption) => void;
  currentLayer: string;
}

export default function MapLayerControl({
  onLayerChange,
  currentLayer,
}: MapLayerControlProps) {
  const map = useMap();
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleLayerChange = (layer: LayerOption) => {
    onLayerChange(layer);
    setShowLayerMenu(false);
  };

  const getCurrentLayerOption = () => {
    return layerOptions.find((l) => l.id === currentLayer) || layerOptions[0];
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLayerMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLayerOption = getCurrentLayerOption();

  return (
    <div
      className="absolute top-[120px] xs:top-[70px] md:top-auto md:bottom-[50px] right-4 z-[1000] flex flex-col gap-2 items-end"
      data-map-control
    >
      {/* 缩放控制器 */}
      <Card className="p-1 w-[40px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border shadow-lg">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </Card>
      {/* 图层选择器 - 紧凑版 */}
      <div className="relative" ref={menuRef}>
        {/* 图层菜单 */}
        {showLayerMenu && (
          <Card className="absolute bottom-12 right-0 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border shadow-lg min-w-[120px]">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <Layers className="h-3 w-3 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                选择图层
              </span>
            </div>
            <div className="space-y-1">
              {layerOptions.map((layer) => (
                <Button
                  key={layer.id}
                  variant="ghost"
                  size="sm"
                  className={`w-full h-8 justify-start text-xs px-2 ${
                    currentLayer === layer.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleLayerChange(layer)}
                >
                  <div className="flex items-center gap-2">
                    {layer.icon}
                    {layer.name}
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* 当前图层按钮 */}
        <Card className="p-1 w-[40px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              showLayerMenu
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title={`当前图层: ${currentLayerOption.name}`}
          >
            {currentLayerOption.icon}
          </Button>
        </Card>
      </div>
    </div>
  );
}
