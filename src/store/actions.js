import types from './mutation-types'

export default {
    selectPlay({ commit, state }, { list, index }) {
        commit(types.SET_PLAYING, true);
        commit(types.SET_FULLSCREEN, true);
        commit(types.SET_PLAYLIST, list);
        commit(types.SET_SEQUENCELIST, list);
        commit(types.SET_CURRENINDEX, index)
    }
}