import E, { $signal } from "minibum";
import ViewContainer from "../components/ViewContainer";
import BackButton from "../components/BackButton";
import { Auth as authSignal } from "../store";

/**
 * High-Fidelity Minimalist Account Settings View Scaffold
 * @param {Object} authSignal - Global authentication state signal (null denotes logged-out)
 */
// Local states for clean configuration toggles
const pushNotifications = $signal(true);
const biometricLock = $signal(false);

// Safely extract active profile info or fallback to defaults
const userEmail = authSignal.derived(
  ({ email }) => email || "alex@example.com",
);
const userName = $signal("Alex Rivera");

const AccountView = () =>
  ViewContainer({
    animation: "slideLeft",
    header: E.div({
      className: "px-5 pt-8 pb-4 flex items-center gap-2",
      children: [
        BackButton(),
        E.h1({
          className: "text-base font-semibold tracking-tight text-[#0f0f0f]",
          textContent: "Account Settings",
        }),
      ],
    }),
    content: E.div({
      className: "flex-1 overflow-y-auto  no-scrollbar space-y-7",
      children: [
        // CATEGORY A: PROFILE IDENTITY
        E.div({
          className: "space-y-3.5",
          children: [
            E.span({
              className:
                "text-[10px] uppercase tracking-wider font-semibold text-zinc-400",
              textContent: "Account Details",
            }),
            E.div({
              className: "space-y-3 pt-4",
              children: [
                E.div({
                  className: "flex flex-col gap-1",
                  children: [
                    E.span({
                      className: "text-[11px] font-semibold text-zinc-500",
                      textContent: "Full name",
                    }),
                    E.p({
                      className: "text-sm text-zinc-900",
                      textContent: userName.value,
                    }),
                  ],
                }),
                E.div({
                  className: "flex flex-col gap-1",
                  children: [
                    E.span({
                      className: "text-[11px] font-semibold text-zinc-500",
                      textContent: "Email address",
                    }),
                    E.p({
                      className: "text-sm text-zinc-900",
                      textContent: userEmail.value,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // CATEGORY B: APP PREFERENCES (Toggles matching native iOS/Android style)
        E.div({
          className: "space-y-2",
          children: [
            E.span({
              className:
                "text-[10px] uppercase tracking-wider font-semibold text-zinc-400",
              textContent: "Preferences",
            }),
            E.div({
              className: "divide-y divide-zinc-100",
              children: [
                // Row 1: Push Notifications
                E.div({
                  className:
                    "flex justify-between items-center py-3.5 cursor-pointer",
                  onclick: () =>
                    (pushNotifications.value = !pushNotifications.value),
                  children: [
                    E.div({
                      className: "flex flex-col gap-0.5",
                      children: [
                        E.span({
                          className: "text-sm font-medium text-zinc-900",
                          textContent: "Push Alerts",
                        }),
                        E.span({
                          className: "text-[11px] text-zinc-400",
                          textContent: "Instant updates on remote signatures",
                        }),
                      ],
                    }),
                    // Minimal Pill Toggle Switch Button
                    E.div({
                      className: {
                        $static:
                          "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 relative",
                        "bg-zinc-950": pushNotifications.derived((v) => v),
                        "bg-zinc-200": pushNotifications.derived((v) => !v),
                      },
                      children: [
                        E.div({
                          className: {
                            $static:
                              "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 absolute top-0.5",
                            "left-[17px]": pushNotifications.derived((v) => v),
                            "left-0.5": pushNotifications.derived((v) => !v),
                          },
                        }),
                      ],
                    }),
                  ],
                }),
                // Row 2: Biometric Access Lock
                E.div({
                  className:
                    "flex justify-between items-center py-3.5 cursor-pointer",
                  onclick: () => (biometricLock.value = !biometricLock.value),
                  children: [
                    E.div({
                      className: "flex flex-col gap-0.5",
                      children: [
                        E.span({
                          className: "text-sm font-medium text-zinc-900",
                          textContent: "Biometric Lock",
                        }),
                        E.span({
                          className: "text-[11px] text-zinc-400",
                          textContent: "Require FaceID / TouchID to open",
                        }),
                      ],
                    }),
                    E.div({
                      className: {
                        $static:
                          "w-9 h-5 rounded-full p-0.5 transition-colors duration-200 relative",
                        "bg-zinc-950": biometricLock.derived((v) => v),
                        "bg-zinc-200": biometricLock.derived((v) => !v),
                      },
                      children: [
                        E.div({
                          className: {
                            $static:
                              "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 absolute top-0.5",
                            "left-[17px]": biometricLock.derived((v) => v),
                            "left-0.5": biometricLock.derived((v) => !v),
                          },
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    footer: E.div({
      className: "p-5 border-t border-zinc-100 shrink-0 ",
      children: [
        E.button({
          type: "button",
          className:
            "w-full py-3.5 rounded-full border border-red-200/60 text-red-600 bg-red-50/20 text-xs font-semibold tracking-wide cursor-pointer active:bg-red-50 transition-colors text-center",
          textContent: "Sign Out",
        }),
      ],
    }),
  });

export default AccountView;
