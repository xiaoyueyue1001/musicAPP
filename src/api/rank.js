import axios from 'axios'
import jsonp from 'common/js/jsonp'

export function getRankData() {
    const method = 'get'
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

    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: data
        }).then(res => {
            let data = res.data;
            // data = jsonp2obj(data);
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

export function getTopListData(topid) {
    const method = 'get'
    const url = '/getTopListData'
    // const url = 'https://y.qq.com/w/toplist.html'
    const data = {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        tpl: 3,
        page: 'detail',
        type: 'top',
        topid,
        _: 1531552347162
    }
    // return jsonp(url, data, {
    //     param: 'jsonpCallback'
    // })

    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: data
        }).then(res => {
            let data = res.data;
            // data = jsonp2obj(data);
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
