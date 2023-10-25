// @ts-ignore
import { defaultExtractor as createDefaultExtractor } from 'tailwindcss/lib/lib/defaultExtractor.js'
import type { ComponentsSafelist } from './types'

export const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

export const customSafelistExtractor = (content: string, components: string[], componentTailwindSafelist: ComponentsSafelist) => {
  let classes = [] as string[]

  //get component name from content string
  const matchedComponents = components.filter(v => content.includes(v))
  if(matchedComponents.length === 0){
    return classes
  }

  for(const component of matchedComponents){
    if(componentTailwindSafelist[component]){
      for(const safelist of componentTailwindSafelist[component]){
        const regex = new RegExp(`<([A-Za-z][A-Za-z0-9]*(?:-[A-Za-z][A-Za-z0-9]*)*)\\s+(?![^>]*:${safelist.extractor}\\b)[^>]*\\b${safelist.extractor}=["']([^"']+)["'][^>]*>`, 'gs')
        const matches = content.matchAll(regex)
        for (const match of matches) {
          const [, extractedComponent, extractedValue] = match
          if(matchedComponents.includes(extractedComponent) && extractedComponent === component && extractedValue){
            const safelistClasses = safelist.classes.map((classEl) => classEl.replace(new RegExp(`{${safelist.extractor}}`, 'g'),extractedValue))
            classes = [...new Set([...classes, ...safelistClasses ])]
          }
        }
      }
    }
  }

  return classes
}