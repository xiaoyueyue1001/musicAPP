// import { getMusicVkey } from 'api/singer'
export class Singer {
    constructor(id, name, avatar) {
        this.id = id;
        this.name = name;
        this.avatar = `http://y.gtimg.cn/music/photo_new/T001R150x150M000${avatar}.jpg?max_age=2592000`,
            this.mid = avatar
    }
}

class Song {
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id,
            this.mid = mid,
            this.singer = singer,
            this.name = name,
            this.album = album,
            this.duration = duration,
            this.image = image,
            this.url = url
    }
}
export function createSong(songInfo) {
    return new Song({
        id: songInfo.songid,
        mid: songInfo.songmid,
        singer: songInfo.singer ? songInfo.singer.map(singer => singer.name).join("/") : '未知',
        name: songInfo.songname,
        album: songInfo.albumname,
        duration: songInfo.interval,
        image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${songInfo.albummid}.jpg?max_age=2592000`,
        // url: `http://dl.stream.qqmusic.qq.com/C400${songmid}.m4a?vkey=${vkey}&guid=7833995540&uin=0&fromtag=66`,
        url: songInfo.songmid,
    })
}
