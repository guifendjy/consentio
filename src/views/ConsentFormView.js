import E, { $signal } from "minibum";
import { consentFormSchema } from "../assets/consentFormSchema";
import ViewContainer from "../components/ViewContainer";
import DocumentPreview from "../components/DocumentPreview";
import renderField from "../components/RenderField";
import { Modal, Navigator } from "../store";
import { DocumentEngine } from "../store";
import validateStepFields from "../utils/validateStepFields";

/**
 * High-Fidelity Full-Screen Form Wizard Scaffold
 */

const ConsentFormView = () => {
  const currentStepIndex = $signal(0);

  // Data-binding model tracking configuration states
  const formData = {
    proposer: $signal("Alex Johnson"),
    proposerContact: $signal("+1 (555) 123-4567"),
    consenter: $signal("Jamie Rivera"),
    consenterContact: $signal("+1 (555) 987-6543"),

    timeType: $signal("specific"),
    date: $signal({ day: "2026-07-01", from: "18:00", to: "22:00" }),

    acts: $signal(["kissing", "massage", "consensual roleplay"]),
    sexualDevices: $signal("vibrator"),
    specialActivities: $signal("light bondage (wrists only)"),

    contraception: $signal(["condoms", "oral contraceptive"]), // 🎯 Matched
    customContraception: $signal("partner on birth control pill"),

    safewords: $signal("red / yellow / green"),
    aftercare: $signal(
      "hydration, quiet conversation, check-in after 30 minutes",
    ),

    acknowledgment: $signal(true),
  };

  const schemaStepsCount = consentFormSchema.length;
  const totalSteps = consentFormSchema.length + 1;

  const handleBackNavigation = () => {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value -= 1;
    } else {
      // Step 0 reached: Pop completely out of the wizard back to the Dashboard
      Modal.show({
        title: "Leave Form",
        confirmText: "Leave",
        message: "Do you want to leave this view?",
        onConfirm: () => Navigator.pop(),
      });
    }
  };

  const handleNext = () => {
    const currentStepData = consentFormSchema[currentStepIndex.value];

    if (!validateStepFields(currentStepData, formData)) {
      return;
    }

    if (currentStepIndex.value < totalSteps - 1) {
      currentStepIndex.value += 1;
    } else {
      // get values from signals
      const consolidatedValues = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, v.value]),
      );

      DocumentEngine.generateDraft(consolidatedValues);
      Navigator.pop();
    }
  };

  return ViewContainer({
    header: E.cond(currentStepIndex, (index) => {
      const isPreviewStep = index === schemaStepsCount;
      return E.div({
        className: "px-6 pt-10 pb-4 shrink-0 flex flex-col gap-4 z-20",
        children: [
          E.div({
            className: "flex justify-between items-baseline",
            children: [
              E.span({
                className:
                  "text-[11px] font-bold text-zinc-400 uppercase tracking-wider",
                textContent: isPreviewStep
                  ? "Document Preview Mode"
                  : `Step ${index + 1} of ${schemaStepsCount}`,
              }),
              E.span({
                className: "text-xs text-zinc-500 font-medium",
                textContent: isPreviewStep
                  ? "Review Compiled Form"
                  : consentFormSchema[index].subtitle,
              }),
            ],
          }),
          // Progress Track Bar Engine
          E.div({
            className: "flex gap-1.5 w-full",
            children: Array.from({ length: totalSteps }).map((_, stepIdx) => {
              return E.div({
                className: {
                  $static:
                    "h-0.5 flex-1 rounded-full transition-colors duration-200",
                  "bg-zinc-950": currentStepIndex.derived(
                    (curr) => stepIdx <= curr,
                  ),
                  "bg-zinc-200": currentStepIndex.derived(
                    (curr) => stepIdx > curr,
                  ),
                },
              });
            }),
          }),
        ],
      });
    }),
    content: E.div({
      className:
        "flex-1 overflow-y-auto px-6 pt-2 pb-6 no-scrollbar mechanical-scroll-lock",
      children: E.cond(currentStepIndex, (index) => {
        // Condition checking if we have bypassed the schema step count index list arrays
        if (index === schemaStepsCount) {
          return E.div({
            className: "space-y-4 animate-fadeIn",
            children: [
              E.h1({
                className:
                  "text-2xl font-semibold tracking-tight text-zinc-900",
                textContent: "Verify",
              }),
              DocumentPreview(
                Object.fromEntries(
                  Object.entries(formData).map(([k, v]) => [k, v.value]),
                ),
              ),
            ],
          });
        }

        // Standard Schema Fields Iteration Path
        const stepData = consentFormSchema[index];
        return E.div({
          className: "space-y-6",
          children: [
            E.h1({
              className:
                "text-2xl font-semibold tracking-tight text-[#0f0f0f] whitespace-pre-line leading-[1.15]",
              textContent: stepData.title,
            }),
            E.div({
              className: "pt-1 space-y-5",
              children: stepData.fields.map((field) =>
                renderField(field, formData),
              ),
            }),
          ],
        });
      }),
    }),
    footer: E.div({
      className: "p-5 flex gap-3 border-t border-zinc-100 shrink-0 z-20",
      children: [
        E.button({
          type: "button",
          className:
            "flex-1 py-3.5 rounded-full border border-zinc-200 text-zinc-500 text-xs font-medium cursor-pointer active:bg-zinc-50 transition-colors",
          textContent: currentStepIndex.derived((index) =>
            index === 0 ? "Leave" : "Back",
          ),
          onclick: handleBackNavigation,
        }),
        E.button({
          type: "button",
          className:
            "flex-[2] py-3.5 rounded-full bg-zinc-950 text-white text-xs font-medium cursor-pointer active:opacity-90 transition-opacity text-center shadow-sm",
          textContent: currentStepIndex.derived((index) =>
            index === totalSteps - 1 ? "Generate form" : "Continue",
          ),
          onclick: handleNext,
        }),
      ],
    }),
  });
};

export default ConsentFormView;
