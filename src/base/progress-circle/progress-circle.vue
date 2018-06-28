<template>
    <div class="progress-circle">
        <svg width='32' height="32" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle class="progress-background" cx="50" cy="50" r="50" fill="transparent"/>
            <circle class="progress-bar" cx="50" cy="50" r="50" fill="transparent" :stroke-dasharray="perimeter" :stroke-dashoffset="schedule"/>
        </svg>
        <slot></slot>
    </div>
</template>
<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      perimeter: Math.PI * 100
    };
  },
  computed: {
    schedule() {
      return (1 - this.percent) * this.perimeter;
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.progress-circle {
    position: relative;

    circle {
        stroke-width: 8px;
        transform-origin: center;

        &.progress-background {
            transform: scale(0.9);
            stroke: $color-theme-d;
        }

        &.progress-bar {
            transform: scale(0.9) rotate(-90deg);
            stroke: $color-theme;
        }
    }
}
</style>


