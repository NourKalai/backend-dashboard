import configl from '../configs/config.json';
import axios from 'axios';
const wsUrl = configl.wsUrl;
export async function updateSeller(id, data, token){
    if(!id){
        throw new Error("No id provided")
    }
    const config = {
      method: 'patch',
      url: `${wsUrl}/seller_profile/update/${id}`,
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
      data : typeof data === 'object' && !(data instanceof FormData) ? JSON.stringify(data) : data
    };
    if(data instanceof FormData){
        config.headers['Content-Type'] = 'multipart/form-data';
    }
    return(
        axios(config)
    )
}
export async function getAllSellers(token){
    const config = {
        method: 'get',
        url: `${wsUrl}/seller_profile/all`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    return axios(config)
}

export async function deleteSeller(id,token){
    const config = {
        method: 'delete',
        url: `${wsUrl}/seller_profile/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'content-type': 'application/json'
        }
    };
    return(
        axios(config)
    );
}

export async function deleteSellerPicture(id, token){
    const config = {
        method: 'delete',
        url: `${wsUrl}/seller_profile/delete_profile_image/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'content-type': 'application/json'
        }
    };
    return(
        axios(config)
    );
}
