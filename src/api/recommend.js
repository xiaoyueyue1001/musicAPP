import axios from 'axios'
import jsonp from 'common/js/jsonp'

export function getRecommend() {
    // return new Promise((resolve, reject) => {
    //     axios({
    //         method: 'get',
    //         url: '/getRecommend',
    //         data: {
    //             g_tk: 5381,
    //             uin: 0,
    //             format: 'json',
    //             inCharset: 'utf-8',
    //             outCharset: 'utf-8',
    //             notice: 0,
    //             platform: 'h5',
    //             needNewCode: 1,
    //             _: 1528295789107,
    //         }
    //     }).then(res => {
    //         resolve(res.data);
    //     }).catch(err => {
    //         reject(err);
    //     })
    // })
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data = {
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
    return jsonp(url, data, {
        param: 'jsonpCallback'
    })
}

export function getRecommendSonglist() {
    const url = '/getRecommendSonglist'
    const data = {
        // callback: 'recom09808241242491622',
        g_tk: 5381,
        jsonpCallback: 'getRecommendSonglist',
        loginUin: 0,
        hostUin: 0,
        format: 'jsonp',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        data: JSON.stringify({
            comm: { "ct": 24 },
            category: {
                "method": "get_hot_category",
                "param": { "qq": "" }, "module": "music.web_category_svr"
            },
            recomPlaylist: {
                "method": "get_hot_recommend",
                "param": { "async": 1, "cmd": 2 },
                "module": "playlist.HotRecommendServer"
            },
            playlist: {
                "method": "get_playlist_by_category",
                "param": {
                    "id": 8,
                    "curPage": 1,
                    "size": 40,
                    "order": 5,
                    "titleid": 8
                },
                "module": "playlist.PlayListPlazaServer"
            },
            new_song: {
                "module": "QQMusic.MusichallServer",
                "method": "GetNewSong", "param": { "type": 0 }
            },
            new_album: {
                "module": "music.web_album_library",
                "method": "get_album_by_tags",
                "param": {
                    "area": 1,
                    "company": -1,
                    "genre": -1,
                    "type": -1,
                    "year": -1,
                    "sort": 2,
                    "get_tags": 1,
                    "sin": 0,
                    "num": 40,
                    "click_albumid": 0
                }
            },
            toplist: {
                "module": "music.web_toplist_svr",
                "method": "get_toplist_index",
                "param": {}
            },
            focus: {
                "module": "QQMusic.MusichallServer",
                "method": "GetFocus",
                "param": {}
            }
        })
    }
    return jsonp(url, data, {
        // param: 'jsonpCallback',
        name: 'getRecommendSonglist'
    })
}

export function getSongListByDiscId(id) {
    // return new Promise((resolve, reject) => {
    //     axios({
    //         method: 'get',
    //         // url: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
    //         url: '/getSongListByDiscId',
    //         data: {
    //             g_tk: 5381,
    //             uin: 0,
    //             format: 'json',
    //             inCharset: 'utf-8',
    //             outCharset: 'utf-8',
    //             notice: 0,
    //             platform: 'h5',
    //             needNewCode: 1,
    //             new_format: 1,
    //             pic: 500,
    //             disstid: id,
    //             type: 1,
    //             json: 1,
    //             utf8: 1,
    //             onlysong: 0,
    //             picmid: 1,
    //             nosign: 1,
    //             song_begin: 0,
    //             song_num: 15,
    //             _: 1531141015957
    //         }
    //     }).then(res => {
    //         resolve(res.data);
    //     }).catch(err => {
    //         reject(err);
    //     })
    // })
    const url = '/getSongListByDiscId'
    const data = {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        new_format: 1,
        pic: 500,
        disstid: id,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        picmid: 1,
        nosign: 1,
        song_begin: 0,
        song_num: 15,
        _: 1531141015957,
        jsonpCallback: 'hehehe',
    }
    return jsonp(url, data, {
        // param: 'jsonpCallback'
        name: 'hehehe'
    })
}