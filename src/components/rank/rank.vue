<template>
    <div class="rank" :data="songLists">
        <scroll class="toplist">
            <ul>
                <li class="item" v-for="item in songLists" :key="item.id" @click="selectId(item.id)">
                    <div class="icon">
                        <img width="100" height="100" :src="item.picUrl">
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,index) in item.songList" :key="index">
                            <span>{{song.songname}}</span>
                            <span>--</span>
                            <span>{{song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </scroll>
        <router-view></router-view>
    </div>
</template>
<script>
import { getRankData } from "api/rank";
import Scroll from "base/scroll/scroll";

export default {
  created() {
    this._getTopList();
  },
  data() {
    return {
      songLists: []
    };
  },
  methods: {
    selectId(id) {
      this.$router.push({
        path: `/rank/${id}`
      });
    },
    _getTopList() {
      getRankData().then(data => {
        this.songLists = data.data.topList;
      });
    }
  },
  components: {
    Scroll
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.rank {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;

    .toplist {
        height: 100%;
        overflow: hidden;

        .item {
            display: flex;
            margin: 0 20px;
            padding-top: 20px;
            height: 100px;

            &:last-child {
                padding-bottom: 20px;
            }

            .icon {
                flex: 0 0 100px;
                width: 100px;
                height: 100px;
            }

            .songlist {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 20px;
                height: 100px;
                overflow: hidden;
                background: $color-highlight-background;
                color: $color-text-d;
                font-size: $font-size-small;

                .song {
                    no-wrap();
                    line-height: 26px;
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



