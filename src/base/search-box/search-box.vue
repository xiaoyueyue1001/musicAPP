<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" v-model="keyWords" :placeholder="placeholder"/>
    <i v-show="keyWords" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    placeholder: {
      type: String,
      default: "请输入关键字"
    }
  },
  data() {
    return {
      keyWords: ""
    };
  },
  created() {
    this.$watch("keyWords", Newquery => {
      this.$emit("queryChang", Newquery);
    });
  },
  methods: {
    setQuery(query) {
      this.keyWords = query;
    },

    clear() {
      this.keyWords = "";
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;

  .icon-search {
    font-size: 24px;
    color: $color-background;
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .icon-dismiss {
    font-size: 16px;
    color: $color-background;
  }
}
</style>