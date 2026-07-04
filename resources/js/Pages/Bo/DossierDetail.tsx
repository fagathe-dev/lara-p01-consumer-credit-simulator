import React from 'react';
import { usePage } from '@inertiajs/react';
import { BoShell } from '@/components/Bo/BoShell';
import { Card } from '@/ui/components/Widgets';
import { Stack } from '@/ui/components/Layout';
import { Text } from '@/ui/components/Typography';

interface Dossier {
  ref: string;
  projectType: string | null;
  amount: number;
  statusLabel: string | null;
}

interface PageProps {
  dossier: Dossier;
  [key: string]: unknown;
}

const euro = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const DossierDetail: React.FC = () => {
  const { dossier } = usePage<PageProps>().props;

  return (
    <BoShell title={`Dossier ${dossier.ref}`}>
      <Card variant="bordered">
        <Card.Body>
          <Stack gap={2}>
            <Text>Projet : {dossier.projectType ?? '—'}</Text>
            <Text tabular>Montant : {euro.format(dossier.amount)}</Text>
            <Text>Statut : {dossier.statusLabel ?? '—'}</Text>
          </Stack>
        </Card.Body>
      </Card>
    </BoShell>
  );
};

export default DossierDetail;
