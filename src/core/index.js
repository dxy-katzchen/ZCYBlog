import { markRaw } from 'vue'
import { distinct, formateTime, OrderedArr } from '../utils'
import SHA1 from '../utils/sha1'

// 博文数据及操作
export class PostSet {

  Mds = []
  tags = []
  categories = []

  constructor() {
    this.initPosts()
  }

  initPosts() {
    const moduleFiles = import.meta.globEager('./sources/posts/*/*/index.md')
    let posts = Object.keys(moduleFiles).map(key => {
      const target = markRaw(moduleFiles[key].default)
      let frontmatter
      target.setup(null, {
        expose(e) {
          frontmatter = e.frontmatter
        }
      })
      return {
        id: SHA1(key),
        key,
        target,
        frontmatter,
      }
    })

    // 无发布时间字段则不展示
    posts = posts.filter(item => Boolean(item.frontmatter.publishTime))

    // 按时间从后往前   
    posts.sort((pre, cur) => {
      return new Date(cur.frontmatter.publishTime).getTime() - new Date(pre.frontmatter.publishTime).getTime()
    })

    this.Mds = []
    for (const post of posts) {
      let { title, categories, tags, description, img, publishTime, updateTime, toc } = post.frontmatter

      publishTime = formateTime(new Date(publishTime))
      if (updateTime) {
        updateTime = formateTime(new Date(updateTime))
      }

      if (!title) {
        title = post.key.match(/\/sources\/posts\/.*\/(.*?)\/index\.md$/)[1]
      }

      if (tags) {
        if (!(tags instanceof Array)) {
          tags = [tags]
        }
      } else {
        tags = []
      }
      this.tags = distinct([...this.tags, ...tags])

      const defaultCategory = post.key.match(/posts\/(.+?)\/.+?\/index\.md$/)[1]
      if (categories) {
        if (categories instanceof Array) {
          categories.unshift(defaultCategory)
        } else {
          categories = [defaultCategory, categories]
        }
      } else {
        categories = [defaultCategory]
      }
      this.categories = distinct([...this.categories, ...categories])

      if (!description)
        description = ''

      if (toc === null || toc === undefined)
        toc = true

      this.Mds.push({
        id: post.id,
        target: post.target,
        frontmatter: {
          title,
          categories,
          tags,
          description,
          img,
          publishTime,
          updateTime,
          toc
        }
      })
    }

    console.log('博文数据预加载完毕')
  }
  import(id) {
    return this.Mds.find(item => item.id === id).target
  }
  getMdById(id) {
    return this.Mds.find(item => item.id === id).frontmatter
  }
  getPreMdById(id) {
    const index = this.Mds.findIndex(item => item.id === id)
    return index === 0 ? null : {
      id: this.Mds[index - 1].id,
      ...this.Mds[index - 1].frontmatter
    }
  }
  getNextMdById(id) {
    const index = this.Mds.findIndex(item => item.id === id)
    return index === this.Mds.length - 1 ? null : {
      id: this.Mds[index + 1].id,
      ...this.Mds[index + 1].frontmatter
    }
  }
  getMds() {
    return this.Mds.map(item => ({
      id: item.id,
      ...item.frontmatter
    }))
  }
  getMDsByTag(tag) {
    const mds = this.Mds.filter(item => item.frontmatter.tags.includes(tag))
    return mds.map(item => ({
      id: item.id,
      ...item.frontmatter
    }))
  }
  getMDsByCategory(category) {
    const mds = this.Mds.filter(item => item.frontmatter.categories.includes(category))
    return mds.map(item => ({
      id: item.id,
      ...item.frontmatter
    }))
  }
  searchMdsByKeyword(keyword) {
    if (!keyword) return []
    keyword = keyword.trim()
    const mds = this.Mds.filter(item => {
      const { title, tags, categories } = item.frontmatter
      for (const target of [title, ...tags, ...categories]) {
        if (~target.indexOf(keyword)) {
          return true
        }
      }
      return false
    })
    return mds.map(item => ({
      id: item.id,
      ...item.frontmatter
    }))
  }
}

// 侧栏目录数据以及路径映射
export function drawerData() {
  const moduleFiles = import.meta.glob('./sources/drawers/*/index.md')
  const drawerList = new OrderedArr()
  const drawerModules = {}
  for (const key of Object.keys(moduleFiles)) {
    const module = moduleFiles[key]
    const moduleName = key.match(/drawers\/(.+?)\/index\.md$/)[1]
    const rank = Number(moduleName.split(".", 2)[0])
    const title = moduleName.split(".", 2)[1]
    const name = SHA1(key)
    drawerList.add(rank, { name, title })
    drawerModules[name] = module
  }
  return { drawerList: drawerList.output(), drawerModules }
}