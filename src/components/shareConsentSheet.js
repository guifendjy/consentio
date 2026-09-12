import E from "minibum"
import createSheet from "./createSheet"


const ShareConsentSheet = (doc) =>{
    const shareCodeText = doc.shareCode

    return createSheet({
    snap:false,
    bgColor: "bg-white",
    backdropColor: "bg-black/50",
    content: E.div({
              className: "w-full rounded-2xl bg-white p-4 sm:p-5",
          children: [
            E.div({
                  className: "flex flex-col gap-1",
              children: [
                E.div({
                      className: "min-w-0",
                  children: [
                    E.p({
                      className: "text-lg font-semibold text-zinc-900",
                      textContent: "Share this consent",
                    }),
                    E.p({
                      className: "mt-1 text-[11px] leading-relaxed text-zinc-500",
                      textContent: "Give this code to your consenter to open the agreement.",
                    }),
                  ],
                }),
              ],
            }),
            E.div({
              className: "mt-3 flex w-full flex-col gap-2 sm:flex-row sm:items-center",
              children: [
                E.div({
                  className: "min-w-0 flex-1 truncate rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-sm font-semibold tracking-[0.15em] text-zinc-900 sm:tracking-[0.2em]",
                  textContent: shareCodeText || "AK89032X-01",
                }),
                E.button({
                  type: "button",
                  className: "w-full shrink-0 rounded-xl bg-zinc-900 px-3 py-2.5 text-[11px] font-semibold text-white transition-opacity active:opacity-80 sm:w-auto",
                  ariaLabel: "Copy share code",
                  textContent: "Copy",
                  onclick(e) {
                    e.stopPropagation();
                  },
                }),
              ],
            }),
          ],
        }),
})
}

export default ShareConsentSheet