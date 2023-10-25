import { globby } from 'globby'
import { extname, join } from 'node:path'
import { useLogger } from '@nuxt/kit'
import type { ScannedThemeFile, ThemeConfig, ThemeDir, ThemeExtendedConfig, Safelist } from './types'
import { extractClasses } from './utils'
import { readFile } from 'node:fs/promises'

const logger = useLogger('nuxt:theming')

export async function createSafelists(files: string[], extendedConfig: ThemeExtendedConfig ) : Promise<Safelist[]>{
  const safelists = [] as Safelist[]
  if(extendedConfig.safelistExtractors){
    for(const file of files){
      const fileContent = await readFile(file, 'utf-8')
      for(const extractor in extendedConfig.safelistExtractors){
        const classes = extractClasses(fileContent, `{${extractor}}`)
        safelists.push({
          component: extendedConfig.safelistExtractors[extractor]?.safelistByProp ? extendedConfig.safelistExtractors[extractor]?.component || false : false,
          extractor,
          classes,
          values: extendedConfig.safelistExtractors[extractor].values || [],
        })
      }
    }
  }
  return safelists
}

export async function scanThemeFiles(rootDir: string, themeDir: string) : Promise<ScannedThemeFile[]> {
  const themeFiles = await globby(`${themeDir}/**/*.{js,ts,json}`, { cwd: rootDir })
  // analyze theme files e.g. to extract the name of the theme from file names -> { path: 'path/to/file/button.admin.json', fileName: 'button.admin.json', name: 'button', theme: 'admin' }
  // if file name has no name part, use the directory name as name if it is not the theme directory
  const scannedThemeFiles = themeFiles
    .filter((file) => {
      const pathElements = file.split("/")
      const themeDirIndex = pathElements.indexOf(themeDir)
      pathElements.splice(0, themeDirIndex + 1)
      return pathElements.length <= 2 && ['.json','.ts','.js'].includes(extname(file))
    })
    .map((file) => {
      const path = file.split("/")
      const fileName = path.pop()
      let variation = ""
      let name = ""
      if (path[path.length - 1] === themeDir) {
        //check if theme variation is default
        const nameArr = fileName?.split(".") || []
        if (nameArr?.length === 2) {
          variation = 'default'
        } else {
          variation = nameArr[nameArr?.length - 2] || ''
        }
        name = fileName?.split(".")[0] || ''
      } else {
        variation = path[path.length - 1]
        name = fileName?.split(".")[0] || ''
      }

      //check if file path has extension ts and remove it from path
      const filePath = file.endsWith('.ts') ? file.slice(0, -3) : file

      return {
        fullPath: join(rootDir, file),
        importPath: join(rootDir, filePath),
        fileName: fileName || '',
        name,
        variation,
      }
    })
  return scannedThemeFiles
}

export function createThemeConfig(themeConfig: ThemeConfig[], files: ScannedThemeFile[]) {
  const defaultThemeFiles = files.filter((file) => file.variation === 'default')
  for(const file of defaultThemeFiles){
    const index = themeConfig.findIndex((c) => c.name === file.name)
    if (index === -1) {
      themeConfig.push({
        name: file.name,
        files: [file.fullPath],
        imports: {
          defaults: [{
            path: file.importPath,
            extension: extname(file.fileName)
          }],
          variations: []
        }
      })
    }else{
      themeConfig[index].files.push(file.fullPath)
      themeConfig[index].imports.defaults.push({
        path: file.importPath,
        extension: extname(file.fileName)
      })
    }
  }
  //get all other theme names
  const otherThemes = [...new Set(files.filter(file => file.variation !== 'default').map(file => file.variation))]
  for(const theme of otherThemes){
    const themeFiles = files.filter((file) => file.variation === theme)
    for (const file of themeFiles) {
      const index = themeConfig.findIndex((c) => c.name === file.name)
      if (index !== -1) {
        //check if theme is already in files array and add it if not

        const themeIndex = themeConfig[index].imports.variations.findIndex(
          (fileConfig) => fileConfig.name === file.name
        )
        if (themeIndex !== -1) {
          themeConfig[index].files.push(file.fullPath)
          themeConfig[index].imports.variations[themeIndex].files.push({
            path: file.importPath,
            extension: extname(file.fileName)
          })
        } else {
          themeConfig[index].files.push(file.fullPath)
          themeConfig[index].imports.variations.push({
            name: file.variation,
            files: [{
              path: file.importPath,
              extension: extname(file.fileName)
            }],
          })
        }
      } else {
        logger.warn(`You have to define a "default" theme file for '${file.name}' before you can add this file as theme variation '${file.variation}'.`)
      }
    }
  }
}

export function orderThemeDirsByPriority(themeDirs: ThemeDir[]): ThemeDir[] {
  // Set priority to 0 for any items without a priority property
  const themeDirsWithPriority = themeDirs.map(themeDir => ({
    ...themeDir,
    priority: themeDir.priority || 0,
  }))

  // Sort items by priority in descending order
  return themeDirsWithPriority.sort((a, b) => b.priority - a.priority)
}