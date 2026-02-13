import type { Test, Sample, Document, NavItem } from './types';
import { LayoutDashboard, FileText, Beaker, FlaskConical, ClipboardList, Archive, FileSpreadsheet } from 'lucide-react';

export const navItems: NavItem[] = [
  {
    title: 'Panel de Control',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Gestión de Documentos',
    href: '/documents',
    icon: FileText,
  },
  {
    title: 'Registro de Muestras',
    href: '/samples',
    icon: Beaker,
  },
  {
    title: 'Ver Muestras',
    href: '/samples/all',
    icon: Archive,
  },
  {
    title: 'Gestor de Asignación de Pruebas',
    href: '/tests',
    icon: FlaskConical,
  },
  {
    title: 'Generación de Informes',
    href: '/reports',
    icon: ClipboardList,
  },
  {
    title: 'Gestor de plantillas de Ensayos',
    href: '/essay-templates',
    icon: FileSpreadsheet,
  },
];

export const tests: Test[] = [];

export const samples: Sample[] = [];

export const documents: Document[] = [];
