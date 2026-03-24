/**
 * ============================================================================
 * DATOS DE PRUEBA HARDCODEADOS - LabTrack
 * ============================================================================
 * Este archivo contiene datos de prueba y funciones CRUD que simulan un backend.
 *
 * TODO: En el futuro, reemplazar cada función con una llamada HTTP
 * a la API REST correspondiente. Los datos hardcodeados serán eliminados
 * y cada getter/setter se convertirá en un fetch/POST/PUT/DELETE.
 * ============================================================================
 */

import { LayoutDashboard, FileText, Beaker, FlaskConical, ClipboardList, Archive, FileSpreadsheet, ClipboardCheck } from 'lucide-react';
import type { NavItem, Sample, Test, UserProfile } from './types';

// ---------------------------------------------------------------------------
// Generador de IDs únicos (temporal)
// TODO: Los IDs serán generados por el backend/API
// ---------------------------------------------------------------------------
let idCounter = 1000;
export function generateId(): string {
  idCounter += 1;
  return `id-${Date.now()}-${idCounter}`;
}

// ---------------------------------------------------------------------------
// Mock de usuario autenticado
// TODO: Reemplazar con autenticación real contra la API (e.g. JWT, session)
// ---------------------------------------------------------------------------
export const mockCurrentUser = {
  uid: 'user-001',
  email: 'admin@labtrack.com',
  isAnonymous: false,
};

// ---------------------------------------------------------------------------
// Navegación
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Datos de prueba: Usuarios / Técnicos
// TODO: Reemplazar con GET /api/users
// ---------------------------------------------------------------------------
export const users: UserProfile[] = [
  { id: 'user-001', name: 'Carlos Administrador', email: 'admin@labtrack.com', role: 'Administrador' },
  { id: 'user-002', name: 'María García', email: 'maria@labtrack.com', role: 'Técnico' },
  { id: 'user-003', name: 'Juan Pérez', email: 'juan@labtrack.com', role: 'Técnico' },
  { id: 'user-004', name: 'Ana López', email: 'ana@labtrack.com', role: 'Técnico' },
];

// ---------------------------------------------------------------------------
// Datos de prueba: Muestras
// TODO: Reemplazar con GET /api/samples
// ---------------------------------------------------------------------------
export const samples: Sample[] = [
  {
    id: 'sample-001',
    identificacion: 'ESP-2026-001',
    registrationDateTime: '2026-01-15T09:30:00.000Z',
    descripcion: 'Espuma de poliuretano densidad 24 kg/m³ - Lote A',
    fechaFabricacionLote: '2026-01-10',
    categoria: 'Espuma',
    tipoMuestra: 'Producción Normal',
    ensayosSolicitados: 'Densidad, Dureza, Resiliencia',
    solicitudNumero: 'SOL-2026-001',
    informeNumero: 'INF-2026-001',
    status: 'Registrado',
    userId: 'user-001',
  },
  {
    id: 'sample-002',
    identificacion: 'TEL-2026-001',
    registrationDateTime: '2026-01-20T10:00:00.000Z',
    descripcion: 'Tela tejido plano algodón 200 hilos',
    fechaFabricacionLote: '2026-01-18',
    categoria: 'Tela',
    tipoMuestra: 'Producción Normal',
    ensayosSolicitados: 'Tracción, Desgarro',
    solicitudNumero: 'SOL-2026-002',
    informeNumero: 'INF-2026-002',
    status: 'Registrado',
    userId: 'user-001',
  },
  {
    id: 'sample-003',
    identificacion: 'COL-2026-001',
    registrationDateTime: '2026-02-05T08:15:00.000Z',
    descripcion: 'Colchón espuma HR 30 kg/m³ - Modelo Confort Plus',
    fechaFabricacionLote: '2026-02-01',
    categoria: 'Colchón',
    tipoMuestra: 'Producción Normal',
    ensayosSolicitados: 'Durabilidad, Deformación permanente, Dureza',
    solicitudNumero: 'SOL-2026-003',
    informeNumero: 'INF-2026-003',
    status: 'Registrado',
    userId: 'user-001',
  },
  {
    id: 'sample-004',
    identificacion: 'ALM-2026-001',
    registrationDateTime: '2026-02-12T11:45:00.000Z',
    descripcion: 'Almohada viscoelástica Memory Foam',
    fechaFabricacionLote: '2026-02-08',
    categoria: 'Almohada',
    tipoMuestra: 'Producción Normal',
    ensayosSolicitados: 'Tiempo de recuperación, Densidad',
    solicitudNumero: 'SOL-2026-004',
    informeNumero: 'INF-2026-004',
    status: 'Registrado',
    userId: 'user-001',
  },
  {
    id: 'sample-005',
    identificacion: 'ESP-2026-002',
    registrationDateTime: '2026-03-01T14:20:00.000Z',
    descripcion: 'Espuma de poliuretano densidad 30 kg/m³ - Lote B',
    fechaFabricacionLote: '2026-02-25',
    categoria: 'Espuma',
    tipoMuestra: 'Prueba de Producción',
    ensayosSolicitados: 'Densidad, Fatiga, Permeabilidad',
    solicitudNumero: 'SOL-2026-005',
    informeNumero: 'INF-2026-005',
    status: 'Registrado',
    userId: 'user-001',
  },
  {
    id: 'sample-006',
    identificacion: 'MUE-2026-001',
    registrationDateTime: '2026-03-10T09:00:00.000Z',
    descripcion: 'Estructura de sofá modelo Elegance - Madera pino',
    fechaFabricacionLote: '2026-03-05',
    categoria: 'Mueble',
    tipoMuestra: 'Producción Normal',
    ensayosSolicitados: 'Resistencia estructural, Acabado',
    solicitudNumero: 'SOL-2026-006',
    informeNumero: 'INF-2026-006',
    status: 'Registrado',
    userId: 'user-001',
  },
  {
    id: 'sample-007',
    identificacion: 'COM-2026-001',
    registrationDateTime: '2026-03-15T16:30:00.000Z',
    descripcion: 'Funda protectora para colchón - Tela impermeable',
    fechaFabricacionLote: '2026-03-12',
    categoria: 'Complemento',
    tipoMuestra: 'Producción Normal',
    ensayosSolicitados: 'Permeabilidad, Tracción',
    solicitudNumero: 'SOL-2026-007',
    informeNumero: 'INF-2026-007',
    status: 'Registrado',
    userId: 'user-001',
  },
  {
    id: 'sample-008',
    identificacion: 'ELP-2026-001',
    registrationDateTime: '2026-03-20T07:45:00.000Z',
    descripcion: 'Espuma línea prod. densidad 22 kg/m³ - Control rápido',
    fechaFabricacionLote: '2026-03-19',
    categoria: 'Ensayos Espuma en Línea de Producción',
    tipoMuestra: 'Ensayo Rápido',
    ensayosSolicitados: 'Densidad, Dureza',
    solicitudNumero: 'SOL-2026-008',
    informeNumero: 'INF-2026-008',
    status: 'Registrado',
    userId: 'user-001',
  },
];

// ---------------------------------------------------------------------------
// Datos de prueba: Tests / Ensayos Asignados
// TODO: Reemplazar con GET /api/tests
// ---------------------------------------------------------------------------
export const tests: Test[] = [
  {
    id: 'test-001',
    sampleId: 'sample-001',
    sampleIdentificacion: 'ESP-2026-001',
    assignedToId: 'user-002',
    assignedToName: 'María García',
    assignedById: 'user-001',
    templateId: 'normal-production-foam',
    templateName: 'Ensayos Espumas Producción Normal',
    assignedDate: '2026-01-16T10:00:00.000Z',
    status: 'En Progreso',
  },
  {
    id: 'test-002',
    sampleId: 'sample-002',
    sampleIdentificacion: 'TEL-2026-001',
    assignedToId: 'user-003',
    assignedToName: 'Juan Pérez',
    assignedById: 'user-001',
    templateId: 'woven-fabric',
    templateName: 'Ensayos Telas Tejido Plano',
    assignedDate: '2026-01-21T09:30:00.000Z',
    status: 'Completado',
  },
  {
    id: 'test-003',
    sampleId: 'sample-003',
    sampleIdentificacion: 'COL-2026-001',
    assignedToId: 'user-002',
    assignedToName: 'María García',
    assignedById: 'user-001',
    templateId: 'normal-production-foam',
    templateName: 'Ensayos Espumas Producción Normal',
    assignedDate: '2026-02-06T11:00:00.000Z',
    status: 'Pendiente',
  },
  {
    id: 'test-004',
    sampleId: 'sample-005',
    sampleIdentificacion: 'ESP-2026-002',
    assignedToId: 'user-004',
    assignedToName: 'Ana López',
    assignedById: 'user-001',
    templateId: 'normal-production-foam',
    templateName: 'Ensayos Espumas Producción Normal',
    assignedDate: '2026-03-02T08:00:00.000Z',
    status: 'Pendiente',
  },
];

// ---------------------------------------------------------------------------
// Funciones de acceso a datos: Usuarios
// TODO: Reemplazar con llamadas a API REST
// ---------------------------------------------------------------------------

/** TODO: Reemplazar con GET /api/users */
export function getUsers(): UserProfile[] {
  return [...users];
}

/** TODO: Reemplazar con GET /api/users?role=Técnico */
export function getTechnicians(): UserProfile[] {
  return users.filter(u => u.role === 'Técnico');
}

// ---------------------------------------------------------------------------
// Funciones de acceso a datos: Muestras
// TODO: Reemplazar con llamadas a API REST
// ---------------------------------------------------------------------------

/** TODO: Reemplazar con GET /api/samples?userId=...&category=...&year=...&month=... */
export function getSamples(filters?: { category?: string; year?: string; month?: string }): Sample[] {
  let result = [...samples];

  if (filters) {
    if (filters.category && filters.category !== 'Todos') {
      result = result.filter(s => s.categoria === filters.category);
    }

    const year = parseInt(filters.year || '', 10);
    const month = parseInt(filters.month || '', 10);

    if (!isNaN(year) && filters.year !== 'Todos') {
      if (!isNaN(month) && filters.month !== 'Todos') {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        result = result.filter(s => {
          const d = new Date(s.registrationDateTime);
          return d >= startDate && d <= endDate;
        });
      } else {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        result = result.filter(s => {
          const d = new Date(s.registrationDateTime);
          return d >= startDate && d <= endDate;
        });
      }
    } else if (!isNaN(month) && filters.month !== 'Todos') {
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0, 23, 59, 59, 999);
      result = result.filter(s => {
        const d = new Date(s.registrationDateTime);
        return d >= startDate && d <= endDate;
      });
    }
  }

  return result;
}

/** TODO: Reemplazar con GET /api/samples (todas las muestras, sin filtro de usuario) */
export function getAllSamples(): Sample[] {
  return [...samples];
}

// ---------------------------------------------------------------------------
// Funciones de acceso a datos: Tests
// TODO: Reemplazar con llamadas a API REST
// ---------------------------------------------------------------------------

/** TODO: Reemplazar con GET /api/tests?sort=assignedDate:desc */
export function getTests(): Test[] {
  return [...tests].sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime());
}

/** TODO: Reemplazar con GET /api/tests?assignedToId=...&sort=assignedDate:desc */
export function getTestsByUser(userId: string): Test[] {
  return tests
    .filter(t => t.assignedToId === userId)
    .sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime());
}