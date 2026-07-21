import E from "minibum";
import { Navigator } from "../store";

export default function BackButton() {
  return E.button({
    type: "button",
    onclick: () => Navigator.pop(),
    className:
      "w-5 h-5 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 active:scale-90 transition-all cursor-pointer",
    children: [
      E.svg({
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        className: "w-5 h-5",
        children: [
          E.path({
            d: "M15 18l-6-6 6-6",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }),
        ],
      }),
    ],
  });
}
