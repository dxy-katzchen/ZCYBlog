<script>
import ThemeSwitcher from './ThemeSwitcher.vue'
import Home from '../assets/svgs/Home.svg?vueComponent'
import TurnBack from '../assets/svgs/TurnBack.svg?vueComponent'
import Search from '../assets/svgs/Search.svg?vueComponent'
import GoTop from './GoTop.vue'


export default {
  components: { ThemeSwitcher, Home, TurnBack, GoTop, Search },
}
</script>

<template>
  <div :class="$style.toolbar">
    <GoTop />
    <span @click="() => $router.push({ name: 'HomePage' })">
      <Home />
    </span>
    <span @click="() => $router.go(-1)">
      <TurnBack />
    </span>
    <span>
      <Search />
    </span>
    <ThemeSwitcher />
  </div>
</template>

<style module>
.toolbar {
  position: fixed;
  bottom: 60px;
  right: 30px;
  height: 100vh;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.toolbar>span {
  width: 30px;
  height: 30px;
  margin-top: 15px;
}

.toolbar svg {
  width: 30px;
  height: 30px;
  fill: var(--theme-color);
}
</style>