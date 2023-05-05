type InputTheme = {
    classes: 'base' | 'text'
    variants: 'error' | 'success'
    options: {
        size: {
            sm: string
            lg: string
        }
    }
}

export default defineTheme<InputTheme>({
    base: {
        text: 'text-base leading-6 text-gray-900',
        base: 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md',
    },
    defaults: {
        text: 'text-base leading-6 text-gray-900',
        base: 'text-base leading-6 text-gray-900',
    },
    variants: {
        error: {
            base: 'text-base leading-6 text-red-600',
            text: 'text-base leading-6 text-red-600'
        }
    },
    options: {
        size: {
            lg: 'text-lg leading-6'
        }
    }
})