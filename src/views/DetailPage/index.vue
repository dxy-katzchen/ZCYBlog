<script>
import useStore from '../../store'
import Clipboard from 'clipboard'
import Category from '../../assets/svgs/Category.svg?vueComponent'
import Tag from '../../assets/svgs/Tag.svg?vueComponent'
import ArrowDown from '../../assets/svgs/ArrowDown.svg?vueComponent'

export default {
  data() {
    return {
      store: useStore(),
      frontmatter: {},
      originalTitle: '',
      md: null,
      elementInViewIndex: 0,
      toc: [],
      prePost: null,
      nextPost: null
    }
  },
  props: ['id'],
  components: { Category, Tag, ArrowDown },
  created() {
    this.frontmatter = this.store.postSet.getMdById(this.id)
    this.md = this.store.postSet.import(this.id)
    this.prePost = this.store.postSet.getPreMdById(this.id)
    this.nextPost = this.store.postSet.getNextMdById(this.id)
    if (this.prePost)
      this.prePost.img = this.prePost.img || this.store.randomImgAPI()
    if (this.nextPost)
      this.nextPost.img = this.nextPost.img || this.store.randomImgAPI()
  },
  computed: {
    bannerImg() {
      return this.frontmatter.img || this.store.randomImgAPI()
    },
    showToc() {
      return this.frontmatter.toc
    },
    timeAlertMessage() {
      const { publishTime, updateTime } = this.frontmatter
      let arr = [`本文发布于： ${publishTime}`]
      if (updateTime) {
        arr.push(`最近更新于： ${updateTime}`)
      }
      return arr
    },
    copyrightAlertMessage() {
      return this.store.config.copyright
    },
    tocLevel() {
      return this.store.config.tocLevel
    },
    copySuffix() {
      return this.store.config.copySuffix
    },
    copyLimite() {
      return this.store.config.copyLimite
    },
    scrollTop() {
      return this.store.scrollData.currentScrollTop
    },
    tocTop() {
      return Math.max(this.scrollTop - 350, 0) + 'px'
    },
  },
  methods: {
    createToc() {
      const titles = Array.from(this.$refs.mdBody.querySelectorAll(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].slice(0, this.tocLevel).join(",")))
      this.toc = titles.map(item => ({
        value: item.innerText,
        element: item,
        level: item.nodeName.slice(1)
      }))
    },
    createCopyBth() {
      const preNodes = document.querySelectorAll(".markdown-body pre")
      for (const preNode of preNodes) {
        const copyNode = document.createElement("span")
        copyNode.innerText = "复制"
        copyNode.className = 'copyBth'
        preNode.parentNode.appendChild(copyNode)
        const clipboard = new Clipboard(copyNode, {
          target: () => preNode,
          text: () => {
            const content = preNode.innerText
            return content.length < this.copyLimite ? content : content + "\n" + this.copySuffix
          }
        })
        clipboard.on("success", e => {
          const node = e.trigger
          node.className = "copySuccess"
          node.innerText = "成功"
          setTimeout(() => {
            node.innerText = "复制"
            node.className = 'copyBth'
          }, 1000)
        })
      }
    },
    toCategory(category) { },
    toTag(tag) { },
    toOtherPost(id) {
      this.$router.push({ name: 'DetailPage', params: { id } })
    }
  },
  mounted() {
    const title = document.querySelector('title')
    this.originalTitle = title.innerText
    title.innerText = this.frontmatter.title
    this.createToc()
    this.createCopyBth()
    this.$refs.mdBody.querySelectorAll("pre").forEach(node => {
      node.classList.add("scrollX")
    })
  },
  beforeUnmount() {
    document.querySelector('title').innerText = this.originalTitle
  },
  watch: {
    scrollTop() {
      for (let i = 0; i < this.toc.length; i++) {
        const element = this.toc[i].element
        const { top } = element.getBoundingClientRect()
        if (top >= -20) {
          this.elementInViewIndex = i
          return
        }
      }
    }
  }
}

</script>

<template>
  <div :class="$style.banner">
    <Picture :src="bannerImg" :class="$style.bannerImg" />
    <div :class="$style.bannerContent">
      <div :class="$style.postTitle" :title="frontmatter.title">{{ frontmatter.title }}</div>
    </div>
  </div>
  <div :class="$style.content">
    <div :class="$style.mdBody" ref="mdBody">
      <AlertBar :message="timeAlertMessage" />
      <component :is="md" />
      <AlertBar type="WARN" :message="copyrightAlertMessage" />
      <div :class="$style.categories">
        <Category />
        <span v-for="(category, index) of frontmatter.categories" :key="index" @click="() => toCategory(category)">{{
            category
        }}</span>
      </div>
      <div :class="$style.tags" v-if="frontmatter.tags.length !== 0">
        <Tag />
        <span v-for="(tag, index) of frontmatter.tags" :key="index" @click="() => toTag(tag)">{{ tag }}</span>
      </div>
      <div :class="$style.otherPosts">
        <div>
          <ArrowDown />
          <div :class="$style.noMorePost" v-if="!prePost">
            暂无更多~
          </div>
          <div v-else @click="() => toOtherPost(prePost.id)">
            <Picture :src="prePost.img" :class="$style.morePostImg" />
            <div :class="$style.morePostTitle">
              <span>{{ prePost.title }}</span>
            </div>
          </div>
        </div>
        <div>
          <ArrowDown />
          <div :class="$style.noMorePost" v-if="!nextPost">
            暂无更多~
          </div>
          <div v-else @click="() => toOtherPost(nextPost.id)">
            <Picture :src="nextPost.img" :class="$style.morePostImg" />
            <div :class="$style.morePostTitle">
              <span>{{ nextPost.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style.rightBar">
      <div :class="$style.rightBarWrap" :style="'--h: ' + tocTop">
        <div :class="[$style.toc, 'scrollY']" :style="'--z: ' + toc.length" v-if="showToc && toc.length >= 2">
          <span v-for="item of toc" :key="item.value" @click="() => item.element.scrollIntoView()"
            :style="'--i:' + item.level">{{
                item.value
            }}</span>
          <span :class="$style.chooseLight" :style="'--itemIndex: ' + elementInViewIndex"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.banner {
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bannerImg {
  width: 100%;
  height: 100%;
  position: absolute;
}

.bannerContent {
  position: relative;
  z-index: 1;
  font-size: 30px;
  background-color: var(--post-banner-background);
  width: 40%;
  min-width: 260px;
  border-radius: 10px;
  padding: 20px;
  transform: translateY(-50px);
}

.postTitle {
  width: 100%;
  line-height: 35px;
  text-overflow: ellipsis;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.content {
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
  z-index: 1;
  top: -50px;
}

.mdBody {
  background-color: var(--mdbody-background);
  box-shadow: var(--mdbody-shadow) 0 0 10px;
  position: relative;
  border-radius: 20px;
  padding: 30px 40px 60px 40px;
}

.rightBar {
  margin-left: 30px;
  margin-top: 80px;
}

.rightBarWrap {
  position: relative;
  width: 100%;
  top: var(--h);
  display: inline-flex;
  transition-property: top, background-color;
  transition-duration: 0s, .3s;
}

@media screen and (min-width: 1100px) {
  .mdBody {
    width: 60%;
    min-width: 800px;
  }

  .rightBar {
    width: 250px;
    min-width: 250px;
  }
}

@media screen and (max-width: 1100px) {
  .mdBody {
    width: 100%;
  }

  .rightBar {
    display: none;
  }
}

.toc {
  width: 100%;
  position: relative;
  background-color: var(--toc-background);
  height: min(400px, calc(30px + 30px * var(--z)));
  padding: 20px 10px 20px 10px;
  border-radius: 10px 0 0 10px;
}

.toc>:not(:last-child) {
  position: relative;
  z-index: 3;
  display: block;
  align-items: center;
  height: 30px;
  width: 90%;
  text-indent: calc(15px * var(--i));
  border-radius: 5px;
  font-size: calc(20px - 1px * var(--i));
  cursor: var(--pointer);
  line-height: 30px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.toc>:not(:last-child):hover {
  background-color: var(--theme-color);
  filter: brightness(1.1);
}

.chooseLight {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 30px;
  border-radius: 5px;
  background-color: var(--theme-color);
  left: 0;
  top: calc(30px * var(--itemIndex));
  margin-top: 20px;
  padding-right: 10px;
}

.categories,
.tags {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.categories span,
.tags span {
  font-size: 14px;
  line-height: 30px;
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

.otherPosts {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 18px;
}

.otherPosts>div {
  margin-top: 30px;
  height: 100px;
  display: flex;
  align-items: center;
}

.otherPosts>div:nth-child(2) {
  transform: rotate(180deg);
}

.otherPosts>div>:nth-child(2) {
  width: calc(100% - 20px);
  height: 100%;
  border-radius: 10px;
  position: relative;
}

.otherPosts>div:nth-child(2)>:nth-child(2) {
  transform: rotate(180deg);
}

.otherPosts svg {
  width: 20px;
  height: 20px;
  fill: var(--theme-color);
  transform: rotate(90deg);
}

@media screen and (min-width: 850px) {
  .otherPosts {
    flex-direction: row;
  }

  .otherPosts>div {
    width: 400px;
  }
}

@media screen and (max-width: 850px) {
  .otherPosts {
    flex-direction: column;
    align-items: center;
  }

  .otherPosts>div {
    width: 100%;
    max-width: 400px;
  }
}

.noMorePost {
  display: flex;
  align-items: center;
  justify-content: center;
}

.morePostImg {
  width: 100%;
  height: 100%;
}

.otherPosts>div:hover .morePostImg {
  transform: scale(1.1);
}

.morePostTitle {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
}

.morePostTitle span {
  padding: 10px 20px 10px 20px;
  text-align: center;
  font-size: 20px;
  width: 100%;
  line-height: 25px;
  background-color: var(--post-banner-background);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>