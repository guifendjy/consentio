import E from "minibum";

/**
 * Flutter-style Native Icon Wrapper
 * @param {Object} rawSvgElement - The directly imported asset
 * @param {string} className - Tailwind size and layout color utilities
 */
export function Icon(rawSvgElement, className = "w-6 h-6 text-gray-800") {
  // If the bundler serves a raw string/node, you pass it straight to your view node tree
  return E.div({
    className: `inline-flex items-center justify-center ${className}`,
    innerHTML: rawSvgElement // Injecting the native vector structure instantly
  });
}