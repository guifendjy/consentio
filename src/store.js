// store.js
import { $signal } from "minibum";

// Tracks if a modal is open, what text it should show, and its callback actions
export const confirmModalConfig = $signal({
  isOpen: false,
  title: "",
  message: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  onConfirm: () => {},
  onCancel: () => {},
});

export const Modal = {
  /**
   * Open a re-usable high-fidelity confirmation prompt from anywhere
   */
  show({
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
  }) {
    confirmModalConfig.value = {
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        onConfirm?.();
        Modal.hide();
      },
      onCancel: () => {
        onCancel?.();
        Modal.hide();
      },
    };
  },
  hide() {
    confirmModalConfig.value = { ...confirmModalConfig.value, isOpen: false };
  },
};

export const Navigator = {
  // A signal tracking the full array stack history(will start it empty, then user can decide which view to navigate to initially.)
  stack: $signal([]),
  activeExitRoute: $signal(null),

  push(route, animation = "none", params = {}) {
    Navigator.activeExitRoute.value = null;
    Navigator.stack.value = [
      ...Navigator.stack.value,
      { route, animation, params },
    ];
  },

  pop() {
    return new Promise((resolve) => {
      if (Navigator.stack.value.length) {
        const topItem = Navigator.stack.value[Navigator.stack.value.length - 1];

        Navigator.activeExitRoute.value = topItem.route;

        setTimeout(() => {
          const copy = Navigator.stack.value.slice();
          copy.pop();
          Navigator.stack.value = copy;
          Navigator.activeExitRoute.value = null;

          resolve();
        }, 350);
      } else {
        resolve();
      }
    });
  },
};

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
export const inviteDocuments = $signal([]);

export const DocumentEngine = {
  /**
   * Initial Draft Generation (Triggered at the end of the form wizard)
   */

  generateDraft(formDataValues) {
    const docId = `CF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toLocaleString();
    const token = Math.random().toString(36).substring(2, 15);

    const draftPayload = {
      isMine: false,
      id: docId,
      status: $signal("Pending signatures"), // Reactive status token
      token: token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 Hours from generation

      // Data models extracted directly from the uploaded Jurizmo schema structure
      ...formDataValues,
      createdTimestamp: timestamp,
      signedTimestamp: $signal(null),
    };

    inviteDocuments.value = [draftPayload, ...inviteDocuments.value];
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

  /**
   * Generates and copies an expirable share link to the clipboard
   */
  ShareDocLink(doc) {
    // we will use this to share link to specific document
    // we can allow in app users to find other users with their email or name and then send invite.
  },
};


// services
export const Auth = $signal({ email: "jean123@example.com", password: "1234" });

export function onAuthSuccess() {
  Navigator.pop().then(() => Navigator.push("loading", "fade"));
  setTimeout(
    () => Navigator.pop().then(() => Navigator.push("home", "fade")),
    900,
  );
}
