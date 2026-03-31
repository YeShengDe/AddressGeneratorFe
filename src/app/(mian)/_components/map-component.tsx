'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapLayerControl from './map-layer-control';
import MapSearch from './map-search';
import UserGenerator from './user-generator';
import { layerOptions } from './map-layer-control';
// 修复 Leaflet 默认图标问题
import L from 'leaflet';
import { LoaderCircle } from 'lucide-react';
import { useStore } from '../_store';
import {
  getPerson,
  getRandomCoor,
  type RandomCoordinateTarget,
} from '@/lib/utils';
import { getPopulationBoundsByCountry } from '@/lib/population';
import {
  generateValidatedRandomAddress,
  hydrateUserWithReverseGeocode,
  type RandomAddressGenerationProgress,
} from '../_lib/random-address';

const DefaultIcon = L.divIcon({
  html: '<div style="font-size: 30px;">📍</div>',
  className: 'emoji-marker',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -20],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ADDRESS_FOCUS_ZOOM = 17;
const COUNTRY_OVERVIEW_ZOOM_MAX = 5;
const COUNTRY_OVERVIEW_DURATION = 1.25;
const ADDRESS_FOCUS_DURATION = 1.45;
const TILE_KEEP_BUFFER = 8;
const STREET_LAYER =
  layerOptions.find((layer) => layer.id === 'street') ?? layerOptions[0];

interface LayerOption {
  id: string;
  name: string;
  url: string;
  attribution: string;
  hasLabels?: boolean;
  labelsUrl?: string;
}

export default function MapComponent({
  lat,
  lon,
}: {
  lat?: number;
  lon?: number;
}) {
  const {
    user,
    country_code,
    setCoord,
    setCountryCode,
    setLoadingAddress,
    setUser,
  } = useStore();
  const [currentLayer, setCurrentLayer] = useState<LayerOption>(
    layerOptions[0]
  );
  const [isGeneratingFlight, setIsGeneratingFlight] = useState(false);
  const [isGeneratingAddress, setIsGeneratingAddress] = useState(false);
  const [generationProgress, setGenerationProgress] =
    useState<RandomAddressGenerationProgress | null>(null);

  const queryClient = useQueryClient();
  const mapRef = useRef<L.Map | null>(null);
  const animationSequenceRef = useRef(0);
  const randomGenerationSequenceRef = useRef(0);
  const skipNextCoordSyncRef = useRef(false);

  const clearPendingAnimation = useCallback(() => {
    animationSequenceRef.current += 1;
    setIsGeneratingFlight(false);
    mapRef.current?.stop();
  }, []);

  const animateGeneratedAddress = useCallback(
    (targetCoord: [number, number], nextCountryCode: string) => {
      const map = mapRef.current;

      if (!map) {
        return;
      }

      clearPendingAnimation();
      const animationSequence = animationSequenceRef.current;
      setIsGeneratingFlight(true);

      const overviewBounds = getPopulationBoundsByCountry(nextCountryCode);

      if (overviewBounds) {
        map.once('moveend', () => {
          if (animationSequenceRef.current !== animationSequence) {
            return;
          }

          map.once('moveend', () => {
            if (animationSequenceRef.current !== animationSequence) {
              return;
            }

            setIsGeneratingFlight(false);
          });

          map.flyTo(targetCoord, ADDRESS_FOCUS_ZOOM, {
            animate: true,
            duration: ADDRESS_FOCUS_DURATION,
          });
        });

        map.flyToBounds(overviewBounds, {
          animate: true,
          duration: COUNTRY_OVERVIEW_DURATION,
          maxZoom: COUNTRY_OVERVIEW_ZOOM_MAX,
          padding: [56, 56],
        });

        return;
      }

      map.once('moveend', () => {
        if (animationSequenceRef.current !== animationSequence) {
          return;
        }

        setIsGeneratingFlight(false);
      });

      map.flyTo(targetCoord, ADDRESS_FOCUS_ZOOM, {
        animate: true,
        duration: ADDRESS_FOCUS_DURATION,
      });
    },
    [clearPendingAnimation]
  );

  const handleGenerateAddress = useCallback(
    async (target?: string | RandomCoordinateTarget) => {
      if (isGeneratingAddress) {
        return;
      }

      const generationSequence = randomGenerationSequenceRef.current + 1;
      randomGenerationSequenceRef.current = generationSequence;
      setIsGeneratingAddress(true);
      setGenerationProgress(null);
      setLoadingAddress(true);

      try {
        const generated = await generateValidatedRandomAddress(
          queryClient,
          target,
          (progress) => {
            if (randomGenerationSequenceRef.current !== generationSequence) {
              return;
            }

            setGenerationProgress(progress);
          }
        );

        if (randomGenerationSequenceRef.current !== generationSequence) {
          return;
        }

        const nextCountryCode = generated.country_code;
        const nextUser = generated.reverse
          ? hydrateUserWithReverseGeocode(
              getPerson(nextCountryCode),
              generated.reverse
            )
          : getPerson(nextCountryCode);

        if (mapRef.current) {
          skipNextCoordSyncRef.current = true;
        }

        setCountryCode(nextCountryCode);
        setCoord(generated.coord);
        setUser(nextUser);
        animateGeneratedAddress(generated.coord, nextCountryCode);
      } catch {
        if (randomGenerationSequenceRef.current !== generationSequence) {
          return;
        }

        const fallback = getRandomCoor(target, 0.2);
        const fallbackCountryCode = fallback.country_code;

        if (mapRef.current) {
          skipNextCoordSyncRef.current = true;
        }

        setCountryCode(fallbackCountryCode);
        setCoord(fallback.coord);
        setUser(getPerson(fallbackCountryCode));
        animateGeneratedAddress(fallback.coord, fallbackCountryCode);
      } finally {
        if (randomGenerationSequenceRef.current === generationSequence) {
          setGenerationProgress(null);
          setIsGeneratingAddress(false);
          setLoadingAddress(false);
        }
      }
    },
    [
      animateGeneratedAddress,
      isGeneratingAddress,
      queryClient,
      setCoord,
      setCountryCode,
      setLoadingAddress,
      setUser,
    ]
  );

  useEffect(() => {
    return () => {
      clearPendingAnimation();
    };
  }, [clearPendingAnimation]);

  // 地理编码 - 根据坐标获取地址
  useEffect(() => {
    if (mapRef.current) {
      if (skipNextCoordSyncRef.current) {
        skipNextCoordSyncRef.current = false;
        return;
      }

      mapRef.current.setView([lat ?? 0, lon ?? 0], ADDRESS_FOCUS_ZOOM, {
        animate: true,
        duration: 1.0,
      });
    }
  }, [lat, lon]);

  const handleLayerChange = (layer: LayerOption) => {
    setCurrentLayer(layer);
  };

  const showAnimationPreviewLayer =
    isGeneratingFlight && currentLayer.id !== STREET_LAYER.id;
  const attributionHtml = showAnimationPreviewLayer
    ? `${STREET_LAYER.attribution} | ${currentLayer.attribution}`
    : currentLayer.attribution;

  // 处理搜索位置选择
  const handleLocationSelect = (lat: number, lng: number) => {
    clearPendingAnimation();
    setCoord([lat, lng]); // 更新全局坐标状态
    // 移动地图中心到新位置，带动画效果
    if (mapRef.current) {
      mapRef.current.stop();
      mapRef.current.setView([lat, lng], ADDRESS_FOCUS_ZOOM, {
        animate: true,
        duration: 1.0,
      });
    }
  };
  // 地图引用组件
  function MapRefHandler() {
    const map = useMapEvents({});
    mapRef.current = map;
    return null;
  }

  // 处理地图点击事件的组件
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        // 检查点击是否在控制面板区域内
        const clickedElement = e.originalEvent?.target as HTMLElement;
        if (clickedElement) {
          // 检查是否点击了控制面板或其子元素
          const isControlPanel = clickedElement.closest('[data-map-control]');
          if (isControlPanel) {
            return; // 如果点击的是控制面板，不处理地图点击
          }
        }

        const { lat, lng } = e.latlng;
        clearPendingAnimation();
        setCoord([lat, lng]); // 更新全局坐标状态
        const newUser = getPerson(country_code);
        setUser(newUser);
        // 自动移动地图使标记点居中
        if (mapRef.current) {
          mapRef.current.stop();
          mapRef.current.setView([lat, lng], mapRef.current.getZoom(), {
            animate: true,
            duration: 0.5,
          });
        }
      },
    });
    return null;
  }

  return (
    <div className="relative h-full w-full">
      {/* 地点搜索组件 */}
      <MapSearch
        onLocationSelect={handleLocationSelect}
        onGenerateAddress={handleGenerateAddress}
        disabled={isGeneratingAddress}
      />

      <MapContainer
        center={[lat ?? 0, lon ?? 0]} // 使用传入的经纬度或默认值
        zoom={16} // 增大放大级别，可以看到房子和地貌
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false} // 禁用默认的缩放控件
        attributionControl={false} // 禁用默认的属性控件
      >
        {/* 地图引用处理器 */}
        <MapRefHandler />
        {/* 地图点击事件处理器 */}
        <MapClickHandler />

        {showAnimationPreviewLayer && (
          <TileLayer
            key="street-animation-preview"
            attribution={STREET_LAYER.attribution}
            url={STREET_LAYER.url}
            keepBuffer={TILE_KEEP_BUFFER}
            updateWhenIdle={false}
          />
        )}

        <TileLayer
          key={currentLayer.id}
          attribution={currentLayer.attribution}
          url={currentLayer.url}
          keepBuffer={TILE_KEEP_BUFFER}
          opacity={showAnimationPreviewLayer ? 0.45 : 1}
          updateWhenIdle={false}
        />

        {/* 如果有标注层，则添加标注层 */}
        {currentLayer.hasLabels && currentLayer.labelsUrl && (
          <TileLayer
            key={`${currentLayer.id}-labels`}
            url={currentLayer.labelsUrl}
            attribution=""
            keepBuffer={TILE_KEEP_BUFFER}
            updateWhenIdle={false}
          />
        )}

        <Marker position={[lat ?? 0, lon ?? 0]}>
          <Popup>
            <div className="min-w-[250px] max-w-[350px]">
              <div className="font-semibold text-sm mb-3 flex items-center gap-2">
                📍 <span>位置详情</span>
              </div>

              {/* 详细地址 */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  详细地址
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <div className="break-all select-all">
                    {user?.display_name}
                  </div>
                </div>
              </div>

              {/* 精确坐标 */}
              <div className="text-xs text-gray-500 border-t pt-2 space-y-1">
                <div className="font-medium mb-1">精确坐标</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">纬度:</span>
                    <br />
                    <span className="font-mono">{lat}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">经度:</span>
                    <br />
                    <span className="font-mono">{lon}</span>
                  </div>
                </div>
              </div>
              {/* 操作提示 */}
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-3 pt-2 border-t">
                💡 点击地图其他位置可重新定位标记
              </div>
            </div>
          </Popup>
        </Marker>

        {/* 自定义图层控制组件 */}
        <MapLayerControl
          onLayerChange={handleLayerChange}
          currentLayer={currentLayer.id}
        />
      </MapContainer>

      {/* 自定义属性信息 */}
      <div className="absolute bottom-1 left-1 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80 px-2 py-1 rounded backdrop-blur-sm">
        <span dangerouslySetInnerHTML={{ __html: attributionHtml }} />
      </div>
      {/* 用户信息生成器 */}
      <UserGenerator
        onGenerateAddress={handleGenerateAddress}
        disabled={isGeneratingAddress}
      />

      {isGeneratingAddress && (
        <div className="pointer-events-auto absolute inset-0 z-[1001] flex items-center justify-center bg-black/72 p-4 text-white backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-2xl font-bold leading-tight sm:text-3xl md:text-5xl">
              一个野生的地址生成器
            </div>
            <LoaderCircle className="h-8 w-8 animate-spin text-white/80" />
            <div className="text-sm text-white/75 md:text-base">
              {generationProgress
                ? `正在寻找可用住宅地址... 第 ${generationProgress.attempt}/${generationProgress.totalAttempts} 次尝试`
                : '正在寻找可用住宅地址...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
