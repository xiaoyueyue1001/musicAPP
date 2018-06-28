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
                <div class="middle"
                    @touchstart.prevent="middleTouchstart"
                    @touchmove.prevent="middleTouchmove"
                    @touchend.prevent="middleTouchend">
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" >
                                <img class="image" :src="currentSong.image"  ref="normalCd">
                            </div>
                        </div>
                    </div>
                    <scroll class="middle-r" :data="lyric&&lyric.lines" ref="lyricScroll">
                        <div class="lyric-wrapper">
                            <div v-if="lyric">
                                <p 
                                class="text" 
                                ref="lines"
                                :class="{current:currentLyricLineNum===index}"
                                v-for="(line,index) in lyric.lines" 
                                :key="index"
                                >{{line.txt}}</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                        <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
                    </div>
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
                            <i :class="playIcon" @click="togglePlay()" ref="normalPlay"></i>
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
                    <img width="40" height="40" :src="currentSong.image" ref="miniCD">
                </div>
                <div class="text">
                    <div class="name" v-html="currentSong.name"></div>
                    <div class="desc" v-html="currentSong.singer"></div>
                </div>
                <div class="control">
                    <progress-circle :radius="miniRadius" :percent="percent">
                        <i :class="minIcon" class="icon-mini"  @click.stop="togglePlay()"></i>
                    </progress-circle>
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
import { getMusicVkey, getLyric } from "api/singer";
import ProgressBar from "base/progress-bar/progress-bar";
import { Base64 } from "js-base64";
import Lyric from "lyric-parser";
import Scroll from "base/scroll/scroll";
import ProgressCircle from "base/progress-circle/progress-circle"
export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      isDrag: false,
      lyric: null,
      currentLyricLineNum: 0,
      currentShow: "cd",
      miniRadius:32
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
  created() {
    this.touch = {};
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
    togglePlay(cdName) { //normalCd miniCD
      this.setPlayingstate(!this.playing);

      let audio = this.$refs.audio;
      if (this.playing) {
        this.$refs["normalCd"].classList.add("play");
        this.$refs["miniCD"].classList.add("play");
        audio.play();
      } else {
        audio.pause();
        //大CD旋转
        let imageDome = this.$refs["normalCd"];
        let containerDom = this.$refs["normalCd"].parentNode;
        let iTransform = getComputedStyle(imageDome).transform;
        let cTransform = getComputedStyle(containerDom).transform;
        containerDom.style.transform =
          cTransform === "none"
            ? iTransform
            : cTransform.concat(" ", iTransform);
        this.$refs["normalCd"].classList.remove("play");
        //miniCD旋转
        let imageDome1 = this.$refs["miniCD"];
        let containerDom1 = this.$refs["miniCD"].parentNode;
        let iTransform1 = getComputedStyle(imageDome1).transform;
        let cTransform1 = getComputedStyle(containerDom1).transform;
        containerDom1.style.transform =
          cTransform1 === "none"
            ? iTransform1
            : cTransform1.concat(" ", iTransform1);
        this.$refs["miniCD"].classList.remove("play");
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
    },
    middleTouchstart(e) {
      this.touch.isStart = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.startY = e.touches[0].pageY;
      this.$refs.lyricScroll.$el.style.transition = "";
      this.$refs.middleL.style.transition = "";
    },
    middleTouchmove(e) {
      if (!this.touch.isStart) {
        return;
      }
      let deltaX = e.touches[0].pageX - this.touch.startX;
      let deltaY = e.touches[0].pageY - this.touch.startY;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (this.currentShow === "cd" && deltaX < 0) {
          this.touch.percent = -deltaX / window.innerWidth;
          this.$refs.lyricScroll.$el.style.transform = `translate3d(${deltaX}px,0,0)`;
          this.$refs.middleL.style.opacity = 1 - this.touch.percent;
        } else if (this.currentShow === "lyric" && deltaX > 0) {
          this.touch.percent = deltaX / window.innerWidth;
          this.$refs.lyricScroll.$el.style.transform = `translate3d(${deltaX -
            window.innerWidth}px,0,0)`;
          this.$refs.middleL.style.opacity = this.touch.percent;
        } else {
          //移动无效
          this.touch.percent = -1;
        }
      }
    },
    middleTouchend(e) {
      if (this.touch.percent < 0) {
        return;
      }
      let offsetX = 0;
      let opacity = 0;
      if (this.touch.percent > 0.1) {
        if (this.currentShow === "lyric") {
          offsetX = 0;
          opacity = 1;
          this.currentShow = "cd";
        } else {
          offsetX = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        }
      } else {
        if (this.currentShow === "lyric") {
          offsetX = -window.innerWidth;
          opacity = 0;
        } else {
          offsetX = 0;
          opacity = 1;
        }
      }
      this.$refs.lyricScroll.$el.style.transition = "all 0.3s";
      this.$refs.lyricScroll.$el.style.transform = `translate3d(${offsetX}px,0,0)`;
      this.$refs.middleL.style.transition = "all 0.3s";
      this.$refs.middleL.style.opacity = opacity;
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
    _lyricCallback({ lineNum, txt }) {
      this.currentLyricLineNum = lineNum;
      if (lineNum < 5) {
        this.$refs.lyricScroll._scrollTo(0, 0, 1000);
      } else {
        this.$refs.lyricScroll._scrollToElement(
          this.$refs.lines[lineNum - 5],
          1000
        );
      }
    },
    ...mapMutations({
      setFullscreen: "SET_FULLSCREEN",
      setPlayingstate: "SET_PLAYING",
      setCurrentIndex: "SET_CURRENINDEX"
    })
  },
  watch: {
    currentSong(newSong) {
      this.songReady = false;
      this.schedule = 0;
      this.getSongSrc(() => {
        this.$nextTick(() => {
          this.$refs.normalPlay.click();
        });
      });
      getLyric(newSong.mid).then(res => {
        let lyric = Base64.decode(res.lyric);
        this.lyric = new Lyric(lyric, this._lyricCallback);
        if (this.playing) {
          this.lyric.play();
        }
      });
    }
  },
  components: {
    ProgressBar,
    Scroll,
    ProgressCircle
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


