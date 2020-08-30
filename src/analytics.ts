import * as $ from 'jquery'

function createAnalytics(): object { // функция в typescript возвращает object
  let counter = 0
  let destroyed: boolean = false

  const listener = (): number => counter++ // функция в typescript возвращает number

  // то же, что и document.addEventListener('click', listener) только с jquery
  $(document).on('click', listener)

  return {
    destroy() {
      // то же, что и document.removeEventListener('click', listener) только с jquery
      $(document).off('click', listener)
      destroyed = true
    },

    getClicks() {
      if (destroyed) {
        return `Analytics is destroyed. Total clicks = ${counter}`
      }
      return counter
    }
  }
}

window[`analytics`] = createAnalytics()
