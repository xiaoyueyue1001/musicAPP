export default {
    singer: state => state.singer,
    playing: state => state.playing,
    fullScreen: state => state.fullScreen,
    playList: state => state.playList,
    sequenceList: state => state.sequenceList,
    mode: state => state.playMode,
    currentIndex: state => state.currentIndex,
    currentSong: state => state.playList[state.currentIndex] || {},
    disc: state => state.disc,
    searchHistory: state => state.searchHistory
}