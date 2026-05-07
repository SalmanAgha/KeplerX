import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
};

const storedToken = localStorage.getItem('jwt_token');

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: !!storedToken,
  error: null,
  token: storedToken,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return { ...state, user: action.payload.user, isAuthenticated: true, token: action.payload.token, loading: false };
    case ACTIONS.LOGOUT:
      return { ...state, user: null, isAuthenticated: false, token: null, loading: false };
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload, isAuthenticated: true, loading: false };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      dispatch({ type: ACTIONS.SET_USER, payload: { id: 1, username: 'user' } });
    }
  }, []);

  const login = async credentials => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const mockRes = {
      user: { id: 1, username: credentials.username },
      token: `mock-token-${Date.now()}`,
    };
    localStorage.setItem('jwt_token', mockRes.token);
    dispatch({ type: ACTIONS.LOGIN, payload: mockRes });
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    dispatch({ type: ACTIONS.LOGOUT });
  };

  return (
    <AppContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
