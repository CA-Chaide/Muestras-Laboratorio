export type Test = {
  id: string;
  name: string;
  sampleId: string;
  status: 'Pendiente' | 'En Progreso' | 'Completado' | 'Requiere Revisión';
  assignedTo: string;
  dueDate: string;
  result: string;
  expectedValue: string;
};

export type Sample = {
  id: string;
  identificacion: string;
  registrationDateTime: string; // ISO String
  descripcion: string;
  fechaFabricacionLote: string;
  categoria: string;
  tipoMuestra: 'Producción Normal' | 'Prueba de Producción' | 'Prueba de Calidad' | 'Ensayo Rápido';
  ensayosSolicitados: string;
  solicitudNumero: string;
  informeNumero: string;
  status: string;
  userId: string;
};

export type Document = {
  id: string;
  title: string;
  type: 'POE' | 'Registro de Calibración' | 'Material de Capacitación' | 'Informe';
  version: string;
  lastUpdated: string;
};

export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Técnico';
};
