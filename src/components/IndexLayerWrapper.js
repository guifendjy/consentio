import E from "minibum";
import { ANIMATION_PRESETS } from "../presets";
import { Navigator } from "../store";

const ZindexWrapper = (content, zIndex, route) => {
  const preset = ANIMATION_PRESETS[route.animation] || ANIMATION_PRESETS.none;

  return E.div({
    id: "mb-zindex-layer",
    className: {
      $static: `absolute inset-0 w-full h-full ${preset.enter}`,
      [preset.leave]: Navigator.activeExitRoute.derived(
        (r) => r == route.route,
      ),
    },
    style: `z-index: ${zIndex};`, // Inline style ensures dynamic numbers apply correctly
    children: [content],
  });
};

export default ZindexWrapper;
