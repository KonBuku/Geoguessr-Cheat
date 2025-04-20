const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (method, url, ...args) {
  originalOpen.apply(this, [method, url, ...args]);
  this._url = url;
};

XMLHttpRequest.prototype.send = function (...args) {
  if (this._url && this._url.includes("MapsJsInternalService/GetMetadata")) {
    const originalOnLoad = this.onload;

    this.onload = function (e) {
      try {
        if (this.responseText && this.status === 200) {
          const response = JSON.parse(this.responseText);
          extractLocationData(response, this._url);
        }
      } catch (error) {
        console.error("Error intercepting response:", error);
      }

      if (originalOnLoad) {
        originalOnLoad.call(this, e);
      }
    };
  }

  originalSend.apply(this, args);
};

function extractLocationData(response, url) {
  let location = null;

  try {
    if (
      Array.isArray(response) &&
      response[1] &&
      Array.isArray(response[1]) &&
      response[1][0] &&
      Array.isArray(response[1][0]) &&
      response[1][0][8] &&
      Array.isArray(response[1][0][8]) &&
      response[1][0][8][0] &&
      Array.isArray(response[1][0][8][0]) &&
      response[1][0][8][0][1] &&
      Array.isArray(response[1][0][8][0][1]) &&
      response[1][0][8][0][1][1] &&
      Array.isArray(response[1][0][8][0][1][1]) &&
      response[1][0][8][0][1][1][0] &&
      Array.isArray(response[1][0][8][0][1][1][0])
    ) {
      const coordArray = response[1][0][8][0][1][1][0];
      if (
        coordArray.length >= 4 &&
        typeof coordArray[2] === "number" &&
        typeof coordArray[3] === "number"
      ) {
        location = {
          lat: coordArray[2],
          lng: coordArray[3],
        };
      }
    }

    if (!location) {
      const findCoordinates = (arr) => {
        if (!Array.isArray(arr)) return null;

        if (
          arr.length === 4 &&
          arr[0] === null &&
          arr[1] === null &&
          typeof arr[2] === "number" &&
          typeof arr[3] === "number"
        ) {
          return { lat: arr[2], lng: arr[3] };
        }

        for (const item of arr) {
          if (Array.isArray(item)) {
            const result = findCoordinates(item);
            if (result) return result;
          }
        }

        return null;
      };

      const coords = findCoordinates(response);
      if (coords) {
        location = coords;
      }
    }
  } catch (error) {
    console.error(
      "Error extracting coordinates from Maps API response:",
      error
    );
  }

  if (location) {
    console.log("Found location:", location);
    window.postMessage(
      {
        type: "GEOGUESSR_LOCATION",
        location: location,
      },
      "*"
    );
  }
}
