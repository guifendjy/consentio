import E from "minibum";
import { $signal } from "minibum";

const toggleSelection = (signal, item) => {
  const list = [...signal.value];
  const index = list.indexOf(item);
  if (index > -1) list.splice(index, 1);
  else list.push(item);
  signal.value = list;
};

const renderField = (field, formData) => {
  const valueSignal = formData[field.id];

  // 🏷️ Normalize label text layout checking for the optional flag parameter
  const labelText = field.label
    ? `${field.label}${field.optional ? " (optional)" : ""}`
    : "";

  let node = null;

  switch (field.type) {
case "static":
      node = E.div({
        className: "p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-start gap-3",
        children: [
          // Elegant Neutral Subtle Info Icon Accent Token
          E.div({
            className: "w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-500 mt-0.5",
            children: [
              E.svg({
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "w-3 h-3",
                children: [
                  E.circle({ cx: "12", cy: "12", r: "10" }),
                  E.line({ x1: "12", y1: "16", x2: "12", y2: "12" }),
                  E.line({ x1: "12", y1: "8", x2: "12.01", y2: "8" })
                ]
              })
            ]
          }),

          // Typography Text Node Layout Lane
          E.div({
            className: "flex-1 space-y-1",
            children: [
              field.label ? E.h4({
                className: "text-xs font-semibold text-zinc-900 leading-tight",
                textContent: field.label,
              }) : null,
              E.p({
                className: "text-[11px] text-zinc-500 leading-normal font-normal",
                textContent: field.content || field.description || "",
              }),
            ],
          }),
        ],
      });
      break;
    case "group":
      node = E.div({
        className: "py-2 border-b border-zinc-100 last:border-none",
        children: [
          E.div({
            className: "text-xs font-semibold text-zinc-900 mb-3",
            textContent: labelText, // Group header normalized label
          }),
          E.div({
            className: "space-y-4 pl-1",
            children: field.children.map((child) =>
              renderField(child, formData),
            ),
          }),
        ],
      });
      break;

    case "text":
      node = E.div({
        className: "flex flex-col gap-1.5",
        children: [
          E.label({
            className: "text-[11px] font-medium text-zinc-400",
            textContent: labelText,
          }),
          E.input({
            type: "text",
            placeholder: field.placeholder || "",
            className:
              "bg-transparent border-b border-[#e0e0e0] pb-2 pt-0.5 text-sm text-[#0f0f0f] outline-none focus:border-zinc-950 transition-colors w-full rounded-none",
            value: valueSignal.value,
            oninput: (e) => (valueSignal.value = e.target.value),
          }),
        ],
      });
      break;

    case "date":
      // Fallback structural safety initialization
      if (!valueSignal.value || typeof valueSignal.value !== "object") {
        valueSignal.value = { day: "", from: "", to: "" };
      }

      node = E.div({
        className: "flex flex-col gap-3",
        children: [
          E.label({
            className: "text-[11px] font-medium text-zinc-400",
            textContent: labelText,
          }),
          E.div({
            className: "grid grid-cols-12 gap-3 items-end",
            children: [
              // 📅 Date Day Picker Column Lane
              E.div({
                className: "col-span-6 flex flex-col gap-1",
                children: [
                  E.span({
                    className: "text-[10px] text-zinc-400 font-normal",
                    textContent: "Date",
                  }),
                  E.input({
                    type: "date",
                    className:
                      "bg-transparent border-b border-[#e0e0e0] pb-2 pt-0.5 text-sm text-[#0f0f0f] outline-none focus:border-zinc-950 transition-colors w-full rounded-none min-h-[32px]",
                    value: valueSignal.derived((v) => v?.day || ""),
                    oninput: (e) => {
                      valueSignal.value = {
                        ...valueSignal.value,
                        day: e.target.value,
                      };
                    },
                  }),
                ],
              }),

              // ⏱️ Start Time Column Lane ("from" clause)
              E.div({
                className: "col-span-3 flex flex-col gap-1",
                children: [
                  E.span({
                    className: "text-[10px] text-zinc-400 font-normal",
                    textContent: "From",
                  }),
                  E.input({
                    type: "time",
                    className:
                      "bg-transparent border-b border-[#e0e0e0] pb-2 pt-0.5 text-sm text-[#0f0f0f] outline-none focus:border-zinc-950 transition-colors w-full rounded-none min-h-[32px]",
                    value: valueSignal.derived((v) => v?.from || ""),
                    oninput: (e) => {
                      const newFrom = e.target.value;
                      const currentTo = valueSignal.value?.to || "";

                      // 🛑 Force "to" forward if the incoming "from" surpasses it
                      const updatedTo =
                        currentTo && currentTo < newFrom ? newFrom : currentTo;

                      valueSignal.value = {
                        ...valueSignal.value,
                        from: newFrom,
                        to: updatedTo,
                      };
                    },
                  }),
                ],
              }),

              // ⏱️ End Time Column Lane ("to" clause)
              E.div({
                className: "col-span-3 flex flex-col gap-1",
                children: [
                  E.span({
                    className: "text-[10px] text-zinc-400 font-normal",
                    textContent: "To",
                  }),
                  E.input({
                    type: "time",
                    className:
                      "bg-transparent border-b border-[#e0e0e0] pb-2 pt-0.5 text-sm text-[#0f0f0f] outline-none focus:border-zinc-950 transition-colors w-full rounded-none min-h-[32px]",
                    value: valueSignal.derived((v) => v?.to || ""),
                    oninput: (e) => {
                      const newTo = e.target.value;
                      const currentFrom = valueSignal.value?.from || "";

                      // 🛑 Reject and reset the input back if it is less than "from" baseline
                      if (newTo && currentFrom && newTo < currentFrom) {
                        e.target.value = currentFrom;
                        return;
                      }

                      valueSignal.value = {
                        ...valueSignal.value,
                        to: newTo,
                      };
                    },
                  }),
                ],
              }),
            ],
          }),
        ],
      });
      break;

    case "multi-select":
      node = E.div({
        className: "flex flex-col gap-3",
        children: [
          E.label({
            className: "text-[11px] font-medium text-zinc-400",
            textContent: labelText,
          }),
          E.div({
            className: "flex flex-wrap gap-2",
            children: field.options.map((option) => {
              return E.button({
                type: "button",
                className: {
                  $static:
                    "px-3.5 py-1.5 rounded-full text-xs border font-medium transition-all cursor-pointer duration-150",
                  "border-zinc-950 bg-zinc-950 text-white": valueSignal.derived(
                    (arr) => arr.includes(option),
                  ),
                  "border-zinc-200 text-zinc-500 hover:border-zinc-400 bg-white":
                    valueSignal.derived((arr) => !arr.includes(option)),
                },
                textContent: option,
                onclick: () => toggleSelection(valueSignal, option),
              });
            }),
          }),
        ],
      });
      break;
    case "checkbox":
      node = E.label({
        className: "flex items-start gap-3 py-3.5 cursor-pointer group w-full",
        children: [
          E.input({
            type: "checkbox",
            checked: valueSignal.value,
            className:
              "w-5 h-5 mt-0.5 accent-zinc-950 border-zinc-300 rounded focus:ring-zinc-950",
            onchange: (e) => (valueSignal.value = e.target.checked),
          }),
          E.div({
            className: "flex flex-col gap-0.5",
            children: [
              E.span({
                className: "text-sm font-medium text-zinc-900 leading-tight",
                textContent: field.label,
              }),
              field.description &&
                E.span({
                  className: "text-xs text-zinc-500 leading-normal",
                  textContent: field.description,
                }),
            ],
          }),
        ],
      });
      break;
    case "radio":
      node = E.div({
        className: "flex flex-col gap-1",
        children: [
          E.label({
            className: "text-[11px] font-medium text-zinc-400 mb-1",
            textContent: labelText,
          }),
          E.div({
            className: "divide-y divide-zinc-50",
            children: field.options.map((opt) => {
              return E.label({
                className:
                  "flex items-start gap-3 py-3.5 cursor-pointer group w-full",
                onclick: () => (valueSignal.value = opt.value),
                children: [
                  E.div({
                    className: {
                      $static:
                        "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                      "border-zinc-950": valueSignal.derived(
                        (v) => v === opt.value,
                      ),
                      "border-zinc-300 bg-white": valueSignal.derived(
                        (v) => v !== opt.value,
                      ),
                    },
                    children: [
                      E.div({
                        className: {
                          $static:
                            "w-2 h-2 rounded-full bg-zinc-950 transition-transform",
                          "scale-100": valueSignal.derived(
                            (v) => v === opt.value,
                          ),
                          "scale-0": valueSignal.derived(
                            (v) => v !== opt.value,
                          ),
                        },
                      }),
                    ],
                  }),
                  E.div({
                    className: "flex flex-col gap-0.5",
                    children: [
                      E.span({
                        className: "text-xs font-medium text-zinc-900",
                        textContent: opt.label,
                      }),
                      E.span({
                        className:
                          "text-[11px] text-zinc-400 font-normal leading-normal",
                        textContent: opt.description,
                      }),
                    ],
                  }),
                ],
              });
            }),
          }),
        ],
      });
      break;

    default:
      node = null;
  }

  const dependsOn = $signal(false);
  if (field.dependsOn) {
    formData[field.dependsOn.field].bind((v) => {
      dependsOn.value = v !== field.dependsOn.value;
    });
  }
  return E.div({ className: { hidden: dependsOn }, children: node });
};

export default renderField;
