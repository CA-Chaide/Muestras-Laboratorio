import type { Test, Sample, Document, NavItem } from './types';
import { LayoutDashboard, FileText, Beaker, FlaskConical, ClipboardList } from 'lucide-react';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Document Management',
    href: '/documents',
    icon: FileText,
  },
  {
    title: 'Sample Registration',
    href: '/samples',
    icon: Beaker,
  },
  {
    title: 'Assigned Tests',
    href: '/tests',
    icon: FlaskConical,
  },
  {
    title: 'Report Generation',
    href: '/reports',
    icon: ClipboardList,
  },
];

export const tests: Test[] = [
  {
    id: 'T001',
    name: 'Viscosity Test',
    sampleId: 'S001',
    status: 'Completed',
    assignedTo: 'Dr. Evelyn Reed',
    dueDate: '2024-08-15',
    result: '45 cP',
    expectedValue: '40 cP',
  },
  {
    id: 'T002',
    name: 'pH Level Analysis',
    sampleId: 'S002',
    status: 'In Progress',
    assignedTo: 'Dr. Marcus Chen',
    dueDate: '2024-08-20',
    result: '6.8',
    expectedValue: '7.0',
  },
  {
    id: 'T003',
    name: 'Particle Size Distribution',
    sampleId: 'S003',
    status: 'Pending',
    assignedTo: 'Dr. Evelyn Reed',
    dueDate: '2024-08-22',
    result: 'N/A',
    expectedValue: '10-20 microns',
  },
  {
    id: 'T004',
    name: 'Tensile Strength',
    sampleId: 'S004',
    status: 'Completed',
    assignedTo: 'Dr. Ben Carter',
    dueDate: '2024-08-18',
    result: '350 MPa',
    expectedValue: '355 MPa',
  },
    {
    id: 'T005',
    name: 'Moisture Content',
    sampleId: 'S005',
    status: 'Requires Review',
    assignedTo: 'Dr. Marcus Chen',
    dueDate: '2024-08-19',
    result: '5.5%',
    expectedValue: '3.0%',
  },
  {
    id: 'T006',
    name: 'Chemical Purity',
    sampleId: 'S006',
    status: 'In Progress',
    assignedTo: 'Dr. Evelyn Reed',
    dueDate: '2024-08-25',
    result: '98.5%',
    expectedValue: '99.5%',
  },
];

export const samples: Sample[] = [
  { id: 'S001', name: 'Polymer Batch A', client: 'InnovateChem', receivedDate: '2024-08-01', status: 'Completed' },
  { id: 'S002', name: 'Water Sample W2', client: 'PureLife', receivedDate: '2024-08-05', status: 'In-Testing' },
  { id: 'S003', name: 'Pharmaceutical Powder P1', client: 'HealthCorp', receivedDate: '2024-08-06', status: 'In-Testing' },
  { id: 'S004', name: 'Metal Alloy M5', client: 'BuildRight', receivedDate: '2024-08-02', status: 'Completed' },
  { id: 'S005', name: 'Food Product F8', client: 'GourmetFoods', receivedDate: '2024-08-07', status: 'In-Testing' },
  { id: 'S006', name: 'Cosmetic Cream C3', client: 'BeautyGlow', receivedDate: '2024-08-10', status: 'Received' },
];

export const documents: Document[] = [
    { id: 'DOC001', title: 'SOP for Viscosity Measurement', type: 'SOP', version: 'v3.1', lastUpdated: '2024-07-15' },
    { id: 'DOC002', title: 'Spectrometer Calibration Record', type: 'Calibration Record', version: 'v1.0', lastUpdated: '2024-08-01' },
    { id: 'DOC003', title: 'Lab Safety Training', type: 'Training Material', version: 'v2.5', lastUpdated: '2024-06-20' },
];
