export type UserRole = 'owner' | 'member';
export type CurrencyCode = 'INR' | 'USD' | 'SAR';
export type HealthStatus = 'green' | 'amber' | 'red' | 'on_hold';
export type StageStatus = 'pending' | 'in_progress' | 'done' | 'blocked';
export type ExceptionSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ExceptionStatus = 'open' | 'ack' | 'closed';
export type ReminderStatus = 'pending' | 'done' | 'overdue';

export type ProjectStage =
  | 'intake' | 'requirements' | 'boq' | 'estimation' | 'engineering'
  | 'procurement' | 'execution' | 'qa_qc' | 'testing_commissioning'
  | 'measurement_claim' | 'financial_erp' | 'commercial_visibility'
  | 'handover' | 'closeout';

export const STAGES: { key: ProjectStage; label: string; short: string }[] = [
  { key: 'intake', label: 'Project Intake', short: 'INT' },
  { key: 'requirements', label: 'Requirements', short: 'REQ' },
  { key: 'boq', label: 'BOQ Intelligence', short: 'BOQ' },
  { key: 'estimation', label: 'Estimation', short: 'EST' },
  { key: 'engineering', label: 'Engineering', short: 'ENG' },
  { key: 'procurement', label: 'Procurement', short: 'PRO' },
  { key: 'execution', label: 'Execution', short: 'EXE' },
  { key: 'qa_qc', label: 'QA / QC', short: 'QA' },
  { key: 'testing_commissioning', label: 'Testing & Commissioning', short: 'T&C' },
  { key: 'measurement_claim', label: 'Measurement / Claim', short: 'MCL' },
  { key: 'financial_erp', label: 'Financial / ERP', short: 'FIN' },
  { key: 'commercial_visibility', label: 'Commercial Visibility', short: 'COM' },
  { key: 'handover', label: 'Handover', short: 'HND' },
  { key: 'closeout', label: 'Closeout', short: 'CLO' }
];

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  client_id: string | null;
  description: string | null;
  contract_value: number;
  currency: CurrencyCode;
  current_stage: ProjectStage;
  health: HealthStatus;
  start_date: string | null;
  end_date: string | null;
  owner_id: string | null;
  archived: boolean;
  boq_total: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectStageRow {
  id: string;
  project_id: string;
  stage: ProjectStage;
  status: StageStatus;
  entered_at: string | null;
  completed_at: string | null;
  notes: string | null;
  updated_at: string;
}

export interface BoqItem {
  id: string;
  project_id: string;
  description: string;
  unit: string | null;
  quantity: number;
  rate: number;
  amount: number;
  source: string;
  created_at: string;
}

export interface Billing {
  id: string;
  project_id: string;
  invoice_no: string;
  amount: number;
  billed_at: string;
  due_at: string | null;
  status: string;
  created_at: string;
}

export interface Collection {
  id: string;
  project_id: string;
  billing_id: string | null;
  amount: number;
  collected_at: string;
  reference: string | null;
  created_at: string;
}

export interface Exception {
  id: string;
  project_id: string;
  type: string;
  severity: ExceptionSeverity;
  message: string;
  status: ExceptionStatus;
  assigned_to: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface Reminder {
  id: string;
  project_id: string;
  exception_id: string | null;
  assigned_to: string | null;
  message: string;
  due_at: string;
  status: ReminderStatus;
  created_at: string;
}
