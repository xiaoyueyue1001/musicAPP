import types from './mutation-types'

export default {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    }
}