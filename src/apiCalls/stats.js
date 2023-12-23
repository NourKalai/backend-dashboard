import axios from "axios";
import config from '../configs/config.json';
const wsUrl = config.wsUrl;

export async function getAllStats(token){
  const config = {
    method: 'get',
    url: `${wsUrl}/stats`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  return axios(config)
}