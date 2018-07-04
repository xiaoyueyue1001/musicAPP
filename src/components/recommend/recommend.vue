<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data='recommendData.songList' ref="list">
      <div>
        <div class="slider-wrapper" v-if="recommendData.slider">
          <slider>
            <div v-for="item in recommendData.slider" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="" class="needsclick">
              </a>
            </div>
          </slider>  
        </div>
        <div class="recommend-list" v-if="recommendData.songList">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item,index) in songList" :key="index" class="item">
              <div class="icon">
                <img v-lazy="item.picUrl" alt="" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name">{{item.songListAuthor}}</h2>
                <h2 class="desc">{{item.songListDesc}}</h2>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container">
        <loading v-show="!recommendData.songList"></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import { getRecommend } from "api/recommend";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { playlistMixin } from "common/js/mixin";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommendData: {}
    };
  },
  computed: {
    songList() {
      return [
        ...this.recommendData.songList,
        ...this.recommendData.songList,
        ...this.recommendData.songList,
        {
          picUrl: "11111",
          songListAuthor: "wangyue",
          songListDesc: "人造无效地址"
        }
      ];
    }
  },
  created() {
    this._getRecommend();
  },
  methods: {
    handlePlaylist(playList) {
      let bottom = playList.length > 0 ? "60px" : "0px";
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === 0) {
          this.recommendData = res.data;
        }
      });
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
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



