// views/PartnerReviewView.js
import E from "minibum";

export default function PartnerReviewView(routeParams) {
  const docId = routeParams.id;
  
  // 1. Initialize local reactive signals for the partner's session
  const isLoading = signal(true);
  const proposerName = signal("");
  const sharedActs = signal([]); // Tracks the active multi-select state
  const sharedSafewords = signal("");
  const sharedAftercare = signal("");

  // 2. Fetch the current document state from your server database
  fetch(`/api/documents/${docId}`)
    .then(res => res.json())
    .then(data => {
      // Pre-populate your signals with what the proposer selected
      proposerName.value = data.proposerName;
      sharedActs.value = data.acts || [];
      sharedSafewords.value = data.safewords || "";
      sharedAftercare.value = data.aftercare || "";
      isLoading.value = false;
    });

  // 3. Handle saving the mutual updates
  const handleSaveAndConfirm = async () => {
    // const finalPayload = {
    //   acts: sharedActs.value,
    //   safewords: sharedSafewords.value,
    //   aftercare: sharedAftercare.value,
    //   status: "Verified & Signed" // Elevate status now that both agreed
    // };

    // await fetch(`/api/documents/${docId}/collaborate`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(finalPayload)
    // });

    // Route them to a beautiful confirmation success state card
  };

  return E.cond(isLoading, (loading) => {
    if (loading) return E.div({ className: "p-8 text-center text-zinc-400", textContent: "Loading shared notes..." });

    return E.div({
      className: "max-w-md mx-auto p-6 space-y-6 font-sans text-zinc-800",
      children: [
        // Warm Welcoming Header
        E.div({
          className: "space-y-1",
          children: [
            E.h2({ className: "text-lg font-bold text-zinc-900", textContent: "Reviewing our shared preferences" }),
            E.p({ 
              className: "text-xs text-zinc-500", 
              textContent: `${proposerName.value} set up a starting point for your shared notes. Look them over and adjust anything to match your comfort level.` 
            })
          ]
        }),

        // Interactive "What we like" Section
        E.div({
          className: "space-y-3",
          children: [
            E.label({ className: "text-[11px] font-bold text-zinc-400 uppercase tracking-wider", textContent: "What are we both comfortable with?" }),
            // Re-render your multi-select components here, mapped to `sharedActs`
            // Allowing the partner to click to add or REMOVE options natively.
          ]
        }),

        // Shared Safeword Check-in
        E.div({
          className: "space-y-2",
          children: [
            E.label({ className: "text-[11px] font-bold text-zinc-400 uppercase tracking-wider", textContent: "Our Safewords & Communication" }),
            E.input({
              type: "text",
              className: "w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm outline-none focus:border-zinc-950",
              value: sharedSafewords,
              oninput: (e) => (sharedSafewords.value = e.target.value)
            })
          ]
        }),

        // Action Trigger
        E.button({
          type: "button",
          className: "w-full py-3.5 rounded-xl bg-zinc-950 text-white text-xs font-semibold active:opacity-90 transition-all text-center cursor-pointer",
          textContent: "Looks great, let's save this",
          onclick: handleSaveAndConfirm
        })
      ]
    });
  });
}