<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li :key="index" 
      class="search-item" 
      v-for="(item,index) in searches"
      @click="selectOne(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    searches: {
      type: Array,
      default: []
    }
  },
  methods: {
    selectOne(item) {
      this.$emit("selectOne", item);
    },
    deleteOne(item) {
      this.$emit("deleteOne", item);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.search-list {
    .search-item {
        display: flex;
        align-items: center;
        height: 40px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
            transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
            height: 0;
        }

        .text {
            flex: 1;
            color: $color-text-l;
        }

        .icon {
            extend-click();

            .icon-delete {
                font-size: $font-size-small;
                color: $color-text-d;
            }
        }
    }
}
</style>