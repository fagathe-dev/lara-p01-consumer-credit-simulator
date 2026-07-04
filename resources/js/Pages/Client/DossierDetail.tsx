import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { EspaceClientLayout } from '@/ui';
import { Card } from '@/ui/components/Widgets';
import { Stack, Flex, Grid } from '@/ui/components/Layout';
import { Title, Text } from '@/ui/components/Typography';
import { Button, Badge, type StatusType } from '@/ui/components/Base';
import { EmptyState } from '@/ui/components/Table';

interface Offer {
  ref: string;
  partner: string | null;
  amount: number;
  duration: number;
  monthlyPayment: number;
  apr: number;
  totalCreditCost: number;
  statusLabel: string | null;
  statusBadge: string | null;
}

interface Dossier {
  ref: string;
  projectType: string | null;
  amount: number;
  duration: number;
  statusLabel: string | null;
  createdAt: string | null;
  offers: Offer[];
}

interface PageProps {
  dossier: Dossier;
  auth: {
    user?: { fullName?: string; avatarUrl?: string | null } | null;
  } | null;
  [key: string]: unknown;
}

const euro = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const DossierDetail: React.FC = () => {
  const { dossier, auth } = usePage<PageProps>().props;

  return (
    <EspaceClientLayout
      userName={auth?.user?.fullName}
      avatarUrl={auth?.user?.avatarUrl}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.post('/espace-client/logout')}
        >
          Déconnexion
        </Button>
      }
    >
      <Stack gap={6}>
        <Flex justify="space-between" align="center" gap={4} wrap="wrap">
          <Stack gap={1}>
            <Title as="h1" level={2}>
              {dossier.projectType ?? 'Crédit à la consommation'}
            </Title>
            <Text tone="secondary" size="sm">
              Réf. {dossier.ref}
              {dossier.createdAt ? ` · Créé le ${dossier.createdAt}` : ''}
            </Text>
          </Stack>
          <Button as="a" href="/espace-client" variant="ghost" size="sm">
            Retour aux dossiers
          </Button>
        </Flex>

        <Card variant="elevated">
          <Card.Body>
            <Grid columns={3} gap={4}>
              <Stack gap={0}>
                <Text size="sm" tone="secondary">
                  Montant
                </Text>
                <Text tabular weight="semibold" size="lg">
                  {euro.format(dossier.amount)}
                </Text>
              </Stack>
              <Stack gap={0}>
                <Text size="sm" tone="secondary">
                  Durée
                </Text>
                <Text weight="semibold" size="lg">
                  {dossier.duration} mois
                </Text>
              </Stack>
              <Stack gap={0}>
                <Text size="sm" tone="secondary">
                  Statut
                </Text>
                <Text weight="semibold" size="lg">
                  {dossier.statusLabel ?? '—'}
                </Text>
              </Stack>
            </Grid>
          </Card.Body>
        </Card>

        <Stack gap={2}>
          <Title as="h2" level={4}>
            Offres
          </Title>
          {dossier.offers.length === 0 ? (
            <Card variant="bordered">
              <EmptyState
                title="Aucune offre pour l'instant"
                description="Les offres de nos partenaires s'afficheront ici dès qu'elles seront disponibles."
              />
            </Card>
          ) : (
            <Stack gap={4}>
              {dossier.offers.map((offer) => (
                <Card key={offer.ref} variant="bordered">
                  <Card.Body>
                    <Stack gap={3}>
                      <Flex
                        justify="space-between"
                        align="center"
                        gap={3}
                        wrap="wrap"
                      >
                        <Title as="h3" level={5}>
                          {offer.partner ?? 'Partenaire'}
                        </Title>
                        <Badge
                          variant="status"
                          status={(offer.statusBadge ?? 'info') as StatusType}
                        >
                          {offer.statusLabel ?? '—'}
                        </Badge>
                      </Flex>
                      <Grid columns={4} gap={4}>
                        <Stack gap={0}>
                          <Text size="xs" tone="secondary">
                            Mensualité
                          </Text>
                          <Text tabular weight="semibold">
                            {euro.format(offer.monthlyPayment)}
                          </Text>
                        </Stack>
                        <Stack gap={0}>
                          <Text size="xs" tone="secondary">
                            TAEG
                          </Text>
                          <Text tabular weight="semibold">
                            {offer.apr.toLocaleString('fr-FR', {
                              minimumFractionDigits: 2,
                            })}
                            %
                          </Text>
                        </Stack>
                        <Stack gap={0}>
                          <Text size="xs" tone="secondary">
                            Durée
                          </Text>
                          <Text weight="semibold">{offer.duration} mois</Text>
                        </Stack>
                        <Stack gap={0}>
                          <Text size="xs" tone="secondary">
                            Coût du crédit
                          </Text>
                          <Text tabular weight="semibold">
                            {euro.format(offer.totalCreditCost)}
                          </Text>
                        </Stack>
                      </Grid>
                      <Text size="xs" tone="muted">
                        Réf. offre {offer.ref}
                      </Text>
                    </Stack>
                  </Card.Body>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </EspaceClientLayout>
  );
};

export default DossierDetail;
