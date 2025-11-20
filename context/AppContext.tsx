
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Case, UserStatus, Hospital, UserRole } from '../types';
import { MOCK_USER, MOCK_CASES, HOSPITALS, MOCK_USERS_LIST } from '../constants';

// State Definition
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  cases: Case[];
  hospitals: Hospital[]; 
  users: User[]; 
  isDarkMode: boolean;
  appMode: 'development' | 'production';
  networkDelay: number;
}

// Actions
type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_USER'; payload: Partial<User> }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'UPDATE_ANY_USER'; payload: User } // New Action for Admin
  | { type: 'ADD_CASE'; payload: Case }
  | { type: 'UPDATE_CASE'; payload: Case }
  | { type: 'UPDATE_USER_STATUS'; payload: UserStatus }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_APP_MODE'; payload: 'development' | 'production' }
  | { type: 'SET_NETWORK_DELAY'; payload: number }
  | { type: 'ADD_HOSPITAL'; payload: Hospital }
  | { type: 'UPDATE_HOSPITAL'; payload: Hospital }
  | { type: 'DELETE_HOSPITAL'; payload: number }
  | { type: 'UPDATE_USER_ROLE_STATUS'; payload: { id: string; status?: UserStatus; role?: UserRole } }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SUBMIT_ACCESS_REQUEST'; payload: { description: string } };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  cases: MOCK_CASES,
  hospitals: HOSPITALS,
  users: MOCK_USERS_LIST,
  isDarkMode: false,
  appMode: 'development',
  networkDelay: 0,
};

// Reducer
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'REGISTER_USER':
      return state.user 
        ? { 
            ...state, 
            user: { ...state.user, ...action.payload, status: UserStatus.PENDING },
            users: state.users.map(u => u.id === state.user?.id ? { ...u, ...action.payload, status: UserStatus.PENDING } : u)
          } 
        : state;
    case 'UPDATE_PROFILE':
      return state.user
        ? { ...state, user: { ...state.user, ...action.payload } }
        : state;
    case 'UPDATE_ANY_USER':
       return {
         ...state,
         users: state.users.map(u => u.id === action.payload.id ? action.payload : u)
       };
    case 'ADD_CASE':
      return { ...state, cases: [action.payload, ...state.cases] };
    case 'UPDATE_CASE':
      return {
        ...state,
        cases: state.cases.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'UPDATE_USER_STATUS':
      return state.user ? { ...state, user: { ...state.user, status: action.payload } } : state;
    case 'ADD_HOSPITAL':
      return { ...state, hospitals: [...state.hospitals, action.payload] };
    case 'UPDATE_HOSPITAL':
      return { ...state, hospitals: state.hospitals.map(h => h.id === action.payload.id ? action.payload : h) };
    case 'DELETE_HOSPITAL':
      return { ...state, hospitals: state.hospitals.filter(h => h.id !== action.payload) };
    case 'UPDATE_USER_ROLE_STATUS':
      return {
        ...state,
        users: state.users.map(u => u.id === action.payload.id ? { ...u, ...action.payload } : u)
      };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(u => u.id !== action.payload) };
    case 'SUBMIT_ACCESS_REQUEST':
      return state.user 
        ? { ...state, user: { ...state.user, status: UserStatus.PENDING } } 
        : state;
    case 'TOGGLE_THEME':
      return { ...state, isDarkMode: !state.isDarkMode };
    case 'SET_APP_MODE':
      return { ...state, appMode: action.payload };
    case 'SET_NETWORK_DELAY':
      return { ...state, networkDelay: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
