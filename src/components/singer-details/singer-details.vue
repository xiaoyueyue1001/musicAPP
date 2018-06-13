<template>
    <transition name="slide">
        <div class="singer-details">歌手详情页</div>
    </transition>
</template>
<script>
import { mapGetters } from "vuex";
import { getSingerInfo, getMusicVkey } from "api/singer";
import { createSong } from "common/js/commonClass";

export default {
  computed: {
    ...mapGetters(["singer"])
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
          console.log(this.songs);
        }
      });

      getMusicVkey().then(res => {
        let filename = res.data.items[0].filename;
        let vkey = res.data.items[0].vkey;
        console.log(
          `http://dl.stream.qqmusic.qq.com/${filename}?vkey=${vkey}&guid=7833995540&uin=0&fromtag=66`
        );
      });
    }
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

.singer-details {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $color-background;
}
</style>


