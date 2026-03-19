import { LayoutDashboard, FileText, Beaker, FlaskConical, ClipboardList, Archive, FileSpreadsheet, ClipboardCheck } from 'lucide-react';
import type { NavItem } from './types';

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
    title: 'Mis Ensayos',
    href: '/my-tests',
    icon: ClipboardCheck,
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