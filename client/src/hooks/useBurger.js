import { useState } from 'react'
import { BREAD, MAX_SLICES } from '../constants'
import { calculatePrice } from '../utils/pricing'

export function useBurger() {
  const [slices, setSlices] = useState([{ ...BREAD }, { ...BREAD }])
  const [qty, setQty] = useState(1)

  function addSlice(sliceType) {
    if (sliceType.name === 'Bread') return // bread only at boundaries
    if (slices.length >= MAX_SLICES) return

    // insert before the last bread
    setSlices(prev => {
      const next = [...prev]
      next.splice(next.length - 1, 0, { ...sliceType })
      return next
    })
  }

  function removeSlice(index) {
    // can't remove the boundary bread slices
    if (index === 0 || index === slices.length - 1) return
    setSlices(prev => prev.filter((_, i) => i !== index))
  }

  function moveSlice(index, direction) {
    // can't move boundary bread
    if (index === 0 || index === slices.length - 1) return

    const target = direction === 'up' ? index - 1 : index + 1
    // can't swap with boundary bread
    if (target === 0 || target === slices.length - 1) return

    setSlices(prev => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function reorderSlice(from, to) {
    if (from === 0 || from === slices.length - 1) return
    if (to === 0 || to === slices.length - 1) return
    if (from === to) return
    setSlices(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  function clearBurger() {
    setSlices([{ ...BREAD }, { ...BREAD }])
    setQty(1)
  }

  const pricing = calculatePrice(slices, qty)

  return {
    slices,
    qty,
    setQty,
    addSlice,
    removeSlice,
    moveSlice,
    reorderSlice,
    clearBurger,
    ...pricing,
  }
}
