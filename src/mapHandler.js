let countryCode = null;

function injectScript() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("location_interceptor.js");
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
}

function updateMiniMap(lat, lng) {
  const mapDiv = document.getElementById("mini-map");
  if (!mapDiv) return;

  mapDiv.innerHTML = `
    <iframe 
      width="100%" 
      height="100%" 
      frameborder="0" 
      scrolling="no" 
      marginheight="0" 
      marginwidth="0" 
      src="https://www.openstreetmap.org/export/embed.html?bbox=${lng - 10},${
    lat - 10
  },${lng + 10},${lat + 10}&layer=mapnik&marker=${lat},${lng}" 
      style="border: none; border-radius: 10px;">
    </iframe>
  `;
}

async function fetchLocationName(lat, lng) {
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

  const lat = location.lat.toFixed(6);
  const lng = location.lng.toFixed(6);

  updateMiniMap(lat, lng);
  fetchLocationName(lat, lng);

  return { lat, lng };
}

window.GeoMap = {
  injectScript,
  handleLocationUpdate,
};
