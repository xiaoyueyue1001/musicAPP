<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div> 
        <div class="dots">
            <div class="dot" v-for="(dot,index) in dots" :key="index" :class="{active:currentPage === index}"></div>
          </div>    
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
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      dots: [],
      currentPage: 0
    };
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots(); //在初始化slider之前初始化dots，因为在loop的时候better-scroll会复制2个slider-wrap到前后
      this._initSlider();
      if (this.autoPlay) {
        this._play();
      }
    }, 20);

    //当窗口大小改变时重新设置slider宽度并刷新
    window.addEventListener("resize", () => {
      this._setSliderWidth();
      this.slider.refresh();
    });
  },
  methods: {
    //设置轮播图宽度
    _setSliderWidth(resize) {
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
      if (this.loop && !resize) {
        width += 2 * clientWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initDots() {
      this.dots = new Array(this.$refs.sliderGroup.children.length);
    },
    //初始化轮播图
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      });

      this.slider.on("scrollEnd", () => {
        let currentPage = this.slider.getCurrentPage().pageX;
        this.currentPage = currentPage;

        if (this.autoPlay) {
          this._play();
        }
      });
    },
    _play() {
      this.timer = setTimeout(() => {
        let currentPage = this.slider.getCurrentPage().pageX;
        console.log(currentPage);
        this.slider.goToPage((currentPage + 1) % this.dots.length, 0, 400);
      }, this.interval);
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

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>


