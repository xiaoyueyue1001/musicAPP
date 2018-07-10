<template>
    <transition name="slide">
        <music-list :title="title" :avatar="imgUrl" :songs="songList"></music-list>
    </transition>
</template>
<script>
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getSongListByDiscId } from "api/recommend";
import { createSongByDisc } from "common/js/commonClass";

export default {
  data() {
    return {
      songList: []
    };
  },
  computed: {
    ...mapGetters(["disc"]),
    title() {
      return this.disc.title;
    },
    imgUrl() {
      return this.disc.cover;
    }
  },
  created() {
    if (!this.disc.content_id) {
      this.$router.push({
        path: "/recommend"
      });
      return;
    }
    this._getSonglist(this.disc.content_id);
  },
  methods: {
    _getSonglist(id) {
      getSongListByDiscId(id).then(res => {
        this.songList = res.cdlist[0].songlist.map(songInfo => {
          return createSongByDisc(songInfo);
        });
      });
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


