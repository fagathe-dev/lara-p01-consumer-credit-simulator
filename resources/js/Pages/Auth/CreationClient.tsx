import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { AuthLayout } from '@/ui';
import { Card } from '@/ui/components/Widgets';
import { Stack, Grid } from '@/ui/components/Layout';
import { Title, Text, Link as UiLink } from '@/ui/components/Typography';
import { Field, Input, Checkbox } from '@/ui/components/Forms';
import { Button } from '@/ui/components/Base';
import { Alert } from '@/ui/components/Feedback';

interface PageProps {
  restrictedDossierRef?: string | null;
  errors: Record<string, string>;
  [key: string]: unknown;
}

const CreationClient: React.FC = () => {
  const { restrictedDossierRef, errors } = usePage<PageProps>().props;

  const form = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    attach_dossier: Boolean(restrictedDossierRef),
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    form.post('/espace-client/creation');
  };

  return (
    <AuthLayout logo={<Title level={3}>CréditSimul</Title>}>
      <Card variant="elevated">
        <Card.Body>
          <Stack gap={6}>
            <Stack gap={1}>
              <Title as="h1" level={3}>
                Créer votre espace client
              </Title>
              <Text tone="secondary" size="sm">
                Retrouvez et suivez toutes vos demandes de crédit en un seul
                endroit.
              </Text>
            </Stack>

            {restrictedDossierRef && (
              <Alert type="info">
                Votre dossier <strong>{restrictedDossierRef}</strong> peut être
                rattaché à ce nouveau compte.
              </Alert>
            )}

            <form onSubmit={submit} noValidate>
              <Stack gap={4}>
                <Grid columns={2} gap={4}>
                  <Field
                    htmlFor="first_name"
                    label="Prénom"
                    required
                    error={errors.first_name}
                  >
                    <Input
                      id="first_name"
                      autoComplete="given-name"
                      value={form.data.first_name}
                      onChange={(e) =>
                        form.setData('first_name', e.target.value)
                      }
                    />
                  </Field>
                  <Field
                    htmlFor="last_name"
                    label="Nom"
                    required
                    error={errors.last_name}
                  >
                    <Input
                      id="last_name"
                      autoComplete="family-name"
                      value={form.data.last_name}
                      onChange={(e) =>
                        form.setData('last_name', e.target.value)
                      }
                    />
                  </Field>
                </Grid>

                <Field
                  htmlFor="email"
                  label="Adresse email"
                  required
                  error={errors.email}
                >
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                  />
                </Field>

                <Field
                  htmlFor="password"
                  label="Mot de passe"
                  required
                  error={errors.password}
                >
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                  />
                </Field>

                <Field
                  htmlFor="password_confirmation"
                  label="Confirmer le mot de passe"
                  required
                  error={errors.password_confirmation}
                >
                  <Input
                    id="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={form.data.password_confirmation}
                    onChange={(e) =>
                      form.setData('password_confirmation', e.target.value)
                    }
                  />
                </Field>

                {restrictedDossierRef && (
                  <Checkbox
                    checked={form.data.attach_dossier}
                    onChange={(e) =>
                      form.setData('attach_dossier', e.target.checked)
                    }
                    label={`Rattacher le dossier ${restrictedDossierRef} à mon compte`}
                  />
                )}

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={form.processing}
                >
                  Créer mon compte
                </Button>
              </Stack>
            </form>

            <Text size="sm" tone="secondary">
              Déjà inscrit ?{' '}
              <UiLink href="/espace-client/connexion">Se connecter</UiLink>
            </Text>
          </Stack>
        </Card.Body>
      </Card>
    </AuthLayout>
  );
};

export default CreationClient;
