'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

const essayTemplates = [
  {
    title: 'Ensayos Espumas Producción Normal',
    href: '/essay-templates/normal-production-foam',
    icon: FileSpreadsheet,
    description: 'Gestionar plantilla para ensayos de espumas en producción normal.',
  },
  {
    title: 'Ensayos Telas Tejido Plano',
    href: '/essay-templates/woven-fabric',
    icon: FileSpreadsheet,
    description: 'Gestionar plantilla para ensayos de telas de tejido plano.',
  },
];

export default function EssayTemplatesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header title="Gestor de plantillas de Ensayos" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {essayTemplates.map((template) => (
            <Link href={template.href} key={template.href} className="group">
              <Card className="flex flex-col justify-between h-full transition-colors group-hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary">
                    <template.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{template.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
