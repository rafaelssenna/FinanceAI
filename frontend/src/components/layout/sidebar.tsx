'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Target,
  LogOut,
  Sparkles,
  Menu,
  X,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Início', href: '/dashboard', icon: LayoutDashboard, description: 'Visão geral' },
  { name: 'Contas Fixas', href: '/dashboard/fixed-expenses', icon: Receipt, description: 'Despesas recorrentes' },
  { name: 'Transações', href: '/dashboard/transactions', icon: ArrowLeftRight, description: 'Gastos e receitas' },
  { name: 'Orçamentos', href: '/dashboard/budgets', icon: Target, description: 'Metas mensais' },
  { name: 'Insights IA', href: '/dashboard/insights', icon: Sparkles, description: 'Dicas inteligentes' },
  { name: 'Minhas Contas', href: '/dashboard/accounts', icon: Wallet, description: 'Bancos e carteiras' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r transition-transform md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">FinanceAI</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className={cn(
                      'text-xs',
                      isActive ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                    )}>
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t p-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              Sair da conta
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
