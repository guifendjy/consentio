import E from "minibum";
import ViewContainer from "../components/ViewContainer";
import { Navigator, generatedDocuments, inviteDocuments } from "../store";
import SignatureModal from "../components/SignatureModal";
import { $signal, $computed } from "minibum";
import NoteCard from "../components/NoteCard";
/**
 * Home / Dashboard View Component
 */

const activeTab = $signal(0); // debug: dead derived signal. updateProps in E.list is having issues. keeping signal outside function fixes the issue.

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
              textContent: "Notes",
              onclick: () => (activeTab.value = 0),
            }),
            // Invites Tab Button
            E.button({
              type: "button",
              className: {
                $static:
                  "flex-1 text-center py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer",
                pulse: inviteDocuments.derived((invites) => invites.length > 0),
                "bg-white text-zinc-900 shadow-sm": activeTab.derived(
                  (v) => v === 1,
                ),
                "text-zinc-500 hover:text-zinc-800 bg-transparent":
                  activeTab.derived((v) => v !== 1),
              },
              children: [
                E.span("Invites"),
                E.span({
                  className:
                    "inline-flex h-2.5 w-2.5 rounded-full ml-3 bg-zinc-950",
                  style: {
                    display: $computed(
                      (invites, activeTab) => {
                        return invites.length > 0 && activeTab !== 1
                          ? "inline-flex"
                          : "none";
                      },
                      [inviteDocuments, activeTab],
                    ),
                  },
                }),
              ],
              onclick: () => (activeTab.value = 1),
            }),
          ],
        }),
        // hide between the two
        E.list(generatedDocuments, (doc) =>
          E.div({
            className: { hidden: activeTab.derived((v) => v !== 0) },
            children: NoteCard(doc),
          }),
        ),
        E.list(inviteDocuments, (doc) =>
          E.div({
            className: { hidden: activeTab.derived((v) => v === 0) },
            children: NoteCard(doc),
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
            [activeTab, generatedDocuments, inviteDocuments],
          ),
          ({ isEmpty, activeTab }) => {
            // Only render if the list is actually empty
            if (!isEmpty) return null;

            const isNotesTab = activeTab === 0;

            return E.div({
              className:
                "py-16 text-center text-zinc-400 text-xs space-y-1 font-normal bg-zinc-50/40 rounded-2xl border border-dashed border-zinc-200/60 p-6",
              children: [
                E.p({
                  className: "font-medium text-zinc-500",
                  textContent: isNotesTab
                    ? "No active notes saved yet."
                    : "Your inbox is clear!",
                }),
                E.p({
                  className:
                    "text-[11px] text-zinc-400/80 max-w-[240px] mx-auto leading-normal",
                  textContent: isNotesTab
                    ? "Tap the '+' below to set up a new note."
                    : "When a partner sends you an invite link, it will show up right here for you to look over.",
                }),
              ],
            });
          },
        ),
        SignatureModal(),
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
                textContent: "Keep track of your notes and invites.",
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
          "w-14 h-14 rounded-full bg-gradient-to-br from-[#0f0f0f] via-[#27272a] to-[#52525b] text-[#fafafa] shadow-[0_18px_40px_rgba(15,15,15,0.25)] hover:shadow-[0_20px_45px_rgba(15,15,15,0.3)] active:scale-95 transition-all cursor-pointer pointer-events-auto flex items-center justify-center border border-white/10",
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
