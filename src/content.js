let currentLocation = null;

window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "GEOGUESSR_LOCATION") {
    currentLocation = event.data.location;
    window.GeoMap.handleLocationUpdate(currentLocation);

    const isMapVisible = localStorage.getItem("geoguessrMapVisible");
    if (isMapVisible !== "false") {
      window.GeoUI.showUI();
    }
  }
});

function initialize() {
  console.log("GeoGuessr Location Display initialized");
  window.GeoMap.injectScript();
  window.GeoUI.createUI();
}

if (document.readyState === "complete") {
  initialize();
} else {
  window.addEventListener("load", initialize);
}
