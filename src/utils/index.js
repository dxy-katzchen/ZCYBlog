// 对象克隆
export function clone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)

  if (cache.has(obj)) return cache.get(obj)
  let cloneObj = new obj.constructor()
  cache.set(obj, cloneObj)

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = clone(obj[key], cache)
    }
  }

  return cloneObj
}

// 字符串数组去重
export function distinct(arr) {
  arr = arr.map(item => item.trim())
  return Array.from(new Set(arr))
}

// 节流
export function throttle(fn, delay) {
  let timer = null
  return () => {
    if (timer) return
    fn()
    timer = setTimeout(() => {
      timer = null
    }, delay)
  }
}

const getUTCTime = date => new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())


// 时间格式化
export function formateTime(date = new Date()) {
  const today = new Date()
  date = getUTCTime(date)
  let diff = today.getTime() - date.getTime()

  diff = Math.ceil(diff / 1000)
  if (diff < 60)
    return diff + '秒前'

  diff = Math.floor(diff / 60)
  if (diff < 60)
    return diff + '分钟前'

  diff = Math.floor(diff / 60)
  if (diff < 24) {
    return diff + '小时前'
  }

  diff = Math.floor(diff / 24)
  if (diff < 30) {
    return diff + '天前'
  }

  const YYYY = date.getUTCFullYear()
  const MM = date.getUTCMonth() + 1
  const DD = date.getUTCDate()

  if (YYYY === today.getFullYear())
    return `${MM}月${DD}日`
  else {
    return `${YYYY}年${MM}月${DD}日`
  }
}

// 有序队列
export class OrderedArr {
  arr = []
  add(rank, value) {
    for (let i = 0, len = this.arr.length; i < len; i++) {
      const target = this.arr[i]
      if (rank < target.rank) {
        return this.arr.splice(i, 0, { rank, value })
      }
    }
    this.arr.push({ rank, value })
  }
  output() {
    return this.arr.map(item => item.value)
  }
}