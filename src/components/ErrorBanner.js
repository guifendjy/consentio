// components/ErrorBanner.js
import E from "minibum";
import { errorConfig, Alert } from "../store";

export default function ErrorBanner() {
  return E.cond(errorConfig, (config) => {
    if (!config.visible) return E.div({ className: "hidden" });

    // Gesture Mechanics
    let touchStartY = 0;

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY - touchEndY; // Positive value means scrolling/flicking UP

      // Guideline: If user drags or flicks up past a small threshold, dismiss it
      if (swipeDistance > 30) {
        Alert.hide();
      }
    };

    return E.div({
      // Placed perfectly across the top safe area grid line above the stack
      className: {
        $static:
          "absolute top-4 left-4 right-4 p-3.5 rounded-2xl bg-white border border-zinc-100 shadow-xl flex items-center gap-3 select-none z-50 pointer-events-auto touch-none",
        "animate-slideInDown": !config.isLeaving,
        "animate-slideOutUp": config.isLeaving,
      },
      // Bind mobile-native gestures
      ontouchstart: onTouchStart,
      ontouchend: onTouchEnd,

      children: [
        E.div({
          className:
            "w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 text-red-500",
          children: [
            E.svg({
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2.5",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              className: "w-4 h-4",
              children: [
                E.circle({ cx: "12", cy: "12", r: "10" }),
                E.line({ x1: "12", y1: "8", x2: "12", y2: "12" }),
                E.line({ x1: "12", y1: "16", x2: "12.01", y2: "16" }),
              ],
            }),
          ],
        }),

        E.div({
          className:
            "flex-1 text-xs font-medium text-zinc-800 leading-normal pr-1",
          textContent: config.message,
        }),

        E.button({
          type: "button",
          className:
            "w-6 h-6 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:text-zinc-600 active:bg-zinc-100 transition-colors shrink-0 cursor-pointer",
          onclick: (e) => {
            e.stopPropagation(); // Stops event bubbling issues
            Alert.hide();
          },
          children: [
            E.svg({
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2.5",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              className: "w-3 h-3",
              children: [
                E.line({ x1: "18", y1: "6", x2: "6", y2: "18" }),
                E.line({ x1: "6", y1: "6", x2: "18", y2: "18" }),
              ],
            }),
          ],
        }),
      ],
    });
  });
}
