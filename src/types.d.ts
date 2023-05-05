export type AnalizedThemeFile = {
    path: string
    fileName: string
    name: string
    theme: string
}

type ThemeFile = {
    path: string
    extension: string
}

type Theme = {
    name: string
    files: ThemeFile[]
}

export type ThemeConfig = {
    name: string
    files: ThemeFile[]
    themes: Theme[]
}

export type ThemeDir = {
    cwd: string
    dir: string
    priority?: number
}  

type LayersOptions = {
    overwriteTypes?: boolean
    priority?: number
}

// Module options TypeScript interface definition
export interface ModuleOptions {
    dir: string
    variations?: string[]
    layers?: LayersOptions
}