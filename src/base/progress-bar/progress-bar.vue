<template>
    <div class="progress-bar" ref="progressBar" @click="progreeBarClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" 
            @touchstart.prevent="progressBarTouchstart"
            @touchmove.prevent="progressBarTouchmove"
            @touchend.prevent="progressBarTouchend"
            ref="progressBtn">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>  
</template>
<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      touch: {}
    };
  },
  methods: {
    progressBarTouchstart(e) {
      this.touch.initFlag = true;
      this.touch.startX = e.touches[0].pageX;
    },
    progressBarTouchmove(e) {
      if (!this.touch.initFlag) {
        return;
      }
      this.touch.deltaPercent =
        (e.touches[0].pageX - this.touch.startX) /
        this.$refs.progressBar.clientWidth;
      let percent = this.percent + this.touch.deltaPercent;
      this._changePercent(percent);
      this.$emit("changePercentIng", percent);
    },
    progressBarTouchend(e) {
      this.touch.initFlag = false;
      let percent = this.percent + this.touch.deltaPercent;
      this.$emit("changePercentEnd", percent);
    },
    progreeBarClick(e) {
      let percent = e.offsetX / this.$refs.progressBar.clientWidth;
      this._changePercent(percent);
      this.$emit("changePercentEnd", percent);
    },
    _changePercent(percent) {
      percent = percent < 0 ? 0 : percent;
      percent = percent > 1 ? 1 : percent;
      this.$refs.progress.style.width = percent * 100 + "%";
      let barWidth = this.$refs.progressBar.clientWidth;
      let xShift = barWidth * percent;
      this.$refs.progressBtn.style.transform = `translate3d(${xShift}px,0,0)`;
    }
  },
  watch: {
    percent(newPercent) {
      if (this.touch.initFlag) {
        return;
      }
      this._changePercent(newPercent);
    }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
    height: 30px;

    .bar-inner {
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0, 0, 0, 0.3);

        .progress {
            position: absolute;
            height: 100%;
            background: $color-theme;
        }

        .progress-btn-wrapper {
            position: absolute;
            left: -15px;
            top: -13px;
            width: 30px;
            height: 30px;

            .progress-btn {
                position: relative;
                top: 7px;
                left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid $color-text;
                border-radius: 50%;
                background: $color-theme;
            }
        }
    }
}
</style>


