type ButtonTheme = {
    classes: 'button' | 'hover'
    variants: 'error' | 'success' | 'warning'
    options: {
        size: {
            sm: string,
            md: string,
            lg: string
        },
        color: {
            red: string,
        }
    }
}

export default defineTheme<ButtonTheme>({
    base: {
        button: 'bg-red-500 text-white',
        hover: 'hover:bg-red-600'
    },
    defaults: {
        button: 'text-sm px-4 py-2 rounded-md'
    },
    variants: {
        error: {

        }
    },
    options: {
        color: {},
        size: {}
    }
})