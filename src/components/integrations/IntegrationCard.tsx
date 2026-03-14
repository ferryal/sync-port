import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import type { Integration } from "@/lib/schemas";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface IntegrationCardProps {
  integration: Integration;
}

export function IntegrationCard({ integration }: IntegrationCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="integration-item"
      onClick={() => navigate(`/integrations/${integration.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div
        className="integration-item__icon"
        style={{ background: `${integration.color}15` }}
      >
        <Icon icon={integration.icon} width={28} color={integration.color} />
      </div>

      <div className="integration-item__info">
        <div className="integration-item__name-row">
          <span className="integration-item__name">{integration.name}</span>
          <span className="integration-item__version">
            {integration.version}
          </span>
        </div>
        <div className="integration-item__desc">{integration.description}</div>
      </div>

      <div className="integration-item__status">
        <StatusBadge status={integration.status} />
        <span className="integration-item__last-sync">
          {integration.status === "syncing"
            ? "Last Sync: In progress"
            : `Last Sync: ${integration.lastSync}`}
        </span>
      </div>

      <div className="integration-item__actions">
        <button
          className="btn btn--primary btn--sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/integrations/${integration.id}`);
          }}
        >
          Open
        </button>
        {/* <button
          className="btn btn--ghost btn--icon btn--sm"
          onClick={(e) => e.stopPropagation()}
          aria-label="More options"
        >
          <Icon icon="mdi:dots-vertical" width={16} />
        </button> */}
      </div>
    </div>
  );
}
