import config from "@/configs/config.json";
import axios from "axios";
const wsUrl = config.wsUrl;

/**
 * @param {string} token
 * @param {object} data
 * @returns {Promise}
 */



export function createAdmin(token,data){
    const config = {
        method: 'POST',
        url: `${wsUrl}/auth/admin/subscribe`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(data)
    };
    return axios(config);
}