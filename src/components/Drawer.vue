<script>
import useStore from '../store'
import ArrowDown from '../assets/svgs/ArrowDown.svg?vueComponent'
import { clone } from '../utils'

const getAnimationTime = () => 0.75 * window.innerWidth + "ms"

export default {
  data() {
    return {
      store: useStore(),
      animationTimeLong: '1ms',
    }
  },
  props: ['data', 'index'],
  components: { ArrowDown },
  computed: {
    targetIndex() {
      return this.store.drawer.index
    },
    isTarget() {
      return this.targetIndex === this.index
    },
    isLeft() {
      return this.targetIndex > this.index
    },
    isRight() {
      return this.targetIndex < this.index
    },
    titleTop() {
      const drawerList = clone(this.store.drawerList)
      const fontNum = drawerList.slice(0, this.index).reduce((preNum, cur) => {
        return preNum + cur.title.length
      }, 0)
      return (30 + fontNum * 25 + this.index * 50) + "px"
    }
  },
  watch: {
    targetIndex(to, from) {
      if (this.store.drawer.isClosing(from, to)) {
        setTimeout(() => {
          this.animationTimeLong = '1ms'
        }, 0.75 * window.innerWidth)
      }
      if (this.store.drawer.isOpening(from, to)) {
        this.animationTimeLong = getAnimationTime()
      }
    }
  },
  methods: {
  },
  mounted() {
    this.animationTimeLong = this.store.drawer.isClosed() ? '1ms' : getAnimationTime()
    window.addEventListener("resize", () => {
      if (!this.store.drawer.isClosed()) {
        this.animationTimeLong = getAnimationTime()
      }
    })
  },
  beforeUnmount() {
    window.removeEventListener("resize", () => {
      if (!this.store.drawer.isClosed()) {
        this.animationTimeLong = getAnimationTime()
      }
    })
  },
}
</script>

<template>
  <div :style="'--z: ' + (999 - index) + '; --t: ' + animationTimeLong" :class="[
    $style.container,
    isLeft ? $style.leftContainer : '',
    isRight ? $style.rightContainer : '',
    isTarget ? $style.targetContainer : ''
  ]">
    <div :class="$style.main">
      <router-view :name="data.name" />
    </div>
    <div :class="$style.control">
      <span :style="'--i: ' + titleTop" @click.prevent="() => store.drawer.openTo(index)" :class="[
        isTarget ? $style.targetBth : '',
        isLeft ? $style.leftBth : '',
        isRight ? $style.rightBth : ''
      ]">
        {{ data.title }}
      </span>
      <span v-if="isTarget" @click.prevent="() => store.drawer.close()">
        <ArrowDown />
      </span>
    </div>
  </div>
</template>

<style scoped>
.markdown-body {
  overflow: scroll !important;
  overflow-x: hidden !important;
  overflow-y: scroll !important;
}

.markdown-body::-webkit-scrollbar {
  display: none;
}
</style>

<style module>
.container {
  z-index: var(--z);
  pointer-events: none;
  width: 100%;
  height: calc(100vh - 60px);
  position: fixed;
  top: 30px;
  display: flex;
}

.leftContainer {
  right: calc(100% - 100px);
  animation: containerRightToLeft var(--t);
}

@keyframes containerRightToLeft {
  0% {
    right: 0;
  }

  100% {
    right: calc(100% - 100px);
  }
}

.rightContainer,
.targetContainer {
  right: 0;
  animation: containerLeftToRight var(--t);
}

@keyframes containerLeftToRight {
  0% {
    right: calc(100% - 100px);
  }

  100% {
    right: 0;
  }
}

.main {
  width: calc(100% - 90px);
  padding: 30px 30px 30px 60px;
  border-radius: 0 20px 20px 0;
  background-color: var(--drawer-target);
  pointer-events: all;
  display: flex;
}


.rightContainer .main {
  box-shadow: var(--drawer-no-target) 2px 2px 5px;
  background-color: var(--drawer-no-target);
  animation: mainRightToLeft var(--t);
}

.leftContainer .main {
  background-color: var(--drawer-no-target);
  animation: mainRightToLeft var(--t);
}

@keyframes mainRightToLeft {
  0% {
    background-color: var(--drawer-target);
  }

  100% {
    background-color: var(--drawer-no-target);
  }
}

.targetContainer .main {
  background-color: var(--drawer-target);
  box-shadow: var(--drawer-target) 2px 2px 5px;
  animation: mainLeftToRight var(--t);
}

@keyframes mainLeftToRight {
  0% {
    background-color: var(--drawer-no-target);
    box-shadow: var(--drawer-no-target) 2px 2px 5px;
  }

  100% {
    background-color: var(--drawer-target);
    box-shadow: var(--drawer-target) 2px 2px 5px;
  }
}


.control {
  width: 90px;
  position: relative;
  display: flex;
  align-items: center;
}

.control>span:first-child {
  position: absolute;
  top: var(--i);
  z-index: 1000;
  width: 30px;
  padding: 20px 0 20px 5px;
  font-size: 18px;
  word-wrap: break-word;
  line-height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 10px 10px 0;
  pointer-events: all;
  cursor: var(--pointer);
}

.control>span:nth-child(2) {
  width: 60px;
  margin-left: 35px;
  height: 100%;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.control>span:nth-child(2) svg {
  width: 25px;
  height: 25px;
  transform: rotate(90deg);
  animation: showArrow 2s, floatArrow 2s ease-in-out infinite;
}

@keyframes showArrow {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes floatArrow {
  0% {
    transform: translateX(0) rotate(90deg);
  }

  50% {
    transform: translateX(-30px) rotate(90deg);
  }

  100% {
    transform: translateX(0) rotate(90deg);
  }
}

.targetBth {
  background-color: var(--drawer-target);
  box-shadow: var(--drawer-target) 2px 2px 5px;
  animation: bthTarget var(--t);
}

@keyframes bthTarget {
  0% {
    background-color: var(--drawer-no-target);
    box-shadow: var(--drawer-no-target) 2px 2px 5px;
  }

  100% {
    background-color: var(--drawer-target);
    box-shadow: var(--drawer-target) 2px 2px 5px;
  }
}

.leftBth,
.rightBth {
  background-color: var(--drawer-no-target);
  box-shadow: var(--drawer-no-target) 2px 2px 5px;
  animation: bthNotTarget var(--t);
}

@keyframes bthNotTarget {
  0% {
    background-color: var(--drawer-target);
    box-shadow: var(--drawer-target) 2px 2px 5px;
  }

  100% {
    background-color: var(--drawer-no-target);
    box-shadow: var(--drawer-no-target) 2px 2px 5px;
  }
}
</style>