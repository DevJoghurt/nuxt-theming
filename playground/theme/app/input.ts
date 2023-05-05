import type { Input } from '#theme'

export default defineTheme<Input>({
    base: {
        base: 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md',
    },
    defaults: {
        base: 'text',
        text: 'text-base leading-6 text-gray-900'
    },
    variants: {
        error: {
            base: 'text-base leading-6 text-red-600',
        }
    },
    props: {
        size: {
        
        }
    }
})