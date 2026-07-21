import E from "minibum";

/**
 * ViewContainer (Scaffold Architecture)
 * Creates a rigid fullscreen mobile layout with pinned top/bottom areas and a scrolling content lane.
 *
 * @param {Object} config
 * @param {Object|Array} config.content - Main body element(s) that should scroll independently
 * @param {Object} [config.header] - Optional element pinned directly to the absolute top
 * @param {Object} [config.footer] - Optional element pinned directly to the absolute bottom (e.g., TabBar, FAB, Buttons)
 * @param {string} [config.bgColor] - Custom tailwind background color configuration overrides
 * @param {Object} [config.animation] - Animation configuration for enter/leave transitions
 */
export default function ViewContainer({
  content,
  header = null,
  footer = null,
  bgColor = "bg-[#fafafa]",
}) {
  return E.div({
    id: "mb-view-container",
    className: {
      $static: `absolute inset-0 w-full h-full flex flex-col justify-between ${bgColor} text-zinc-900 select-none overflow-hidden font-sans`,
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
  });
}
