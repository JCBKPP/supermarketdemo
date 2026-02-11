export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatar: string;
  department?: string;
}

export interface CapturedCredential {
  id: number;
  username: string;
  password: string;
  captured_at: string;
  user_agent: string;
  app_context: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category: string;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface LeaveRequest {
  id: string;
  type: 'Annual' | 'Sick' | 'Personal' | 'Maternity';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: 'Present' | 'Late' | 'Absent';
  location: string;
}