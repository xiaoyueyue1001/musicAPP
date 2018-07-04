<template>
    <div class="singer" ref="singer">
      <list-view ref="list" :data='songListData' @itemClick="selectSinger"></list-view>
      <router-view></router-view>
    </div>
</template>
<script>
import { getSingerList } from "api/singer";
import { Singer } from "common/js/commonClass";
import ListView from "base/listview/listview";
import { mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";

const HOTSINGERLEN = 10;
export default {
  mixins: [playlistMixin],
  data() {
    return {
      songListData: []
    };
  },
  created() {
    this._getSongList();
  },
  methods: {
    selectSinger(singer) {
      this.setSinger(singer);
      this.$router.push({
        path: `/singer/${singer.id}`
      });
    },
    handlePlaylist(playList) {
      let bottom = playList.length > 0 ? "60px" : "0px";
      this.$refs.singer.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    _getSongList() {
      getSingerList().then(res => {
        if (res.code === 0) {
          this.songListData = this._formateSingerList(res.data.list);
        }
      });
    },
    //将借口返回的数据格式化为有序的数组(hot最前后面依次a到z)
    _formateSingerList(list) {
      let hot = {};
      hot.title = "热门";
      hot.items = list.slice(0, 10).map(item => {
        return new Singer(item.Fsinger_id, item.Fsinger_name, item.Fsinger_mid);
      });

      let azObj = {};
      list.forEach(item => {
        if (!azObj[item.Findex]) {
          azObj[item.Findex] = [];
        }
        azObj[item.Findex].push(
          new Singer(item.Fsinger_id, item.Fsinger_name, item.Fsinger_mid)
        );
      });
      let azArray = [];
      for (let key in azObj) {
        let otherKey = "~";
        azArray.push({
          title: /[a-zA-Z]/.test(key) ? key : otherKey,
          items: azObj[key]
        });
      }
      azArray = azArray.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      return [hot, ...azArray];
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  components: {
    ListView
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>



