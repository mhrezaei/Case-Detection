import { MOCK_USER } from '../constants';
import { User, UserStatus } from '../types';

// Simple delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    requestOtp: async (mobile: string, networkDelay: number): Promise<boolean> => {
      await delay(networkDelay + 500); // Simulate network
      return true;
    },
    verifyOtp: async (code: string, networkDelay: number): Promise<User> => {
      await delay(networkDelay + 800);
      
      // Mock logic for demo purposes
      if (code === '12345') {
        return { ...MOCK_USER }; // Default active user
      } else if (code === '11111') {
        return { ...MOCK_USER, status: UserStatus.PENDING };
      } else if (code === '00000') {
        return { ...MOCK_USER, status: UserStatus.UNREGISTERED };
      } else {
        throw new Error('کد وارد شده اشتباه است');
      }
    }
  },
  cases: {
    // In a real app, this would fetch from server
    // Here we rely on Context state passed into components, or we could return mocks here
  }
};