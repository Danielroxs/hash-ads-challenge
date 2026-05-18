import { formatCurrency, formatNumber } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formatea valores enteros sin decimales', () => {
    expect(formatCurrency(1000)).toBe('$1,000')
  })

  it('formatea valores grandes correctamente', () => {
    expect(formatCurrency(50000)).toBe('$50,000')
  })

  it('trunca decimales', () => {
    expect(formatCurrency(1234.56)).toBe('$1,235')
  })

  it('formatea cero', () => {
    expect(formatCurrency(0)).toBe('$0')
  })
})

describe('formatNumber', () => {
  it('formatea millones con sufijo M', () => {
    expect(formatNumber(1_500_000)).toBe('1.5M')
  })

  it('formatea miles con sufijo K', () => {
    expect(formatNumber(2500)).toBe('2.5K')
  })

  it('devuelve el número como string si es menor a 1000', () => {
    expect(formatNumber(999)).toBe('999')
  })

  it('formatea exactamente 1000 como 1.0K', () => {
    expect(formatNumber(1000)).toBe('1.0K')
  })

  it('formatea exactamente 1,000,000 como 1.0M', () => {
    expect(formatNumber(1_000_000)).toBe('1.0M')
  })
})
