import React from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import { EspaceClientLayout } from '@/ui';
import { Card } from '@/ui/components/Widgets';
import { Stack, Grid, Flex } from '@/ui/components/Layout';
import { Title, Text } from '@/ui/components/Typography';
import { Field, Input } from '@/ui/components/Forms';
import { Button } from '@/ui/components/Base';
import { Avatar } from '@/ui/components/Media';
import { Alert } from '@/ui/components/Feedback';

interface Profile {
  ref: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  fullName: string;
}

interface FlashProps {
  status?: string | null;
}

interface PageProps {
  profile: Profile;
  flash: FlashProps;
  errors: Record<string, string>;
  auth: {
    user?: { fullName?: string; avatarUrl?: string | null } | null;
  } | null;
  [key: string]: unknown;
}

const ProfileEdit: React.FC = () => {
  const { profile, flash, errors, auth } = usePage<PageProps>().props;

  const infoForm = useForm({
    first_name: profile.firstName,
    last_name: profile.lastName,
    email: profile.email,
  });

  const passwordForm = useForm({
    first_name: profile.firstName,
    last_name: profile.lastName,
    email: profile.email,
    password: '',
    password_confirmation: '',
  });

  const avatarForm = useForm<{ avatar: File | null }>({ avatar: null });
  const [preview, setPreview] = React.useState<string | null>(
    profile.avatarUrl,
  );

  const onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    avatarForm.setData('avatar', file);
    setPreview(file ? URL.createObjectURL(file) : profile.avatarUrl);
  };

  const submitInfo = (event: React.FormEvent) => {
    event.preventDefault();
    infoForm.put('/espace-client/profil');
  };

  const submitPassword = (event: React.FormEvent) => {
    event.preventDefault();
    passwordForm.put('/espace-client/profil', {
      onSuccess: () => passwordForm.reset('password', 'password_confirmation'),
    });
  };

  const submitAvatar = (event: React.FormEvent) => {
    event.preventDefault();
    avatarForm.post('/espace-client/profil/avatar', { forceFormData: true });
  };

  return (
    <EspaceClientLayout
      userName={auth?.user?.fullName}
      avatarUrl={auth?.user?.avatarUrl}
      actions={
        <Flex align="center" gap={2}>
          <Button as="a" href="/espace-client" variant="ghost" size="sm">
            Mes dossiers
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.post('/espace-client/logout')}
          >
            Déconnexion
          </Button>
        </Flex>
      }
    >
      <Stack gap={6}>
        <Title as="h1" level={2}>
          Mon profil
        </Title>

        {flash?.status && <Alert type="success">{flash.status}</Alert>}

        <Card variant="elevated">
          <Card.Header>Photo de profil</Card.Header>
          <Card.Body>
            <form onSubmit={submitAvatar} noValidate>
              <Flex align="center" gap={6} wrap="wrap">
                <Avatar
                  size="xl"
                  name={profile.fullName}
                  src={preview ?? undefined}
                  alt={profile.fullName}
                />
                <Stack gap={3}>
                  <Field
                    htmlFor="avatar"
                    label="Nouvelle photo (PNG, JPG ou WEBP, 2 Mo max)"
                    error={errors.avatar}
                  >
                    <input
                      id="avatar"
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp"
                      onChange={onAvatarChange}
                    />
                  </Field>
                  <Flex gap={2}>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      isLoading={avatarForm.processing}
                      disabled={!avatarForm.data.avatar}
                    >
                      Enregistrer la photo
                    </Button>
                  </Flex>
                </Stack>
              </Flex>
            </form>
          </Card.Body>
        </Card>

        <Card variant="elevated">
          <Card.Header>Informations personnelles</Card.Header>
          <Card.Body>
            <form onSubmit={submitInfo} noValidate>
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
                      value={infoForm.data.first_name}
                      onChange={(e) =>
                        infoForm.setData('first_name', e.target.value)
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
                      value={infoForm.data.last_name}
                      onChange={(e) =>
                        infoForm.setData('last_name', e.target.value)
                      }
                    />
                  </Field>
                </Grid>
                <Field
                  htmlFor="email"
                  label="Adresse email"
                  required
                  hint="Toute modification nécessitera une nouvelle vérification."
                  error={errors.email}
                >
                  <Input
                    id="email"
                    type="email"
                    value={infoForm.data.email}
                    onChange={(e) => infoForm.setData('email', e.target.value)}
                  />
                </Field>
                <Flex justify="flex-end">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={infoForm.processing}
                  >
                    Enregistrer
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Card.Body>
        </Card>

        <Card variant="elevated">
          <Card.Header>Mot de passe</Card.Header>
          <Card.Body>
            <form onSubmit={submitPassword} noValidate>
              <Stack gap={4}>
                <Field
                  htmlFor="password"
                  label="Nouveau mot de passe"
                  required
                  error={errors.password}
                >
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={passwordForm.data.password}
                    onChange={(e) =>
                      passwordForm.setData('password', e.target.value)
                    }
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
                    value={passwordForm.data.password_confirmation}
                    onChange={(e) =>
                      passwordForm.setData(
                        'password_confirmation',
                        e.target.value,
                      )
                    }
                  />
                </Field>
                <Flex justify="flex-end">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={passwordForm.processing}
                  >
                    Modifier le mot de passe
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Card.Body>
        </Card>
      </Stack>
    </EspaceClientLayout>
  );
};

export default ProfileEdit;
