chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "uninstallExtension") {
        chrome.management.uninstallSelf();
    }
}); 