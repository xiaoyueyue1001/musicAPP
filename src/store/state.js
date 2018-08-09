import { playMode } from 'common/js/config'
import { getSearchHistory } from "common/js/cache"

export default {
    singer: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    playMode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    searchHistory: getSearchHistory()//搜索历史记录
}