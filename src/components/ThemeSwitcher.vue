<script>
import Sun from '../assets/svgs/Sun.svg?vueComponent'
import Moon from '../assets/svgs/Moon.svg?vueComponent'
import useStore from '../store'

export default {
  data() {
    return {
      store: useStore(),
    }
  },
  components: { Sun, Moon },
  computed: {
    isDay() {
      return this.store.themeColor.isDayModel()
    },
  }
}

</script>

<template>
  <span :class="$style.container" @click="() => store.themeColor.switchThemeColor()">
    <Sun :class="[isDay ? $style.front : $style.back]" />
    <Moon :class="[isDay ? $style.back : $style.front]" />
  </span>
</template>

<style module>
.container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container>:first-child {
  position: absolute;
}

.container>:nth-child(2) {
  position: absolute;
}

.back {
  opacity: 0;
  transform: rotateY(180deg);
  animation: myAnimation .7s;
}

@keyframes myAnimation {
  from {
    transform: rotateY(0);
    opacity: 1;
  }

  50% {
    transform: rotateY(90deg);
    opacity: 1;
  }

  50.01% {
    transform: rotateY(90deg);
    opacity: 0;
  }

  to {
    transform: rotateY(180deg);
    opacity: 0;
  }
}

.front {
  animation: myAnimationReverse .7s;
  transform: rotateY(0);
  opacity: 1;
}

@keyframes myAnimationReverse {
  from {
    transform: rotateY(-180deg);
    opacity: 0;
  }

  50% {
    transform: rotateY(-90deg);
    opacity: 0;
  }

  50.01% {
    transform: rotateY(-90deg);
    opacity: 1;
  }

  to {
    transform: rotateY(0);
    opacity: 1;
  }
}
</style>