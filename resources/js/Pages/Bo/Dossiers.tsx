import React from 'react';
import { usePage } from '@inertiajs/react';
import { BoShell } from '@/components/Bo/BoShell';
import { Card } from '@/ui/components/Widgets';
import { Table } from '@/ui/components/Table';
import { EmptyState } from '@/ui/components/Table';

interface DossierRow {
  ref: string;
  projectType: string | null;
  amount: number;
  statusLabel: string | null;
}

interface PageProps {
  dossiers: DossierRow[];
  [key: string]: unknown;
}

const euro = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const Dossiers: React.FC = () => {
  const { dossiers } = usePage<PageProps>().props;

  return (
    <BoShell title="Dossiers" description="Liste des dossiers de crédit.">
      <Card variant="bordered">
        {dossiers.length === 0 ? (
          <EmptyState
            title="Aucun dossier"
            description="Aucun dossier à afficher pour le moment."
          />
        ) : (
          <Table
            columns={[
              { key: 'ref', label: 'Référence' },
              { key: 'projectType', label: 'Projet' },
              {
                key: 'amount',
                label: 'Montant',
                numeric: true,
                render: (value) => euro.format(Number(value)),
              },
              { key: 'statusLabel', label: 'Statut' },
            ]}
            data={dossiers}
          />
        )}
      </Card>
    </BoShell>
  );
};

export default Dossiers;
