<template>
    <div class="suggest">
        <ul class="suggest-list">
            <li class="suggest-item" v-for="(item,index) in searchData" :key="index">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getTestCls(item)"></p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { getSearchData } from "api/search";

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
      page: 1,
      searchData: []
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
    _querySongList(query, page, isNeedSinger) {
      getSearchData(query, page, isNeedSinger).then(res => {
        if (res.code === 0) {
          this.searchData = this._formatSearchData(res.data);
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
    }
  },
  watch: {
    query() {
      this._querySongList(this.query, this.page, this.isNeedSinger);
    }
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