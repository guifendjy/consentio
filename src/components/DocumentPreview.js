// components/DocumentPreview.js
import E from "minibum";

/**
 * A stark, minimal summary sheet focusing purely on information flow.
 */
export default function DocumentPreview(doc) {
  const proposer = doc.proposer || "—";
  const proposerContact = doc.proposerContact || "—";
  const consenter = doc.consenter || "—";
  const consenterContact = doc.consenterContact || "—";
  const timeframeStr =
    doc.type == "term"
      ? "Ongoing Relationship Term"
      : `date: ${doc.date.day}. from: ${doc.date.from}, to: ${doc.date.to}` ||
        "—";

  const actsList = doc.acts || [];
  const safetyList = doc.contraception || [];

  const devices = doc.sexualDevices || "None specified";
  const specialInstructions = doc.specialActivities || "None specified";
  const customContraception = doc.customContraception;
  const safewords = doc.safewords || "—";
  const aftercare = doc.aftercare || "None specified";

  const hasAcknowledged =
    doc.acknowledgment === true || doc.status !== "Pending signatures";

  const actsText =
    actsList.length === 0 ? "None specified" : actsList.join("  ·  ");

  const safetyStr =
    safetyList.length === 0 && !customContraception
      ? "None specified"
      : [...safetyList, customContraception].filter(Boolean).join(", ");

  return E.div({
    className:
      "bg-white text-zinc-900 font-sans text-xs leading-relaxed select-text tracking-normal space-y-6 p-2 pb-4 printable-document-root",
    innerHTML: `
      <div class="space-y-1">
        <h2 class="text-xs font-bold tracking-widest uppercase text-zinc-900">Mutual Agreement Summary</h2>
        <div class="border-b border-zinc-900 pt-2"></div>
      </div>

      <div class="grid grid-cols-2 gap-8">
        <div>
          <span class="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block mb-0.5">Proposer</span>
          <div class="font-medium text-zinc-900">${proposer}</div>
          <div class="text-zinc-500 text-[11px]">${proposerContact}</div>
        </div>
        <div>
          <span class="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block mb-0.5">Partner</span>
          <div class="font-medium text-zinc-900">${consenter}</div>
          <div class="text-zinc-500 text-[11px]">${consenterContact}</div>
        </div>
      </div>

      <div class="space-y-0.5 pt-2 border-t border-zinc-200">
        <span class="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block">Timeline</span>
        <p class="text-zinc-800">${timeframeStr}</p>
      </div>

      <div class="space-y-3 pt-2 border-t border-zinc-200">
        <div>
          <span class="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block mb-0.5">Agreed Activities</span>
          <div class="text-zinc-900 font-medium text-[13px]">${actsText}</div>
        </div>
        
        <div class="grid grid-cols-2 gap-8 text-[11px]">
          <div>
            <span class="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block mb-0.5">Devices / Toys</span>
            <p class="text-zinc-600">${devices}</p>
          </div>
          <div>
            <span class="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block mb-0.5">Special Instructions</span>
            <p class="text-zinc-600">${specialInstructions}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-8 pt-2 border-t border-zinc-200">
        <div class="col-span-1">
          <span class="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block mb-0.5">Safewords / Signals</span>
          <p class="text-zinc-900 font-semibold">${safewords}</p>
        </div>
        <div class="col-span-1">
          <span class="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block mb-0.5">Protection</span>
          <p class="text-zinc-700">${safetyStr}</p>
        </div>
        <div class="col-span-1">
          <span class="text-[9px] font-bold tracking-wider text-zinc-400 uppercase block mb-0.5">Aftercare</span>
          <p class="text-zinc-600">${aftercare}</p>
        </div>
      </div>

      <div class="space-y-1.5 pt-3 border-t border-zinc-200 text-zinc-500 text-[11px] font-normal">
        <p><b>Withdrawal:</b> Consent can be withdrawn at any time for any reason. If either person signals or says stop, all activities pause immediately.</p>
        <p><b>Boundaries:</b> If a boundary is accidentally crossed, activities pause immediately to check in and both partiess will decide on how to proceed.</p>
      </div>

      <div class="pt-3 flex items-center gap-2 text-[9px] tracking-widest text-zinc-400 font-medium border-t border-zinc-200">
        <span>${hasAcknowledged ? "[✓]" : "[ ]"}</span>
        <span>SHARED COMMITMENT TO RESPECT</span>
      </div>
    `,
  });
}
