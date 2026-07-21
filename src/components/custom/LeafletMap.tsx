import React, { useRef } from "react";
import { View, Platform, Linking } from "react-native";

let WebViewComponent: any = null;
if (Platform.OS !== "web") {
  WebViewComponent = require("react-native-webview").WebView;
}

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  onLocationChanged: (latitude: number, longitude: number) => void;
}

export default function LeafletMap({ latitude, longitude, onLocationChanged }: LeafletMapProps) {
  const webViewRef = useRef<any>(null);

  const handleMapMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "LOCATION_CHANGED") {
        onLocationChanged(data.latitude, data.longitude);
      }
    } catch (e) {}
  };

  if (Platform.OS === "web") {
    return (
      <View className="absolute inset-0 w-full h-full">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
        />
      </View>
    );
  }

  const mapMobileHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; background-color: #E5E5DE; }
        .leaflet-control-geocoder {
          position: fixed !important; top: 35px !important; left: 50% !important; transform: translateX(-50%) !important;
          width: 88% !important; max-width: 440px !important; margin: 0 !important; border-radius: 16px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; border: 1px solid rgba(255,255,255,0.6) !important;
          overflow: hidden; background: rgba(255, 255, 255, 0.75) !important; backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important; z-index: 99999 !important;
        }
        .leaflet-control-geocoder-form { width: 100% !important; display: flex !important; }
        .leaflet-control-geocoder-form input {
          font-size: 16px !important; padding: 14px 16px !important; width: 100% !important; border: none !important; outline: none !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: transparent !important;
        }
        .leaflet-control-geocoder-icon { display: none !important; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
      <script>
        var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${latitude}, ${longitude}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        var marker = L.marker([${latitude}, ${longitude}]).addTo(map);

        L.Control.geocoder({
          defaultMarkGeocode: false,
          placeholder: "📍 Buscar localização...",
          collapsed: false
        }).on('markgeocode', function(e) {
          var center = e.geocode.center; map.flyTo(center, 16, { animate: true, duration: 1.5 }); marker.setLatLng(center);
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOCATION_CHANGED', latitude: center.lat, longitude: center.lng }));
        }).addTo(map);
      </script>
    </body>
    </html>
  `;

  return (
    <View className="absolute inset-0 w-full h-full">
      {WebViewComponent && (
        <WebViewComponent
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: mapMobileHTML }}
          className="flex-1"
          domStorageEnabled={true}
          javaScriptEnabled={true}
          onMessage={handleMapMessage}
          onShouldStartLoadWithRequest={(request: any) => {
            if (request.url.startsWith("http") && request.url !== "about:blank") {
              Linking.openURL(request.url).catch(() => {});
              return false;
            }
            return true;
          }}
        />
      )}
    </View>
  );
}
