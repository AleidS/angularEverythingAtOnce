import { environment } from "src/environments/environment"
export const dataProviderTomorrow = {
    tomorrowRadar: {
        url : environment.tomorrowURL,
        options: {
            method: 'GET',
            headers: {accept: 'text/plain', 'accept-encoding': 'deflate, gzip, br'}
        },
        isWms: true
    }
}