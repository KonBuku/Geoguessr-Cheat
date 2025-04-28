let countryCode = null;
let isMapVisible = true;
let lastLat = null;
let lastLng = null;
const COORD_THRESHOLD = 0.09; // 10km

function injectScript() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("src/location_interceptor.js");
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);

  setupHotkeys();
}

function toggleMapVisibility() {
  isMapVisible = !isMapVisible;

  const uiElement = document.getElementById("geoguess-assistant");
  if (uiElement) {
    if (isMapVisible) {
      window.GeoUI.showUI();
    } else {
      window.GeoUI.hideUI();
    }
  }

  localStorage.setItem("geoguessrMapVisible", isMapVisible.toString());
}

function exitExtension() {
  const uiElement = document.getElementById("geoguess-assistant");
  if (uiElement) {
    uiElement.remove();
  }

  document.removeEventListener("keydown", handleKeydown);
  window.GeoMap = null;

  try {
    chrome.runtime.sendMessage({ action: "uninstallExtension" });
  } catch (error) {
    console.error("Failed to uninstall extension:", error);
  }
}

function handleKeydown(event) {
  if (event.key === "F10") {
    toggleMapVisibility();
    event.preventDefault();
  } else if (event.key === "F9") {
    exitExtension();
    event.preventDefault();
  }
}

function setupHotkeys() {
  document.addEventListener("keydown", handleKeydown);

  const savedVisibility = localStorage.getItem("geoguessrMapVisible");
  if (savedVisibility !== null) {
    isMapVisible = savedVisibility === "true";

    const uiElement = document.getElementById("geoguess-assistant");
    if (uiElement) {
      if (isMapVisible) {
        window.GeoUI.showUI();
      } else {
        window.GeoUI.hideUI();
      }
    }
  }
}

function shouldUpdateMap(lat, lng) {
  if (lastLat === null || lastLng === null) {
    return true;
  }

  const latDiff = Math.abs(lat - lastLat);
  const lngDiff = Math.abs(lng - lastLng);

  return latDiff > COORD_THRESHOLD || lngDiff > COORD_THRESHOLD;
}

function updateMiniMap(lat, lng) {
  const mapDiv = document.getElementById("mini-map");
  if (!mapDiv) return;

  if (!shouldUpdateMap(lat, lng)) {
    return;
  }

  lastLat = lat;
  lastLng = lng;

  mapDiv.innerHTML = `
    <iframe 
      width="100%" 
      height="100%" 
      frameborder="0" 
      scrolling="no" 
      marginheight="0" 
      marginwidth="0" 
      src="https://www.openstreetmap.org/export/embed.html?bbox=${lng - 10},${lat - 10
    },${lng + 10},${lat + 10}&layer=mapnik&marker=${lat},${lng}" 
      style="border: none; border-radius: 10px;">
    </iframe>
  `;

  const uiElement = document.getElementById("geoguess-assistant");
  if (uiElement && !isMapVisible) {
    window.GeoUI.hideUI();
  }
}

async function fetchLocationName(lat, lng) {
  if (!shouldUpdateMap(lat, lng)) {
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();

    if (data && data.address) {
      const locationNameElement = document.getElementById("location-name");
      const address = data.address;
      let locationName = "";

      if (address.city || address.town || address.village) {
        locationName = address.city || address.town || address.village;
      } else if (address.county || address.state) {
        locationName = address.county || address.state;
      } else if (address.country) {
        locationName = address.country;
      }

      if (locationNameElement && locationName) {
        locationNameElement.innerHTML = locationName;
      } else if (locationNameElement) {
        locationNameElement.innerHTML = "Unknown Location";
      }

      if (data.address.country_code) {
        countryCode = data.address.country_code.toUpperCase();
        const flagElement = document.getElementById("country-flag");
        if (flagElement && countryCode) {
          flagElement.textContent = countryCode;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching location name:", error);
  }
}

function handleLocationUpdate(location) {
  if (!location) return;

  const lat = parseFloat(location.lat.toFixed(6));
  const lng = parseFloat(location.lng.toFixed(6));

  updateMiniMap(lat, lng);
  fetchLocationName(lat, lng);
}

window.GeoMap = {
  injectScript,
  handleLocationUpdate,
  setupHotkeys,
  exitExtension
};
