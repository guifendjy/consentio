import E, { $signal } from "minibum";
import ConsentioLogo from "../components/ConsentioLogo";
import ViewContainer from "../components/ViewContainer";
import { Auth as authSignal, onAuthSuccess } from "../store";

/**
 * Authentication View Component
 * @param {Object} authSignal - Minibum signal managing auth state or user data
 * @param {Function} onAuthSuccess - Callback to trigger application login
 */

// Local signal to toggle between Sign In (false) and Register (true)
const isRegister = $signal(false);

// Local form state signals
const email = $signal("alex@example.com");
const password = $signal("password");
const fullName = $signal("");

// Simulated submission handler
const handleSubmit = (e) => {
  e.preventDefault();

  const payload = {
    email: email.value,
    password: password.value,
    ...(isRegister.value && { name: fullName.value }),
  };

  console.log("Authenticating with:", payload);

  // Simulate API call and transition state
  authSignal.value = { email: payload.email, token: "mock-jwt-token" };
  if (onAuthSuccess) onAuthSuccess();
};

const SigninView = () =>
  ViewContainer({
    content: E.div({
      className:
        "h-full flex flex-col justify-between px-4 pt-6 pb-8 text-zinc-950",
      children: [
        E.div({
          className: "flex justify-center mb-6",
          children: [
            E.div({
              className: "flex items-center justify-center",
              style: { transform: "scale(1.15)" },
              children: [ConsentioLogo()],
            }),
          ],
        }),

        E.form({
          className:
            "flex-1 flex flex-col justify-center gap-6 max-w-md w-full mx-auto",
          onsubmit: handleSubmit,
          children: [
            E.div({
              className: "flex gap-3 rounded-full bg-zinc-100 p-1",
              children: [
                E.button({
                  type: "button",
                  className: {
                    $static:
                      "flex-1 text-sm font-semibold rounded-full px-4 py-3 transition",
                    "bg-zinc-950 text-white": isRegister.derived((reg) => !reg),
                    "text-zinc-500 hover:text-zinc-700": isRegister.derived(
                      (reg) => reg,
                    ),
                  },
                  textContent: "Sign in",
                  onclick: () => (isRegister.value = false),
                }),
                E.button({
                  type: "button",
                  className: {
                    $static:
                      "flex-1 text-sm font-semibold rounded-full px-4 py-3 transition",
                    "bg-zinc-950 text-white": isRegister.derived((reg) => reg),
                    "text-zinc-500 hover:text-zinc-700": isRegister.derived(
                      (reg) => !reg,
                    ),
                  },
                  textContent: "Register",
                  onclick: () => (isRegister.value = true),
                }),
              ],
            }),

            E.div({
              className: "space-y-5",
              children: [
                E.div({
                  className: {
                    $static:
                      "flex flex-col gap-2 rounded-3xl border border-zinc-200 bg-zinc-50 p-4 transition-all",
                    hidden: isRegister.derived((reg) => !reg),
                  },
                  children: [
                    E.label({
                      className:
                        "text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500",
                      textContent: "Full Name",
                    }),
                    E.input({
                      type: "text",
                      placeholder: "Alex Rivera",
                      className:
                        "bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-400 w-full",
                      value: fullName.value,
                      oninput: (e) => (fullName.value = e.target.value),
                    }),
                  ],
                }),
                E.div({
                  className:
                    "flex flex-col gap-2 rounded-3xl border border-zinc-200 bg-zinc-50 p-4",
                  children: [
                    E.label({
                      className:
                        "text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500",
                      textContent: "Email Address",
                    }),
                    E.input({
                      type: "email",
                      required: true,
                      className:
                        "bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-400 w-full",
                      value: email.value,
                      oninput: (e) => (email.value = e.target.value),
                    }),
                  ],
                }),
                E.div({
                  className:
                    "flex flex-col gap-2 rounded-3xl border border-zinc-200 bg-zinc-50 p-4",
                  children: [
                    E.label({
                      className:
                        "text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500",
                      textContent: "Password",
                    }),
                    E.input({
                      type: "password",
                      required: true,
                      className:
                        "bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-400 w-full",
                      value: password.value,
                      oninput: (e) => (password.value = e.target.value),
                    }),
                  ],
                }),
              ],
            }),

            E.div({
              className: "flex flex-col gap-4 mt-1",
              children: [
                E.button({
                  type: "submit",
                  className:
                    "w-full py-4 rounded-full bg-zinc-950 text-white text-sm font-semibold tracking-wide hover:bg-zinc-800 transition-colors shadow-sm",
                  textContent: isRegister.derived((reg) =>
                    reg ? "Create Account" : "Sign In",
                  ),
                }),
                E.button({
                  type: "button",
                  className: {
                    $static:
                      "text-center text-sm text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer self-center",
                    hidden: isRegister.derived((reg) => reg),
                  },
                  textContent: "Forgot password?",
                }),
              ],
            }),
          ],
        }),

        E.div({
          className:
            "flex items-start gap-2.5 max-w-xs mx-auto text-zinc-500 leading-5 text-[11px]",
          children: [
            E.i({
              className: "ti ti-lock text-sm shrink-0 mt-0.5 text-zinc-400",
            }),
            E.span({
              className: "font-sm tracking-wide text-balance text-center",
              textContent:
                "End-to-end encrypted protocol. Your data remains completely confidential and secure.",
            }),
          ],
        }),
      ],
    }),
  });

export default SigninView;
