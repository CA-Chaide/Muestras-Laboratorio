import type { Test, Sample, Document, NavItem } from './types';
import { LayoutDashboard, FileText, Beaker, FlaskConical, ClipboardList } from 'lucide-react';

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
    title: 'Pruebas Asignadas',
    href: '/tests',
    icon: FlaskConical,
  },
  {
    title: 'Generación de Informes',
    href: '/reports',
    icon: ClipboardList,
  },
];

export const tests: Test[] = [
  {
    id: 'T001',
    name: 'Prueba de Viscosidad',
    sampleId: 'S001',
    status: 'Completado',
    assignedTo: 'Dra. Evelyn Reed',
    dueDate: '2024-08-15',
    result: '45 cP',
    expectedValue: '40 cP',
  },
  {
    id: 'T002',
    name: 'Análisis de Nivel de pH',
    sampleId: 'S002',
    status: 'En Progreso',
    assignedTo: 'Dr. Marcus Chen',
    dueDate: '2024-08-20',
    result: '6.8',
    expectedValue: '7.0',
  },
  {
    id: 'T003',
    name: 'Distribución de Tamaño de Partícula',
    sampleId: 'S003',
    status: 'Pendiente',
    assignedTo: 'Dra. Evelyn Reed',
    dueDate: '2024-08-22',
    result: 'No Aplica',
    expectedValue: '10-20 micras',
  },
  {
    id: 'T004',
    name: 'Resistencia a la Tracción',
    sampleId: 'S004',
    status: 'Completado',
    assignedTo: 'Dr. Ben Carter',
    dueDate: '2024-08-18',
    result: '350 MPa',
    expectedValue: '355 MPa',
  },
    {
    id: 'T005',
    name: 'Contenido de Humedad',
    sampleId: 'S005',
    status: 'Requiere Revisión',
    assignedTo: 'Dr. Marcus Chen',
    dueDate: '2024-08-19',
    result: '5.5%',
    expectedValue: '3.0%',
  },
  {
    id: 'T006',
    name: 'Pureza Química',
    sampleId: 'S006',
    status: 'En Progreso',
    assignedTo: 'Dra. Evelyn Reed',
    dueDate: '2024-08-25',
    result: '98.5%',
    expectedValue: '99.5%',
  },
];

export const samples: Sample[] = [
  { id: 'S001', name: 'Lote de Polímero A', client: 'InnovateChem', receivedDate: '2024-08-01', status: 'Completado' },
  { id: 'S002', name: 'Muestra de Agua W2', client: 'PureLife', receivedDate: '2024-08-05', status: 'En Prueba' },
  { id: 'S003', name: 'Polvo Farmacéutico P1', client: 'HealthCorp', receivedDate: '2024-08-06', status: 'En Prueba' },
  { id: 'S004', name: 'Aleación de Metal M5', client: 'BuildRight', receivedDate: '2024-08-02', status: 'Completado' },
  { id: 'S005', name: 'Producto Alimenticio F8', client: 'GourmetFoods', receivedDate: '2024-08-07', status: 'En Prueba' },
  { id: 'S006', name: 'Crema Cosmética C3', client: 'BeautyGlow', receivedDate: '2024-08-10', status: 'Recibido' },
];

export const documents: Document[] = [
    { id: 'DOC001', title: 'POE para Medición de Viscosidad', type: 'POE', version: 'v3.1', lastUpdated: '2024-07-15' },
    { id: 'DOC002', title: 'Registro de Calibración del Espectrómetro', type: 'Registro de Calibración', version: 'v1.0', lastUpdated: '2024-08-01' },
    { id: 'DOC003', title: 'Capacitación en Seguridad de Laboratorio', type: 'Material de Capacitación', version: 'v2.5', lastUpdated: '2024-06-20' },
];
