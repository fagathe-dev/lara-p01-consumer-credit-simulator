import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { AuthLayout } from '@/ui';
import { Card } from '@/ui/components/Widgets';
import { Stack } from '@/ui/components/Layout';
import { Title, Text } from '@/ui/components/Typography';
import { Field, Input } from '@/ui/components/Forms';
import { Button } from '@/ui/components/Base';
import { Alert } from '@/ui/components/Feedback';

interface FlashProps {
  status?: string | null;
}

interface PageProps {
  flash: FlashProps;
  errors: Record<string, string>;
  step?: 'credentials' | '2fa';
  email?: string;
  [key: string]: unknown;
}

const CredentialsForm: React.FC<{ errors: Record<string, string> }> = ({
  errors,
}) => {
  const form = useForm({ email: '', password: '' });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    form.post('/bo/connexion');
  };

  return (
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
            autoComplete="username"
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
            autoComplete="current-password"
            value={form.data.password}
            onChange={(e) => form.setData('password', e.target.value)}
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={form.processing}
        >
          Continuer
        </Button>
      </Stack>
    </form>
  );
};

const TwoFactorForm: React.FC<{ errors: Record<string, string> }> = ({
  errors,
}) => {
  const form = useForm({ code: '' });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    form.post('/bo/connexion/2fa');
  };

  return (
    <form onSubmit={submit} noValidate>
      <Stack gap={4}>
        <Field
          htmlFor="code"
          label="Code de vérification (2FA)"
          required
          error={errors.code}
        >
          <Input
            id="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={form.data.code}
            onChange={(e) => form.setData('code', e.target.value)}
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={form.processing}
        >
          Vérifier et se connecter
        </Button>
      </Stack>
    </form>
  );
};

const ConnexionCrm: React.FC = () => {
  const {
    flash,
    errors,
    step = 'credentials',
    email,
  } = usePage<PageProps>().props;
  const isTwoFactor = step === '2fa';

  return (
    <AuthLayout logo={<Title level={3}>CréditSimul · Back-office</Title>}>
      <Card variant="elevated">
        <Card.Body>
          <Stack gap={6}>
            <Stack gap={1}>
              <Title as="h1" level={3}>
                {isTwoFactor
                  ? 'Vérification en deux étapes'
                  : 'Connexion agent'}
              </Title>
              <Text tone="secondary" size="sm">
                {isTwoFactor
                  ? `Un code de vérification a été envoyé à ${email ?? 'votre adresse email'}.`
                  : 'Espace réservé aux conseillers et administrateurs.'}
              </Text>
            </Stack>

            {flash?.status && <Alert type="info">{flash.status}</Alert>}

            {isTwoFactor ? (
              <TwoFactorForm errors={errors} />
            ) : (
              <CredentialsForm errors={errors} />
            )}
          </Stack>
        </Card.Body>
      </Card>
    </AuthLayout>
  );
};

export default ConnexionCrm;
