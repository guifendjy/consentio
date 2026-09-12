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
      : `date: ${doc.date?.day}. from: ${doc.date?.from}, to: ${doc.date?.to}` ||
        "—";

  const actsList = doc.acts || [];
  const safetyList = doc.contraception || [];

  const devices = doc.sexualDevices || "None specified";
  const specialInstructions = doc.specialActivities || "None specified";
  const customContraception = doc.customContraception;
  const safewords = doc.safewords || "—";
  const aftercare = doc.aftercare || "None specified";

  const signedByConsenter = doc.status === "Pending signatures"
  const signedByProposer = true // always true since the proposer is the one who creates the document and signs it first.

  const actsText =
    actsList.length === 0 ? "None specified" : actsList.join("  ·  ");

  const safetyStr =
    safetyList.length === 0 && !customContraception
      ? "None specified"
      : [...safetyList, customContraception].filter(Boolean).join(", ");

  return E.div({
    className:
      "w-full max-w-xl mx-auto p-6 sm:p-10 bg-white text-zinc-900 font-sans text-xs leading-relaxed border border-zinc-300 shadow-sm select-text printable-document-root print:max-w-none print:border-0 print:shadow-none print:p-0",
    innerHTML: `
      <!-- Document Title -->
      <div class="text-center space-y-1 mb-6">
        <h1 class="text-base sm:text-lg font-bold tracking-tight uppercase text-zinc-900">
          Sexual Consent Form
        </h1>
        <p class="text-[11px] text-zinc-700">
          This Consent is made on the effective date by and between:
        </p>
      </div>

      <!-- Section: Parties -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <!-- Proposer Column -->
        <div class="space-y-2">
          <div class="font-bold text-zinc-900 uppercase tracking-wide border-b border-zinc-900 pb-0.5">
            PROPOSER:
          </div>
          <div class="space-y-1.5 pt-1">
            <div class="flex items-end gap-1">
              <span class="font-semibold text-zinc-800">Name:</span>
              <span class="border-b border-zinc-900 flex-1 px-1 font-medium text-zinc-900 truncate">${proposer}</span>
            </div>
            <div class="flex items-end gap-1">
              <span class="font-semibold text-zinc-800">Contact:</span>
              <span class="border-b border-zinc-900 flex-1 px-1 text-zinc-700 truncate">${proposerContact}</span>
            </div>
          </div>
        </div>

        <!-- Consenter Column -->
        <div class="space-y-2">
          <div class="font-bold text-zinc-900 uppercase tracking-wide border-b border-zinc-900 pb-0.5">
            CONSENTER:
          </div>
          <div class="space-y-1.5 pt-1">
            <div class="flex items-end gap-1">
              <span class="font-semibold text-zinc-800">Name:</span>
              <span class="border-b border-zinc-900 flex-1 px-1 font-medium text-zinc-900 truncate">${consenter}</span>
            </div>
            <div class="flex items-end gap-1">
              <span class="font-semibold text-zinc-800">Contact:</span>
              <span class="border-b border-zinc-900 flex-1 px-1 text-zinc-700 truncate">${consenterContact}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Legal Preamble Text -->
      <div class="space-y-2 mb-6 text-zinc-800 text-[11px] leading-normal text-justify">
        <p>
          The Proposer and the Consenter hereby affirm that they fully understand the implications of this Consent and assert that they are acting voluntarily and without coercion.
        </p>
      </div>

      <!-- Section: Time & Activities -->
      <div class="space-y-3 mb-6">
        <div class="font-bold text-zinc-900 uppercase tracking-wide">
          TIME & ACTIVITIES.
        </div>
        
        <div class="pl-2 space-y-2">
          <div class="flex items-start gap-2">
            <span class="font-bold text-zinc-900 mt-0.5">[✓]</span>
            <div class="flex-1">
              <span>Timeframe specified for activities:</span>
              <div class="border-b border-zinc-900 font-semibold text-zinc-900 py-0.5 mt-0.5">
                ${timeframeStr}
              </div>
            </div>
          </div>

          <div class="space-y-1 pt-1">
            <span class="font-semibold text-zinc-800 block">Agreed Activities:</span>
            <div class="border-b border-zinc-900 pb-1 text-zinc-900 font-medium">
              ${actsText}
            </div>
          </div>

          <div class="space-y-1 pt-1">
            <span class="font-semibold text-zinc-800 block">Use of following devices/items:</span>
            <div class="border-b border-zinc-900 pb-1 text-zinc-800">
              ${devices}
            </div>
          </div>

          <div class="space-y-1 pt-1">
            <span class="font-semibold text-zinc-800 block">Special instructions or constraints:</span>
            <div class="border-b border-zinc-900 pb-1 text-zinc-800">
              ${specialInstructions}
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Safety, Protection & Care -->
      <div class="space-y-3 mb-6">
        <div class="font-bold text-zinc-900 uppercase tracking-wide">
          PROTECTION & SAFETY PROTOCOLS.
        </div>
        
        <div class="pl-2 space-y-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span class="font-semibold text-zinc-800 block">Safewords / Signals:</span>
              <div class="border-b border-zinc-900 pb-0.5 font-bold text-zinc-900">
                ${safewords}
              </div>
            </div>
            <div>
              <span class="font-semibold text-zinc-800 block">Protection Method:</span>
              <div class="border-b border-zinc-900 pb-0.5 text-zinc-800">
                ${safetyStr}
              </div>
            </div>
          </div>

          <div class="space-y-1 pt-1">
            <span class="font-semibold text-zinc-800 block">Aftercare plan:</span>
            <div class="border-b border-zinc-900 pb-1 text-zinc-800">
              ${aftercare}
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Terms & Conditions -->
      <div class="space-y-2 mb-8 text-[11px] text-zinc-800 text-justify border-t border-zinc-300 pt-3">
        <p>
          <b>EARLY TERMINATION.</b> Both the Proposer and the Consenter have the right to withdraw this Consent at any time, without providing any reason. Upon receiving withdrawal notification or standard safeword signal, all further actions shall cease immediately.
        </p>
        <p>
          <b>BOUNDARY CHECK-INS.</b> If a boundary is crossed during activity, participants agree to halt all activity immediately to consult and re-evaluate consent prior to proceeding.
        </p>
      </div>

      <!-- Signatures Execution Block -->
      <div class="space-y-4 pt-2 border-t-2 border-zinc-900">
        <div class="font-bold text-zinc-900 uppercase tracking-wide text-[11px]">
          IN WITNESS WHEREOF, the Parties have executed this Consent.
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-zinc-700 uppercase block">Proposer Signature</span>
            <div class="border-b border-zinc-900 h-8 flex items-end pb-1 font-serif text-sm text-zinc-900">
              ${signedByProposer ? proposer : ""}
            </div>
            <div class="flex justify-between text-[9px] text-zinc-500 pt-0.5">
              <span>Status: ${signedByProposer ? "Signed" : "Pending"}</span>
            </div>
          </div>

          <div class="space-y-1">
            <span class="text-[10px] font-bold text-zinc-700 uppercase block">Consenter Signature</span>
            <div class="border-b border-zinc-900 h-8 flex items-end pb-1 font-serif text-sm text-zinc-900">
              ${signedByConsenter ? consenter : ""}
            </div>
            <div class="flex justify-between text-[9px] text-zinc-500 pt-0.5">
              <span>Status: ${signedByConsenter ? "Signed" : "Pending"}</span>
            </div>
          </div>
        </div>
      </div>
    `,
})


;
}
