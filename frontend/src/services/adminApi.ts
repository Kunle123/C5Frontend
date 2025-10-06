// Admin API Service

const API_BASE_URL = 'https://api-gw-production.up.railway.app/api/admin';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Analytics
export interface AnalyticsSummary {
  total_users: number;
  active_users_7d: number;
  active_users_30d: number;
  new_signups_7d: number;
  new_signups_30d: number;
  total_cvs_generated: number;
  cvs_generated_7d: number;
  cvs_generated_30d: number;
  total_applications: number;
  applications_7d: number;
  applications_30d: number;
  total_credits_purchased: number;
  total_credits_consumed: number;
}

export const getAnalytics = async (): Promise<AnalyticsSummary> => {
  const response = await fetch(`${API_BASE_URL}/analytics/summary`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch analytics');
  return response.json();
};

// Users
export interface UserListItem {
  id: string;
  email: string;
  name: string | null;
  monthly_credits_remaining: number;
  topup_credits: number;
  subscription_type: string;
  created_at: string;
  last_monthly_reset: string | null;
}

export const listUsers = async (skip = 0, limit = 50, search = ''): Promise<UserListItem[]> => {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  const response = await fetch(`${API_BASE_URL}/users/?${params}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

export interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  address_line1: string | null;
  city_state_postal: string | null;
  linkedin: string | null;
  phone_number: string | null;
  monthly_credits_remaining: number;
  daily_credits_remaining: number;
  topup_credits: number;
  subscription_type: string;
  created_at: string;
  updated_at: string;
  last_daily_reset: string | null;
  last_monthly_reset: string | null;
  next_credit_reset: string | null;
}

export const getUserDetail = async (userId: string): Promise<UserDetail> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch user detail');
  return response.json();
};

// Credit Management
export interface CreditAdjustmentRequest {
  amount: number;
  reason: 'Refund' | 'Promo' | 'Support' | 'Correction' | 'Violation';
  notes?: string;
}

export interface CreditTransaction {
  id: number;
  user_id: string;
  admin_id: string;
  amount: number;
  reason: string;
  notes: string | null;
  balance_before: number;
  balance_after: number;
  created_at: string;
}

export const adjustCredits = async (userId: string, adjustment: CreditAdjustmentRequest): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/credits`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(adjustment)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to adjust credits');
  }
  return response.json();
};

export const getCreditHistory = async (userId: string): Promise<CreditTransaction[]> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/credits/history`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch credit history');
  return response.json();
};

// User Activity
export interface UserActivity {
  user_id: string;
  cvs_count: number;
  cvs: Array<{
    id: string;
    created_at: string;
    job_title: string;
  }>;
  applications_count: number;
  applications: Array<{
    id: string;
    job_title: string;
    company_name: string;
    applied_at: string;
    status: string;
  }>;
}

export const getUserActivity = async (userId: string): Promise<UserActivity> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/activity`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch user activity');
  return response.json();
};

// User Profile (Career Arc)
export interface UserProfile {
  work_experience: Array<{
    id: string;
    company: string;
    title: string;
    start_date: string;
    end_date: string;
    location: string;
    description: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string;
  }>;
  skills: Array<{ skill: string }>;
  projects: Array<{ name: string; description: string }>;
  certifications: Array<{ name: string; issuer: string; year: string }>;
  languages: string[];
  interests: string[];
}

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return response.json();
};

