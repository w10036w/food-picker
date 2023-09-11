function parseEssentialDetails() {
  return { 
    user: window.__PROVIDER_PROPS__.user,
    api_key: window.__PROVIDER_PROPS__.config.FIREBASE_API_KEY
  };
}

window.addEventListener(
  "message",
  function (event) {
    if (event.data.type && event.data.type === "RECEIVE") {
      let essential = parseEssentialDetails();
      window.postMessage({ type: "FROM_PAGE", essential });
    }
  },
  false
);
