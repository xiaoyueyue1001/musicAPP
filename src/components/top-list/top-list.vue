<template>
  <transition name="slide">
    <music-list :title="title" :avatar="imgUrl" :songs="songs" :isRank="isRank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from "components/music-list/music-list";
import { getTopListData } from "api/rank";
import { createSong } from "common/js/commonClass";

export default {
  data() {
    return {
      albumInfo: {},
      isRank: true
    };
  },
  computed: {
    title() {
      return this.albumInfo.topinfo ? this.albumInfo.topinfo.ListName : "";
    },
    imgUrl() {
      if (this.albumInfo.songlist) {
        let url = this.albumInfo.songlist[0].data.albummid;
        return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${url}.jpg?max_age=2592000`;
      }
    },
    songs() {
      if (this.albumInfo.songlist) {
        return this.albumInfo.songlist.map(song => {
          return createSong(song.data);
        });
      }
    }
  },
  created() {
    this._getTopListData();
  },
  methods: {
    _getTopListData() {
      getTopListData(this.$route.params.id).then(res => {
        this.albumInfo = res;
      });
    }
  },
  components: {
    MusicList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>