import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { lazy, Suspense } from "react";

// Components
import LoadingSpinner from "./components/ui/LoadingSpinner";
import PageLayout from "./components/layout/PageLayout";

// Store
import { RootState } from "./store/store";

// Utils
import { ROUTES } from "./utils/constants";
import {
  isAdmin,
  isClient,
  isOnboardingRequired,
  getRedirectPath,
} from "./utils/authUtils";

// Lazy loaded pages for better performance
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));

// Route guards
interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectPath: string;
  children: JSX.Element;
}

const ProtectedRoute = ({
  isAllowed,
  redirectPath,
  children,
}: ProtectedRouteProps): JSX.Element => {
  return isAllowed ? children : <Navigate to={redirectPath} replace />;
};

function App() {
  const { user, view, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  console.log(
    isAuthenticated && isClient(user, view) && !isOnboardingRequired(user)
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <Routes>
          {/* Public route - Login */}
          <Route
            path={ROUTES.LOGIN}
            element={
              <ProtectedRoute
                isAllowed={!isAuthenticated}
                redirectPath={getRedirectPath(isAuthenticated, user, view)}
              >
                <LoginPage />
              </ProtectedRoute>
            }
          />

          {/* Admin route */}
          <Route
            path={ROUTES.ADMIN}
            element={
              <ProtectedRoute
                isAllowed={isAuthenticated && isAdmin(user, view)}
                redirectPath={ROUTES.LOGIN}
              >
                <PageLayout title="Admin Dashboard" showThemeToggle>
                  <AdminPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />

          {/* Client dashboard route */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute
                isAllowed={
                  isAuthenticated &&
                  isClient(user, view) &&
                  !isOnboardingRequired(user)
                }
                redirectPath={getRedirectPath(isAuthenticated, user, view)}
              >
                <PageLayout title="Dashboard" showThemeToggle>
                  <DashboardPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />

          {/* Onboarding route */}
          <Route
            path={ROUTES.ONBOARDING}
            element={
              <ProtectedRoute
                isAllowed={
                  isAuthenticated &&
                  isClient(user, view) &&
                  isOnboardingRequired(user)
                }
                redirectPath={getRedirectPath(isAuthenticated, user, view)}
              >
                <PageLayout
                  title="Complete Your Profile"
                  maxWidth="md"
                  centered
                >
                  <OnboardingPage />
                </PageLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect from home route */}
          <Route
            path={ROUTES.HOME}
            element={
              <Navigate
                to={getRedirectPath(isAuthenticated, user, view)}
                replace
              />
            }
          />

          {/* Catch all - redirect to appropriate page */}
          <Route
            path="*"
            element={
              <Navigate
                to={getRedirectPath(isAuthenticated, user, view)}
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
