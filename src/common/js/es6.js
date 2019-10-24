import axios from "axios";
import { commonMethod } from "./common"

const http = ({
    url = '',
    param = {},
    method = 'get',
    responseType = 'json'
}) => {
    let promise = new Promise(function (resolve, reject) {
        axios({
            method: method,
            url,
            params: param,
            responseType: responseType,
            baseURL: commonMethod.url.baseURL
        }).then(function (response) {
            resolve(response)
        }).catch(function (error) {
            reject(error)
        });
    });
    return promise;
}


const httpLocal = ({
    url = '',
    responseType = 'json'
}) => {
    let promise = new Promise(function (resolve, reject) {
        axios({
            method: 'get',
            url,
            responseType: responseType,
        }).then(function (response) {
            resolve(response)
        }).catch(function (error) {
            reject(error)
        });
    });
    return promise;
}




export {
    http,
    httpLocal
}
