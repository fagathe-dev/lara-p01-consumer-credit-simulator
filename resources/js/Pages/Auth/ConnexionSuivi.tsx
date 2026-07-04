import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { AuthLayout } from '@/ui';
import { Card } from '@/ui/components/Widgets';
import { Stack } from '@/ui/components/Layout';
import { Title, Text, Link as UiLink } from '@/ui/components/Typography';
import { Field, Input } from '@/ui/components/Forms';
import { Button } from '@/ui/components/Base';
import { Alert } from '@/ui/components/Feedback';

interface FlashProps {
  status?: string | null;
  codeSent?: boolean;
}

interface PageProps {
  flash: FlashProps;
  errors: Record<string, string>;
  [key: string]: unknown;
}

const ConnexionSuivi: React.FC = () => {
  const { flash, errors } = usePage<PageProps>().props;
  const codeSent = Boolean(flash?.codeSent);

  const form = useForm({
    ref: '',
    email: '',
    code: '',
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (codeSent) {
      form.post('/suivi-de-dossier/verify');
    } else {
      form.transform((data) => ({ ref: data.ref, email: data.email }));
      form.post('/suivi-de-dossier/connexion');
    }
  };

  return (
    <AuthLayout logo={<Title level={3}>CréditSimul</Title>}>
      <Card variant="elevated">
        <Card.Body>
          <Stack gap={6}>
            <Stack gap={1}>
              <Title as="h1" level={3}>
                Suivi de dossier
              </Title>
              <Text tone="secondary" size="sm">
                Consultez l'avancement de votre demande avec la référence de
                dossier et votre email.
              </Text>
            </Stack>

            {flash?.status && <Alert type="info">{flash.status}</Alert>}

            <form onSubmit={submit} noValidate>
              <Stack gap={4}>
                <Field
                  htmlFor="ref"
                  label="Référence du dossier"
                  required
                  error={errors.ref}
                >
                  <Input
                    id="ref"
                    value={form.data.ref}
                    onChange={(e) => form.setData('ref', e.target.value)}
                    placeholder="DOSS-…"
                    readOnly={codeSent}
                  />
                </Field>

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
                    readOnly={codeSent}
                  />
                </Field>

                {codeSent && (
                  <Field
                    htmlFor="code"
                    label="Code reçu par email"
                    required
                    error={errors.code}
                  >
                    <Input
                      id="code"
                      inputMode="numeric"
                      value={form.data.code}
                      onChange={(e) => form.setData('code', e.target.value)}
                    />
                  </Field>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={form.processing}
                >
                  {codeSent ? 'Accéder au dossier' : 'Recevoir un code'}
                </Button>
              </Stack>
            </form>

            <Text size="sm" tone="secondary">
              Vous avez un compte ?{' '}
              <UiLink href="/espace-client/connexion">
                Se connecter à l'espace client
              </UiLink>
            </Text>
          </Stack>
        </Card.Body>
      </Card>
    </AuthLayout>
  );
};

export default ConnexionSuivi;
