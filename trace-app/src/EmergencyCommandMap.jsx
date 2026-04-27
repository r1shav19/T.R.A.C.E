import { useEffect, useMemo, useRef, useState } from "react";
import { getServiceTone } from "./traceData";

const TONE_COLORS = {
  red: "#ff4d4d",
  blue: "#59a7ff",
  green: "#2ee59d",
  amber: "#ffb347",
  violet: "#a482ff",
  cyan: "#55d9ff",
};

const STATUS_PROGRESS = {
  standby: 0,
  alerted: 0.18,
  notified: 0.12,
  syncing: 0.3,
  "en-route": 0.64,
  "on-scene": 0.96,
  resolved: 1,
};

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#070b10" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9fb0c6" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#070b10" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#16222f" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#09111a" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#0c1621" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#172331" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#243444" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#05080c" }],
  },
];

function loadGoogleMapsApi(apiKey) {
  if (!apiKey) {
    return Promise.reject(
      new Error(
        "Missing VITE_GOOGLE_MAPS_API_KEY. Add the Maps JavaScript API key to the Vite environment file."
      )
    );
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (window.__traceGoogleMapsPromise) {
    return window.__traceGoogleMapsPromise;
  }

  window.__traceGoogleMapsPromise = new Promise((resolve, reject) => {
    const cleanup = () => {
      delete window.__traceInitGoogleMaps;
    };

    window.__traceInitGoogleMaps = () => {
      cleanup();
      resolve(window.google);
    };

    const existingScript = document.querySelector(
      'script[data-trace-google-maps="true"]'
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&v=weekly&loading=async&callback=__traceInitGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.dataset.traceGoogleMaps = "true";
    script.onerror = () => {
      cleanup();
      reject(
        new Error(
          "Google Maps JavaScript API failed to load. Check the key and API restrictions."
        )
      );
    };
    document.head.appendChild(script);
  });

  return window.__traceGoogleMapsPromise;
}

function resolveColor(type) {
  return TONE_COLORS[getServiceTone(type)] ?? TONE_COLORS.red;
}

function resolveStatusLabel(status) {
  switch (status) {
    case "on-scene":
      return "On scene";
    case "en-route":
      return "En route";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

function EmptyMapState() {
  return (
    <div className="trace-map-empty">
      <div className="section-tag">Shared map</div>
      <h3>Map unavailable</h3>
      <p>
        TRACE could not prepare the shared map because no client profile is
        available yet.
      </p>
    </div>
  );
}

function CanvasMapStage({ incident, profile, services, selectedServiceId, syncStatus, title }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const viewport = useMemo(() => {
    const latitudeValues = [incident.coords.lat, ...services.map(item => item.coords.lat)];
    const longitudeValues = [incident.coords.lng, ...services.map(item => item.coords.lng)];
    const paddingLat = 0.008;
    const paddingLng = 0.008;

    return {
      minLat: Math.min(...latitudeValues) - paddingLat,
      maxLat: Math.max(...latitudeValues) + paddingLat,
      minLng: Math.min(...longitudeValues) - paddingLng,
      maxLng: Math.max(...longitudeValues) + paddingLng,
    };
  }, [incident, services]);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const toScreen = coords => {
      const width = canvas.width;
      const height = canvas.height;
      const xRange = Math.max(0.0001, viewport.maxLng - viewport.minLng);
      const yRange = Math.max(0.0001, viewport.maxLat - viewport.minLat);

      return {
        x: ((coords.lng - viewport.minLng) / xRange) * width,
        y: height - ((coords.lat - viewport.minLat) / yRange) * height,
      };
    };

    let tick = 0;
    resize();

    const draw = () => {
      tick += 1;
      const width = canvas.width;
      const height = canvas.height;
      const center = toScreen(incident.coords);

      context.fillStyle = "#060a10";
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(255,255,255,0.04)";
      context.lineWidth = 1;
      for (let x = 0; x <= width; x += 40) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }

      for (let y = 0; y <= height; y += 40) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      context.strokeStyle = "rgba(255,255,255,0.05)";
      context.lineWidth = 8;
      [
        [0.16, 0.05, 0.22, 0.96],
        [0.44, 0.08, 0.47, 0.95],
        [0.74, 0.02, 0.78, 0.9],
        [0.05, 0.32, 0.95, 0.35],
        [0.08, 0.62, 0.92, 0.58],
      ].forEach(([x1, y1, x2, y2]) => {
        context.beginPath();
        context.moveTo(x1 * width, y1 * height);
        context.lineTo(x2 * width, y2 * height);
        context.stroke();
      });

      for (let pulseIndex = 0; pulseIndex < 3; pulseIndex += 1) {
        const radius = (tick * 0.9 + pulseIndex * 28) % 86;
        context.beginPath();
        context.arc(center.x, center.y, radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(255,77,77,${(1 - radius / 86) * 0.34})`;
        context.lineWidth = 1;
        context.stroke();
      }

      services.forEach(service => {
        const basePoint = toScreen(service.coords);
        const toneColor = resolveColor(service.type);
        const progress = STATUS_PROGRESS[service.status] ?? 0;
        const tokenPoint =
          service.category === "responder" || service.category === "authority"
            ? {
                x: lerp(basePoint.x, center.x, progress),
                y: lerp(basePoint.y, center.y, progress),
              }
            : basePoint;
        const selected = selectedServiceId === service.id;

        context.beginPath();
        context.arc(basePoint.x, basePoint.y, selected ? 11 : 8, 0, Math.PI * 2);
        context.fillStyle = `${toneColor}22`;
        context.fill();

        context.beginPath();
        context.arc(basePoint.x, basePoint.y, selected ? 6 : 4, 0, Math.PI * 2);
        context.fillStyle = toneColor;
        context.shadowColor = toneColor;
        context.shadowBlur = selected ? 24 : 12;
        context.fill();
        context.shadowBlur = 0;

        if (progress > 0) {
          context.beginPath();
          context.setLineDash([4, 8]);
          context.moveTo(basePoint.x, basePoint.y);
          context.lineTo(center.x, center.y);
          context.strokeStyle = `${toneColor}55`;
          context.lineWidth = 1;
          context.stroke();
          context.setLineDash([]);

          context.beginPath();
          context.arc(tokenPoint.x, tokenPoint.y, selected ? 7 : 5, 0, Math.PI * 2);
          context.fillStyle = toneColor;
          context.shadowColor = toneColor;
          context.shadowBlur = selected ? 20 : 10;
          context.fill();
          context.shadowBlur = 0;
        }

        context.font = "11px 'Space Mono', monospace";
        context.fillStyle = selected ? "#ffffff" : "rgba(237,242,250,0.8)";
        context.fillText(service.name, basePoint.x + 12, basePoint.y - 10);
      });

      context.beginPath();
      context.arc(center.x, center.y, 9, 0, Math.PI * 2);
      context.fillStyle = "#ff4d4d";
      context.shadowColor = "#ff4d4d";
      context.shadowBlur = 24;
      context.fill();
      context.shadowBlur = 0;

      context.font = "bold 12px 'Space Mono', monospace";
      context.fillStyle = "#ff9e9e";
      context.fillText("CLIENT", center.x + 14, center.y + 4);

      animationRef.current = window.requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    draw();

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationRef.current);
    };
  }, [incident, selectedServiceId, services, viewport]);

  return (
    <div className="trace-map-stage">
      <canvas ref={canvasRef} className="trace-map-canvas" />
      <div className="trace-map-card trace-map-card-left">
        <div className="section-tag">Shared live map</div>
        <div className="trace-map-title">{title}</div>
        <div className="trace-map-meta">{profile.address}</div>
        <div className="trace-map-meta">{profile.zone}</div>
        <div className="trace-map-meta">
          {incident.coords.lat.toFixed(4)}, {incident.coords.lng.toFixed(4)}
        </div>
      </div>
      <div className="trace-map-card trace-map-card-right">
        <span className="status-pill">
          <span className="status-dot" />
          {syncStatus}
        </span>
      </div>
      <div className="trace-map-legend">
        <div className="legend-item">
          <span className="legend-dot red" />
          Client
        </div>
        <div className="legend-item">
          <span className="legend-dot green" />
          Responders
        </div>
        <div className="legend-item">
          <span className="legend-dot blue" />
          Authorities
        </div>
        <div className="legend-item">
          <span className="legend-dot orange" />
          Service nodes
        </div>
      </div>
    </div>
  );
}

function GoogleMapStage({
  incident,
  profile,
  services,
  selectedServiceId,
  onSelectService,
  syncStatus,
  title,
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const googleRef = useRef(null);
  const incidentMarkerRef = useRef(null);
  const markerRefs = useRef([]);
  const pathRefs = useRef([]);
  const infoWindowRef = useRef(null);
  const fittedIncidentIdRef = useRef(null);
  const [apiState, setApiState] = useState({
    status: apiKey ? "loading" : "error",
    error: apiKey ? "" : "Missing Google Maps API key.",
  });

  useEffect(() => {
    let cancelled = false;

    loadGoogleMapsApi(apiKey)
      .then(google => {
        if (cancelled) {
          return;
        }

        googleRef.current = google;
        setApiState({ status: "ready", error: "" });
      })
      .catch(error => {
        if (cancelled) {
          return;
        }

        setApiState({ status: "error", error: error.message });
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    if (apiState.status !== "ready" || !mapNodeRef.current) {
      return undefined;
    }

    const google = googleRef.current;

    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(mapNodeRef.current, {
        center: incident.coords,
        zoom: 14,
        disableDefaultUI: true,
        gestureHandling: "greedy",
        clickableIcons: false,
        styles: DARK_MAP_STYLE,
        backgroundColor: "#060a10",
      });
      infoWindowRef.current = new google.maps.InfoWindow();
    }

    markerRefs.current.forEach(marker => marker.setMap(null));
    pathRefs.current.forEach(path => path.setMap(null));
    markerRefs.current = [];
    pathRefs.current = [];

    if (incidentMarkerRef.current) {
      incidentMarkerRef.current.setMap(null);
    }

    incidentMarkerRef.current = new google.maps.Marker({
      map: mapRef.current,
      position: incident.coords,
      title: `${profile.name} | Active client`,
      zIndex: 999,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: "#ff4d4d",
        fillOpacity: 1,
        strokeColor: "#ffd2d2",
        strokeOpacity: 1,
        strokeWeight: 2,
        scale: 9,
      },
    });

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(incident.coords);

    markerRefs.current = services.map(service => {
      const selected = selectedServiceId === service.id;
      const toneColor = resolveColor(service.type);
      const marker = new google.maps.Marker({
        map: mapRef.current,
        position: service.coords,
        title: service.name,
        zIndex: selected ? 10 : 5,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: toneColor,
          fillOpacity: selected ? 1 : 0.82,
          strokeColor: selected ? "#ffffff" : toneColor,
          strokeOpacity: 0.95,
          strokeWeight: selected ? 2 : 1,
          scale: selected ? 8 : 6,
        },
      });

      marker.addListener("click", () => {
        onSelectService?.(service.id);
        infoWindowRef.current?.setContent(
          `
            <div style="padding:8px 10px;max-width:220px;color:#070b10;font-family:Arial,sans-serif;">
              <div style="font-weight:700;margin-bottom:4px;">${service.name}</div>
              <div style="font-size:12px;margin-bottom:4px;">${service.distanceLabel} | ETA ${service.etaMinutes} min</div>
              <div style="font-size:12px;color:#374151;">${service.description}</div>
            </div>
          `
        );
        infoWindowRef.current?.open({ anchor: marker, map: mapRef.current });
      });

      bounds.extend(service.coords);

      if (service.category === "responder" || service.category === "authority") {
        const path = new google.maps.Polyline({
          map: mapRef.current,
          path: [service.coords, incident.coords],
          strokeColor: toneColor,
          strokeOpacity: selected ? 0.8 : 0.35,
          strokeWeight: selected ? 3 : 2,
          icons: [
            {
              icon: {
                path: "M 0,-1 0,1",
                strokeOpacity: 1,
                scale: 3,
              },
              offset: "0",
              repeat: "12px",
            },
          ],
        });
        pathRefs.current.push(path);
      }

      return marker;
    });

    if (fittedIncidentIdRef.current !== incident.id) {
      mapRef.current.fitBounds(bounds, 60);
      fittedIncidentIdRef.current = incident.id;
    } else if (selectedServiceId) {
      const selectedService = services.find(service => service.id === selectedServiceId);
      if (selectedService) {
        mapRef.current.panTo(selectedService.coords);
      }
    } else {
      mapRef.current.panTo(incident.coords);
    }

    return undefined;
  }, [apiState.status, incident, onSelectService, profile.name, selectedServiceId, services]);

  useEffect(() => {
    return () => {
      markerRefs.current.forEach(marker => marker.setMap(null));
      pathRefs.current.forEach(path => path.setMap(null));
      incidentMarkerRef.current?.setMap(null);
    };
  }, []);

  if (apiState.status === "error") {
    return (
      <div className="trace-map-stage trace-map-google-state">
        <div className="trace-map-empty">
          <div className="section-tag">Google Maps</div>
          <h3>Map unavailable</h3>
          <p>{apiState.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trace-map-stage">
      <div ref={mapNodeRef} className="trace-map-canvas" />
      <div className="trace-map-card trace-map-card-left">
        <div className="section-tag">Google Maps live view</div>
        <div className="trace-map-title">{title}</div>
        <div className="trace-map-meta">{profile.address}</div>
        <div className="trace-map-meta">{profile.zone}</div>
        <div className="trace-map-meta">
          {incident.coords.lat.toFixed(4)}, {incident.coords.lng.toFixed(4)}
        </div>
      </div>
      <div className="trace-map-card trace-map-card-right">
        <span className="status-pill">
          <span className="status-dot" />
          {syncStatus}
        </span>
      </div>
      <div className="trace-map-legend">
        <div className="legend-item">
          <span className="legend-dot red" />
          Client
        </div>
        <div className="legend-item">
          <span className="legend-dot green" />
          Responders
        </div>
        <div className="legend-item">
          <span className="legend-dot blue" />
          Authorities
        </div>
        <div className="legend-item">
          <span className="legend-dot orange" />
          Demo service nodes
        </div>
      </div>
      {apiState.status === "loading" && (
        <div className="trace-map-loading">
          <div className="trace-map-loading-card">
            <div className="section-tag">Loading map</div>
            <p>Booting Google Maps for the shared TRACE view.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function EmergencyCommandMap({
  incident,
  profile,
  services,
  selectedServiceId,
  onSelectService,
  syncStatus,
  title = "Shared live map",
  mapVariant = "google",
}) {
  if (!profile) {
    return <EmptyMapState />;
  }

  const mapIncident = incident ?? {
    id: `preview-${profile.id}`,
    coords: profile.coords,
  };
  const useGoogleMap =
    mapVariant === "google" || Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  return (
    <div className="trace-map-shell">
      {useGoogleMap ? (
        <GoogleMapStage
          incident={mapIncident}
          profile={profile}
          services={services}
          selectedServiceId={selectedServiceId}
          onSelectService={onSelectService}
          syncStatus={syncStatus}
          title={title}
        />
      ) : (
        <CanvasMapStage
          incident={mapIncident}
          profile={profile}
          services={services}
          selectedServiceId={selectedServiceId}
          syncStatus={syncStatus}
          title={title}
        />
      )}

      <aside className="trace-map-rail">
        <div className="section-tag">Demo help services</div>
        <div className="trace-map-list">
          {services.map(service => (
            <button
              key={service.id}
              type="button"
              className={`trace-map-service ${
                selectedServiceId === service.id ? "selected" : ""
              }`}
              onClick={() => onSelectService?.(service.id)}
            >
              <div className="trace-map-service-top">
                <span
                  className={`trace-map-bullet ${getServiceTone(service.type)}`}
                />
                <span className="trace-map-service-name">{service.name}</span>
              </div>
              <div className="trace-map-service-meta">
                {service.distanceLabel} | ETA {service.etaMinutes} min
              </div>
              <div className="trace-map-service-meta">{service.lane}</div>
              <div className="trace-map-service-copy">{service.description}</div>
              <div className="trace-map-service-status">
                {resolveStatusLabel(service.status)}
              </div>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
