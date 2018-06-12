<template>
    <transition name="slide">
        <div class="singer-details">歌手详情页</div>
    </transition>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["singer"])
  },
  created() {
    console.log(this.singer);
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
}

.singer-details {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $color-background;
}
</style>


