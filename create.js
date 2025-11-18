#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectName = process.env[2] || (await askForProjectName())
const templateDir = path.resolve(__dirname, 'template')
const targetDir = path.resolve(process.cwd(), projectName)

async function askForProjectName() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = (query) => new Promise((resolve) => rl.question(query, resolve))

  console.log('\nProject name:\n')
  const projectName = await question('  > ')
  rl.close()
  return projectName
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const file of fs.readdirSync(src)) {
    const srcFile = path.resolve(src, file)
    const destFile = path.resolve(dest, file)
    if (fs.statSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile)
    } else {
      fs.copyFileSync(srcFile, destFile)
    }
  }
}

copyDir(templateDir, targetDir)

console.log(`✅ Shader sandbox created in ${projectName}`)
console.log(`👉 cd ${projectName} && npm install`)
