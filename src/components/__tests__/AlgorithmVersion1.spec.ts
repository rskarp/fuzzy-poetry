import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AlgorithmVersion1 from '../AlgorithmVersion1.vue'

describe('AlgorithmVersion1', () => {
  it('renders properly', () => {
    const wrapper = mount(AlgorithmVersion1)
    expect(wrapper.text()).not.toBeNull()
  })
})
