import E from "minibum";
import { ANIMATION_PRESETS } from "../presets";
import { Navigator } from "../store";

const ZindexWrapper = (content, zIndex, route) => {
  const preset = ANIMATION_PRESETS[route.animation] || ANIMATION_PRESETS.none;

  return E.div({
    onMount(t){
      // initialize swipe back gesture for this view container
      Navigator.initSwipeBack(t);
      return ()=> Navigator.destroySwipeBack(t);
    },
    id: `mb-zindex-layer-${route.route}-${zIndex}`,
    className: {
      $static: `mb-zindex-layer-view-wrapper absolute inset-0 w-full h-full ${preset.enter}`,
      [preset.leave]: Navigator.activeExitRoute.derived(
        (r) => r == route.route,
      ),
    },
    style: `z-index: ${zIndex};`, // Inline style ensures dynamic numbers apply correctly
    children: content,
  });
};

export default ZindexWrapper;
