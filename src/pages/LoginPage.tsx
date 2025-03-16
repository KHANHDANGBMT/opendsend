import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/auth/authApi";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { isValidEmail } from "../utils/validation";
import { VIEW_TYPES, ROUTES, ONBOARDING_STATUS } from "../utils/constants";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useDispatch } from "react-redux";
import { updateUserStore } from "../features/auth/authSlice";

// Base URL from the storeApi
const BASE_URL = "https://stgapp-bwgkn3md.opensend.com";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // RTK Query hook for login mutation
  const [login, { isLoading }] = useLoginMutation();

  // Validate form on submission
  const validateForm = () => {
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();

      // Check if view type is CLIENT
      if (response.view.type === VIEW_TYPES.CLIENT) {
        // Get store ID from the first access in the response
        const storeId = response.accesses[0]?.store_id;

        if (storeId) {
          // Fetch store info to check onboarding status
          try {
            // Use direct fetch call to get store info
            console.log("🚀 ~ handleSubmit ~ response:", response);
            const storeResponse = await fetch(`${BASE_URL}/store/${storeId}`, {
              headers: {
                "Access-Token": `Bearer ${response.tokens.accessToken}`,
                "Client-Token": response.tokens.clientToken,
              },
            });

            if (storeResponse.ok) {
              console.log("🚀 ~ handleSubmit ~ storeResponse:", storeResponse);
              const storeInfo = await storeResponse.json();

              dispatch(updateUserStore(storeInfo.store));
              console.log("🚀 ~ handleSubmit ~ storeInfo:", storeInfo);
              if (
                storeInfo?.store.onboarding_procedure?.onboarding_status !==
                ONBOARDING_STATUS.DONE
              ) {
                navigate(ROUTES.ONBOARDING);
              } else {
                navigate(ROUTES.DASHBOARD);
              }
            } else {
              console.error("Store API returned error:", storeResponse.status);
              navigate(ROUTES.DASHBOARD);
            }
          } catch (error) {
            console.error("Failed to fetch store info:", error);
            navigate(ROUTES.DASHBOARD);
          }
        } else {
          navigate(ROUTES.DASHBOARD);
        }
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setEmailError("Invalid email or password");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            error={emailError}
            icon={<FaEnvelope />}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              error={passwordError}
              icon={<FaLock />}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
