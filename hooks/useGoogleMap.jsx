export const loadGoogleMaps = (apiKey) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      // Server-side rendering (SSR)
      resolve();
      return;
    }

    if (window.google) {
      // Already loaded on client-side
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => resolve();
  });
};