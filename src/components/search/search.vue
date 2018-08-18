<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @queryChang="queryChang"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li class="item" v-for="item in hotKeys" :key="item.n" @click="selectKey(item.k)">{{item.k}}</li>
                    </ul>
                </div>
                <div class="search-history">
                <div class="title">
                    <span class="text">搜索历史</span>
                    <span class="clear" @click="clearAll">
                        <i class="icon-clear"></i>
                    </span>
                </div>
                <search-list :searches="searchHistory" @selectOne="selectKey" @deleteOne="deleteOne"></search-list>
            </div>
            </div>            
        </div>
        <div class="search-result" v-show="query">
            <suggest :query="query" @selected="AddKeywordToSearchHisyory"></suggest>
        </div>
        <confirm text="是否删除搜索历史？" 
        v-show="confirmShow"
        @confirm="confirmBoxConfirm"
        @cancel="confirmBoxCancel"></confirm>
        <router-view></router-view>
    </div>
</template>
<script>
import SearchBox from "base/search-box/search-box";
import { getHotKeys } from "api/search";
import Suggest from "components/suggest/suggest";
import { insert2Cache, delete2Cache, clearCache } from "common/js/cache";
import { mapMutations, mapGetters } from "vuex";
import SearchList from "base/search-list/search-list";
import Confirm from "base/confirm/confirm";
export default {
  created() {
    this._getHotKeys();
  },
  data() {
    return {
      hotKeys: [], //热门搜索词条
      query: "", //搜索栏的词条
      confirmShow: false //弹窗显示
    };
  },
  computed: {
    ...mapGetters(["searchHistory"])
  },
  methods: {
    selectKey(key) {
      this.$refs.searchBox.setQuery(key);
    },
    queryChang(query) {
      this.query = query;
    },
    AddKeywordToSearchHisyory() {
      let list = insert2Cache(this.query);
      this.setSearchHistory(list);
    },
    deleteOne(query) {
      let list = delete2Cache(query);
      this.setSearchHistory(list);
    },
    clearAll() {
      this.confirmShow = true;
      //   clearCache();
      //   this.setSearchHistory([]);
    },
    confirmBoxConfirm() {
      clearCache();
      this.setSearchHistory([]);
      this.confirmShow = false;
    },
    confirmBoxCancel() {
      this.confirmShow = false;
    },
    _getHotKeys() {
      getHotKeys()
        .then(res => {
          this.hotKeys = res.data.hotkey.slice(0, 10);
        })
        .catch(err => {
          console.log(err);
        });
    },
    ...mapMutations({
      setSearchHistory: "SET_SEARCHHISTORY"
    })
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
    .search-box-wrapper {
        margin: 20px;
    }

    .shortcut-wrapper {
        position: fixed;
        top: 178px;
        bottom: 0;
        width: 100%;

        .shortcut {
            height: 100%;
            overflow: hidden;

            .hot-key {
                margin: 0 20px 20px 20px;

                .title {
                    margin-bottom: 20px;
                    font-size: $font-size-medium;
                    color: $color-text-l;
                }

                .item {
                    display: inline-block;
                    padding: 5px 10px;
                    margin: 0 20px 10px 0;
                    border-radius: 6px;
                    background: $color-highlight-background;
                    font-size: $font-size-medium;
                    color: $color-text-d;
                }
            }

            .search-history {
                position: relative;
                margin: 0 20px;

                .title {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    font-size: $font-size-medium;
                    color: $color-text-l;

                    .text {
                        flex: 1;
                    }

                    .clear {
                        extend-click();

                        .icon-clear {
                            font-size: $font-size-medium;
                            color: $color-text-d;
                        }
                    }
                }
            }
        }
    }

    .search-result {
        position: fixed;
        width: 100%;
        top: 178px;
        bottom: 0;
    }
}
</style>



