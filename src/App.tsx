import {
  Authenticated,
  GitHubBanner,
  Refine,
  WelcomePage,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { authProvider, dataProvider, liveProvider } from "./providers"; // here we do not use ./providers/data because we export from providers (using index.ts)
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Home, ForgotPassword, Login, Register } from "./pages";
import Layout from "./components/layout";
import { resources } from "./config/resources";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={resources} //from 1:27 min
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "kiGLyj-UVjP6v-1e3sA1",
                liveMode: "auto",
              }}
            >
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />} // if not authenticated, we will redirected to login
                    >
                      {/* If authenticated, Will see all the children elements */}
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  {/* index mean path ="/"   */}
                  <Route index element={<Home />} />
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
