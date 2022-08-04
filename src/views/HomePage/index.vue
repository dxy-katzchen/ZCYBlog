<script>
import Banner from './Banner.vue'
import useStore from '../../store'
import Boy from '../../assets/boy.webp'
import Girl from '../../assets/girl.webp'
import Date from '../../assets/svgs/Date.svg?vueComponent'
import Category from '../../assets/svgs/Category.svg?vueComponent'
import Tag from '../../assets/svgs/Tag.svg?vueComponent'

export default {
  data() {
    return {
      store: useStore(),
      Boy,
      Girl,
    }
  },
  components: { Banner, Date, Category, Tag },
  computed: {
    isDay() {
      return this.store.themeColor.isDayModel()
    },
    imgTop() {
      return Math.max(100, this.store.scrollData.currentScrollTop - window.innerHeight / 2)
    },
    posts() {
      const data = this.store.postSet.getMds()
      return data.map(item => ({
        ...item,
        img: item.img || this.store.randomImgAPI()
      }))
    },
  },
  methods: {
    toDetail(id) {
      this.$router.push({ name: 'DetailPage', params: { id } })
    },
    toTag(tag) {

    },
    toCategory(category) {

    }
  }
}
</script>

<template>
  <Banner />
  <div :class="$style.postContainer">
    <Picture :src="Boy" :class="[!isDay ? $style.invertImg : '']" :style="'--h: ' + imgTop + 'px;'" />
    <div :class="$style.content">
      <div :class="$style.noPosts" v-if="posts.length === 0">
        还未发布文章~
      </div>
      <div :class="$style.posts" v-else>
        <div v-for="(item, index) of posts" :class="[$style.postItem, index % 2 ? $style.reverseItem : '']"
          :key="item.id">
          <div :class="$style.imgBox" @click="() => toDetail(item.id)">
            <Picture :src="item.img" :class="$style.postImg" />
          </div>
          <div :class="[$style.postDetail, index % 2 ? $style.reverseItem : '']">
            <div :class="$style.postTitle" @click="() => toDetail(item.id)">
              {{ item.title }}
            </div>
            <div :class="$style.publishTime">
              <Date />
              {{ item.publishTime }}
            </div>
            <div :class="$style.description" @click="() => toDetail(item.id)">
              {{ item.description }}
            </div>
            <div :class="$style.categories">
              <Category />
              <span v-for="(category, index) of item.categories" :key="index" @click="() => toCategory(category)">{{
                  category
              }}</span>
            </div>
            <div :class="$style.tags" v-if="item.tags.length !== 0">
              <Tag />
              <span v-for="(tag, index) of item.tags" :key="index" @click="() => toTag(tag)">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Picture :src="Girl" :class="[!isDay ? $style.invertImg : '']" :style="'--h: ' + imgTop + 'px;'" />
  </div>
</template>

<style module>
.postContainer {
  width: 100%;
  display: flex;
  min-height: 600px;
  margin-bottom: 150px;
  position: relative;
  justify-content: space-evenly;
}

.postContainer>:nth-child(1),
.postContainer>:nth-child(3) {
  width: 200px;
  height: 200px;
  position: relative;
  z-index: 30;
  top: var(--h);
  border-radius: 20px;
  mix-blend-mode: multiply;
}

@media screen and (max-width: 1300px) {

  .postContainer>:nth-child(1),
  .postContainer>:nth-child(3) {
    display: none;
  }
}

.postContainer>:nth-child(3) {
  transform: rotateY(180deg);
}

.invertImg {
  filter: invert(100%);
  mix-blend-mode: revert !important;
}

.content {
  flex-grow: 1;
  min-height: 200px;
  position: relative;
  z-index: 50;
  top: 60px;
}

.noPosts {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
}

.posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 100px;
}

.postItem {
  background-color: var(--home-background);
  box-shadow: var(--post-shadow) 0 0 10px;
  border-radius: 20px;
}

.postItem:hover {
  box-shadow: var(--post-shadow) 0 0 20px;
}


.imgBox * {
  cursor: var(--pointer);
}

.postDetail {
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-right: 40px;
  margin-top: 20px;
}

.postTitle {
  font-size: 20px;
  line-height: 30px;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: var(--pointer);
}

.postTitle:hover {
  color: var(--theme-color);
}

.publishTime {
  margin-top: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.publishTime svg {
  width: 18px;
  height: 18px;
  fill: var(--theme-color);
  margin-right: 10px;
}

.description {
  margin-top: 20px;
  text-indent: 2em;
  line-height: 25px;
  height: 125px;
  text-overflow: ellipsis;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  font-size: 18px;
  cursor: var(--pointer);
}

.categories,
.tags {
  height: 30px;
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.categories span,
.tags span {
  font-size: 14px;
  color: #999;
  letter-spacing: 1px;
  padding: 0 8px 0 8px;
  cursor: var(--pointer);
}

.categories span:hover,
.tags span:hover {
  color: var(--theme-color);
}

.categories svg,
.tags svg {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  fill: var(--theme-color);
}

@media screen and (min-width: 950px) {
  .postItem {
    width: 900px;
    height: 300px;
    margin: 50px 10% 50px 10%;
    display: flex;
  }

  .reverseItem {
    transform: rotateY(180deg);
  }

  .imgBox {
    width: 400px;
    height: 100%;
    border-radius: 20px 0 0 20px;
  }

  .postImg {
    width: 100%;
    height: 100%;
    transition: 1s;
  }

  .postItem:hover .postImg {
    transform: scale(1.3) rotate(15deg);
  }

  .postTitle {
    width: 400px;
  }

  .description {
    width: 440px;
  }
}

@media screen and (max-width: 950px) {
  .postItem {
    width: 90%;
    margin: 30px 0 30px 0;
    display: flex;
    flex-direction: column;
  }

  .imgBox {
    width: 100%;
    aspect-ratio: 2;
    border-radius: 20px 20px 0 0;
  }

  .postTitle {
    width: 100%;
  }

  .description {
    width: 100%;
  }
}
</style>