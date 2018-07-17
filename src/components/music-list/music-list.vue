<template>
    <div class="music-list" ref="musicList">
        <div class="back">
            <i class="icon-back" @click='back'></i>
        </div>
        <div class="title">{{title}}</div>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper">
                <div ref="playBtn" v-show="playBtnShow" class="play" @click="randomToPlay">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>   
        <scroll class="list" 
                :data="songs" 
                ref='scroll'
                :probe-type='probeType'
                :listen-scroll='listenScroll'
                @scroll="scroll">
            <div class="song-list-wrapper">
                <song-list :songs="songs" @select="selectItem" :isRank="isRank"></song-list>
            </div>
            <div v-show="!songs.length" class="loading-container">
              <loading></loading>
            </div>
        </scroll>
    </div>
</template>
<script>
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import Loading from "base/loading/loading";
import { mapActions } from "vuex";
import { playlistMixin } from "common/js/mixin";

const HEADERHEIGHT = 40;
export default {
  mixins: [playlistMixin],
  props: {
    title: {
      type: String,
      default: ""
    },
    avatar: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default() {
        return [];
      }
    },
    isRank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.avatar})`;
    },
    playBtnShow() {
      return (
        this.songs.length > 0 && this.scrollY > HEADERHEIGHT - this.bgImageHight
      );
    }
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      });
    },
    randomToPlay() {
      this.randomPlay({
        list: this.songs
      });
    },
    handlePlaylist(playList) {
      let bottom = playList.length > 0 ? "60px" : "0px";
      this.$refs.scroll.$el.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    ...mapActions(["selectPlay", "randomPlay"])
  },
  mounted() {
    this.bgImageHight = this.$refs.bgImage.clientHeight;
    this.$refs.scroll.$el.style.top = `${this.bgImageHight}px`;
  },
  watch: {
    scrollY(newY) {
      let translateY,
        bgImagezIndex,
        bgImagePaddingTop,
        bgImageHeight,
        bgImageScale;
      //判断图片放大的倍数
      if (newY > 0) {
        bgImageScale = newY / this.bgImageHight + 1;
        bgImagezIndex = 10;
      } else if (-newY < this.bgImageHight - HEADERHEIGHT) {
        //向上滑动不到顶部底部的时候
        translateY = newY;
        bgImagezIndex = 0;
        bgImagePaddingTop = "70%";
        bgImageHeight = 0;
      } else {
        //向上滑动超过顶部底部的时候
        translateY = HEADERHEIGHT - this.bgImageHight;
        bgImagezIndex = 10;
        bgImagePaddingTop = 0;
        bgImageHeight = HEADERHEIGHT;
      }
      this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`;
      this.$refs.bgImage.style.zIndex = bgImagezIndex;
      this.$refs.bgImage.style.paddingTop = bgImagePaddingTop;
      this.$refs.bgImage.style.height = `${bgImageHeight}px`;
      this.$refs.bgImage.style.transform = `scale(${bgImageScale})`;
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>

