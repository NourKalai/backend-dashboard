import axios from "axios";
import config from '../configs/config.json';
const wsUrl = config.wsUrl;
export async function getAllCategories(token){
    const config = {
        method: 'get',
        url: `${wsUrl}/category/all`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    return axios(config)
}
export async function updateCategory(id, data, token){
    if(!id){
        throw new Error("No id provided")
    }
    const config = {
        method: 'put',
        url: `${wsUrl}/category/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        },
        data : data
    };
    return(
        axios(config)
    )
}
export async function addCategory(data,token){
    const config = {
        method: 'post',
        url: `${wsUrl}/category`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        },
        data : data
    };
    return(
        axios(config)
    )
}
export async function searchCategory(name,token){
    const config = {
        method: 'get',
        url: `${wsUrl}/category/search/${name}/1/1`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    return(
        axios(config)
    )
}
export async function deleteCategory(id,token){
    const config = {
        method: 'delete',
        url: `${wsUrl}/category/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    return(
        axios(config)
    )
}
export async function deleteCategoryImage(id, token){
    const config = {
        method: 'delete',
        url: `${wsUrl}/category/image/${id}`,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    }
    return axios(config)
}