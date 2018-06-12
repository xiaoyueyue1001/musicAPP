<template>
    <scroll 
    :data="data" 
    class="listview" 
    ref="listview" 
    :listenScroll="true"
    @scroll="scroll"
    :probeType="probeType">
        <ul>
            <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroups">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li class="list-group-item"
                     v-for="item in group.items" 
                     :key="item.id"
                     @click='itemClick(item)'>
                        <img v-lazy="item.avatar" alt="" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut"
             @touchstart="onShortcutTouchStart"
             @touchmove.stop.prevent="onShortcutTouchmove">
            <ul>
                <li 
                v-for="(item,index) in shortcutList" 
                :key="index"
                :data-index="index"
                class="item"
                :class="{'current':currentIndex===index}"
                >{{item}}</li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref='fixed'>
            <div class="fixed-title">{{fixedTitle}}</div>
        </div>
    </scroll>
</template>
<script>
import Scroll from "base/scroll/scroll";

const SHORTCUTLILHEIGHT = 18;
const FIXEDHEIGHT = 30;
export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      touchInfo: {},
      currentIndex: 0,
      probeType: 3,
      scrollY: 0,
      diff: 0
    };
  },
  computed: {
    shortcutList() {
      return this.data.map(item => {
        return item.title[0];
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      let currentIndex = e.target.getAttribute("data-index");
      let firstTouch = e.touches[0];
      this.touchInfo.startY = firstTouch.pageY;
      //记录起始坐标
      this.touchInfo.startIndex = currentIndex;
      this._scroll(+currentIndex);
    },
    onShortcutTouchmove(e) {
      let firstTouch = e.touches[0];
      this.touchInfo.endY = firstTouch.pageY;
      let delta =
        ((this.touchInfo.endY - this.touchInfo.startY) / SHORTCUTLILHEIGHT) | 0;
      let currentIndex = +this.touchInfo.startIndex + delta;
      this._scroll(currentIndex);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    itemClick(item) {
      this.$emit("itemClick", item);
    },
    _scroll(index, time = 0) {
      //快速切换两头无index值
      if (index === null) {
        return;
      }
      if (index < 0) {
        index = 0;
      }
      if (index > this.shortcutList.length - 1) {
        index = this.shortcutList.length - 1;
      }
      if (index !== this.currentIndex) {
        this.$refs.listview._scrollToElement(
          this.$refs.listGroups[index],
          time
        );
        this.currentIndex = index;
      }
    },
    _calculateHeight() {
      this.listHeight = [];
      let list = this.$refs.listGroups;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length - 1; i++) {
        height += list[i].clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  components: {
    Scroll
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      let listHeight = this.listHeight;
      //滑到顶部
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      //滑到中间
      for (let i = 0; i < listHeight.length - 1; i++) {
        if (-newY < this.listHeight[i]) {
          this.currentIndex = i - 1;
          this.diff =
            listHeight[i] + newY > FIXEDHEIGHT ? 0 : listHeight[i] + newY;
          return;
        }
      }
      //滑到底部
      this.currentIndex = this.listHeight.length - 2;
    },
    diff(newDiff) {
      if (newDiff) {
        this.$refs.fixed.style.top = newDiff - FIXEDHEIGHT + "px";
      } else {
        this.$refs.fixed.style.top = 0;
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    transform: 'translateY(-1px)';
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      position: relative;
      top: -1px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

