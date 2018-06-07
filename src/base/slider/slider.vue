<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div> 
        <div class="dots"></div>    
    </div>
</template>
<script>
import BScroll from "better-scroll";
import { addClass } from "common/js/dom";

export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initSlider();
    }, 20);
  },
  methods: {
    //设置轮播图宽度
    _setSliderWidth() {
      //获取屏幕宽度
      let clientWidth = this.$refs.slider.clientWidth;
      let children = this.$refs.sliderGroup.children;
      let width = 0;
      for (let i = 0; i < children.length; i++) {
        width += clientWidth;
        let child = children[i];
        child.style.width = clientWidth + "px";
        addClass(child, "slider-item");
      }
      //若轮播循环需要给2边各复制一个图形位置
      if (this.loop) {
        width += 2 * clientWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    //初始化轮播图
    _initSlider() {
      let slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        // snap: true,
        // snapLoop: this.loop,
        // snapThreshold: 0.3,
        // snapSpeed: 400,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        clcik: true
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.slider {
    min-height: 1px;

    .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;

        .slider-item {
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;

            a {
                display: block;
                width: 100%;
                overflow: hidden;
                text-decoration: none;
            }

            img {
                display: block;
                width: 100%;
            }
        }
    }
}
</style>


