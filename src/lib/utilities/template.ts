import fs from 'fs'
import { parseComponent, SFCDescriptor } from 'vue-template-compiler'

export function readTemplate(path: string): SFCDescriptor {
  if (!fs.existsSync(path)) {
    throw new Error(`Input file does not exists: ${path}`)
  }

  const source = fs.readFileSync(path, 'utf-8')
  return parseComponent(source, {})
}

export function updateTemplate(component: SFCDescriptor, code: string): string {
  const templateAttr = Object.entries(component.template?.attrs || {})
    .map(([key, value]) => {
      return `${key}="${value}"`
    })
    .join(' ')

  const scriptAttr = Object.entries(component.script?.attrs || {})
    .map(([key, value]) => {
      return `${key}="${value}"`
    })
    .join(' ')

  const styles = component.styles
    .map((style) => {
      const attr = Object.entries(style.attrs || {})
        .map(([key, value]) => {
          return `${key}="${value}"`
        })
        .join(' ')

      return `<style ${attr}>
        ${component.styles.map((s) => s.content).join('\n')}
      </style>`
    })
    .join('\n')

  return `<template ${templateAttr}>
    ${component.template?.content || ''}
  </template>
  <script ${scriptAttr}>
    ${code}
  </script>
  ${styles}`
}
