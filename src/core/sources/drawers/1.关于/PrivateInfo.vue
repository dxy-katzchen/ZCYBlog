<script>
import config from '../../../_config.yaml'
import Address from './Address.svg?vueComponent'
import Man from './Man.svg?vueComponent'
import Woman from './Woman.svg?vueComponent'

export default {
  data() {
    return {
      Info: config.PrivateInfo,
    }
  },
  components: { Address, Man, Woman },
  computed: {
    avatarImg() {
      return this.Info.avatarImg || config.randomImgAPI
    },
    Age() {
      if (!this.Info.birthday) return ''
      const birthDate = new Date(this.Info.birthday)
      const birthArr = [birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDay()]
      const today = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDay()]
      if (today[2] < birthArr[2]) {
        today[1]--
      }
      if (today[1] < birthArr[1]) {
        today[0]--
      }
      if (today[0] < birthArr[0]) return ''
      return today[0] - birthArr[0]
    },

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
      <span v-if="Info.sex" :class="$style.sex">
        <Man v-if="Info.sex === '男'" />
        <Woman v-if="Info.sex === '女'" />
        {{ Age }}
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
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 20px;
}

.content span {
  line-height: 28px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 40px);
  text-align: center;
}

.address,
.sex {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.address svg,
.sex svg {
  width: 20px;
  height: 20px;
}

.sex svg {
  margin-right: 10px;
}

.description {
  margin-top: 20px;
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
    padding: 70px 0 30px 0;
    transform: translateY(-50px);
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
    padding-top: 10px;
  }

  .description {
    display: none !important;
  }

  .nickName {
    font-size: 20px;
  }

}
</style>
