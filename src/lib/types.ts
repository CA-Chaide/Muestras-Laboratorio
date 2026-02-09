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
  name: string;
  client: string;
  receivedDate: string;
  status: 'Recibido' | 'En Prueba' | 'Completado' | 'Archivado';
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
