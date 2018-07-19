import jsonp from "jsonp"
import axios from "axios"

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