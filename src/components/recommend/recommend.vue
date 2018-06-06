<template>
    <div>推荐</div>
</template>
<script>
import { getRecommend } from "common/api/recommend";
export default {
  created() {
    this._getRecommend();
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === 0) {
          console.log(res.data);
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>



