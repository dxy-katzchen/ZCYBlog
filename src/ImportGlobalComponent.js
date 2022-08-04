// 导入全局自定义组件

const moduleFiles = import.meta.globEager('./components/Global/*.vue')

export default (app) => {
  for (let module of Object.keys(moduleFiles)) {
    const component = moduleFiles[module].default
    const name = module.match(/[^/]+?(?=.vue)/)[0]
    app.component(
      name,
      component
    )
  }
}
