// components/ConfirmModal.js
import E from "minibum";
import createSheet from "./createSheet";
import ViewContainer from "./ViewContainer";


let current = null
 const Modal = {
  /**
   * Open a re-usable high-fidelity confirmation prompt from anywhere
   */
  show({
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
  }) {
    current = setUpModal(
      {
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        onConfirm?.();
        Modal.hide();
      },
      onCancel: () => {
        onCancel?.();
        Modal.hide();
      },
    }
    )
    current.open()
    
  },
  hide() {
    current.close()
    current = null
  },
};

function setUpModal(config) {
  return createSheet({
  bgColor: null,
  fullScreen: true,
  content: E.div({
      className: "h-full flex items-center justify-center p-4",
    children: E.div({
            className:
                "w-full max-w-md rounded-2xl bg-white p-5 pb-6 shadow-xl ring-1 ring-zinc-200/60 flex flex-col justify-between",
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
                    className: "text-xs mb-2 text-zinc-400 font-normal leading-normal",
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
  })

})
}

export default Modal