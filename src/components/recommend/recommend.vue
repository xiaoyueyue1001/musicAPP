<template>
  <div class="recommend">
    <scroll class="recommend-content" :data='recommendData.songList'>
      <div>
        <div class="slider-wrapper" v-if="recommendData.slider">
          <slider>
            <div v-for="item in recommendData.slider" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>  
        </div>
        <div class="recommend-list" v-if="recommendData.songList">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item,index) in songList" :key="index" class="item">
              <div class="icon">
                <img :src="item.picUrl" alt="" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name">{{item.songListAuthor}}</h2>
                <h2 class="desc">{{item.songListDesc}}</h2>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>
<script>
import { getRecommend } from "api/recommend";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
export default {
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
        ...this.recommendData.songList
      ];
    }
  },
  created() {
    this._getRecommend();
  },
  methods: {
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
    Scroll
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



