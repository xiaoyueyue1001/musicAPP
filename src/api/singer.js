import jsonp from 'common/js/jsonp'
import axios from 'axios'
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
}

export function getSingerInfo({ mid }) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
    const data = {
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        singermid: mid,
        order: 'listen',
        begin: 0,
        num: 100,
        songstatus: 1
    }
    return jsonp(url, data, {
        param: 'jsonpCallback'
    })
}

export function getMusicVkey(songmid) {
    // const url = '/getMusicVkey';
    const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
    const data = {
        g_tk: 5381,
        // jsonpCallback: 'MusicJsonCallback10673305293322288',
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        // callback: 'MusicJsonCallback10673305293322288',
        uin: 0,
        songmid: songmid,
        filename: `C400${songmid}.m4a`,
        guid: 7833995540,
    }
    return jsonp(url, data, {
        // param: 'jsonpCallback'
    })
}

export function getLyric(songmid = "003399lJ0At8Zu") {
    // const url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg";
    const url = "/getLyric";
    const data = {
        // callback: 'MusicJsonCallback_lrc',
        pcachetime: 1529935554445,
        songmid: songmid,
        g_tk: 5381,
        // jsonpCallback: 'MusicJsonCallback_lrc',
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
    }
    return jsonp(url, data, {
        // param: 'jsonpCallback'
    })
}