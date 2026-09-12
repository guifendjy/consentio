// store.js
import { $signal } from "minibum";

const swipeState = {
  startX: null,
  startY: null,
  hasMoved: false,
  targetElement: null,
};

const SWIPE_BACK_EDGE_THRESHOLD = 40;
const SWIPE_BACK_DISTANCE_THRESHOLD = 90;
const SWIPE_BACK_VERTICAL_LIMIT = 120;



function resetSwipeTarget() {
  if (swipeState.targetElement) {
    swipeState.targetElement.style.transform = "";
    swipeState.targetElement.style.transition = "";
    swipeState.targetElement.style.opacity = "";
    swipeState.targetElement.style.boxShadow = "";
    swipeState.targetElement = null;
  }
}

function dismissSwipeTarget() {
  if (swipeState.targetElement) {
    swipeState.targetElement.style.transition = "transform 0ms ease-out, opacity 0ms ease-out";
    swipeState.targetElement.style.transform = "translateX(100vw)";
    swipeState.targetElement.style.opacity = "0";
    swipeState.targetElement.style.boxShadow = "inset -10px 0 20px rgba(0, 0, 0, 0.08)";
    swipeState.targetElement = null;
  }
}

function findSwipeTarget(element) {
  let current = element instanceof Element ? element : null;
  let fallback = current;

  while (current && current !== document && current !== document.documentElement) {
    const style = getComputedStyle(current);
    if (style.position === "absolute" || style.position === "fixed") {
      return current;
    }
    fallback = current;
    current = current.parentElement;
  }

  return fallback;
}

function handleSwipeStart(event) {
  if ( Navigator.stack.value.length <= 1) {
    swipeState.startX = null;
    swipeState.targetElement = null;
    return;
  }
  const touch = event.touches?.[0] || event;
  if (touch.clientX > SWIPE_BACK_EDGE_THRESHOLD) {
    swipeState.startX = null;
    swipeState.targetElement = null;
    return;
  }
  swipeState.startX = touch.clientX;
  swipeState.startY = touch.clientY;
  swipeState.hasMoved = false;
  swipeState.targetElement = findSwipeTarget(event.target);
}

function handleSwipeMove(event) {
  if (swipeState.startX === null) return;
  const touch = event.touches?.[0] || event;
  const deltaY = touch.clientY - swipeState.startY;
  if (Math.abs(deltaY) > SWIPE_BACK_VERTICAL_LIMIT) {
    swipeState.startX = null;
    swipeState.startY = null;
    resetSwipeTarget();
    return;
  }

  const deltaX = touch.clientX - swipeState.startX;
  if (swipeState.targetElement && deltaX > 0) {
    swipeState.targetElement.style.transform = `translateX(${deltaX}px)`;
    swipeState.targetElement.style.boxShadow = "inset -10px 0 20px rgba(0, 0, 0, 0.08)";
  }
  swipeState.hasMoved = true;
}

function handleSwipeEnd(event) {
  if (swipeState.startX === null) return;
  const touch = event.changedTouches?.[0] || event;
  const deltaX = touch.clientX - swipeState.startX;
  const deltaY = touch.clientY - swipeState.startY;

  if (
    swipeState.hasMoved &&
    swipeState.startX <= SWIPE_BACK_EDGE_THRESHOLD &&
    deltaX > SWIPE_BACK_DISTANCE_THRESHOLD &&
    Math.abs(deltaY) < SWIPE_BACK_VERTICAL_LIMIT
  ) {
    if (Navigator.stack.value.length > 1) {
      dismissSwipeTarget();
      Navigator.pop();
    }
  }

  resetSwipeTarget();
  swipeState.startX = null;
  swipeState.startY = null;
  swipeState.hasMoved = false;
}

function buildURL(route, params = {}) {
  const normalizedRoute = route ? `/${route.replace(/^\/+/g, "")}` : "/";
  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();
  return normalizedRoute + (query ? `?${query}` : "");
}

// function parseSearchParams(search = "") {
//   const params = {};
//   const searchParams = new URLSearchParams(search.replace(/^\?/, ""));
//   for (const [key, value] of searchParams.entries()) {
//     params[key] = value;
//   }
//   return params;
// }

// function parseRouteFromLocation(pathname = "/") {
//   const route = pathname.replace(/^\/+/g, "").replace(/\/+$/g, "");
//   return route || "/";
// }

// function getInitialNavigatorStack() {
//   if (typeof window === "undefined") {
//     return [{ route: "/", animation: "none", params: {} }];
//   }

//   const navigatorState = window.history.state?.navigator;
//   if (navigatorState?.stack?.length) {
//     return navigatorState.stack;
//   }

//   return [
//     {
//       route: parseRouteFromLocation(window.location.pathname),
//       animation: "none",
//       params: parseSearchParams(window.location.search),
//     },
//   ];
// }

// function replaceCurrentHistoryState(stack) {
//   if (typeof window === "undefined" || !window.history.replaceState) return;

//   const currentEntry = stack[stack.length - 1] || {
//     route: "/",
//     params: {},
//   };

//   window.history.replaceState(
//     { navigator: { stack } },
//     "",
//     buildURL(currentEntry.route, currentEntry.params),
//   );
// }

export const Navigator = {
  // A signal tracking the full array stack history(will start it empty, then user can decide which view to navigate to initially.)
  stack: $signal([]),
  activeExitRoute: $signal(null),
  push(route, animation = "none", params = {}) {
    Navigator.activeExitRoute.value = null;
    const nextStack = [
      ...Navigator.stack.value,
      { route, animation, params },
    ];

    Navigator.stack.value = nextStack;

    // if (typeof window !== "undefined" && window.history?.pushState) {
    //   window.history.pushState({ navigator: { stack: nextStack } }, "", buildURL(route, params));
    // }
  },

  pop(timeout = 350) {
    return new Promise((resolve) => {
      if (Navigator.stack.value.length) {
        const topItem = Navigator.stack.value[Navigator.stack.value.length - 1];

        Navigator.activeExitRoute.value = topItem.route;

        setTimeout(() => {
          const nextStack = Navigator.stack.value.slice();
          nextStack.pop();
          Navigator.stack.value = nextStack;
          Navigator.activeExitRoute.value = null;

            //  if (typeof window !== "undefined" && window.history?.pushState) {
            //     window.history.pushState({ navigator: { stack: nextStack } }, "", buildURL(nextStack.at(-1)?.route, nextStack.at(-1)?.params));
            // }
          resolve();
        }, timeout);
      } else {
        resolve();
      }
    });
  },

  initSwipeBack(target = typeof window !== "undefined" ? window : null) {
    if (!target || !target.addEventListener) return;

    target.addEventListener("touchstart", handleSwipeStart, { passive: true });
    target.addEventListener("touchmove", handleSwipeMove, { passive: true });
    target.addEventListener("touchend", handleSwipeEnd);
    target.addEventListener("pointerdown", handleSwipeStart);
    target.addEventListener("pointermove", handleSwipeMove);
    target.addEventListener("pointerup", handleSwipeEnd);
  },

  destroySwipeBack(target = typeof window !== "undefined" ? window : null) {
    if (!target || !target.removeEventListener) return;

    target.removeEventListener("touchstart", handleSwipeStart, { passive: true });
    target.removeEventListener("touchmove", handleSwipeMove, { passive: true });
    target.removeEventListener("touchend", handleSwipeEnd);
    target.removeEventListener("pointerdown", handleSwipeStart);
    target.removeEventListener("pointermove", handleSwipeMove);
    target.removeEventListener("pointerup", handleSwipeEnd);
  },
};





// App state
export const errorConfig = $signal({
  visible: false,
  isLeaving: false,
  message: "",
});

let errorTimeout = null;
export const Alert = {
  /**
   * Trigger a premium attention-grabbing error banner from anywhere in the app
   * @param {string} message - The localized error text string to display
   */
  show(message) {
    // Clear any pending dismissal timeouts if an error is already showing
    if (errorTimeout) clearTimeout(errorTimeout);

    errorConfig.value = {
      ...errorConfig.value,
      visible: true,
      message,
    };

    // Automatically dismiss the banner cleanly after 4 seconds
    errorTimeout = setTimeout(() => {
      Alert.hide();
    }, 4000);
  },

  hide() {
    errorConfig.value = {
      ...errorConfig.value,
      isLeaving: true,
    };
    // allow leaving animation sometime
    setTimeout(() => {
      errorConfig.value = {
        ...errorConfig.value,
        isLeaving: false,
        visible: false,
      };
    }, 350);
  },
};




export const generatedDocuments = $signal([]);
export const sharedDocuments = $signal([]);

export const DocumentEngine = {
  /**
   * Initial Draft Generation (Triggered at the end of the form wizard)
   */

  generateDraft(formDataValues) {
    const docId = `CF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleString();
    const token = Math.random().toString(36).substring(2, 15);
    const shareCode = "code" // this code will be used to share the document with the partner, and they can use it to access the document and sign it.

    const draftPayload = {
      id: docId,
      status: $signal("Pending signatures"), // Reactive status token
      token: token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 Hours from generation

      // Data models extracted directly from the uploaded Jurizmo schema structure
      ...formDataValues,
      createdTimestamp: timestamp,
      signedTimestamp: $signal(null),
    };

    // here we will do network request to save the document to the backend,
    //  and then we will update the generatedDocuments signal with the new document.
    //  and show error if the request fails. but for now we will just update the signal directly.
    // since this is gonna be a pwa, we will use local storage to save the documents, and then we will sync them with the backend when the user is online.
    generatedDocuments.value = [draftPayload, ...generatedDocuments.value];
    return draftPayload;
  },

  /**
   * Finalizes the document state upon valid signature capture
   */
  executeSignature(doc, consenterSignatureName) {
    if (!consenterSignatureName.trim()) {
      Alert.show("Please enter a valid partner signature authorization name.");
      return false;
    }
    doc.status.value = "Verified & Signed";
    doc.signedTimestamp.value = new Date().toLocaleString();
    return true;
  },
};


// services
export const Auth = $signal({ email: "jean123@example.com", password: "1234" });

export function onAuthSuccess() {
  Navigator.pop().then(() => Navigator.push("loading", "fade"));
  setTimeout(
    () => Navigator.pop().then(() => Navigator.push("home", "fade")),
    400,
  );
}
