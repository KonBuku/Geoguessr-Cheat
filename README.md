# GeoGuessr Cheat Chrome Extension

![Logo](assets/icons/icon128.png)

A Chrome extension that reveals the exact location in Geoguessr live on a minimap.

## How It Works

The extension intercepts the GeoGuessr API requests, specifically the `GetMetadata` endpoint that returns the actual location data. When it detects this information, it displays a small map with the exact location in the top-left corner of your screen.

![Cheat in Action](https://i.imgur.com/F8v1nl5.png)

## Technical Details

The extension works by intercepting XHR requests to the Maps API and extracting the location coordinates from the response:

![Dev Tools Screenshot](https://i.imgur.com/9dTq8qe.png)

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer Mode" in the top-right corner
4. Click "Load Unpacked" and select the folder containing this extension
5. The extension will now be active whenever you play GeoGuessr

## Disclaimer

This extension is for educational purposes only. Using it in competitive play is cheating and against GeoGuessr's terms of service. Use at your own risk.
