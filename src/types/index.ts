export interface User {
  id: string;
  name: string;
  phone: string;
  location: string;
  eventId: string;
  registrationDate: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registrationCount: number;
  imageUrl: string;
  createdAt: Date;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}