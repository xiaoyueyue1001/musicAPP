import { mapGetters } from "vuex"

export const playlistMixin = {
    computed: {
        ...mapGetters(["playList"])
    },
    mounted() {
        this.handlePlaylist(this.playList)
    },
    activated() {
        this.handlePlaylist(this.playList)
    },
    watch: {
        playList(newPlayList) {
            this.handlePlaylist(newPlayList)
        }
    },
    methods: {
        handlePlaylist() {
            throw new Error('请处理handlePlaylist函数来自适应滚动长度')
        }
    }
}