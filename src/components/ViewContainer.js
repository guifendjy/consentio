import E from "minibum"

/**
 * ViewContainer (Scaffold Architecture)
 * Creates a rigid fullscreen mobile layout with pinned top/bottom areas and a scrolling content lane.
 *
 * @param {Object} config
 * @param {Object|Array} config.content - Main body element(s) that should scroll independently
 * @param {Object} [config.header] - Optional element pinned directly to the absolute top
 * @param {Object} [config.footer] - Optional element pinned directly to the absolute bottom (e.g., TabBar, FAB, Buttons)
 * @param {string} [config.bgColor] - Custom tailwind background color configuration overrides
 * @param {string} [config.headerBg] - Custom tailwind background color configuration for the header.
 * @param {string} [config.footerBg] - Custom tailwind background color configuration for the footer.
 * @param {number} [config.zIndex] -  zIndex configuration overrides
 * @param {string|Object} [config.animation] - Custom Tailwind animation configuration overrides.
 * @param {string} [config.animation.enter] - Animation class applied on enter.
 * @param {string} [config.animation.leave] - Animation class applied on leave.
 * 
 */
export default function ViewContainer({
  content,
  header = null,
  footer = null,
  headerBg=null,
  footerBg=null,
  bgColor = "bg-[#fafafa]",
  zIndex=null,
  animation=null,
}) {

  return E.div({
    className: {
      $static: `mb-view-container absolute inset-0 w-full h-full flex flex-col justify-between ${bgColor} text-zinc-900 select-none overflow-hidden font-sans ${animation  ? animation:'' } z-${zIndex}`,
    },
    children: [
      header
        ? E.header({
            className: "w-full shrink-0 z-30 relative",
            children: header,
          })
        : null,
      E.div({
        className: "flex-1 w-full overflow-y-auto px-6 pt-2 pb-6 no-scrollbar",
        children: content,
      }),
      footer
        ? E.footer({
            className: "w-full shrink-0 z-30 relative",
            children: footer,
          })
        : null,
    ],
  })
}
