import types from './mutation-types'
import { playMode } from "common/js/config";

export default {
    selectPlay({ commit, state }, { list, index }) {
        commit(types.SET_PLAYING, false);
        commit(types.SET_FULLSCREEN, true);
        commit(types.SET_PLAYLIST, list);
        commit(types.SET_SEQUENCELIST, list);
        commit(types.SET_CURRENINDEX, index)
    },
    randomPlay({ commit, state }, { list }) {
        commit(types.SET_PLAYING, false);
        commit(types.SET_FULLSCREEN, true);
        commit(types.SET_PLAYLIST, list);
        commit(types.SET_SEQUENCELIST, list);
        commit(types.SET_CURRENINDEX, Math.floor(Math.random() * list.length))
        commit(types.SET_PLAYMODE, playMode.random)
    },
    insertSong({ commit, state }, selectSong) {
        console.log(selectSong)
        //判断插入的歌曲是否存在播放列表中
        let selectIndex = -1;//存储插入歌曲在播放列表的位置，若没有则为-1
        let isExist = state.playList.filter((song, index) => {
            if (song.id === selectSong.id) {
                selectIndex = index
                return true
            }
        }).length === 1;
        if (isExist) {
            commit(types.SET_PLAYING, false);
            commit(types.SET_FULLSCREEN, true);
            commit(types.SET_CURRENINDEX, selectIndex)
        }
        else {
            let playlist = JSON.parse(JSON.stringify(state.playList))
            playlist.push(selectSong)
            commit(types.SET_PLAYING, false);
            commit(types.SET_FULLSCREEN, true);
            commit(types.SET_PLAYLIST, playlist);
            commit(types.SET_CURRENINDEX, playlist.length - 1)
        }
    }
}