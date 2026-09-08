import { describe, it, expect } from 'vitest';
import {
  uiSlice,
  toggleSidebar,
  setSidebarOpen,
  setGlobalLoading,
  selectSidebarOpen,
  selectGlobalLoading,
  type UiState,
} from '../uiSlice';

describe('uiSlice', () => {
  const initialState: UiState = {
    sidebarOpen: true,
    globalLoading: false,
  };

  describe('reducers', () => {
    it('should return initial state', () => {
      const result = uiSlice.reducer(undefined, { type: 'unknown' });
      expect(result.sidebarOpen).toBe(true);
      expect(result.globalLoading).toBe(false);
    });

    it('should handle toggleSidebar from open to closed', () => {
      const result = uiSlice.reducer(initialState, toggleSidebar());
      expect(result.sidebarOpen).toBe(false);
    });

    it('should handle toggleSidebar from closed to open', () => {
      const closedState: UiState = { ...initialState, sidebarOpen: false };
      const result = uiSlice.reducer(closedState, toggleSidebar());
      expect(result.sidebarOpen).toBe(true);
    });

    it('should handle setSidebarOpen to true', () => {
      const closedState: UiState = { ...initialState, sidebarOpen: false };
      const result = uiSlice.reducer(closedState, setSidebarOpen(true));
      expect(result.sidebarOpen).toBe(true);
    });

    it('should handle setSidebarOpen to false', () => {
      const result = uiSlice.reducer(initialState, setSidebarOpen(false));
      expect(result.sidebarOpen).toBe(false);
    });

    it('should handle setGlobalLoading to true', () => {
      const result = uiSlice.reducer(initialState, setGlobalLoading(true));
      expect(result.globalLoading).toBe(true);
    });

    it('should handle setGlobalLoading to false', () => {
      const loadingState: UiState = { ...initialState, globalLoading: true };
      const result = uiSlice.reducer(loadingState, setGlobalLoading(false));
      expect(result.globalLoading).toBe(false);
    });
  });

  describe('selectors', () => {
    const mockState = {
      auth: { user: null, token: null, isLoading: false, isInitialized: true },
      ui: { sidebarOpen: true, globalLoading: false },
      authApi: {},
    };

    it('should select sidebarOpen', () => {
      expect(selectSidebarOpen(mockState as never)).toBe(true);
    });

    it('should select sidebarOpen when false', () => {
      const closedState = {
        ...mockState,
        ui: { ...mockState.ui, sidebarOpen: false },
      };
      expect(selectSidebarOpen(closedState as never)).toBe(false);
    });

    it('should select globalLoading', () => {
      expect(selectGlobalLoading(mockState as never)).toBe(false);
    });

    it('should select globalLoading when true', () => {
      const loadingState = {
        ...mockState,
        ui: { ...mockState.ui, globalLoading: true },
      };
      expect(selectGlobalLoading(loadingState as never)).toBe(true);
    });
  });
});
