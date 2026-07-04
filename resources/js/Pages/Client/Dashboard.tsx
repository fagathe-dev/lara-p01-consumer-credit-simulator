import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { EspaceClientLayout } from '@/ui';
import { Card } from '@/ui/components/Widgets';
import { Stack, Flex } from '@/ui/components/Layout';
import { Title, Text, Link as UiLink } from '@/ui/components/Typography';
import { Button, Badge, type StatusType } from '@/ui/components/Base';
import { Alert } from '@/ui/components/Feedback';
import { EmptyState } from '@/ui/components/Table';

interface Offer {
  ref: string;
  partner: string | null;
  amount: number;
  duration: number;
  monthlyPayment: number;
  apr: number;
  statusLabel: string | null;
  statusBadge: string | null;
}

interface Dossier {
  ref: string;
  projectType: string | null;
  amount: number;
  duration: number;
  statusValue: string | null;
  statusLabel: string | null;
  statusBadge: StatusType;
  createdAt: string | null;
  offers: Offer[];
}

interface AuthUser {
  fullName?: string;
  avatarUrl?: string | null;
}

interface PageProps {
  dossiers: Dossier[];
  isRestricted: boolean;
  auth: { user?: AuthUser | null } | null;
  [key: string]: unknown;
}

const euro = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const Dashboard: React.FC = () => {
  const { dossiers, isRestricted, auth } = usePage<PageProps>().props;
  const userName = auth?.user?.fullName;

  const logout = () => router.post('/espace-client/logout');

  return (
    <EspaceClientLayout
      userName={userName}
      avatarUrl={auth?.user?.avatarUrl}
      actions={
        <Flex align="center" gap={2}>
          {!isRestricted && (
            <Button
              as="a"
              href="/espace-client/profil"
              variant="ghost"
              size="sm"
            >
              Mon profil
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={logout}>
            Déconnexion
          </Button>
        </Flex>
      }
    >
      <Stack gap={6}>
        <Stack gap={1}>
          <Title as="h1" level={2}>
            Mes dossiers
          </Title>
          <Text tone="secondary">
            Suivez l'avancement de vos demandes de crédit à la consommation.
          </Text>
        </Stack>

        {isRestricted && (
          <Alert type="info" title="Accès restreint">
            Vous consultez un dossier en accès limité.{' '}
            <UiLink href="/espace-client/creation">
              Créez un espace client
            </UiLink>{' '}
            pour retrouver et suivre l'ensemble de vos dossiers.
          </Alert>
        )}

        {dossiers.length === 0 ? (
          <Card variant="bordered">
            <EmptyState
              title="Aucun dossier"
              description="Vos demandes de crédit apparaîtront ici une fois soumises."
              action={
                <Button
                  as="a"
                  href="/simulation/credit-consommation/"
                  variant="primary"
                >
                  Simuler un crédit
                </Button>
              }
            />
          </Card>
        ) : (
          <Stack gap={4}>
            {dossiers.map((dossier) => (
              <Card key={dossier.ref} variant="elevated">
                <Card.Body>
                  <Stack gap={4}>
                    <Flex
                      justify="space-between"
                      align="flex-start"
                      gap={4}
                      wrap="wrap"
                    >
                      <Stack gap={1}>
                        <Flex align="center" gap={3} wrap="wrap">
                          <Title as="h2" level={5}>
                            {dossier.projectType ?? 'Crédit à la consommation'}
                          </Title>
                          <Badge variant="status" status={dossier.statusBadge}>
                            {dossier.statusLabel ?? '—'}
                          </Badge>
                        </Flex>
                        <Text size="sm" tone="secondary">
                          Réf. {dossier.ref}
                          {dossier.createdAt
                            ? ` · Créé le ${dossier.createdAt}`
                            : ''}
                        </Text>
                      </Stack>
                      <Stack gap={0} align="flex-end">
                        <Text tabular weight="semibold" size="lg">
                          {euro.format(dossier.amount)}
                        </Text>
                        <Text size="sm" tone="secondary">
                          sur {dossier.duration} mois
                        </Text>
                      </Stack>
                    </Flex>

                    {dossier.offers.length > 0 && (
                      <Stack gap={2}>
                        <Text size="sm" weight="semibold">
                          Offres proposées
                        </Text>
                        <Stack gap={2}>
                          {dossier.offers.map((offer) => (
                            <Flex
                              key={offer.ref}
                              justify="space-between"
                              align="center"
                              gap={3}
                              wrap="wrap"
                            >
                              <Flex align="center" gap={2} wrap="wrap">
                                <Text size="sm" weight="medium">
                                  {offer.partner ?? 'Partenaire'}
                                </Text>
                                <Badge
                                  variant="status"
                                  status={
                                    (offer.statusBadge ?? 'info') as StatusType
                                  }
                                  size="sm"
                                >
                                  {offer.statusLabel ?? '—'}
                                </Badge>
                              </Flex>
                              <Text size="sm" tabular tone="secondary">
                                {euro.format(offer.monthlyPayment)}/mois · TAEG{' '}
                                {offer.apr.toLocaleString('fr-FR', {
                                  minimumFractionDigits: 2,
                                })}
                                %
                              </Text>
                            </Flex>
                          ))}
                        </Stack>
                      </Stack>
                    )}

                    <Flex justify="flex-end">
                      <Button
                        as="a"
                        href={`/espace-client/dossiers/${dossier.ref}`}
                        variant="ghost"
                        size="sm"
                      >
                        Voir le détail
                      </Button>
                    </Flex>
                  </Stack>
                </Card.Body>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </EspaceClientLayout>
  );
};

export default Dashboard;
