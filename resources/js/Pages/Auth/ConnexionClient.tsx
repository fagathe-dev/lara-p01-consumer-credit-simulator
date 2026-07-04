import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { AuthLayout } from '@/ui';
import { Card } from '@/ui/components/Widgets';
import { Stack, Flex } from '@/ui/components/Layout';
import { Title, Text, Link as UiLink } from '@/ui/components/Typography';
import { Field, Input } from '@/ui/components/Forms';
import { Button } from '@/ui/components/Base';
import { Alert } from '@/ui/components/Feedback';

interface FlashProps {
  status?: string | null;
  requiresCode?: boolean;
}

interface PageProps {
  flash: FlashProps;
  errors: Record<string, string>;
  [key: string]: unknown;
}

type Mode = 'password' | 'code';

const ConnexionClient: React.FC = () => {
  const { flash, errors } = usePage<PageProps>().props;
  const [mode, setMode] = React.useState<Mode>('password');
  const codeSent = Boolean(flash?.requiresCode);

  const form = useForm({
    email: '',
    password: '',
    code: '',
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    form.transform((data) =>
      mode === 'password'
        ? { email: data.email, password: data.password }
        : { email: data.email, code: codeSent ? data.code : '' },
    );
    form.post('/espace-client/connexion');
  };

  return (
    <AuthLayout logo={<Title level={3}>CréditSimul</Title>}>
      <Card variant="elevated">
        <Card.Body>
          <Stack gap={6}>
            <Stack gap={1}>
              <Title as="h1" level={3}>
                Connexion à votre espace
              </Title>
              <Text tone="secondary" size="sm">
                Accédez au suivi de vos demandes de crédit.
              </Text>
            </Stack>

            {flash?.status && <Alert type="info">{flash.status}</Alert>}

            <Flex gap={2}>
              <Button
                type="button"
                variant={mode === 'password' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setMode('password')}
              >
                Mot de passe
              </Button>
              <Button
                type="button"
                variant={mode === 'code' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setMode('code')}
              >
                Code unique
              </Button>
            </Flex>

            <form onSubmit={submit} noValidate>
              <Stack gap={4}>
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
                    aria-describedby="email-error"
                  />
                </Field>

                {mode === 'password' && (
                  <Field
                    htmlFor="password"
                    label="Mot de passe"
                    required
                    error={errors.password}
                  >
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={form.data.password}
                      onChange={(e) => form.setData('password', e.target.value)}
                    />
                  </Field>
                )}

                {mode === 'code' && codeSent && (
                  <Field
                    htmlFor="code"
                    label="Code de connexion"
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
                  {mode === 'code' && !codeSent
                    ? 'Recevoir un code'
                    : 'Se connecter'}
                </Button>
              </Stack>
            </form>

            <Text size="sm" tone="secondary">
              Pas encore de compte ?{' '}
              <UiLink href="/espace-client/creation">
                Créer un espace client
              </UiLink>
            </Text>
          </Stack>
        </Card.Body>
      </Card>
    </AuthLayout>
  );
};

export default ConnexionClient;
