export const environment = {
    leaflet: {
        defaultCenter: [52.2660751, 6.1552165],
    },
    production: false,
    serviceWorker: false,
    tomorrowApiKey:'please generate your own api key here; https://app.tomorrow.io/home ',
    nsApiKey: 'please generate your own API key at apiportal.ns.nl',
    tomTomApiKey: 'Please generate your own API key at https://developer.tomtom.com/user/me/dashboard',
    get tomorrowIOLink() {
        return `https://api.tomorrow.io/v4/weather/forecast?location=42.3478,-71.0466&apikey=${this.tomorrowApiKey}`;
    },
    get tomorrowURL(){
        return `https://api.tomorrow.io/v4/map/tile/5/2/3/precipitationIntensity/now.png?apikey=${this.tomorrowApiKey}`
     }
};