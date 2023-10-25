import { ThemeSchema, Theme } from "#build/types/theme"

interface Avatar extends Theme {
    keys: 'avatar'
    options: {
        test: {
            bla: string
        }
    }
}

export default defineTheme<Avatar>({
    base: {
        avatar: 'inline-flex items-center justify-center overflow-hidden bg-gray-100 rounded-full'
    },
    defaults: {
        avatar: 'w-10 h-10'
    },
    options: {
        test: {
            bla: 'test'
        }
    },
    presets: {
        color: 'red'
    }
})