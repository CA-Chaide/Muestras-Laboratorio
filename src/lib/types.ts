export type Test = {
  id: string;
  name: string;
  sampleId: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Requires Review';
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
  status: 'Received' | 'In-Testing' | 'Completed' | 'Archived';
};

export type Document = {
  id: string;
  title: string;
  type: 'SOP' | 'Calibration Record' | 'Training Material' | 'Report';
  version: string;
  lastUpdated: string;
};

export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};
