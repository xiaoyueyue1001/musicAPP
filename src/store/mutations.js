import types from './mutation-types'

export default {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    },
    [types.SET_PLAYING](state, flag) {
        state.playing = flag
    },
    [types.SET_FULLSCREEN](state, flag) {
        state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state, list) {
        state.playList = list
    },
    [types.SET_SEQUENCELIST](state, list) {
        state.sequenceList = list
    },
    [types.SET_PLAYMODE](state, mode) {
        state.playMode = mode
    },
    [types.SET_CURRENINDEX](state, index) {
        state.currentIndex = index
    },
    [types.SET_DISC](state, disc) {
        state.disc = disc
    },
    [types.SET_SEARCHHISTORY](state, list) {
        state.searchHistory = list
    }
}