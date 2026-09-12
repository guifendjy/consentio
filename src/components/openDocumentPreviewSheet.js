import E from "minibum";
import ShareConsentSheet from "./shareConsentSheet";
import createSheet from "./createSheet";
import { signatureModalConfig } from "./SignatureModal"; // for consenters
import {generatedDocuments } from "../store";
import Modal from "./ConfirmationModal";
import DocumentPreview from "./DocumentPreview";


export default function openDocumentPreviewSheet(doc) {
  const ShareSheet = ShareConsentSheet(doc)

  const DocumentSheet = createSheet({
    fullScreen: true,
    header: E.div({
      className: "w-full flex items-center justify-between px-3 py-3 border-b border-zinc-200",
      children: [
        E.h2({
          className: "text-sm font-semibold text-zinc-900 truncate",
          textContent: `${doc.proposer || "You"} & ${doc.consenter || "Partner"}`,
        }),
        E.button({
          type: "button",
          className: "rounded-full p-2 text-zinc-500 hover:bg-zinc-100 transition",
          ariaLabel: "Close sheet",
          onclick() {
            // does not work when fullScreen is false.
            DocumentSheet.close();
          },
          children: E.svg({
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            className: "h-4 w-4",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              E.path({ d: "M6 6l12 12" }),
              E.path({ d: "M18 6l-12 12" }),
            ],
          }),
        }),
      ],
    }),
    content: E.div({
      className: "p-4 space-y-4",
      children: DocumentPreview(doc),
    }),

    footer: E.div({
      className: "border-t border-zinc-200 px-4 py-3 flex gap-3",
      children: [
        E.button({
          type: "button",
          className:
            "flex-1 py-3.5 rounded-full border border-zinc-200 text-zinc-500 text-xs font-medium cursor-pointer active:bg-zinc-50 transition-colors",
          ariaLabel: "Share consent",
          onclick(e) {
            e.stopPropagation();
            ShareSheet.open()
          },
          textContent: "Share Consent",
        }),
        E.button({
          type: "button",
          className:
            "flex-1 py-3.5 rounded-full bg-red-600 text-white text-xs font-medium cursor-pointer active:opacity-90 transition-opacity text-center shadow-sm",
          ariaLabel: "Delete consent",
          onclick(e) {
            e.stopPropagation();
            Modal.show({
              title: "Delete Consent",
              message: "This action cannot be undone.",
              content:
                "Are you sure you want to delete this consent? This action cannot be undone.",
              onConfirm() {
                generatedDocuments.value = generatedDocuments.value.filter(
                  (d) => d.id !== doc.id
                );
                DocumentSheet.close(); // quickly close/destroy the sheet after deletion
              },
            });
          },
          textContent: "Delete Consent",
        }),
      ],
    })
  })

  return DocumentSheet
}
