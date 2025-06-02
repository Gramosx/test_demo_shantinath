import { UserRole, TenderType, TenderTOC, TenderStatus, TenderStage, HolidayType } from './enums';

export interface Country {
  code: string;
  name: string;
}

// Organization Models
export interface Organization {
  _id?: string;
  name: string;
  address: string;
  country: string;      // Country code
  alias: string;        // Unique across system
  units: string[];      // Array of unit names
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
}

export interface OrganizationResponse {
  data: Organization[];
  total: number;
}

export interface OrganizationUnit {
  name: string;
}

export interface CreateOrganizationDto {
  name: string;
  address: string;
  country: string;
  alias: string;
  units: string[];
}

export interface UpdateOrganizationDto {
  name?: string;
  address?: string;
  country?: string;
  alias?: string;
  units?: string[];
  isActive?: boolean;
}

// Tender Models
export interface TenderDates {
  creation: Date;
  sendForQuote: Date;
  priceDiscussion: Date;
  quoteApproval: Date;
  submission: Date;
  reference: Date;
}

export interface Tender {
  _id?: string;
  tenderId?: string;            // Auto-generated sequence
  title: string;
  description: string;
  status: TenderStatus;
  country: string;              // Country code
  organizationId: string;       // Reference to Organization ID
  organizationUnit: string;     // Must exist in organization.units
  type: TenderType;
  items: string[];              // Simple string array
  toc: TenderTOC;
  currentStage: TenderStage;
  dates: TenderDates;
  createdBy: string;            // User ID who created the tender
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletionDate?: Date;
}

export interface TenderResponse {
  data: Tender[];
  total: number;
}

export interface TenderStats {
  total: number;
  active: number;
  completed: number;
  growth: number;
  newOrganizations: number;
}

export interface CreateTenderDto {
  title: string;
  description: string;
  country: string;
  organizationId: string;
  organizationUnit: string;
  type: TenderType;
  items: string[];
  toc: TenderTOC;
  status: TenderStatus;
  currentStage: TenderStage;
  dates: TenderDates;
}

export interface UpdateTenderDto {
  title?: string;
  description?: string;
  country?: string;
  organizationId?: string;
  organizationUnit?: string;
  type?: TenderType;
  items?: string[];
  toc?: TenderTOC;
  status?: TenderStatus;
  currentStage?: TenderStage;
  dates?: Partial<TenderDates>;
}

// Holiday Models
export interface Holiday {
  _id?: string;
  date: Date;
  name: string;
  type: HolidayType;
  isActive: boolean;
}

export interface CreateHolidayDto {
  date: Date;
  name: string;
  type: HolidayType;
}

export interface UpdateHolidayDto {
  date?: Date;
  name?: string;
  type?: HolidayType;
  isActive?: boolean;
}

// User and Auth Models
export interface User {
  id?: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  email: string;
  fullName: string;
  role?: UserRole;
}

export interface UserResponse {
  data: User[];
  total: number;
}
