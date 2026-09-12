import "./style.css";

import E from "minibum";
import AuthView from "./views/SigninRegisterView";
import DashboardView from "./views/DashboardView";
import AccountView from "./views/AccountView";
import CreateFormView from "./views/ConsentFormView";
import ViewContainer from "./components/ViewContainer";
import Loading from "./components/LoadingComponent";
import ZindexWrapper from "./components/IndexLayerWrapper";
import ErrorBanner from "./components/ErrorBanner";
import { Navigator } from "./store";

const App = ViewContainer({
  content: [
    E.list(Navigator.stack, (route, index) => {
      let viewNode;

      switch (route.route) {
        case "loading":
          viewNode = Loading();
          break;
        case "auth":
          viewNode = AuthView();
          break;
        case "home":
          viewNode = DashboardView();
          break;
        case "create-form":
          viewNode = CreateFormView();
          break;
        case "account":
          viewNode = AccountView();
          break;
        default:
          viewNode = AuthView();
      }

      // Wrap every single active view in its own layer calculated by its array index(and applies animation set up using the navigator)
      return ZindexWrapper(viewNode, index * 10, route);
    }),
    ErrorBanner(),
  ],
});

Navigator.push("auth", "fade"); // Start the app with the auth view
document.getElementById("app").appendChild(App.render().element);
