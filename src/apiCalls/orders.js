import config from "../configs/config.json";
import axios from "axios";

const wsUrl = config.wsUrl;

export async function getAllOrders(token){
    const config = {
        method: 'get',
        url: `${wsUrl}/orders/all`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    return axios(config)
}
/**
    Description: update an order
    @param id: String
    @param token: String
    @param data: Object
    @return: Promise
*/
export async function updateOrder(id, token, data){
    const config = {
        method: 'put',
        url: `${wsUrl}/orders/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        data:JSON.stringify(data)
    };
    return axios(config);
}

export async function deleteOrder(id, token){
    const config = {
        method: 'delete',
        url: `${wsUrl}/orders/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    return axios(config);
}