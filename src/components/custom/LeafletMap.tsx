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

  // Centering map function
  const goToCurrentLocation = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (typeof map !== 'undefined' && typeof marker !== 'undefined') {
          var latlng = [${latitude}, ${longitude}];
          map.flyTo(latlng, 16, { animate: true, duration: 1.5 });
          marker.setLatLng(latlng);
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOCATION_CHANGED', latitude: ${latitude}, longitude: ${longitude} }));
        }
        true;
      `);
    }
  };

  const handleMapMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "LOCATION_CHANGED") {
        onLocationChanged(data.latitude, data.longitude);
      } else if (data.type === "REQUEST_GPS") {
        goToCurrentLocation();
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
          position: fixed !important; top: 65px !important; left: 50% !important; transform: translateX(-50%) !important;
          width: 88% !important; max-width: 440px !important; margin: 0 !important; border-radius: 16px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; border: 1px solid rgba(255,255,255,0.6) !important;
          background: rgba(255, 255, 255, 0.92) !important; backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important; z-index: 99999 !important;
        }
        .leaflet-control-geocoder-form {
          width: 100% !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
        }
        .leaflet-control-geocoder-form input {
          font-size: 16px !important; padding: 14px 12px 14px 16px !important; flex: 1 !important; border: none !important; outline: none !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: transparent !important;
        }
        .leaflet-control-geocoder-icon { display: none !important; }

        .gps-btn {
          background: transparent !important; border: none !important; outline: none !important;
          width: 44px !important; height: 44px !important; display: flex !important;
          justify-content: center !important; align-items: center !important; cursor: pointer !important;
          padding: 10px !important; margin-right: 4px !important; color: #1C1C1E !important; opacity: 0.85 !important;
        }
        .gps-btn:active { opacity: 0.5 !important; }

        .leaflet-control-geocoder-alternatives {
          margin: 0 !important; padding: 0 !important; list-style: none !important;
          background: rgba(255, 255, 255, 0.95) !important; max-height: 200px !important; overflow-y: auto !important;
          border-top: 1px solid rgba(0,0,0,0.08) !important;
          border-bottom-left-radius: 16px !important; border-bottom-right-radius: 16px !important;
        }
        .leaflet-control-geocoder-alternatives li {
          padding: 12px 16px !important; cursor: pointer !important; font-size: 14px !important;
          border-bottom: 1px solid rgba(0,0,0,0.04) !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #1C1C1E !important;
        }
        .leaflet-control-geocoder-alternatives li a {
          color: #1C1C1E !important; text-decoration: none !important;
        }
        .leaflet-control-geocoder-alternatives li:last-child {
          border-bottom: none !important;
        }
        .leaflet-control-geocoder-alternatives li:active, .leaflet-control-geocoder-alternatives .leaflet-control-geocoder-selected {
          background-color: rgba(0,0,0,0.05) !important;
        }
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

        var geocoderControl = L.Control.geocoder({
          defaultMarkGeocode: false,
          placeholder: "📍 Buscar localização...",
          collapsed: false
        }).on('markgeocode', function(e) {
          var center = e.geocode.center; map.flyTo(center, 16, { animate: true, duration: 1.5 }); marker.setLatLng(center);
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOCATION_CHANGED', latitude: center.lat, longitude: center.lng }));
        }).addTo(map);

        // Autocomplete inteligente em tempo real e Botão de GPS
        setTimeout(function() {
          var input = document.querySelector('.leaflet-control-geocoder-form input');
          var alternativesContainer = document.querySelector('.leaflet-control-geocoder-alternatives');
          var geocoderService = geocoderControl.getGeocoder();
          var debounceTimeout = null;

          if (input && alternativesContainer && geocoderService) {
            // Criação do botão de GPS
            var gpsBtn = document.createElement('button');
            gpsBtn.type = 'button';
            gpsBtn.className = 'gps-btn';
            gpsBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>';

            var form = document.querySelector('.leaflet-control-geocoder-form');
            if (form) {
              form.appendChild(gpsBtn);
            }

            gpsBtn.addEventListener('click', function(ev) {
              ev.preventDefault();
              ev.stopPropagation();
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'REQUEST_GPS' }));
            });

            // Lógica do Autocomplete
            input.addEventListener('input', function(e) {
              var query = e.target.value;

              if (debounceTimeout) clearTimeout(debounceTimeout);

              if (query.trim().length >= 3) {
                debounceTimeout = setTimeout(function() {
                  geocoderService.geocode(query, function(results) {
                    while (alternativesContainer.firstChild) {
                      alternativesContainer.removeChild(alternativesContainer.firstChild);
                    }

                    if (results && results.length > 0) {
                      alternativesContainer.style.display = 'block';
                      results.forEach(function(result) {
                        var li = document.createElement('li');
                        li.innerText = result.name;
                        li.addEventListener('click', function(ev) {
                          ev.stopPropagation();
                          var center = result.center;
                          map.flyTo(center, 16, { animate: true, duration: 1.5 });
                          marker.setLatLng(center);
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'LOCATION_CHANGED',
                            latitude: center.lat,
                            longitude: center.lng
                          }));
                          input.value = result.name;
                          alternativesContainer.style.display = 'none';
                        });
                        alternativesContainer.appendChild(li);
                      });
                    } else {
                      alternativesContainer.style.display = 'none';
                    }
                  });
                }, 400);
              } else {
                while (alternativesContainer.firstChild) {
                  alternativesContainer.removeChild(alternativesContainer.firstChild);
                }
                alternativesContainer.style.display = 'none';
              }
            });
          }
        }, 500);
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
