import axios from "axios";
import config from '../configs/config.json';
const wsUrl = config.wsUrl;
export async function getAllServices(token){
    const config = {
        method: 'get',
        url: `${wsUrl}/services/all`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    return axios(config)
}
export async function updateService(id, data, token){
    if(!id){
        throw new Error("No id provided")
    }
    const config = {
        method: 'put',
        url: `${wsUrl}/services/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data : JSON.stringify(data)
    };
    return(
        axios(config)
    )
}
export async function getServicesByUser(token,id){
    return axios.get(`${wsUrl}/services/user/${id}/7/1`,{
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}
export async function deleteService(id,token){
    const config = {
        method: 'delete',
        url: `${wsUrl}/services/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'content-type': 'application/json'
        }
    };
    return(
        axios(config)
    );
}