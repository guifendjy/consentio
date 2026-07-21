// components/NoteCard.js
import E from "minibum";
import { signatureModalConfig } from "./SignatureModal";
import { Modal } from "../store";


/**
 * A versatile, conversational card component that shifts context,
 * headers, and primary CTA buttons dynamically based on whether
 * it is an incoming invite or an existing saved note.
 *
 * @param {Object} doc - The plain document entity data.
 */
export default function NoteCard(doc) {
  // Determine if this is an incoming request from someone else requiring my feedback
  const isIncomingInvite = !doc.isMine;

  return E.div({
    className:
      "p-5 bg-white border border-zinc-100 rounded-3xl shadow-sm flex flex-col gap-4 mb-1 transition-transform active:scale-[0.995]",
    children: [
      E.div({
        className: "flex justify-between items-start",
        children: [
          E.div({
            className: "space-y-0.5",
            children: [
              E.h3({
                className:
                  "text-[10px] mb-2 font-bold text-zinc-400 uppercase tracking-wider",
                textContent: isIncomingInvite ? "Incoming Invite" : "Note",
              }),
              E.p({
                className: "text-sm font-semibold text-zinc-800",
                textContent: `${doc.proposer || "You"} & ${doc.consenter || "Partner"}`,
              }),
            ],
          }),
          // Warm Relationship Status Badge
          E.cond(doc.status, (statusValue) => {
            const isSigned = statusValue === "Verified & Signed";
            return E.span({
              className: `px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide ${
                isSigned
                  ? "bg-emerald-50 text-emerald-700"
                  : isIncomingInvite
                    ? "bg-amber-50 text-amber-700"
                    : "bg-zinc-50 text-zinc-500"
              }`,
              textContent: isSigned
                ? "On the same page"
                : isIncomingInvite
                  ? "Review needed"
                  : "Still reviewing",
            });
          }),
        ],
      }),

      // Soft, Conversational Summary Breakdown
      E.div({
        className:
          "text-xs text-zinc-500 space-y-1.5 bg-zinc-50/60 p-3.5 rounded-2xl border border-zinc-50/80 font-normal",
        children: [
          E.p({
            textContent: `For when: ${doc.timeType === "term" ? "Our ongoing relationship" : "Our upcoming date together"}`,
          }),
          E.p({
            textContent: `What we like: ${doc.acts && doc.acts.length > 0 ? doc.acts.join(", ") : "Nothing selected yet"}`,
          }),
        ],
      }),

      E.cond(doc.status, (statusValue) => {
        if (statusValue === "Verified & Signed") {
          // Finalized State: Saved download configuration
          return E.button({
            type: "button",
            className:
              "w-full py-3 rounded-xl bg-zinc-950 text-white text-xs font-semibold cursor-pointer text-center flex items-center justify-center gap-2 transition-opacity active:opacity-90",
            children: [E.span({ textContent: "Save our notes (PDF)" })],
          });
        } else {
          // Pending State: Forking paths depending on who received it
          return E.div({
            className: "flex gap-2 w-full",
            children: [
              // Primary CTA
              isIncomingInvite
                ? E.button({
                    type: "button",
                    className:
                      "flex-1 py-3 rounded-xl bg-zinc-950 text-white text-xs font-semibold cursor-pointer text-center transition-all active:opacity-90",
                    textContent: "Review & Confirm",
                    onclick() {
                      signatureModalConfig.value = {
                        isOpen: true,
                        targetDoc: doc,
                      };
                    },
                  })
                : E.button({
                    type: "button",
                    className:
                      "flex-1 py-3 rounded-xl bg-zinc-950 text-white text-xs font-semibold cursor-pointer text-center transition-all active:opacity-90",
                    textContent: "Delete note",
                    onclick() {
                      // implement delete logic here
                      Modal.show({
                        title: "Delete Note",
                        message: "Are you sure you want to delete this note? This action cannot be undone.",
                        confirmText: "Delete",
                        cancelText: "Cancel",
                        onConfirm: () => {
                          // Call the delete function here
                          console.log("Note deleted:", doc);
                        }
                      });
                    },
                  }),
              // Secondary CTA
              E.button({
                type: "button",
                className:
                  "flex-1 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-xs font-medium cursor-pointer text-center transition-all active:bg-zinc-50",
                textContent: isIncomingInvite ? "Decline" : "Send Invite",
                onclick() {},
              }),
            ],
          });
        }
      }),
    ],
  });
}
