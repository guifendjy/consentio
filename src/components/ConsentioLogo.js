import E from "minibum";

/**
 * High-Fidelity Custom Inline SVG Logo for Consentio
 */
const ConsentioLogo = () => {
  return E.div({
    className: "flex items-center gap-3 select-none",
    children: [
      // SVG Icon Wrapper Container
      E.div({
        className: "w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white shadow-sm shrink-0",
        children: [
          E.svg({
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2.25",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "w-[21px] h-[21px]",
            children: [
              // Clean Geometric Shield Contour Path
              E.path({
                d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              }),
              // Embedded Central Verification Checkmark Path
              E.path({
                d: "M9 11l2 2 4-4"
              })
            ]
          })
        ]
      }),
      
      // Typography Title Block
      E.h2({
        className: "text-xl font-semibold tracking-tight text-zinc-900 leading-none",
        textContent: "Consentio"
      })
    ]
  });
};

export default ConsentioLogo;