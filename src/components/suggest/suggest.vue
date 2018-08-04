<template>
    <scroll class="suggest" :data="searchData" :pullup="pullup" @scrollToEnd="searchMore" ref="suggest">
        <ul class="suggest-list">
            <li class="suggest-item" 
                v-for="(item,index) in searchData" 
                :key="index"
                @click="selectItem(item)">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getTestCls(item)"></p>
                </div>
            </li>
            <loading v-show="isMoreData"></loading>
        </ul>
        <div class="no-result-wrapper" v-show="!isMoreData && !searchData.length">
          <no-result title="抱歉，暂无搜索结果"></no-result>
        </div>
    </scroll>    
</template>

<script>
import { getSearchData } from "api/search";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { mapMutations, mapActions } from "vuex";
import { Singer, createSong } from "common/js/commonClass";
import NoResult from "base/no-result/no-result";

export default {
  props: {
    query: {
      type: String,
      default: ""
    },
    isNeedSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pullup: true,
      page: 1,
      searchData: [],
      isMoreData: true
    };
  },
  methods: {
    getIconCls(item) {
      if (item.type === "singer") {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getTestCls(item) {
      if (item.type === "singer") {
        return item.singername;
      } else {
        return `${item.songname}-${item.singer
          .map(singer => singer.name)
          .join("/")}`;
      }
    },
    searchMore() {
      if (!this.isMoreData) {
        return;
      }
      this.page++;
      getSearchData(this.query, this.page, this.isNeedSinger).then(res => {
        if (res.code === 0) {
          this.searchData = this.searchData.concat(
            this._formatSearchData(res.data)
          );
          this._checkMore(res);
        }
      });
    },
    selectItem(item) {
      console.log(item);
      if (item.type === "singer") {
        let singer = new Singer(item.singerid, item.singername, item.singermid);
        this.setSinger(singer);
        this.$router.push({
          path: `/search/${item.singerid}`
        });
      } else {
        let song = createSong(item);
        this.insertSong(song);
      }
    },
    _querySongList(query, page, isNeedSinger) {
      this.page = 1;
      this.isMoreData = true;
      this.$refs.suggest._scrollTo(0, 0);
      getSearchData(query, page, isNeedSinger).then(res => {
        if (res.code === 0) {
          this.searchData = this._formatSearchData(res.data);
          this._checkMore(res);
        }
      });
    },
    _formatSearchData(data) {
      let result = [];
      if (data.zhida && data.zhida.singerid) {
        result.push({ ...data.zhida, ...{ type: "singer" } });
      }
      if (data.song) {
        result = result.concat(data.song.list);
      }
      return result;
    },
    _checkMore(res) {
      if (
        res.data.song.curpage * res.data.song.curnum >=
          res.data.song.totalnum ||
        res.data.song.list.length === 0
      ) {
        this.isMoreData = false;
      }
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  },

  watch: {
    query() {
      this._querySongList(this.query, this.page, this.isNeedSinger);
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>