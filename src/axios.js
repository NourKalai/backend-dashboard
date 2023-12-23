import appConfig from './configs/config.json';
import axios from 'axios';
export default axios.create({
    baseURL: appConfig.wsUrl,
    timeout: 1000,
    headers: {"content-type": "application/json","acces-control-allow-origin": "*"}
});
export function config(url){
    return(
        {
            method: 'get',
            url: url,
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvdWZhMjBAZmZmLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjcxMTE5NjA0LCJleHAiOjE2NzI0MTU2MDR9.-ulpvLjPfM76O7ggRGM8SDVM4t0q0eaSaJXUl9Nj8AI'
            }
        }
    );
}
export function postConfig(url){
    return(
        {
            method: 'post',
            url: url,
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvdWZhMjBAZmZmLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjcxMTE5NjA0LCJleHAiOjE2NzI0MTU2MDR9.-ulpvLjPfM76O7ggRGM8SDVM4t0q0eaSaJXUl9Nj8AI'
            }
        }
    );
}