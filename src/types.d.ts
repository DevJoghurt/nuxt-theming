export type ScannedThemeFile = {
    importPath: string
    fullPath: string
    fileName: string
    name: string
    variation: string
}

type ThemeFile = {
    path: string
    extension: string
}

type ThemeVariation = {
    name: string
    files: ThemeFile[]
}

type ThemeImport = {
    defaults: ThemeFile[]
    variations: ThemeVariation[]
}

export type Safelist = {
    component: string | false
    safelistByProp: boolean | string | undefined
    extractor: string
    classes: string[]
    values: string[]
  }

export type ThemeConfig = {
    name: string
    safelists?: Safelist[]
    files: string[]
    imports: ThemeImport
}

export type ThemeDir = {
    cwd: string
    dir: string
    priority?: number
}  

type ComponentSafelist = {
    classes: string[]
    safelistByProp: boolean | string | undefined
    extractor: string
}
export type ComponentsSafelist =  Record<string, ComponentSafelist[]>

export type SafelistConfig = {
    global: string[]
    components: ComponentsSafelist
    componentWhitelist: string[]
  }

// Module config options for TypeScript interface

type LayersOptions = {
    overwriteTypes?: boolean
    priority?: number
}

type SafelistExtractor = {
    component?: string
    safelistByProp?: boolean | string
    values?: string[]
}

export type ThemeExtendedConfig = {
    name: string
    safelistExtractors?: Record <string, SafelistExtractor>
}

export interface ModuleOptions {
    dir: string
    variations: string[]
    mergeStrategy: 'tailwind-merge' | 'overwrite'
    layers: LayersOptions
    config: ThemeExtendedConfig[]
}