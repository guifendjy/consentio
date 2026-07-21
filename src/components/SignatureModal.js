// components/SignatureModal.js
import E, { $signal } from "minibum";
import { DocumentEngine } from "../store";
import DocumentPreview from "./DocumentPreview"; 
import ViewContainer from "./ViewContainer";

export const signatureModalConfig = $signal({ isOpen: false, targetDoc: null });
export default function SignatureModal() {
  const signatureInput = $signal("");
  const activeTab = $signal("review"); // 🔄 Tracks modal sub-state: "review" or "confirm"

  const handleClose = () => {
    signatureInput.value = "";
    activeTab.value = "review";
    signatureModalConfig.value = { isOpen: false, targetDoc: null };
  };

  return E.cond(signatureModalConfig, (config) => {
    if (!config.isOpen) return E.div({ className: "hidden" });

    const doc = config.targetDoc;

    return E.div({
      className:
        "absolute inset-0 w-full h-full bg-zinc-950/40 backdrop-blur-sm z-50 flex items-end justify-center animate-fadeIn",
      children: [
        E.div({
          className:
            "w-full max-w-md bg-white rounded-t-3xl p-6 space-y-5 animate-slideInUp pb-8 max-h-[92vh] overflow-y-auto no-scrollbar",
          children: [
            // Header Group
            E.div({
              className: "flex justify-between items-center pb-2",
              children: [
                E.div({
                  children: [
                    E.h3({
                      className: "text-base font-bold text-zinc-900",
                      textContent: "Review & Confirm",
                    }),
                    E.p({
                      className: "text-xs text-zinc-400",
                      textContent:
                        "Make sure you both feel completely comfortable",
                    }),
                  ],
                }),
                E.button({
                  className:
                    "w-7 h-7 rounded-full bg-zinc-50 text-zinc-400 text-xs font-bold cursor-pointer flex items-center justify-center",
                  textContent: "✕",
                  onclick: handleClose,
                }),
              ],
            }),

            // Interactive Sub-Segmented Bar inside Modal Drawer
            E.div({
              className:
                "bg-zinc-100 p-0.5 rounded-xl flex items-center border border-zinc-200/20",
              children: [
                E.button({
                  type: "button",
                  className: {
                    $static:
                      "flex-1 text-center py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer",
                    "bg-white text-zinc-900 shadow-xs": activeTab.derived(
                      (v) => v === "review",
                    ),
                    "text-zinc-500 bg-transparent": activeTab.derived(
                      (v) => v !== "review",
                    ),
                  },
                  textContent: "1. Review Summary",
                  onclick: () => (activeTab.value = "review"),
                }),
                E.button({
                  type: "button",
                  className: {
                    $static:
                      "flex-1 text-center py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer",
                    "bg-white text-zinc-900 shadow-xs": activeTab.derived(
                      (v) => v === "confirm",
                    ),
                    "text-zinc-500 bg-transparent": activeTab.derived(
                      (v) => v !== "confirm",
                    ),
                  },
                  textContent: "2. Sign",
                  onclick: () => (activeTab.value = "confirm"),
                }),
              ],
            }),

            // Dynamic Stage View Switching Engine
            E.cond(activeTab, (stage) => {
              if (stage === "review") {
                // Stage A: Display high-fidelity normalized static preview card
                return E.div({
                  className: "space-y-4",
                  children: [
                    DocumentPreview(doc), // Renders the fully styled agreement snapshot
                    E.button({
                      type: "button",
                      className:
                        "w-full py-3 rounded-xl bg-zinc-950 text-white text-xs font-semibold text-center cursor-pointer active:opacity-90",
                      textContent: "Everything looks good →",
                      onclick: () => (activeTab.value = "confirm"),
                    }),
                  ],
                });
              }

              // Stage B: Confirmation signature panel
              return E.div({
                className: "space-y-5 animate-fadeIn",
                children: [
                  // Soft Mutual Assurance Block
                  E.div({
                    className:
                      "p-4 bg-zinc-50 rounded-2xl border border-zinc-100/80 text-[11px] text-zinc-600 leading-relaxed space-y-2.5 font-normal",
                    children: [
                      E.p({
                        textContent: `By typing your name below, you're checking in and confirming that these notes accurately reflect what you and ${doc.proposer || "your partner"} want to share together.`,
                      }),
                      E.p({
                        className: "text-zinc-400 italic text-[10px]",
                        textContent:
                          "Remember: this is just a personal reminder of your shared comfort zones. You can change your mind, pause, or say stop at any point.",
                      }),
                    ],
                  }),

                  // Input Field
                  E.div({
                    className: "flex flex-col gap-1.5",
                    children: [
                      E.label({
                        className:
                          "text-[10px] font-bold text-zinc-400 uppercase tracking-wider",
                        textContent: `${doc.consenter || "Partner"}'s Confirmation`,
                      }),
                      E.input({
                        type: "text",
                        placeholder:
                          doc.consenter || "Type your name to confirm",
                        className:
                          "w-full bg-transparent border-b border-zinc-200 pb-2 text-sm text-zinc-900 outline-none focus:border-zinc-950 transition-colors rounded-none pt-1",
                        value: signatureInput.value,
                        oninput: (e) => (signatureInput.value = e.target.value),
                      }),
                    ],
                  }),

                  // Action Execute Button
                  E.button({
                    type: "button",
                    className:
                      "w-full py-3.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold active:opacity-90 transition-all text-center shadow-sm cursor-pointer",
                    textContent: "Save our preferences",
                    onclick: () => {
                      const success = DocumentEngine.executeSignature(
                        doc,
                        signatureInput.value,
                      );
                      if (success) handleClose();
                    },
                  }),
                ],
              });
            }),
          ],
        }),
      ],
    });
  });
}
