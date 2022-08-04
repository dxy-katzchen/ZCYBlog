#! /usr/bin/env node

const { program } = require('commander')
const { execSync } = require('child_process');

const fs = require('fs')
const { join } = require("path")

const fullPath = path => join(__dirname, "../src/core", path)

program.command("post")
  .description("创建新的文章")
  .argument('<string>', '文章标题')
  .option("-t,--type <string>", '文章类型(作为文章的分类)', '默认')
  .action((str, options) => {
    const category = options.type
    const dirPath = fullPath("sources/posts/" + category)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
    const targetDir = join(dirPath, str)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir)
    }
    const templatePath = fullPath("templates/post.md")
    const targetPath = join(targetDir, "index.md")
    fs.copyFileSync(templatePath, targetPath)
    console.log("\n \033[42;37m SUCCESS! \033[0m \n")
    console.log(` > to ${targetPath}`)
  })

program.command("drawer")
  .description("创建新的抽屉页")
  .argument("<string>", '抽屉名称')
  .option("-i,--index <number>", "抽屉的序号", Number.MAX_SAFE_INTEGER)
  .action((str, options) => {
    const dirPath = fullPath("sources/drawers")
    const index = Math.min(options.index, fs.readdirSync(dirPath).length + 1)
    fs.readdir(dirPath, (_, files) => {
      files.forEach(fileName => {
        const rank = Number(fileName.split(".", 1)[0])
        if (rank >= index) {
          const filePath = join(dirPath, fileName)
          const newFileName = (rank + 1) + fileName.slice((rank + "").length)
          const newFilePath = join(dirPath, newFileName)
          fs.renameSync(filePath, newFilePath)
        }
      })
    })
    const targetDir = join(dirPath, index + "." + str)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir)
    }
    const templatePath = fullPath("templates/drawer.md")
    const targetPath = join(targetDir, "index.md")
    fs.copyFileSync(templatePath, targetPath)
    console.log("\n \033[42;37m SUCCESS! \033[0m \n")
    console.log(` > to ${targetPath}`)
  })

program.command("publish")
  .description("发布最新博客")
  .action(() => {
    execSync("git add . && git commit -a --allow-empty-message -m '' && git push")
  })


program.parse(process.argv)