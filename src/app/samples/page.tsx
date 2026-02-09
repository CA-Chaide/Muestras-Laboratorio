'use client';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Armchair, BedDouble, Layers, Puzzle, Rectangle, Square } from 'lucide-react';
import Link from 'next/link';

const sampleTypes = [
  {
    title: 'Registro de Espumas',
    href: '/samples/foam',
    icon: Square,
    description: 'Registrar nuevas muestras de espuma.',
  },
  {
    title: 'Registro de Telas',
    href: '/samples/fabric',
    icon: Layers,
    description: 'Registrar nuevas muestras de tela.',
  },
  {
    title: 'Registro de Colchones',
    href: '/samples/mattress',
    icon: BedDouble,
    description: 'Registrar nuevas muestras de colchón.',
  },
  {
    title: 'Registro de Almohadas',
    href: '/samples/pillow',
    icon: Rectangle,
    description: 'Registrar nuevas muestras de almohada.',
  },
  {
    title: 'Registro de Muebles',
    href: '/samples/furniture',
    icon: Armchair,
    description: 'Registrar nuevas muestras de mueble.',
  },
  {
    title: 'Registro de Complementos',
    href: '/samples/accessory',
    icon: Puzzle,
    description: 'Registrar nuevas muestras de complementos.',
  },
];

export default function SamplesPage() {
  return (
    <div className="flex flex-col w-full">
      <Header title="Registro de Muestras" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sampleTypes.map((sample) => (
            <Link href={sample.href} key={sample.href} className="group">
              <Card className="flex flex-col justify-between h-full transition-colors group-hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary">
                    <sample.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{sample.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {sample.description}
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