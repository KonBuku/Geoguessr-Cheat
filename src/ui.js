function createUI() {
  const container = document.createElement("div");
  container.id = "geoguess-assistant";
  container.style.cssText = `
    position: absolute;
    top: 150px;
    left: 24px;
    background-color: rgba(25, 25, 25, 0.92);
    border-radius: 12px;
    color: white;
    font-family: 'Proxima Nova', Arial, sans-serif;
    padding: 8px;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    display: none;
    width: 230px;
    overflow: hidden;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;

  const content = document.createElement("div");
  content.id = "geoguess-content";
  content.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 4px;">
      <div id="location-name" style="font-weight: bold; font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-grow: 1;"></div>
      <div id="country-flag" style="font-size: 16px; margin-left: 8px; line-height: 1;"></div>
    </div>
    <div id="mini-map" style="height: 165px; margin: 2px 0; border-radius: 10px; overflow: hidden;"></div>
  `;

  container.appendChild(content);
  document.body.appendChild(container);

  const style = document.createElement("style");
  style.textContent = `
    #geoguess-assistant {
      opacity: 0.95;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

function showUI() {
  document.getElementById("geoguess-assistant").style.display = "block";
}

function hideUI() {
  document.getElementById("geoguess-assistant").style.display = "none";
}

window.GeoUI = {
  createUI,
  showUI,
  hideUI,
};
