// frontend/src/services/apiService.ts
// CREATE THIS NEW FILE

import { auth } from '../config/firebase';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Get Firebase auth token for API calls
 */
const getAuthToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user logged in');
  }
  
  // Get fresh token from Firebase
  return await user.getIdToken();
};

/**
 * Make authenticated API call to backend
 */
const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
};

// ============================================
// API METHODS
// ============================================

export interface NoticeAnalysisResult {
  platform: string;
  reason: string;
  urgency_level: string;
  deadline_days: number | null;
  risk_level: string;
  missing_info: string[];
  recommendations: string[];
}

export interface AppealData {
  platform: string;
  deactivation_reason: string;
  user_story: string;
  account_tenure?: string;
  current_rating?: string;
  completion_rate?: string;
  total_deliveries?: string;
  appeal_tone?: string;
  user_state?: string;
}

export interface AppealResult {
  appeal_id: string;
  appeal_letter: string;
  status: string;
  platform: string;
  tone_used?: string;
}

export interface Appeal {
  id: string;
  platform: string;
  deactivationReason: string;
  generatedLetter: string;
  status: string;
  createdAt: string;
}

/**
 * Analyze a deactivation notice
 */
export const analyzeNotice = async (noticeText: string): Promise<NoticeAnalysisResult> => {
  const response = await authenticatedFetch('/api/analyze-notice', {
    method: 'POST',
    body: JSON.stringify({ notice_text: noticeText })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to analyze notice');
  }
  
  return await response.json();
};

/**
 * Generate an appeal letter
 */
export const generateAppeal = async (appealData: AppealData): Promise<AppealResult> => {
  const response = await authenticatedFetch('/api/generate-appeal', {
    method: 'POST',
    body: JSON.stringify(appealData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to generate appeal');
  }
  
  return await response.json();
};

/**
 * Get all appeals for current user
 */
export const getMyAppeals = async (): Promise<Appeal[]> => {
  const response = await authenticatedFetch('/api/my-appeals', {
    method: 'GET'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch appeals');
  }
  
  const data = await response.json();
  return data.appeals;
};

/**
 * Delete an appeal
 */
export const deleteAppeal = async (appealId: string): Promise<void> => {
  const response = await authenticatedFetch(`/api/appeals/${appealId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete appeal');
  }
};

/**
 * Send a chat message
 */
export const chatWithBot = async (
  message: string, 
  history: any[] = []
): Promise<{ response: string; suggested_actions: any[] }> => {
  const response = await authenticatedFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      conversation_history: history
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to send message');
  }
  
  return await response.json();
};

/**
 * Check API health
 */
export const checkHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return await response.json();
};