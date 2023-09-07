import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils'

describe('ssr', async () => {

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = '<div>basic</div>'
    expect(html).toContain('<div>basic</div>')
  })
})
