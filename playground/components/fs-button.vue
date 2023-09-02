<template>
  <component
    v-bind="$attrs"
    :is="props.as"
    :class="classes('button',{
      size: props.size,
      rounded: props.rounded,
      loading: transformBoolean(props.loading),
      disabled: transformBoolean(props.disabled)
    })"
    :type="props.type"
    :disabled="props.disabled"
    @click="handleClickEvent"
  >
    <div
      :class="classes('container')"
    >
      <slot name="default">
        <!-- Loading Icon -->
        <span v-if="loading">
          <svg
            viewBox="0 0 24 24"
            width="1.2em"
            height="1.2em"
            :class="classes('spinner')"
          >
            <path
              fill="currentColor"
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity=".25"
            /><path
              fill="currentColor"
              d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
            >
              <animateTransform
                attributeName="transform"
                dur="0.75s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
          </svg>
        </span>
        <!-- If not loading, show the user provided icon -->
        <span v-if="!loading && hasSlot($slots.icon)">
          <slot name="icon" />
        </span>
        <!-- Actual button label -->
        <slot name="label">
          <span>
            {{ label }}
          </span>
        </slot>
      </slot>
    </div>
  </component>
</template>
<script lang="ts">
    export default {
        name: 'FsButton',
        inheritAttrs: true,
    }
</script>
<script setup lang="ts">
    import type { ComponentPublicInstance, Ref } from 'vue'
    import { onMounted, ref } from 'vue'
    import type { Slot, VNode } from 'vue'
    import { Comment, Text } from 'vue'
    import type { ButtonConfig, Button  } from '#theme'
    import { buttonTheme } from '#imports'
    import { twMerge } from 'tailwind-merge'

    type Props = {
        as?: string
        type?: string
        variant?: Button['variants'] | null
        overwrite?: ButtonConfig['base']
        disabled?: boolean
        loading?: keyof ButtonConfig['options']['loading'] | boolean
        focusOnMount?: boolean
        size?: keyof ButtonConfig['options']['size']
        rounded?: keyof ButtonConfig['options']['rounded']
        label?: string
    }
    const props = withDefaults(defineProps<Props>(),{
        loading: false,
        disabled: false,
        focusOnMount: false,
        as: 'button',
        type: 'button',
        size: 'md',
        color: 'red',
        label: 'Button',
        rounded: 'full',
        variant: null
    })

    const emit = defineEmits(['click'])
    const root = ref(null) as Ref<ComponentPublicInstance<HTMLInputElement> | null>

    const { classes: useClasses } = useTheme('form', {
      theme: 'app',
      overwrite: {
        container: 'flex items-center justify-center'
      },
      variant: 'error',
      merge: twMerge
    })

    console.log(useClasses('container', {
      size: 'xs',
    }))

    const { classes } = createTheme<Button>(buttonTheme, {
      theme: 'default',
      variant: props.variant,
      overwrite: props.overwrite,
      merge: twMerge
    })

    function hasSlot(slot: Slot | undefined, slotProps = {}): boolean {
        if (!slot)
        return false

        return slot(slotProps).some((vnode: VNode) => {
            if (vnode.type === Comment)
        return false

        if (Array.isArray(vnode.children) && !vnode.children.length)
        return false

        return (
        vnode.type !== Text
        || (typeof vnode.children === 'string' && vnode.children.trim() !== '')
        )
        })
    }

    function transformBoolean(value: boolean | string): 'true' | 'false' | undefined {
        if (typeof value === 'string' && ['true', 'false'].includes(value)) {
            return value as 'true' | 'false'
        }
        if (typeof value === 'boolean') {
            return value ? 'true' : 'false'
        }
        return value as 'true' | 'false' | undefined
    }

    // If it's disable, just ignore it
    const handleClickEvent = (event: MouseEvent) => {
        if (props.disabled || props.loading) {
            event.preventDefault()
            event.stopPropagation()
            return
        }
        emit('click', event)
    }
        // Focus on mount, (useful for modals )
    onMounted(() => {
        if (props.focusOnMount) {
            try {
                root?.value?.focus()
            }
            catch (e) {
                root?.value?.$el?.focus()
            }
        }
    })
</script>