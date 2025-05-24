import { environment } from "src/environments/environment"
export const dataProvider = {
    nwsRadar: {
        uri: `https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows`,
        options: {
            layers: 'conus_bref_qcd',
            format: `image/png`,
            transparent: true,
            opacity: 0.575,
            zIndex: 200
        },
        isWms: true
    },
    tomorrowRadar: {
        url : environment.tomorrowURL,
        options: {
            method: 'GET',
            headers: {accept: 'text/plain', 'accept-encoding': 'deflate, gzip, br'}
        },
        isWms: true
    }
}