import axios from "axios";



const localHttp = ({
    url = '',
}) => {
    let promise = new Promise(function (resolve, reject) {
        axios({
            method: 'get',
            url,
            responseType: 'json',
            baseURL: 'http://localhost:1234/', //根路径
        }).then(function (response) {
            resolve(response)
        }).catch(function (error) {
            reject(error)
        });
    });
    return promise;
}

const axiosHttp = ({
    url = '',
    param = {},
    method = 'get',
    postData = {},
}) => {
    let promise = new Promise(function (resolve, reject) {
        axios({
            method: method,
            url,
            params: param,
            responseType: 'json',
            data: postData,
            baseURL: 'http://7.24.123.247:58080/ICOS-CMDI/', //根路径
            // cancelToken: new CancelToken( c => { //阻止相同地址的二次请求
            // 	cancel = c
            // } )
        }).then(function (response) {
            resolve(response)
        }).catch(function (error) {
            reject(error)
        });
    });
    return promise;
}

export {
    localHttp,
    axiosHttp
}
