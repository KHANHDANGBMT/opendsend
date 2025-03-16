import { User, View } from "../features/auth/authSlice";
import {
  USER_GROUPS,
  VIEW_TYPES,
  ONBOARDING_STATUS,
  ROUTES,
} from "./constants";

export const isAdmin = (user?: User | null, view?: View | null): boolean => {
  if (!user) return false;

  return (
    user.user_group === USER_GROUPS.ADMIN ||
    view?.type === VIEW_TYPES.ADMIN ||
    user.view?.type === VIEW_TYPES.ADMIN
  );
};

export const isClient = (user?: User | null, view?: View | null): boolean => {
  if (!user) return false;

  return (
    user.user_group === USER_GROUPS.USER ||
    view?.type === VIEW_TYPES.CLIENT ||
    user.view?.type === VIEW_TYPES.CLIENT
  );
};

export const isOnboardingRequired = (user?: User | null): boolean => {
  if (!user) return false;

  if (user.user_group === USER_GROUPS.ADMIN) return false;
  return (
    !user.store?.onboarding_procedure?.onboarding_status ||
    user.store?.onboarding_procedure?.onboarding_status !==
      ONBOARDING_STATUS.DONE
  );
};

export const getRedirectPath = (
  isAuthenticated: boolean,
  user?: User | null,
  view?: View | null
): string => {
  if (!isAuthenticated || !user) return ROUTES.LOGIN;

  if (user.user_group) {
    if (user.user_group === USER_GROUPS.ADMIN) return ROUTES.ADMIN;
    if (user.user_group === USER_GROUPS.USER) return ROUTES.DASHBOARD;
  }

  if (view?.type === VIEW_TYPES.ADMIN || user.view?.type === VIEW_TYPES.ADMIN) {
    return ROUTES.ADMIN;
  }

  const isClientView =
    view?.type === VIEW_TYPES.CLIENT || user.view?.type === VIEW_TYPES.CLIENT;
  console.log("🚀 ~ user:", user);

  if (isClientView) {
    if (
      user.store?.onboarding_procedure?.onboarding_status !==
      ONBOARDING_STATUS.DONE
    ) {
      return ROUTES.ONBOARDING;
    }
    return ROUTES.DASHBOARD;
  }

  return ROUTES.LOGIN;
};
