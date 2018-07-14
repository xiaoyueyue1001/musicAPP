import axios from 'axios'
import jsonp from 'common/js/jsonp'

export function getRankData() {
    const url = '/getRankData'
    const data = {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        _: 1531485004927,
    }
    // return jsonp(url, data, {
    //     param: 'jsonpCallback'
    // })

    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url,
            data
        }).then(res => {
            let data = res.data;
            data = jsonp2obj(data);
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

function jsonp2obj(str) {
    let indexStart = str.indexOf("(");
    let indexEnd = str.length - 2;
    return JSON.parse(str.substring(indexStart + 1, indexEnd + 1))
}
