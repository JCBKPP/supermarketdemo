import { Product, User, UserRole, LeaveRequest, AttendanceRecord } from './types.ts';

// Remote Database Configuration
export const SUPABASE_URL = 'https://bfkqksdndamlxyalfsaf.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJma3Frc2RuZGFtbHh5YWxmc2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjA1MjAsImV4cCI6MjA4NjM5NjUyMH0.2eJ31fQc3s1MbB-X0dnOK_mQ67WJcvAfI7kbURpRJho';

export const ADMIN_USER: User = {
  id: 'admin',
  username: 'admin',
  fullName: 'Super Admin',
  role: UserRole.ADMIN,
  avatar: 'https://picsum.photos/seed/admin/200',
  department: 'Administration'
};

export const STAFF_USER: User = {
  id: '001',
  username: '001',
  fullName: 'John Doe',
  role: UserRole.STAFF,
  avatar: 'https://picsum.photos/seed/staff/200',
  department: 'Produce'
};

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Fresh Apples', sku: 'APL-001', stock: 150, price: 2.99, category: 'Produce', expiryDate: '2024-12-25', status: 'In Stock' },
  { id: '2', name: 'Whole Milk', sku: 'MLK-042', stock: 12, price: 4.50, category: 'Dairy', expiryDate: '2024-12-20', status: 'Low Stock' },
  { id: '3', name: 'Chicken Breast', sku: 'MEAT-12', stock: 45, price: 9.99, category: 'Meat', expiryDate: '2024-12-18', status: 'In Stock' },
  { id: '4', name: 'Bread', sku: 'BAK-08', stock: 5, price: 3.25, category: 'Bakery', expiryDate: '2024-12-16', status: 'Low Stock' },
  { id: '5', name: 'Cereal', sku: 'GRO-55', stock: 0, price: 5.49, category: 'Grocery', expiryDate: '2025-06-10', status: 'Out of Stock' },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: '1', type: 'Annual', startDate: '2024-12-24', endDate: '2024-12-27', status: 'Pending', reason: 'Holiday trip' },
  { id: '2', type: 'Sick', startDate: '2024-11-15', endDate: '2024-11-16', status: 'Approved', reason: 'Fever' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: '1', date: '2024-12-14', clockIn: '08:55 AM', clockOut: '05:05 PM', status: 'Present', location: 'Main Entrance' },
  { id: '2', date: '2024-12-13', clockIn: '09:15 AM', clockOut: '05:10 PM', status: 'Late', location: 'Main Entrance' },
];