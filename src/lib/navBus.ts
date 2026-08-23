type Listener = (index: number) => void

export const navBus = {
  index: 0,
  listeners: new Set<Listener>(),
  setIndex(index: number) {
    if (this.index === index) return
    this.index = index
    this.listeners.forEach((fn) => fn(index))
  },
  subscribe(fn: Listener) {
    this.listeners.add(fn)
    fn(this.index)
    return () => {
      this.listeners.delete(fn)
    }
  },
}
