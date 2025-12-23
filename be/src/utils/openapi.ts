import fs from 'fs'
import path from 'path'

function deepMerge(target: any, source: any) {
  for (const key of Object.keys(source)) {
    const srcVal = (source as any)[key]
    const tgtVal = (target as any)[key]
    if (srcVal && typeof srcVal === 'object' && !Array.isArray(srcVal)) {
      ;(target as any)[key] = deepMerge(tgtVal || {}, srcVal)
    } else if (Array.isArray(srcVal)) {
      // For arrays like tags: merge unique by name if objects
      if (Array.isArray(tgtVal) && srcVal.length && typeof srcVal[0] === 'object') {
        const existingByName = new Map((tgtVal as any[]).map((o: any) => [o.name || JSON.stringify(o), o]))
        for (const item of srcVal) {
          const k = item.name || JSON.stringify(item)
          if (!existingByName.has(k)) existingByName.set(k, item)
        }
        ;(target as any)[key] = Array.from(existingByName.values())
      } else {
        ;(target as any)[key] = (tgtVal || []).concat(srcVal)
      }
    } else {
      ;(target as any)[key] = srcVal
    }
  }
  return target
}

export function buildOpenAPISpec(): any {
  const dir = path.resolve(process.cwd(), 'src', 'docs', 'openapi')
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
  const baseIdx = files.indexOf('base.json')
  if (baseIdx > -1) {
    files.splice(baseIdx, 1)
    files.unshift('base.json')
  }
  let spec: any = { openapi: '3.0.3', info: {}, paths: {}, components: {} }
  for (const f of files) {
    try {
      const content = fs.readFileSync(path.join(dir, f), 'utf8')
      const json = JSON.parse(content)
      spec = deepMerge(spec, json)
    } catch (e) {
      console.error('Failed parsing OpenAPI file:', f, e)
    }
  }
  spec.paths = spec.paths || {}
  spec.components = spec.components || {}
  return spec
}
