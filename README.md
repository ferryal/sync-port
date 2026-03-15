# Sync Port

A modern React application designed to manage, preview, and selectively approve incoming synchronization data from various 3rd party integrations including Salesforce, HubSpot, Stripe, Slack, Zendesk, and Intercom. 

## 🚀 Features

- **Dashboard:** At-a-glance view of all your application integrations, their system health, and current sync status (Synced, Syncing, Conflict, Error).
- **Integration Detail:** Deep-dive into specific integrations. Review metrics, recent activities, and fetch new data seamlessly.
- **Sync Approval Workflow:** 
  - Preview incoming `ADD`, `DELETE`, and non-conflicting `UPDATE` changes.
  - Granularly review what your database will look like using intuitive Git-style diffs (red for removals, green for additions).
  - Multi-select and batch approve. 
- **Conflict Resolution Workspace:**
  - Dedicated UI for handling `UPDATE` conflicts (where the external source differs from your local database).
  - Side-by-side value comparisons with visual indicators.
  - Instantly select "Keep mine" or "Accept incoming" with real-time text styles showing exactly what will happen.
- **Forensic Sync History:**
  - Persistent, tamper-evident log of all historic syncs and conflict resolutions.
  - Interactive "Version Diff Viewer" to see the exact snapshot payload that was committed into the database following an approval or resolution.

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Vanilla CSS w/ rich custom tokens (Dark/Light mode ready)
- **State Management:** Zustand (Stores for Integration, Sync Approval, and Conflict Resolution)
- **Data Fetching:** TanStack React Query (`@tanstack/react-query`) for robust API requests and cache management.
- **Routing:** React Router v7
- **Validation:** Zod for API response schemas and types.
- **Icons:** Iconify (`@iconify/react`)

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- `pnpm` (or `npm` / `yarn`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ferryal/sync-port.git
   cd sync-port
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure Environment Variables:
   Copy the example environment variables file and update it if necessary:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

```text
src/
├── api/             # API clients (axios setup)
├── components/      # Reusable UI components
│   ├── approval/    # Sync approval specific components (Change rows, confirm bars)
│   ├── conflict/    # Conflict resolution workspace components 
│   ├── detail/      # Integration detail specific layouts
│   ├── history/     # Diff viewers and forensic tables
│   ├── layout/      # TopNav, layout wrappers
│   └── ui/          # Generic visual components (Buttons, Checkboxes, Toasts)
├── hooks/           # Custom React Query hooks (mutations & queries)
├── lib/             # Utilities, constants, queryKeys, and Zod Schemas
├── mock/            # Initial mock data fallback
├── pages/           # Route-level views
│   ├── conflict-workspace/
│   ├── dashboard/
│   ├── integration-detail/
│   ├── sync-approval/
│   └── sync-history/
└── stores/          # Zustand global state (useConflictStore, useSyncApprovalStore, useIntegrationStore)
```

## 🔄 The Sync Workflow

1. Navigate to an Integration (e.g. `Salesforce`).
2. Click **Sync Now**. The app fires a request to the API.
3. If changes come in cleanly, you're prompted to **Approve All**, routing to the `/approvals/salesforce` page.
4. If there are field collisions, a **Resolve Conflicts** warning alerts you to head into the `/conflicts/salesforce` workspace.
5. After applying changes from either page, a payload record is pushed to the global store and instantly becomes readable under local **Sync History**.
