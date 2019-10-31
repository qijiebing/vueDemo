// import { fetch } from './fetch'
import api from '../config/api'
export const getCityInfoByLocation = ({ latitude, longitude }) => {
    return window.app.fetch({
        url: api.regeoaddress,
        method: 'POST',
        data: {
            lat: latitude,
            lon: longitude
        }
    })
}
