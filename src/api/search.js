import jsonp from "jsonp"
import axios from "axios"

//获取热门搜索词
export function getHotKeys() {
    const method = "get"
    const url = "/getHotKeys"
    const data = {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        _: 1532005702144,
    }

    return new Promise((resolve, reject) => {
        axios({
            method,
            url,
            data
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

//获取搜索结果
export function getSearchData(query, page, isNeedSinger) {
    const method = "get"
    const url = "/getSearchData"
    const data = {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        w: query,
        zhidaqu: isNeedSinger ? 1 : 0,
        catZhida: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: 20,
        n: 20,
        p: page,
        remoteplace: 'txt.mqq.all',
        _: 1532353286253
    }

    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: data
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}