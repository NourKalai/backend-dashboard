import axios from 'axios';
import config from '../configs/config.json';
const wsUrl = config.wsUrl;
export async function getAllBuyers(token) {
    const config = {
        method: 'get',
        url: `${wsUrl}/buyer_profile/all`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    return axios(config)
}
export async function updateBuyer(id, data, token) {

    if (!id) {
        throw new Error("No id provided")
    }
    const config = {
        method: 'patch',
        url: `${wsUrl}/buyer_profile/update/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: typeof data === 'object' && !(data instanceof FormData) ? JSON.stringify(data) : data
    };
    if(data instanceof FormData){
        config.headers['Content-Type'] = 'multipart/form-data';
    }
    return (
        axios(config)
    )
}
export async function deleteBuyer(id, token) {
    const config = {
        method: 'delete',
        url: `${wsUrl}/buyer_profile/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'content-type': 'application/json'
        }
    };
    return (
        axios(config)
    );
}

export async function getBuyerById(id, token){
    const config = {
        method: 'get',
        url: `${wsUrl}/buyer_profile/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'content-type': 'application/json'
        }
    };
    return (
        axios(config)
    );
}

export async function deleteBuyerPicture(id, token){
    const config = {
        method: 'delete',
        url: `${wsUrl}/buyer_profile/delete_profile_image/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'content-type': 'application/json'
        }
    };
    return (
        axios(config)
    );
}
