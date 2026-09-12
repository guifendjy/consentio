import E from "minibum";
import ViewContainer from "../components/ViewContainer";
import { Navigator, generatedDocuments, sharedDocuments } from "../store";
import SignatureModal from "../components/SignatureModal";
import { $signal, $computed } from "minibum";
import NoteCard from "../components/NoteCard";
import Modal from "../components/ConfirmationModal";
/**
 * Home / Dashboard View Component
 */

const activeTab = $signal(0); // debug: dead derived signal in E.list when updateProps gets called with dummy instances.

const DashboardView = () =>
  ViewContainer({
    header: Header(),
    content: E.div({
      className: "space-y-4",
      children: [
        E.div({
          className:
            "bg-zinc-100 p-1 rounded-2xl flex items-center mb-6 border border-zinc-200/40 relative",
          children: [
            // Notes Tab Button
            E.button({
              type: "button",
              className: {
                $static:
                  "flex-1 text-center py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer",
                "bg-white text-zinc-900 shadow-sm": activeTab.derived(
                  (v) => v === 0,
                ),
                "text-zinc-500 hover:text-zinc-800 bg-transparent":
                  activeTab.derived((v) => v !== 0),
              },
              textContent: "Consents",
              onclick: () => (activeTab.value = 0),
            }),
            // Invites Tab Button
            E.button({
              type: "button",
              className: {
                $static:
                  "flex-1 text-center py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer",
                pulse: sharedDocuments.derived((invites) => invites.length > 0),
                "bg-white text-zinc-900 shadow-sm": activeTab.derived(
                  (v) => v === 1,
                ),
                "text-zinc-500 hover:text-zinc-800 bg-transparent":
                  activeTab.derived((v) => v !== 1),
              },
              children: [
                E.span("Shared"),
                // should be hidden if no invites and has been read, but for now just show it if there are invites
                // E.span({
                //   className:
                //     "inline-flex h-2.5 w-2.5 rounded-full ml-3 bg-zinc-950/50 border border-zinc-950/10",
                //     style: {
                //     display: $computed(
                //       (invites, activeTab) => {
                //         return invites.length !== 0 && activeTab !== 0
                //           ? "inline-flex"
                //           : "none";
                //       },
                //       [sharedDocuments, activeTab],
                //     ),
                //   },
                // }),
              ],
              onclick: () => (activeTab.value = 1),
            }),
          ],
        }),
        // LIST OF NOTES GENERATED
        E.list(generatedDocuments, (doc) =>
          E.div({
            className: { hidden: activeTab.derived((v) => v !== 0) },
            children: NoteCard(doc),
          }),
        ),
        // JOIN A NOTE SHARED WITH YOU
        E.cond(activeTab, (tab) => {
          if (tab !== 0) {
            return E.div({
              className: "py-2",
              children: [
                E.div({
                  className:
                    "rounded-2xl border border-zinc-200/60 bg-gradient-to-br from-white via-zinc-50/50 to-zinc-50 p-4 shadow-xm hover:border-zinc-300/80 transition-colors",
                  children: [
                    E.label({
                      className: "text-[10px] font-medium uppercase tracking-wider text-zinc-600",
                      textContent: "Enter Shared Code",
                    }),
                    E.div({
                      className: "flex items-stretch gap-3 w-full mt-2",
                      children: [
                        E.input({
                          onMount: t=> t.focus(),
                          className:
                            "flex-1 bg-transparent text-sm font-medium text-zinc-950 outline-none placeholder:text-zinc-400/70 min-h-[28px]",
                          placeholder: "e.g., ABC123XYZ",
                        }),
                        E.button({
                          type: "button",
                          className:
                            "rounded-full bg-gradient-to-br from-zinc-950 to-zinc-800 px-5 text-[11px] font-bold tracking-widest text-white transition-all hover:from-zinc-900 hover:to-zinc-700 active:scale-[0.98] shadow-md hover:shadow-lg whitespace-nowrap flex items-center justify-center",
                          textContent: "Join",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            });
          }

          return null;
        }),
        // LIST OF SHARED NOTES(consents you are part of)
        E.list(sharedDocuments, (doc) =>
          E.div({
            className: { hidden: activeTab.derived((v) => v === 0) },
            // children: NoteCard(doc),
          }),
        ),
        // Dynamic Empty State Fallback Node Check
        E.cond(
          $computed(
            (activeTab, notes, invites) => {
              // Determine if the current active tab's list is empty
              const isEmpty =
                activeTab === 0 ? notes.length === 0 : invites.length === 0;
              return { isEmpty, activeTab };
            },
            [activeTab, generatedDocuments, sharedDocuments],
          ),
          ({ isEmpty, activeTab }) => {
            // Only render if the list is actually empty
            if (!isEmpty) return null;

            const isShareNoteTab = activeTab === 0;

            return E.div({
              className:
                "py-16 text-center text-zinc-400 text-xs space-y-1 font-normal bg-zinc-50/40 rounded-2xl border border-dashed border-zinc-200/60 p-6",
              children: [
                E.p({
                  className: "font-medium text-zinc-500",
                  textContent: isShareNoteTab
                    ? "No active consents saved yet."
                    : "Your inbox is clear!",
                }),
                E.p({
                  className:
                    "text-[11px] text-zinc-400/80 max-w-[240px] mx-auto leading-normal",
                  textContent: isShareNoteTab
                    ? "Tap the '+' below to set up a new consent."
                    : "When a partner shares a consent with you, it will show up right here for you to look over.",
                }),
              ],
            });
          },
        ),
      ],
    }),
    // Fab
    footer: Footer(),
  });

function Header() {
  return E.div({
    className: "px-5 pt-8 pb-4 flex items-center justify-between",
    children: [
      E.div({
        className: "flex items-center gap-3",
        children: [
          E.div({
            className: "space-y-0.5",
            children: [
              E.h1({
                className:
                  "text-lg font-semibold tracking-tight text-[#0f0f0f]",
                textContent: "Your Space",
              }),
              E.p({
                className: "text-[11px] text-zinc-500",
                textContent: "Keep track of your consents.",
              }),
            ],
          }),
        ],
      }),
      E.button({
        type: "button",
        onclick: () => Navigator.push("account", "slideLeft"),
        className:
          "w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300/40 flex items-center justify-center text-zinc-600 hover:border-zinc-900 active:scale-95 transition-all cursor-pointer overflow-hidden",
        children: [
          E.svg({
            className: "w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              E.circle({ cx: "12", cy: "8", r: "3" }),
              E.path({ d: "M6 20c0-2.5 3-4 6-4s6 1.5 6 4" }),
              E.circle({ cx: "18", cy: "14", r: "1.2" }),
              E.line({ x1: "18", y1: "12.2", x2: "18", y2: "10.8" }),
              E.line({ x1: "19.1", y1: "12.6", x2: "20.2", y2: "13.6" }),
              E.line({ x1: "16.9", y1: "12.6", x2: "15.8", y2: "13.6" }),
            ],
          }),
        ],
      }),
    ],
  });
}

function Footer() {
  return E.div({
    className: "absolute bottom-5 right-5 z-20 pointer-events-none",
    children: [
      E.button({
        type: "button",
        onclick: () => Navigator.push("create-form", "slideUp"),
        className:
          "w-14 h-14 rounded-full bg-gradient-to-br from-[#0f0f0f] via-[#27272a] to-[#52525b] text-[#fafafa] shadow-lg active:scale-95 transition-all cursor-pointer pointer-events-auto flex items-center justify-center border border-white/10",
        children: [
          E.svg({
            className: "w-5 h-5",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              E.line({ x1: "12", y1: "5", x2: "12", y2: "19" }),
              E.line({ x1: "5", y1: "12", x2: "19", y2: "12" }),
            ],
          }),
          E.span({ className: "sr-only", textContent: "New form" }),
        ],
      }),
    ],
  });
}

export default DashboardView;
