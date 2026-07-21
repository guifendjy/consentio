// components/ConfirmModal.js
import E from "minibum";
import { confirmModalConfig } from "../store";

export default function ConfirmModal() {
  return E.cond(confirmModalConfig, (config) => {
    if (!config.isOpen) return E.div({ className: "hidden" });

    return E.div({
      // Full-screen layout overlay wrapper pinning modal above the scaffold stack
      className:
        "absolute inset-0 w-full h-full flex items-end sm:items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm z-50 animate-fadeIn",
      children: [
        // Modal Sheet Box
        E.div({
          className:
            "w-full max-w-sm bg-white rounded-3xl border border-zinc-100 shadow-xl p-5 space-y-5 animate-slideUp transform select-none",
          children: [
            // Text Block Area
            E.div({
              className: "space-y-1.5 text-center sm:text-left",
              children: [
                E.h3({
                  className:
                    "text-base font-semibold tracking-tight text-zinc-900",
                  textContent: config.title,
                }),
                E.p({
                  className: "text-xs text-zinc-400 font-normal leading-normal",
                  textContent: config.message,
                }),
              ],
            }),

            // Action Execution Button Rack
            E.div({
              className: "flex flex-col sm:flex-row-reverse gap-2 pt-1",
              children: [
                // Highlighted Affirmative Confirm Action
                E.button({
                  type: "button",
                  className:
                    "w-full py-3 sm:py-2.5 rounded-full bg-zinc-950 text-white text-xs font-semibold cursor-pointer active:opacity-90 transition-opacity text-center shadow-sm",
                  textContent: config.confirmText,
                  onclick: config.onConfirm,
                }),
                // Secondary Dismissive Cancel Action
                E.button({
                  type: "button",
                  className:
                    "w-full py-3 sm:py-2.5 rounded-full border border-zinc-200 text-zinc-500 text-xs font-medium cursor-pointer active:bg-zinc-50 transition-all text-center",
                  textContent: config.cancelText,
                  onclick: config.onCancel,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  });
}
