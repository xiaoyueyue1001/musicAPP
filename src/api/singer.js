// import axios from 'axios'
import jsonp from 'common/js/jsonp'

export function getSingerList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
    const data =
        {
            channel: 'singer',
            page: 'list',
            key: 'all_all_all',
            pagesize: 100,
            pagenum: 1,
            loginUin: 0,
            hostUin: 0,
            notice: 0,
            platform: 'yqq',
            needNewCode: 0,
            g_tk: 5381,
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: 0,
            format: 'jsonp'
        }
    return jsonp(url, data, {
        param: 'jsonpCallback'
    })
    // return axios({
    //     method: 'get',
    //     url,
    //     data: {
    //         csrf_token: data
    //     }
    // })
}