<template>
    <transition name="slide">
        <music-list :title='singer.name' :avatar="singer.avatar" :songs="songs"></music-list>
    </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { getSingerInfo, getMusicVkey } from "api/singer";
import { createSong } from "common/js/commonClass";
import MusicList from "components/music-list/music-list.vue";

export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(["singer"])
    // title: this.singer.name,
    // avatar: this.singer.avatar
  },
  created() {
    this._getSingerInfo();
  },
  methods: {
    _getSingerInfo() {
      if (!this.singer.mid) {
        this.$router.push({
          path: "/singer"
        });
      }
      getSingerInfo(this.singer).then(res => {
        if (res.code === 0) {
          let ret = [];
          this.songs = res.data.list.map(songInfo =>
            createSong(songInfo.musicData)
          );
          // console.log(this.songs);
        }
      });

      // getMusicVkey().then(res => {
      //   let filename = res.data.items[0].filename;
      //   let vkey = res.data.items[0].vkey;
      //   console.log(
      //     `http://dl.stream.qqmusic.qq.com/${filename}?vkey=${vkey}&guid=7833995540&uin=0&fromtag=66`
      //   );
      // });
    }
  },
  components: {
    MusicList
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>


