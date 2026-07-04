import React from 'react';
import { usePage } from '@inertiajs/react';
import { BoShell } from '@/components/Bo/BoShell';
import { Card } from '@/ui/components/Widgets';
import { Table, EmptyState } from '@/ui/components/Table';

interface AgentRow {
  ref: string;
  agentId: string | null;
  fullName: string;
  email: string;
  role: string | null;
}

interface PageProps {
  agents: AgentRow[];
  [key: string]: unknown;
}

const Agents: React.FC = () => {
  const { agents } = usePage<PageProps>().props;

  return (
    <BoShell title="Agents" description="Gestion des comptes agents CRM.">
      <Card variant="bordered">
        {agents.length === 0 ? (
          <EmptyState
            title="Aucun agent"
            description="Aucun agent enregistré."
          />
        ) : (
          <Table
            columns={[
              { key: 'agentId', label: 'Matricule' },
              { key: 'fullName', label: 'Nom' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Rôle' },
            ]}
            data={agents}
          />
        )}
      </Card>
    </BoShell>
  );
};

export default Agents;
