// Data service for superannuation advisor dashboard
// Connects to ML backend API

const API_BASE_URL = "/api";

export interface SignupData {
  name: string;
  username: string;
  password: string;
  age: number;
  gender: string;
  country: string;
  employment_status: string;
  annual_income: number;
  current_savings: number;
  retirement_age_goal: number;
  risk_tolerance: "Low" | "Medium" | "High";
  contribution_amount: number;
  contribution_frequency: string;
  employer_contribution: number;
  years_contributed: number;
  investment_type: string;
  fund_name: string;
  marital_status: string;
  number_of_dependents: number;
  education_level: string;
  health_status: string;
  home_ownership_status: string;
  investment_experience_level: string;
  financial_goals: string;
  insurance_coverage: string;
  pension_type: string;
  withdrawal_strategy: string;
  // Additional fields used by ML models
  debt_level: string;
  savings_rate: number;
  portfolio_diversity_score: number;
  monthly_expenses: number;
  transaction_amount: number;
  transaction_pattern_score: number;
  anomaly_score: number;
  suspicious_flag: string;
}

// Login interface
export interface LoginCredentials {
  username: string; // Email address
  password: string;
}

export interface LoginResult {
  success: boolean;
  userId?: string;
  name?: string;
  username?: string;
  message?: string;
}

export interface User {
  User_ID: string;
  Name: string;
  Age: number;
  Risk_Tolerance: string;
  Annual_Income: number;
  Current_Savings: number;
}

export interface UserProfile {
  User_ID: string;
  Name?: string; // Generated name from backend
  Age: number;
  Gender: string;
  Country: string;
  Employment_Status: string;
  Annual_Income: number;
  Current_Savings: number;
  Retirement_Age_Goal: number;
  Risk_Tolerance: "Low" | "Medium" | "High";
  Contribution_Amount: number;
  Contribution_Frequency: string;
  Employer_Contribution: number;
  Total_Annual_Contribution: number;
  Years_Contributed: number;
  Investment_Type: string;
  Fund_Name: string;
  Annual_Return_Rate: number;
  Volatility: number;
  Fees_Percentage: number;
  Projected_Pension_Amount: number;
  Expected_Annual_Payout: number;
  Inflation_Adjusted_Payout: number;
  Years_of_Payout: number;
  Survivor_Benefits: string;
  Marital_Status: string;
  Number_of_Dependents: number;
  Education_Level: string;
  Health_Status: string;
  Life_Expectancy_Estimate: number;
  Home_Ownership_Status: string;
  Debt_Level: number;
  Monthly_Expenses: number;
  Savings_Rate: number;
  Investment_Experience_Level: string;
  Financial_Goals: string;
  Insurance_Coverage: string;
  Portfolio_Diversity_Score: number;
  Tax_Benefits_Eligibility: string;
  Government_Pension_Eligibility: string;
  Private_Pension_Eligibility: string;
  Pension_Type: string;
  Withdrawal_Strategy: string;
}

// Sample user IDs from the dataset (first 10 users)
export const sampleUserIds = [
  "U1000",
  "U1001",
  "U1002",
  "U1003",
  "U1004",
  "U1005",
  "U1006",
  "U1007",
  "U1008",
  "U1009",
];

// API service for connecting to ML backend
export const dataService = {
  // Get user profile from API
  getUserById: async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log(
        `Fetching user ${userId} from ${API_BASE_URL}/user/${userId}`,
      );
      const response = await fetch(`${API_BASE_URL}/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: User ${userId} not found`);
      }
      const data = await response.json();
      console.log("User data received:", data);
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Re-throw to let caller handle
    }
  },

  // Get all available user IDs
  getAllUserIds: (): string[] => {
    return sampleUserIds;
  },

  // Get summary statistics for dashboard
  getSummaryStats: async (userId: string) => {
    try {
      console.log(`Fetching summary for ${userId}`);
      const response = await fetch(`${API_BASE_URL}/summary/${userId}`);
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Summary not found for user ${userId}`,
        );
      }
      const data = await response.json();
      console.log("Summary data received:", data);
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching summary:", error);
      throw error;
    }
  },

  // Get peer comparison data
  getPeerComparison: async (userId: string) => {
    try {
      console.log(`Fetching peer stats for ${userId}`);
      const response = await fetch(`${API_BASE_URL}/peer_stats/${userId}`);
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Peer stats not found for user ${userId}`,
        );
      }
      const data = await response.json();
      console.log("Peer stats received:", data);
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching peer stats:", error);
      throw error;
    }
  },

  // Get pension projection
  getPensionProjection: async (userId: string, extraMonthly: number = 0) => {
    try {
      console.log(
        `Fetching projection for ${userId} with extra monthly: ${extraMonthly}`,
      );
      const response = await fetch(`${API_BASE_URL}/simulate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          extra_monthly: extraMonthly,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: Projection not found for user ${userId}`,
        );
      }
      const data = await response.json();
      console.log("Projection data received:", data);
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching projection:", error);
      throw error;
    }
  },

  // Get risk prediction
  getRiskPrediction: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/risk/${userId}`);
      if (!response.ok) {
        throw new Error(`Risk prediction not found for user ${userId}`);
      }
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error fetching risk prediction:", error);
      return null;
    }
  },

  // Send chat message to AI
  sendChatMessage: async (userId: string, message: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          message: message,
        }),
      });
      if (!response.ok) {
        throw new Error(`Chat response error`);
      }
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error("Error sending chat message:", error);
      return null;
    }
  },

  // Signup interfaces
  signupUser: async (
    signupData: SignupData,
  ): Promise<{
    success: boolean;
    userId: string;
    user: any;
    message: string;
  }> => {
    try {
      console.log("Attempting signup for user:", signupData.username);
      console.log("Signup data (excluding password):", {
        ...signupData,
        password: "***",
      });

      // Call backend API to create user (backend generates User_ID)
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupData.name,
          username: signupData.username,
          password: signupData.password,
          age: signupData.age,
          gender: signupData.gender,
          country: signupData.country,
          employment_status: signupData.employment_status,
          annual_income: signupData.annual_income,
          current_savings: signupData.current_savings,
          retirement_age_goal: signupData.retirement_age_goal,
          risk_tolerance: signupData.risk_tolerance,
          contribution_amount: signupData.contribution_amount,
          contribution_frequency: signupData.contribution_frequency,
          employer_contribution: signupData.employer_contribution,
          years_contributed: signupData.years_contributed,
          investment_type: signupData.investment_type,
          fund_name: signupData.fund_name,
          marital_status: signupData.marital_status,
          number_of_dependents: signupData.number_of_dependents,
          education_level: signupData.education_level,
          health_status: signupData.health_status,
          home_ownership_status: signupData.home_ownership_status,
          investment_experience_level: signupData.investment_experience_level,
          financial_goals: signupData.financial_goals,
          insurance_coverage: signupData.insurance_coverage,
          pension_type: signupData.pension_type,
          withdrawal_strategy: signupData.withdrawal_strategy,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Backend error: ${response.status}`,
        );
      }

      const backendResult = await response.json();
      console.log("Backend signup successful:", backendResult);

      if (backendResult.user_id) {
        const session = {
          userId: backendResult.user_id,
          username: signupData.username,
          name: signupData.name,
          loggedInAt: new Date().toISOString(),
        };
        localStorage.setItem("userSession", JSON.stringify(session));

        return {
          success: true,
          userId: backendResult.user_id,
          user: backendResult.user_data,
          message: backendResult.message,
        };
      } else {
        throw new Error("No user ID returned from backend");
      }
    } catch (error) {
      console.error("Error signing up user:", error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  // Login user with username(email) and password
  loginUser: async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      const { supabase } = await import("@/lib/supabase");

      console.log("Attempting login for username:", credentials.username);

      // Find the user by username(email)
      const { data: userData, error: userError } = await supabase
        .from("MUFG")
        .select("*")
        .eq("username", credentials.username)
        .single();

      if (userError || !userData) {
        console.error("User not found or error:", userError);
        return {
          success: false,
          message: "Invalid username or password.",
        };
      }

      // Verify password: support plaintext and bcrypt-hashed
      const storedPassword: string = userData.Password || "";
      let isPasswordValid = false;
      if (storedPassword.startsWith("$2")) {
        const bcrypt = await import("bcryptjs");
        isPasswordValid = await bcrypt.compare(
          credentials.password,
          storedPassword,
        );
      } else {
        isPasswordValid = credentials.password === storedPassword;
      }

      if (!isPasswordValid) {
        console.error("Invalid password");
        return {
          success: false,
          message: "Invalid username or password.",
        };
      }

      const session = {
        userId: userData.User_ID,
        username: userData.username,
        name: userData.Name,
        loggedInAt: new Date().toISOString(),
      };

      localStorage.setItem("userSession", JSON.stringify(session));

      return {
        success: true,
        userId: userData.User_ID,
        name: userData.Name,
        message: "Login successful",
        username: userData.username,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "An error occurred during login. Please try again.",
      };
    }
  },
};
