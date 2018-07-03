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
    }
}