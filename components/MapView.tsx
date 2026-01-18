
import React, { useEffect, useRef } from 'react';
import { MissingPerson, CaseStatus } from '../types';

interface MapViewProps {
  reports: MissingPerson[];
}

const MapViewComponent: React.FC<MapViewProps> = ({ reports }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  // Expose share function to window for raw HTML popup interaction
  useEffect(() => {
    (window as any).copyCaseLink = (id: string) => {
      const url = `${window.location.origin}?case=${id}`;
      navigator.clipboard.writeText(url).then(() => {
        // Simple visual feedback using alert as we don't have a global toast system in this file's scope easily
        const notification = document.createElement('div');
        notification.innerHTML = 'Link copied!';
        notification.style.cssText = `
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: #0F172A;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 1rem;
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          z-index: 9999;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          animation: fadeSlideUp 0.3s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.transition = 'opacity 0.3s';
          setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
      });
    };
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([-1.2921, 36.8219], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    
    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    reports.forEach(report => {
      const isMissing = report.status === CaseStatus.MISSING;
      const color = isMissing ? '#EF4444' : '#10B981';
      
      const marker = L.circleMarker([report.lat, report.lng], {
        radius: 8,
        fillColor: color,
        color: "#FFFFFF",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      });

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; padding: 4px; min-width: 150px;">
            <div style="font-weight: 800; font-size: 14px; color: #0F172A; margin-bottom: 2px;">${report.name}</div>
            <div style="font-size: 11px; color: #64748B; font-weight: 500; margin-bottom: 8px;">${report.location}</div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                <div style="display: inline-block; padding: 2px 8px; border-radius: 4px; background-color: ${isMissing ? '#FEE2E2' : '#D1FAE5'}; color: ${color}; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em;">
                    ${report.status}
                </div>
                <button 
                  onclick="copyCaseLink('${report.id}')"
                  style="background: none; border: none; color: #3B82F6; font-size: 10px; font-weight: 800; text-transform: uppercase; cursor: pointer; padding: 0; display: flex; align-items: center; gap: 4px;"
                >
                  Share
                </button>
            </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
          closeButton: false,
          className: 'custom-map-popup'
      });

      // Show details on hover
      marker.on('mouseover', function(e: any) {
        this.openPopup();
      });
      // We removed mouseout as people need to click the share button in the popup
      // marker.on('mouseout', function(e: any) {
      //   this.closePopup();
      // });

      marker.addTo(markersLayerRef.current);
    });
  }, [reports]);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Regional Heatmap</h1>
        <p className="text-slate-500 mt-2 font-medium">Geographic distribution of active cases</p>
      </div>
      
      <div className="flex-1 relative bg-white border border-slate-200 rounded-3xl p-4 shadow-sm overflow-hidden min-h-[500px]">
        <div ref={mapContainerRef} className="z-0 h-full w-full" />
        
        <div className="absolute bottom-10 right-10 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 z-[1000] w-64 pointer-events-none">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Map Legend</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#EF4444] shadow-sm border-2 border-white" />
              <span className="text-sm font-semibold text-slate-700">Missing Person</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#10B981] shadow-sm border-2 border-white" />
              <span className="text-sm font-semibold text-slate-700">Successfully Found</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-map-popup .leaflet-popup-content-wrapper {
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .leaflet-container {
            font-family: 'Inter', sans-serif;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translate(-50%, 1rem); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

export default MapViewComponent;
