const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const api = {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  },

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  },

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  },

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  }
};

export interface TarotCard {
  name_short: string;
  name: string;
  type: string;
  value_int: number;
  meaning_up: string;
  meaning_rev: string;
  desc: string;
}

export interface Card {
  cardId: string;
  name: string;
  isReversed: boolean;
  position: string;
}

export interface Reading {
  _id: string;
  user: string;
  readingType: string;
  spreadType: string;
  question: string;
  cards: Card[];
  aiInterpretation: string;
  additionalData?: Record<string, unknown>;
  createdAt: string;
}

export interface Prompt {
  _id: string;
  name: string;
  content: string;
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  birthTime?: string;
  gender: string;
  createdAt: string;
}

export interface AdminReading extends Reading {
  user: {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalReadings: number;
  genderStats: { male: number; female: number; other: number };
  ageGroups: Record<string, number>;
  readingTypes: Record<string, number>;
  uniqueUsersByType: Record<string, number>;
  readingsByGender: { male: number; female: number; other: number };
  readingsByAge: Record<string, number>;
  dailyReadings: Record<string, number>;
}

export const tarotApi = {
  async getRandomCards(count: number = 5): Promise<TarotCard[]> {
    const response = await fetch(`https://tarotapi.dev/api/v1/cards/random?n=${count}`);
    const data = await response.json();
    return data.cards;
  }
};

export const readingsApi = {
  getAll: () => api.get<Reading[]>('/api/readings'),
  getById: (id: string) => api.get<Reading>(`/api/readings/${id}`),
  createTaro: (cards: Card[], language: string) => 
    api.post<Reading>('/api/readings/taro', { cards, language }),
  createLove: (question: string, language: string, partnerData?: Record<string, string>) => 
    api.post<Reading>('/api/readings/love', { question, language, partnerData }),
  createMoney: (question: string, language: string) => 
    api.post<Reading>('/api/readings/money', { question, language }),
  createWork: (question: string, language: string) => 
    api.post<Reading>('/api/readings/work', { question, language }),
  createGeneral: (question: string, language: string) => 
    api.post<Reading>('/api/readings/general', { question, language })
};

export const promptsApi = {
  getAll: () => api.get<Prompt[]>('/api/prompts'),
  create: (name: string, content: string) => 
    api.post<Prompt>('/api/prompts', { name, content }),
  update: (id: string, content: string) => 
    api.put<Prompt>(`/api/prompts/${id}`, { content }),
  delete: (id: string) => api.delete(`/api/prompts/${id}`)
};

export const userApi = {
  getProfile: () => api.get<Record<string, unknown>>('/api/users/me'),
  updateProfile: (data: Record<string, unknown>) => 
    api.put<Record<string, unknown>>('/api/users/me', data)
};

export const adminApi = {
  getUsers: () => api.get<AdminUser[]>('/api/admin/users'),
  getReadings: () => api.get<AdminReading[]>('/api/admin/readings'),
  getStats: () => api.get<AdminStats>('/api/admin/stats'),
  deleteReading: (id: string) => api.delete(`/api/admin/readings/${id}`)
};