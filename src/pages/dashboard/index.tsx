import { useMemo } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useIntegrations } from "@/hooks/queries/useIntegrations";
import { useIntegrationStore } from "@/stores/useIntegrationStore";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { IntegrationFilters } from "@/components/integrations/IntegrationFilters";
import { IntegrationCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { FullErrorState } from "@/components/ui/ErrorState";

export function Dashboard() {
  const navigate = useNavigate();
  const { data: integrations, isLoading, error, refetch } = useIntegrations();
  const { activeFilter, setActiveFilter } = useIntegrationStore();

  const filtered = useMemo(() => {
    if (!integrations) return [];
    if (activeFilter === "all") return integrations;
    return integrations.filter((i) => i.status === activeFilter);
  }, [integrations, activeFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: integrations?.length ?? 0 };
    integrations?.forEach((i) => {
      c[i.status] = (c[i.status] ?? 0) + 1;
    });
    return c;
  }, [integrations]);

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="page-header__left">
          <h1>Integrations</h1>
          <p>
            Manage and monitor operational data bridges between your tech stack.
          </p>
        </div>
        <div className="page-header__right">
          <button
            className="btn btn--primary"
            onClick={() => navigate("/connect")}
          >
            <Icon icon="mdi:plus" width={16} />
            Connect New App
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <IntegrationFilters
        active={activeFilter}
        onChange={setActiveFilter}
        counts={counts}
      />

      {/* Content */}
      {isLoading ? (
        <IntegrationCardSkeleton />
      ) : error ? (
        <FullErrorState error={error} onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state__icon">
              <Icon icon="mdi:filter-off-outline" width={40} />
            </div>
            <div className="empty-state__title">
              No integrations match this filter
            </div>
            <div className="empty-state__desc">
              Try selecting "All" to see all integrations.
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card integration-list">
            {filtered.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
