const main = async () => {
  let duration = 1000
  while (true) {
    for (const likesEl of Array.from(document.querySelectorAll(`div[aria-label$='Like']`))) {
      const viewsEl = likesEl.parentElement?.nextElementSibling
      colorize(likesEl as HTMLElement, viewsEl as HTMLElement | null | undefined)
    }
    for (const likesEl of Array.from(document.querySelectorAll(`a[href$="/likes"]`))) {
      let viewsEl: HTMLElement | null | undefined = likesEl.parentElement?.parentElement
      while (viewsEl) {
        if (viewsEl.querySelector(`a[href$="/analytics"]`)) break
        viewsEl = viewsEl?.previousElementSibling as HTMLElement | null | undefined
      }
      colorize(likesEl as HTMLElement, viewsEl as HTMLElement | null | undefined)
    }
    await delay(duration)
  }
}

const colorize = (likesEl: HTMLElement, viewsEl: HTMLElement | null | undefined) => {
  const likes = getCount(likesEl)
  const views = getCount(viewsEl)
  if (likes === undefined) return
  // if (views === undefined) continue
  const container = parentN(likesEl, 11) as HTMLElement
  const avg = 100
  const red: V3 = [0, 100, 50]
  const green: V3 = [120, 100, 50]
  const strength = Math.min(Math.log10(likes) / 10, 1)
  const ripeness = views === undefined ? 0.5 : avg / (avg + views / likes)
  const color = lerp3(red, green, ripeness)
  container.style.backgroundColor = `hsla(${color[0]}, ${color[1]}%, ${color[2]}%, ${strength})`
  console.log('likes', likes, 'views', views, 'strength', strength, 'ripeness', ripeness, 'color', color)
}

const getCount = (element: Element | null | undefined): number | undefined => {
  const string = element?.querySelector('[data-testid="app-text-transition-container"]')?.textContent
  if (!string) return undefined
  return dehumanize(string)
}

const dehumanize = (s: string): number => {
  let str = s.replaceAll(',', '')
  let multiplier = 1
  if (str.endsWith('K')) multiplier = 1_000
  if (str.endsWith('M')) multiplier = 1_000_000
  if (str.endsWith('B')) multiplier = 1_000_000_000
  return parseInt(str) * multiplier
}

const delay = (duration: number) => new Promise(resolve => setTimeout(resolve, duration))

const parentN = <T extends Element>(element: T, n: number): Element | undefined => {
  let cur: Element | undefined = element
  for (let i = 0; i < n; i++) cur = cur?.parentElement ?? undefined
  return cur
}

type V3 = [number, number, number]

const lerp3 = (a: V3, b: V3, f: number): V3 => [lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f)]

const lerp = (a: number, b: number, f: number): number => a + (b - a) * f

main()

export {}
