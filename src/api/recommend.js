import axios from 'axios'

export function getRecommend() {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: '/getRecommend',
            data: {
                g_tk: 5381,
                uin: 0,
                format: 'json',
                inCharset: 'utf-8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'h5',
                needNewCode: 1,
                _: 1528295789107,
            }
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    })
}