import E from "minibum";
import ViewContainer from "./ViewContainer";

/**
 * High-Fidelity Minimalist Mobile Loading / Splash View
 */
const LoadingComponent = () =>
  ViewContainer({
    animation: { enter: "scaleUp" },
    content: E.div({
      className:
        "w-full h-full min-h-[400px] flex flex-col items-center justify-center gap-5 select-none",
      children: [
        // Brand Mark Container with a subtle pulse transition effect
        E.div({
          className: "flex flex-col items-center gap-3.5 animate-pulse",
          children: [
            // Custom Engineered SVG Logo Badge Block
            E.div({
              className:
                "w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-white shadow-md",
              children: [
                E.svg({
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2.5",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "w-[26px] h-[26px]",
                  children: [
                    // Precision Shield Contour Path
                    E.path({
                      d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
                    }),
                    // Embedded Central Verification Checkmark Path
                    E.path({
                      d: "M9 11l2 2 4-4",
                    }),
                  ],
                }),
              ],
            }),

            // App Title Typography Token
            E.h2({
              className:
                "text-lg font-semibold tracking-tight text-zinc-900 leading-none",
              textContent: "Consentio",
            }),
          ],
        }),

        // Native-style iOS Indeterminate Activity Indicator Spinner
        E.div({
          className:
            "w-4 h-4 rounded-full border-2 border-zinc-200 border-t-zinc-950 animate-spin",
        }),
      ],
    }),
  });

export default LoadingComponent;
