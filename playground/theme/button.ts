export type ButtonTheme = {
    classes: 'button' | 'container' | 'spinner'
    variants: 'error' | 'success' | 'warning'
    options: {
        loading: {
            true: string
            false: string
        },
        size: {
            sm: string
            md: string
            lg: string
            xl: string
        },
        rounded: {
            circle: string
            full: string
            top: string
            bottom: string
            left: string
            right: string
            topLeft: string
            topRight: string
            bottomLeft: string
            bottomRight: string
        },
        disabled: {
            true: string
            false: string
        }
    }
}

export default defineTheme<ButtonTheme>({
    base: {
        button: 'block justify-center inline-flex items-center cursor-pointer whitespace-nowrap rounded px-2 py-1',
        container: 'flex items-center space-x-1',
        spinner: '-ml-1 mr-1 h-4 w-4 text-white',
    },
    defaults: {
        button: 'border border-gray-300 dark:border-gray-600 dark:focus:border-primary-600 bg-white dark:bg-gray-800 text-gray-700 focus:text-gray-600 dark:text-white dark:hover:text-white dark:focus:text-white focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 shadow focus:outline-none dark:focus:ring-offset-gray-900'
    },
    variants: {
        error: {
            button: 'shadow focus:outline-none focus:ring-2 dark:focus:ring-offset-gray-900 focus:ring-offset-2 focus:ring-red-500 text-white focus:text-gray-200 bg-red-600'
        }
    },
    options: {
        size: {
            sm: 'px-2.5 py-1.5 text-sm font-medium',
            md: 'px-2.5 py-1.5 text-sm font-medium',
            lg: 'px-2.5 py-1.5 text-md font-medium',
            xl: 'px-2.5 py-1.5 text-lg font-medium'
        },
        loading: {
            true: 'opacity-50 cursor-not-allowed',
            false: ''
        },
        disabled: {
            true: 'opacity-50 cursor-not-allowed',
            false: 'opacity-100 cursor-pointer'
        },
        rounded: {
            circle: 'rounded-full',
            full: 'rounded-md',
            top: 'rounded-t-md',
            bottom: 'rounded-b-md',
            left: 'rounded-l-md',
            right: 'rounded-r-md',
            topLeft: 'rounded-tl-md',
            topRight: 'rounded-tr-md',
            bottomLeft: 'rounded-bl-md',
            bottomRight: 'rounded-br-md'
        }
    }
})