import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import { Layout } from "@/components/layout/Layout";
import { ToastProvider } from "@/components/ui/Toast";
import { Dashboard } from "@/pages/dashboard";
import { IntegrationDetail } from "@/pages/integration-detail";
import { SyncHistory } from "@/pages/sync-history";
import { ConflictWorkspace } from "@/pages/conflict-workspace";
import { Icon } from "@iconify/react";

function NotFoundPage() {
  return (
    <div className="empty-state" style={{ marginTop: 80 }}>
      <div className="empty-state__icon">
        <Icon icon="mdi:map-search-outline" width={44} />
      </div>
      <div className="empty-state__title">404 – Page not found</div>
      <div className="empty-state__desc">
        The page you're looking for doesn't exist.
      </div>
      <a
        href="/"
        className="btn btn--primary"
        style={{ marginTop: 20, display: "inline-flex" }}
      >
        Go to Integrations
      </a>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/integrations/:id" element={<IntegrationDetail />} />
              <Route path="/conflicts/:id" element={<ConflictWorkspace />} />
              <Route path="/history" element={<SyncHistory />} />
              <Route path="/activity" element={<SyncHistory />} />
              <Route
                path="/settings"
                element={
                  <div className="empty-state" style={{ marginTop: 40 }}>
                    <div className="empty-state__icon">
                      <Icon icon="mdi:cog-outline" width={40} />
                    </div>
                    <div className="empty-state__title">Settings</div>
                    <div className="empty-state__desc">
                      Global workspace configuration coming soon.
                    </div>
                  </div>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
