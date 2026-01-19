'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Lock,
  Palette,
  Bell,
  Shield,
  Loader2,
  Check,
  Moon,
  Sun,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const handleProfileSubmit = async (data: ProfileForm) => {
    setSaving(true);
    // TODO: Implementar update do perfil na API
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordSubmit = async (data: PasswordForm) => {
    setSaving(true);
    // TODO: Implementar troca de senha na API
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    passwordForm.reset();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie seu perfil e preferências</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        {/* Perfil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button type="button" variant="outline" size="sm">
                      Alterar foto
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG ou GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    {...profileForm.register('name')}
                    placeholder="Seu nome"
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register('email')}
                    placeholder="seu@email.com"
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Plano */}
                <div className="space-y-2">
                  <Label>Plano atual</Label>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      user?.plan === 'FREE' ? 'bg-muted' : 'bg-primary/10 text-primary'
                    )}>
                      {user?.plan || 'FREE'}
                    </span>
                    {user?.plan === 'FREE' && (
                      <Button type="button" variant="outline" size="sm">
                        Fazer upgrade
                      </Button>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : saved ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : null}
                  {saved ? 'Salvo!' : 'Salvar alterações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aparência */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize a aparência do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tema */}
              <div className="space-y-3">
                <Label>Tema</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      theme === 'light' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <Sun className="h-6 w-6" />
                    <span className="text-sm font-medium">Claro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      theme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <Moon className="h-6 w-6" />
                    <span className="text-sm font-medium">Escuro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      theme === 'system' ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
                    )}
                  >
                    <div className="flex">
                      <Sun className="h-4 w-4" />
                      <Moon className="h-4 w-4 ml-1" />
                    </div>
                    <span className="text-sm font-medium">Sistema</span>
                  </button>
                </div>
              </div>

              {/* Notificações */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notificações
                </Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alertas de orçamento</p>
                      <p className="text-sm text-muted-foreground">
                        Receba alertas quando atingir o limite
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Resumo semanal</p>
                      <p className="text-sm text-muted-foreground">
                        Receba um resumo toda segunda-feira
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dicas da IA</p>
                      <p className="text-sm text-muted-foreground">
                        Insights personalizados de economia
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seguranca */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Alterar senha
              </CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register('currentPassword')}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register('newPassword')}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Alterar senha
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Zona de perigo
              </CardTitle>
              <CardDescription>
                Ações irreversíveis para sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Excluir conta</p>
                  <p className="text-sm text-muted-foreground">
                    Remove todos os dados permanentemente
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Excluir conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
