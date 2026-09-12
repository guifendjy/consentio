import E from "minibum"


/**
 * Creates a modular sheet base with optional snap and full screen modes.
 *
 * @param {Object} config
 * @param {Object|Array} config.content
 * @param {Object} [config.header]
 * @param {Object} [config.footer]
 * @param {boolean} [config.snap] - if true, the sheet snaps to `snapPoints`; if false, drag is free form.
 * @param {Array<number>} [config.snapPoints] - an array of numbers between 0 and 1 representing the snap points for the sheet. 0 is fully closed, 1 is fully open.
 * @param {number} [config.defaultSnap]
 * @param {boolean} [config.fullScreen]
 * @param {string} [config.backdropColor] - the color of the backdrop overlay behind the sheet.
 * @param {string} [config.bgColor]
 * @param {Function} [config.onClose]
 */

export default function createSheet({
  content,
  header = null,
  footer = null,
  snap = true,
  snapPoints = [0.5, 0.8, 1],
  defaultSnap = 0,
  fullScreen = false,
  bgColor = "bg-[#fafafa]",
  backdropColor = "bg-black/30",
  onClose = null,
}) {
  const snapToPoints = Boolean(snap)
  const points = snapToPoints ? snapPoints.map((point) => Math.min(1, Math.max(0, point))) : [1]
  const getNearestPointIndex = (value) => {
    const clamped = Math.min(1, Math.max(0, value))
    return points.reduce((closestIndex, point, index) => {
      return Math.abs(clamped - point) < Math.abs(clamped - points[closestIndex]) ? index : closestIndex
    }, 0)
  }
  const initialIndex = snapToPoints ? getNearestPointIndex(defaultSnap) : 0

  const sheet = E.div({
    className: {
      $static: `w-full mx-auto flex flex-col ${fullScreen ? "h-full rounded-none" : "max-h-[90vh] rounded-t-3xl"} ${bgColor || ""} shadow-2xl overflow-hidden transition-transform duration-300 ease-out`,
    },
    style: {
      transform: "translateY(100%)",
    },
    children: [
      header
        ? E.header({
            className: "w-full shrink-0 z-10 px-6 py-4",
            children: header,
          })
        : null,
      E.div({
        className: `w-full flex-1 min-h-0 overflow-y-auto ${fullScreen ? "" : "pb-6"} no-scrollbar`,
        children: content,
      }),
      footer
        ? E.footer({
            className: "w-full shrink-0 z-10 px-6 py-4",
            children: footer,
          })
        : null,
    ],
  }).render().element

  const wrapper = E.div({
    id: "mb-sheet-container-" + Math.random().toString(36).substring(2, 15),
    className: {
      $static: `fixed inset-0 z-400 h-full flex items-end justify-center pointer-events-none`,
    },
    children: [
      E.div({
        className: {
          $static: "fixed inset-0 " + backdropColor || "" + " opacity-0 pointer-events-none transition-opacity duration-300",
        },
      }),
      sheet,
    ],
  }).render().element

  const overlay = wrapper.children[0]

  let currentValue = 0
  const clamp = (value) => Math.min(1, Math.max(0, value))
  const getNearestPoint = (value) => {
    return points.reduce((closest, point) => {
      return Math.abs(value - point) < Math.abs(value - closest) ? point : closest
    }, points[0])
  }

  const dragTarget = header ? sheet.children[0] : sheet
  let isDragging = false
  let startY = 0
  let dragStartValue = 0

  const apply = (value) => {
    currentValue = clamp(value)
    sheet.style.transform = `translateY(${100 - currentValue * 100}%)`
    const visible = currentValue > 0
    overlay.style.opacity = visible ? "1" : "0"
    overlay.style.pointerEvents = visible ? "auto" : "none"
    wrapper.style.pointerEvents = visible ? "auto" : "none"
  }

  const completeDrag = () => {
    if (currentValue <= 0.25) {
      close()
      return
    }
    const target = getNearestPoint(currentValue)
    apply(target)
  }

  const onPointerDown = (event) => {
    if (fullScreen) return
    if (event.pointerType === "mouse" && event.button !== 0) return
    isDragging = true
    startY = event.clientY
    dragStartValue = currentValue
    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  const onPointerMove = (event) => {
    if (!isDragging) return
    const deltaY = event.clientY - startY
    const height = sheet.getBoundingClientRect().height || window.innerHeight
    apply(dragStartValue - deltaY / height)
  }

  const onPointerUp = (event) => {
    if (!isDragging) return
    isDragging = false
    if (event.currentTarget.releasePointerCapture) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    completeDrag()
  }

  let mounted = false

  const addEvents = () => {
    dragTarget.addEventListener("pointerdown", onPointerDown)
    dragTarget.addEventListener("pointercancel", onPointerUp)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerUp)
  }

  const removeEvents = () => {
    dragTarget.removeEventListener("pointerdown", onPointerDown)
    dragTarget.removeEventListener("pointercancel", onPointerUp)
    window.removeEventListener("pointermove", onPointerMove)
    window.removeEventListener("pointerup", onPointerUp)
    window.removeEventListener("pointercancel", onPointerUp)
  }

  const unmount = (target) => {
    if (!mounted) return
    removeEvents()
    if (target.contains(wrapper)) {
      target.removeChild(wrapper)
    }
    mounted = false
  }

  const destroy = () => {
    if (!mounted) return
    removeEvents()
    wrapper.remove()
    mounted = false
  }

  const close = () => {
    apply(0)
    onClose?.()
    destroy()
  }

  overlay.onclick = close

  const open = (snapIndex = initialIndex) => {
    if (!mounted) {
      mount()
    }
    const clampedIndex = Math.min(Math.max(snapIndex, 0), points.length - 1)
    const value = fullScreen ? 1 : points[clampedIndex]
    apply(value)
  }

  const mount = (target = document.body) => {
    if (target.contains(wrapper)) {
      if (!mounted) {
        addEvents()
        mounted = true
      }
      return () => unmount(target)
    }

    target.appendChild(wrapper)
    addEvents()
    mounted = true

    return () => unmount(target)
  }



  return { open, close }
}
