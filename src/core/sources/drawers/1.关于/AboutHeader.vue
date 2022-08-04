<script>
import config from '../../../_config.yaml'
import Address from './Address.svg?vueComponent'

export default {
  data() {
    return {
      Info: config.PrivateInfo,
    }
  },
  components: { Address },
  computed: {
    avatarImg() {
      return this.Info.avatarImg || config.randomImgAPI
    }
  }
}

</script>

<template>
  <div :class="$style.container">
    <img :src="avatarImg" :class="$style.avatarImg" />
    <div :class="$style.content">
      <span :class="$style.nickName">
        {{ Info.nickName }}
      </span>
      <span :class="$style.address">
        <Address />
        {{ Info.address }}
      </span>
      <span :title="Info.description" :class="$style.description">
        {{ Info.description }}
      </span>
    </div>
  </div>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.avatarImg {
  border-radius: 50%;
  box-shadow: #666 0 0 10px;
  position: relative;
  z-index: 1;
  margin-top: 30px;
  object-fit: cover;
}

.content {
  transform: translateY(-50px);
  padding: 70px 0 30px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 20px;
}

.content span {
  line-height: 28px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.address {
  font-size: 16px;
}

.address svg {
  width: 20px;
  height: 20px;
}

@media screen and (min-width: 800px) {

  .avatarImg {
    width: 150px;
    height: 150px;
    transition: 1s;
  }

  .avatarImg:hover {
    transform: rotate(360deg);
  }

  .content {
    width: 60vw;
    max-width: 1200px;
    min-width: 600px;
    border-radius: 10px;
    box-shadow: #999 0 3px 5px;
  }

  .nickName {
    font-size: 25px;
  }
}

@media screen and (max-width: 800px) {
  .avatarImg {
    width: 50%;
    height: 50%;
    max-width: 100px;
    max-height: 100px;
  }

  .content {
    width: 100%;
    max-width: 400px;
    min-width: 100px;
  }

  .description {
    display: none !important;
  }

  .nickName {
    font-size: 20px;
  }

}
</style>
