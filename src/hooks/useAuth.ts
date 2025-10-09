import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation, useMeQuery, useLogoutMutation } from "@/lib/store/api/authApi";
import { setCredentials, setLoading, setError, clearError, logout } from "@/lib/store/slices/authSlice";
import type { RootState } from "@/lib/store";
import type { LoginRequest, LoginFormData } from "@/types/auth";

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const { isLoading: isMeLoading } = useMeQuery(undefined, {
    skip: !auth.token, // Only run if we have a token
  });

  // Handle login
  const handleLogin = useCallback(async (formData: LoginFormData) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const loginRequest: LoginRequest = {
        email: formData.email,
        password: formData.password,
      };

      const result = await loginMutation(loginRequest).unwrap();
      
      // Store token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", result.token);
      }

      // Update Redux state
      dispatch(setCredentials(result));
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Login failed";
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, loginMutation]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error("Logout error:", error);
    } finally {
      // Clear local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      
      // Clear Redux state
      dispatch(logout());
    }
  }, [dispatch, logoutMutation]);

  // Check if user is authenticated
  const isAuthenticated = auth.isAuthenticated && !!auth.token;

  // Get current user
  const user = auth.user;

  // Get loading state
  const isLoading = auth.isLoading || isLoginLoading || isMeLoading;

  // Get error state
  const error = auth.error;

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login: handleLogin,
    logout: handleLogout,
    clearError: () => dispatch(clearError()),
  };
};
