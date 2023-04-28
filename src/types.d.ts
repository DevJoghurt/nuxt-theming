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