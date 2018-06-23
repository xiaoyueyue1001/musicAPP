<template>
    <div class="player" v-show="playList.length>0">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen" ref="normalPlayer">
                <div class="background">
                    <img :src="currentSong.image" width="100%" height="100%">
                </div>
                <div class="top">
                    <div class="back">
                        <i class="icon-back" @click="back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" >
                                <img class="image" :src="currentSong.image"  ref="normalCd">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time time-l">{{timeFormat(isDrag?dragTime:currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent"
                                          @changePercentEnd="changePercentEnd"
                                          @changePercentIng="changePercentIng">
                            </progress-bar>
                        </div>
                        <span class="time time-l">{{timeFormat(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i class="icon-sequence"></i>
                        </div>
                        <div class="icon i-left" :class="btnDisable">
                            <i class="icon-prev" @click="prev"></i>
                        </div>
                        <div class="icon i-center" :class="btnDisable">
                            <i :class="playIcon" @click="togglePlay('normalCd')" ref="normalPlay"></i>
                        </div>
                        <div class="icon i-right" :class="btnDisable">
                            <i class="icon-next" @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="up">
                <div class="icon">
                    <img   width="40" height="40" :src="currentSong.image" ref="miniCD">
                </div>
                <div class="text">
                    <div class="name" v-html="currentSong.name"></div>
                    <div class="desc" v-html="currentSong.singer"></div>
                </div>
                <div class="control">
                    <i :class="minIcon" @click.stop="togglePlay('miniCD')"></i>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition> 
        <audio  ref="audio" @canplay="ready" @error="error" @timeupdate="timeupdate"></audio>      
    </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { getMusicVkey } from "api/singer";
import ProgressBar from "base/progress-bar/progress-bar";

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      isDrag: false
    };
  },
  computed: {
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    minIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    // cdClass() {
    //   return this.playing ? "play" : "";
    // },
    btnDisable() {
      return !this.songReady && this.playing ? "disable" : "";
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      "playList",
      "fullScreen",
      "currentSong",
      "playing",
      "currentIndex"
    ])
  },
  methods: {
    back() {
      this.setFullscreen(false);
    },
    up() {
      this.setFullscreen(true);
    },
    enter(el, done) {
      let { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        70: {
          transform: `translate3d(0,0,0) scale(1.2)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      let { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave(el) {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style.transform = "";
    },
    getSongSrc(callback) {
      let vkeyPromise = getMusicVkey(this.currentSong.url);
      vkeyPromise.then(res => {
        if (res.code === 0) {
          let src = `http://dl.stream.qqmusic.qq.com/${
            res.data.items[0].filename
          }?vkey=${res.data.items[0].vkey}&guid=7833995540&uin=0&fromtag=66`;
          this.$refs.audio.src = src;
          callback();
        }
      });
    },
    togglePlay(cdName) {
      this.setPlayingstate(!this.playing);

      let audio = this.$refs.audio;
      if (this.playing) {
        this.$refs[cdName].classList.add("play");
        audio.play();
      } else {
        audio.pause();
        let imageDome = this.$refs[cdName];
        let containerDom = this.$refs[cdName].parentNode;
        let iTransform = getComputedStyle(imageDome).transform;
        let cTransform = getComputedStyle(containerDom).transform;
        containerDom.style.transform =
          cTransform === "none"
            ? iTransform
            : cTransform.concat(" ", iTransform);
        this.$refs[cdName].classList.remove("play");
      }
    },
    prev() {
      if (!this.songReady && this.playing) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playList.length - 1;
      }
      this.setPlayingstate(false);
      this.setCurrentIndex(index);
      //   this.togglePlay();
    },
    next() {
      if (!this.songReady && this.playing) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playList.length) {
        index = 0;
      }
      this.setPlayingstate(false);
      this.setCurrentIndex(index);
      //   this.togglePlay();
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    timeupdate(e) {
      this.currentTime = e.target.currentTime;
    },
    timeFormat(time) {
      time = time | 0;
      let min = (time / 60) | 0;
      let sec = time % 60;
      sec = sec < 10 ? "0" + sec : sec;
      return min + ":" + sec;
    },
    changePercentEnd(percent) {
      this.isDrag = false;
      this.$refs.audio.currentTime = this.currentSong.duration * percent;
    },
    changePercentIng(percent) {
      this.isDrag = true;
      this.dragTime = percent * this.currentSong.duration;
      console.log(percent);
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - paddingBottom - width / 2;
      return {
        x,
        y,
        scale
      };
    },
    ...mapMutations({
      setFullscreen: "SET_FULLSCREEN",
      setPlayingstate: "SET_PLAYING",
      setCurrentIndex: "SET_CURRENINDEX"
    })
  },
  watch: {
    currentSong() {
      this.songReady = false;
      this.getSongSrc(() => {
        this.$nextTick(() => {
          //   console.log(this.$refs.audio.src);
          //   this.$refs.audio.play();
          this.$refs.normalPlay.click();
          //   let event = new MouseEvent("click", {
          //     view: window,
          //     bubbles: true,
          //     cancelable: true
          //   });
          //   this.$refs.normalPlay.dispatchEvent(event);
        });
      });
    }
    // playing(newPlayingState) {
    //   let audio = this.$refs.audio;
    //   newPlayingState ? audio.play() : audio.pause();
    // }
  },
  components: {
    ProgressBar
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
    .normal-player {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: $color-background;

        .background {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px);
        }

        .top {
            position: relative;
            margin-bottom: 25px;

            .back {
                position: absolute;
                top: 0;
                left: 6px;
                z-index: 50;

                .icon-back {
                    display: block;
                    padding: 9px;
                    font-size: $font-size-large-x;
                    color: $color-theme;
                    transform: rotate(-90deg);
                }
            }

            .title {
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
                no-wrap();
                font-size: $font-size-large;
                color: $color-text;
            }

            .subtitle {
                line-height: 20px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-text;
            }
        }

        .middle {
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-size: 0;

            .middle-l {
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;

                .cd-wrapper {
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    height: 100%;

                    .cd {
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border: 10px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50%;

                        // &.pause {
                        // animation-play-state: paused;
                        // }
                        .image {
                            // position: absolute;
                            // left: 0;
                            // top: 0;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;

                            &.play {
                                animation: rotate 20s linear infinite;
                            }
                        }
                    }
                }

                .playing-lyric-wrapper {
                    width: 80%;
                    margin: 30px auto 0 auto;
                    overflow: hidden;
                    text-align: center;

                    .playing-lyric {
                        height: 20px;
                        line-height: 20px;
                        font-size: $font-size-medium;
                        color: $color-text-l;
                    }
                }
            }

            .middle-r {
                display: inline-block;
                vertical-align: top;
                width: 100%;
                height: 100%;
                overflow: hidden;

                .lyric-wrapper {
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;

                    .text {
                        line-height: 32px;
                        color: $color-text-l;
                        font-size: $font-size-medium;

                        &.current {
                            color: $color-text;
                        }
                    }
                }
            }
        }

        .bottom {
            position: absolute;
            bottom: 50px;
            width: 100%;

            .dot-wrapper {
                text-align: center;
                font-size: 0;

                .dot {
                    display: inline-block;
                    vertical-align: middle;
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

            .progress-wrapper {
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0px auto;
                padding: 10px 0;

                .time {
                    color: $color-text;
                    font-size: $font-size-small;
                    flex: 0 0 30px;
                    line-height: 30px;
                    width: 40px;

                    &.time-l {
                        text-align: left;
                    }

                    &.time-r {
                        text-align: right;
                    }
                }

                .progress-bar-wrapper {
                    flex: 1;
                    margin: 0 10px;
                }
            }

            .operators {
                display: flex;
                align-items: center;

                .icon {
                    flex: 1;
                    color: $color-theme;

                    &.disable {
                        color: $color-theme-d;
                    }

                    i {
                        font-size: 30px;
                    }
                }

                .i-left {
                    text-align: right;
                }

                .i-center {
                    padding: 0 20px;
                    text-align: center;

                    i {
                        font-size: 40px;
                    }
                }

                .i-right {
                    text-align: left;
                }

                .icon-favorite {
                    color: $color-sub-theme;
                }
            }
        }

        &.normal-enter-active, &.normal-leave-active {
            transition: all 0.4s;

            .top, .bottom {
                transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
            }
        }

        &.normal-enter, &.normal-leave-to {
            opacity: 0;

            .top {
                transform: translate3d(0, -100px, 0);
            }

            .bottom {
                transform: translate3d(0, 100px, 0);
            }
        }
    }

    .mini-player {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: $color-highlight-background;

        &.mini-enter-active, &.mini-leave-active {
            transition: all 0.4s;
        }

        &.mini-enter, &.mini-leave-to {
            opacity: 0;
        }

        .icon {
            flex: 0 0 40px;
            width: 40px;
            margin: 0 20px 0 20px;
            border-radius: 50%;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;

                &.play {
                    animation: rotate 10s linear infinite;
                }
            }
        }

        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;

            .name {
                margin-bottom: 2px;
                no-wrap();
                font-size: $font-size-medium;
                color: $color-text;
            }

            .desc {
                no-wrap();
                font-size: $font-size-small;
                color: $color-text-d;
            }
        }

        .control {
            flex: 0 0 30px;
            width: 30px;
            padding: 0 10px;

            .icon-play-mini, .icon-pause-mini, .icon-playlist {
                font-size: 30px;
                color: $color-theme-d;
            }

            .icon-mini {
                font-size: 32px;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
}

@keyframes rotate {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>


