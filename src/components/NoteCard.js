// components/NoteCard.js
import E from "minibum";
import openDocumentPreviewSheet from "./openDocumentPreviewSheet";

//NOTE: we can use this for shared not, but when the user opens it, 
// they have the option to decline or sign it and let you know.
// so the sheet to showcase the document should use a flag that let's them know to render for generetadNotes and sharedNotes.

/**
 * A versatile, conversational card component that shifts context,
 * headers, and primary CTA buttons dynamically based on whether
 * it is an incoming invite or an existing saved note.
 *
 * @param {Object} doc - The plain document entity data.
 */


export default function NoteCard(doc) {

  const DocumentSheet =  openDocumentPreviewSheet(doc)

return E.div({
  onclick: () => {
    DocumentSheet.open();
  },
  className:
    "border-l-5 border-black/50 group p-4 bg-white/90 backdrop-blur-md border border-zinc-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-300 flex flex-col gap-3 mb-3 transition-all duration-200 ease-out active:scale-[0.985] cursor-pointer manipulation-none select-none",
  children: [
    // TOP SECTION: Header & Actions
    E.div({
      className: "flex items-center justify-between w-full pb-2.5 border-b border-zinc-100",
      children: E.div({
          className: "flex items-center gap-3 min-w-0 pr-2",
          children: [
            // Apple-style Monogram Avatar
            E.div({
              className:
                "w-9 h-9 rounded-full bg-black flex items-center justify-center text-xs font-semibold tracking-wider text-white shadow-xs shrink-0 ring-1 ring-black/5",
              textContent: doc.proposer.slice(0, 1).toUpperCase() + doc.consenter.slice(0, 1).toUpperCase(),
            }),
            E.div({
              className: "min-w-0",
              children: [
                E.p({
                  className:
                    "text-[14px] font-semibold text-zinc-900 tracking-tight truncate leading-tight",
                  textContent: `${doc.proposer || "You"} & ${doc.consenter || "Partner"}`,
                }),
                // Optional subtitle or document tag
                E.p({
                  className: "text-[11px] font-medium text-zinc-400 uppercase tracking-wider mt-0.5",
                  textContent: "Mutual Agreement",
                }),
              ],
            }),
          ],
        }),
      
    }),

    // BOTTOM SECTION: Status, Timestamp & Summary Meta
    E.div({
      className: "flex flex-col gap-2 pt-0.5",
      children: [
        // Status & Created Timestamp Bar
        E.div({
          className: "flex items-center justify-between text-[11px] font-medium text-zinc-400 pt-1",
          children: [
            // Status Tag / Value
            E.div({
              className: "flex items-center gap-1.5",
              children: [
                E.span({
                  className: "w-1.5 h-1.5 rounded-full bg-zinc-400",
                }),
                E.span({
                  className: "text-zinc-700 font-medium",
                  textContent: typeof doc.status === "object" ? doc.status.value : doc.status || "Draft",
                }),
                
                // Signed Badge
                E.cond(doc.status, (statusVal) => {
                  const isSigned = statusVal === "Verified & Signed";
                  if (!isSigned) return null;
                  return E.span({
                    className:
                      "ml-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-zinc-100 text-zinc-800 border border-zinc-200/80",
                    textContent: "Signed",
                  });
                }),
              ],
            }),

            // Created Timestamp
            E.span({
              className: "tabular-nums text-zinc-400",
              textContent: doc.createdTimestamp || "Just now",
            }),
          ],
        }),
      ],
    }),
  ],
});
}
