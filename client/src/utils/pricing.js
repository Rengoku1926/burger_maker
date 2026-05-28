import { PLATFORM_FEE } from '../constants'

export function calculatePrice(slices, quantity) {
  const subtotal = slices.reduce((sum, s) => sum + s.price, 0)

  const names = slices.map(s => s.name)
  const hasCheese = names.includes('Cheese')
  const hasPaneer = names.includes('Paneer')
  const discount = hasCheese && hasPaneer ? 3 : 0

  // count consecutive aloo tikki pairs
  let surcharge = 0
  for (let i = 0; i < slices.length - 1; i++) {
    if (slices[i].name === 'Aloo Tikki' && slices[i + 1].name === 'Aloo Tikki') {
      surcharge += 2
    }
  }

  const perBurger = subtotal - discount + surcharge
  const total = perBurger * quantity + PLATFORM_FEE
  const splitWarning = slices.length > 6

  return { subtotal, discount, surcharge, platformFee: PLATFORM_FEE, total, splitWarning }
}
