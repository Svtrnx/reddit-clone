"use client"

import type React from "react"
import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Signin from "./pages/signin/Signin"
import Signup from "./pages/signup/Signup"
import Home from "./pages/home/Home"
import { useLocation } from 'react-router-dom';
import { GetCurrentUser } from "./services/user/userService"
import { Spinner } from "./components/ui/spinner"
import SubredditThread from "./pages/subredditThread/subredditThread"
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks"
import { setUser, setLoading } from "./features/userSlice"

import "./styles/App.css"

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    async function getCurrentUser() {
      try {
        dispatch(setLoading(true));
        const data = await GetCurrentUser();
        dispatch(setUser(data.user));
      } catch (error) {
        console.error("Error fetching user:", error);
        dispatch(setUser(null));
      } finally {
        dispatch(setLoading(false));
      }
    }

    getCurrentUser();
  }, [dispatch, location.pathname]);

  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAppSelector((state) => state.user)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" className="bg-black dark:bg-white" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAppSelector((state) => state.user)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" className="bg-black dark:bg-white" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <div className="content-wrapper">
          <Routes>
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <Signin />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subreddit/:subreddit"
              element={
                <ProtectedRoute>
                  <SubredditThread />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/signin" />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}

