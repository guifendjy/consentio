// config/consentFormSchema.js

export const consentFormSchema = [
  {
    id: "parties",
    title: "Who's involved?",
    subtitle: "About Us",
    fields: [
      {
        id: "proposerGroup", // Pure layout block identity
        type: "group",
        label: "You (Proposer)",
        children: [
          {
            id: "proposer", // 🎯 Updated from proposerName to match draftPayload directly
            type: "text",
            label: "Full name",
            placeholder: "Alex Rivera",
          },
          {
            id: "proposerContact", // 🎯 Already matches draftPayload
            type: "text",
            label: "Email or phone",
            placeholder: "alex@example.com",
          },
        ],
      },
      {
        id: "consenterGroup", // Pure layout block identity
        type: "group",
        label: "Your Partner",
        children: [
          {
            id: "consenter", // 🎯 Updated from consenterName to match draftPayload directly
            type: "text",
            label: "Full name",
            placeholder: "Taylor Chen",
          },
          {
            id: "consenterContact", // 🎯 Already matches draftPayload
            type: "text",
            label: "Email or phone",
            placeholder: "taylor@example.com",
          },
        ],
      },
    ],
  },

  {
    id: "timing",
    title: "When does this apply?",
    subtitle: "Timeline",
    fields: [
      {
        id: "timeType",
        type: "radio",
        label: "How long is this agreement for?",
        options: [
          {
            value: "specific",
            label: "One specific occasion",
            description: "For a particular date and time window",
          },
          {
            value: "term",
            label: "Ongoing relationship",
            description:
              "Applies during our relationship until we change or end it",
          },
        ],
      },
      {
        id: "date",
        type: "date",
        label: "Date & Time",
        dependsOn: { field: "timeType", value: "specific" },
      },
    ],
  },

  {
    id: "activities",
    title: "What are we excited about?",
    subtitle: "Activities",
    fields: [
      {
        id: "acts",
        type: "multi-select",
        label: "Activities we're both saying yes to (choose all that apply)",
        options: [
          "Full-body touching (external only)",
          "Kissing",
          "Sexual penetration",
          "Vaginal sex",
          "Oral sex",
          "Anal sex",
        ],
      },
      {
        id: "instructions",
        label: "Any special requests or notes?",
        type: "group",
        children: [
          {
            id: "sexualDevices",
            type: "text",
            label: "Toys or devices we can use",
            placeholder: "Vibrator, blindfold, etc.",
            optional: true,
          },
          {
            id: "specialActivities",
            type: "text",
            label: "Other activities or special instructions",
            placeholder: "e.g. gentle kissing on neck, specific positions...",
            optional: true,
          },
        ],
      },
    ],
  },

  {
    id: "protection",
    title: "Safety first",
    subtitle: "Protection",
    fields: [
      {
        id: "contraception", // 🎯 Updated from contraceptionMethods to match draftPayload directly
        type: "multi-select",
        label: "Protection methods we'll use (choose all that apply)",
        options: [
          "Condom",
          "Diaphragm",
          "Contraceptive ring",
          "Oral contraceptives",
          "Intrauterine device (IUD)",
          "Contraceptive implant",
          "Contraceptive injection",
          "Emergency contraception pill",
        ],
      },
      {
        id: "customContraception",
        type: "text",
        label: "Other protection or safety notes",
        placeholder: "Dental dam, PrEP, etc.",
        optional: true,
      },
    ],
  },

  {
    id: "communication",
    title: "How we'll stay connected",
    subtitle: "Check-ins & Boundaries",
    fields: [
      {
        id: "safewords",
        type: "text",
        label: "Our safewords or signals",
        placeholder: "Red = stop, Yellow = slow down, Green = all good",
        description:
          "Highly recommended: Use traffic light system or custom words/gestures",
      },
      {
        id: "aftercare",
        type: "text",
        label: "Aftercare preferences",
        placeholder: "Cuddling, water, quiet time, check-in conversation...",
        optional: true,
      },
    ],
  },
  {
    id: "clauses",
    title: "Important reminders",
    subtitle: "Consent Basics",
    fields: [
      {
        id: "withdrawalNote",
        type: "static",
        label: "Consent can be withdrawn anytime",
        content:
          "We both understand that consent can be withdrawn at any time, for any reason, without explanation. When someone says stop — verbally or using our agreed signal — we stop immediately and take care of each other.",
      },
      {
        id: "unexpectedNote",
        type: "static",
        label: "If something unexpected happens",
        content:
          "Sex can be unpredictable. If a boundary is crossed accidentally, we agree to pause, check in kindly with each other, and decide together how to move forward — with no blame.",
      },
      {
        id: "acknowledgment",
        type: "checkbox",
        label: "I understand and agree to the above",
        description: "This is our shared commitment to respect each other",
      },
    ],
  },
];
