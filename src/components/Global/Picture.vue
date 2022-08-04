<script>
import Loading from './Loading.vue'

export default {
  data() {
    return {
      isLoading: true,
    }
  },
  props: ['src'],
  components: { Loading },
  mounted() {
    const img = new Image()
    img.src = this.src
    img.onerror = () => {
      console.log(`图片加载失败, 地址: ${this.src}`)
    }
    img.onload = () => {
      this.isLoading = false
    }
  }
}

</script>

<template>
  <div :class="$style.container">
    <Loading v-if="isLoading" />
    <img :src="src" v-else />
  </div>
</template>

<style module>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.container img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  filter: brightness(var(--banner-brightness));
}
</style>