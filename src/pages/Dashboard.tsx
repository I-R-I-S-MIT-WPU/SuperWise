import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { NavigationTabs } from "@/components/dashboard/NavigationTabs";
import { PortfolioPage } from "@/components/dashboard/PortfolioPage";
import { GoalsPage } from "@/components/dashboard/GoalsPage";
import { EducationPage } from "@/components/dashboard/EducationPage";
import { RiskPage } from "@/components/dashboard/RiskPage";
import { ChatbotPageWithSpeech } from "@/components/dashboard/ChatbotPageWithSpeech";
import { FloatingChatButton } from "@/components/dashboard/FloatingChatButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { SupabaseService } from "@/services/supabaseService";

import { LogOut, User, ArrowLeft } from "lucide-react";

export default function Dashboard() {
  console.log("Dashboard component rendering...");
  const { user, loading: authLoading, signOut } = useAuth();
  const { adminUser, isAdminMode, logout: adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("chatbot");
  const [goals, setGoals] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [summaryStats, setSummaryStats] = useState<any>(null);
  const [peerComparison, setPeerComparison] = useState<any>(null);
  const [projection, setProjection] = useState<any>(null);
  const [customUserId, setCustomUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [advancedMetrics, setAdvancedMetrics] = useState<any>(null);

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const userIdFromState = (location.state as any)?.userId;
    const currentUserFromStorage = localStorage.getItem("currentUser");
    const userSessionFromStorage = localStorage.getItem("userSession");
    console.log("Checking for custom userId:", {
      userIdFromState,
      currentUserFromStorage,
    });
    if (userIdFromState) {
      console.log("Got userId from navigation state:", userIdFromState);
      setCustomUserId(userIdFromState);
    } else if (currentUserFromStorage) {
      try {
        const userData = JSON.parse(currentUserFromStorage);
        console.log("Got userId from localStorage:", userData.userId);
        setCustomUserId(userData.userId);
      } catch (error) {
        console.error("Error parsing currentUser from localStorage:", error);
      }
    } else if (userSessionFromStorage) {
      try {
        const session = JSON.parse(userSessionFromStorage);
        if (session?.userId) {
          console.log("Got userId from userSession:", session.userId);
          setCustomUserId(session.userId);
        }
      } catch (error) {
        console.error("Error parsing userSession from localStorage:", error);
      }
    } else {
      console.log("No custom userId found");
    }
    // Mark initialization as complete
    setInitializing(false);
  }, []);

  const loadAdvancedMetrics = async (userId: string) => {
    try {
      console.log("Loading advanced metrics for userId:", userId);
      const response = await fetch(`/api/advanced_analysis/${userId}`);
      console.log("Advanced metrics response status:", response.status);
      const data = await response.json();
      console.log("Advanced metrics API response:", data);

      if (data.success) {
        const analysis = data.data;
        console.log("Analysis data:", analysis);
        const metrics = {
          financial_health_score:
            analysis.financial_health?.financial_health_score || 0,
          churn_risk_percentage:
            (analysis.churn_risk?.churn_probability || 0) * 100,
          anomaly_score: analysis.anomaly_detection?.anomaly_percentage || 0,
        };
        console.log("Setting advanced metrics:", metrics);
        setAdvancedMetrics(metrics);
      } else {
        console.log("Advanced metrics API failed, using fallback calculations");
        // Fallback calculations based on user data
        const user = currentUser;
        if (user) {
          const healthScore = calculateFinancialHealthScore(user);
          const churnRisk = calculateChurnRisk(user);
          // Anomaly score is not available in Supabase - only from ML API
          const anomalyScore = 0; // Default to 0 if ML API fails

          console.log("Fallback calculations:", {
            healthScore,
            churnRisk,
            anomalyScore,
          });
          setAdvancedMetrics({
            financial_health_score: healthScore,
            churn_risk_percentage: churnRisk,
            anomaly_score: anomalyScore,
          });
        }
      }
    } catch (error) {
      console.error("Error loading advanced metrics:", error);
      // Fallback calculations
      const user = currentUser;
      if (user) {
        const healthScore = calculateFinancialHealthScore(user);
        const churnRisk = calculateChurnRisk(user);
        // Anomaly score is not available in Supabase - only from ML API
        const anomalyScore = 0; // Default to 0 if ML API fails

        console.log("Error fallback calculations:", {
          healthScore,
          churnRisk,
          anomalyScore,
        });
        setAdvancedMetrics({
          financial_health_score: healthScore,
          churn_risk_percentage: churnRisk,
          anomaly_score: anomalyScore,
        });
      }
    }
  };

  const calculateFinancialHealthScore = (user: any) => {
    let score = 0;

    console.log("Calculating financial health score for user:", user);

    // Income component (20 points)
    const income = user.Annual_Income || 0;
    console.log("User income:", income);
    if (income > 100000) score += 20;
    else if (income > 75000) score += 15;
    else if (income > 50000) score += 10;
    else score += 5;

    // Savings component (25 points)
    const savingsRatio = (user.Current_Savings || 0) / (income || 1);
    if (savingsRatio > 2.0) score += 25;
    else if (savingsRatio > 1.0) score += 20;
    else if (savingsRatio > 0.5) score += 15;
    else if (savingsRatio > 0.2) score += 10;
    else score += 5;

    // Contribution component (20 points)
    const contribRatio = (user.Contribution_Amount || 0) / (income || 1);
    if (contribRatio > 0.15) score += 20;
    else if (contribRatio > 0.1) score += 15;
    else if (contribRatio > 0.05) score += 10;
    else score += 5;

    // Debt component (15 points) - simplified
    const debtLevel = user.Debt_Level || 0;
    if (debtLevel < 20000) score += 15;
    else if (debtLevel < 50000) score += 10;
    else if (debtLevel < 100000) score += 5;

    // Age component (10 points)
    const age = user.Age || 0;
    if (age >= 25 && age <= 35) score += 10;
    else if (age >= 36 && age <= 45) score += 8;
    else if (age >= 46 && age <= 55) score += 6;
    else score += 4;

    // Investment experience (10 points)
    const expLevel = user.Investment_Experience_Level || "Beginner";
    if (expLevel === "Expert") score += 10;
    else if (expLevel === "Intermediate") score += 7;
    else score += 4;

    const finalScore = Math.min(100, Math.max(0, score));
    console.log("Final financial health score:", finalScore);
    return finalScore;
  };

  const calculateChurnRisk = (user: any) => {
    let risk = 0;

    console.log("Calculating churn risk for user:", user);

    // Age factor
    const age = user.Age || 0;
    console.log("User age:", age);
    if (age < 30) risk += 15;
    else if (age < 40) risk += 10;
    else if (age < 50) risk += 5;

    // Employment status
    const employment = user.Employment_Status || "";
    if (employment === "Unemployed") risk += 20;
    else if (employment === "Part-time") risk += 10;
    else if (employment === "Self-employed") risk += 5;

    // Contribution frequency
    const freq = user.Contribution_Frequency || "";
    if (freq === "Annually") risk += 15;
    else if (freq === "Quarterly") risk += 8;
    else if (freq === "Monthly") risk += 2;

    // Years contributed
    const years = user.Years_Contributed || 0;
    if (years < 2) risk += 20;
    else if (years < 5) risk += 10;
    else if (years < 10) risk += 5;

    // Income stability
    const income = user.Annual_Income || 0;
    if (income < 40000) risk += 15;
    else if (income < 60000) risk += 8;
    else if (income < 80000) risk += 3;

    const finalRisk = Math.min(100, Math.max(0, risk));
    console.log("Final churn risk:", finalRisk);
    return finalRisk;
  };

  const loadUserData = async () => {
    // Use custom userId if available, otherwise fall back to admin mode
    const userIdToUse =
      customUserId || (isAdminMode ? adminUser?.User_ID : null);

    if (!userIdToUse) {
      console.log("No userId available for loading data");
      return;
    }

    console.log("Loading user data for userId:", userIdToUse);

    if (isAdminMode && adminUser) {
      console.log("Admin user data:", adminUser);
      console.log(
        "Admin user Employer_Contribution:",
        adminUser.Employer_Contribution,
      );
      console.log(
        "Admin user Contribution_Amount:",
        adminUser.Contribution_Amount,
      );
      console.log(
        "Admin user anomaly score:",
        adminUser.Anomaly_Score ?? adminUser.anomaly_score ?? 0,
      );
      setCurrentUser(adminUser);

      // Get real projection data from ML API for admin user
      try {
        const projectionResponse = await fetch(
          `/api/projection/${adminUser.User_ID}`,
        );
        const projectionData = await projectionResponse.json();

        if (projectionData.success) {
          // Calculate monthly increase needed
          // The user wants to reach their Projected_Pension_Amount goal
          // The ML model predicts they'll have adjusted_projection with current contributions
          // We need to calculate how much more they need to contribute monthly to reach their goal
          const retirementGoal =
            adminUser.Projected_Pension_Amount || adminUser.Current_Savings * 5; // What they want to have
          const projectedAmount = projectionData.data.adjusted_projection; // What they'll actually have with current contributions
          const currentSavings = adminUser.Current_Savings; // What they have now
          const yearsToRetirement =
            projectionData.data.years_to_retirement || 35;

          console.log("Projection calculation debug:", {
            retirementGoal,
            projectedAmount,
            currentSavings,
            yearsToRetirement,
            adjusted_projection: projectionData.data.adjusted_projection,
            years_to_retirement: projectionData.data.years_to_retirement,
            gap: retirementGoal - projectedAmount,
            totalMonths: yearsToRetirement * 12,
            isExceedingGoal: projectedAmount > retirementGoal,
          });

          // Calculate how much more they need to contribute monthly to reach their goal
          // If they're already exceeding their goal, show 0
          // If they're short, calculate the monthly increase needed
          const monthlyIncreaseNeeded = Math.max(
            0,
            (retirementGoal - projectedAmount) / (yearsToRetirement * 12),
          );

          console.log("Monthly increase needed calculation:", {
            numerator: retirementGoal - projectedAmount,
            denominator: yearsToRetirement * 12,
            result: monthlyIncreaseNeeded,
            isExceedingGoal: projectedAmount > retirementGoal,
            excessAmount: projectedAmount - retirementGoal,
          });

          setProjection({
            ...projectionData.data,
            monthly_increase_needed: Number(monthlyIncreaseNeeded), // Ensure it's a native JavaScript number
          });
          setSummaryStats({
            current_savings: adminUser.Current_Savings,
            projected_pension:
              projectionData.data.adjusted_projection ||
              adminUser.Projected_Pension_Amount,
            percent_to_goal:
              (adminUser.Current_Savings /
                (projectionData.data.adjusted_projection ||
                  adminUser.Projected_Pension_Amount)) *
              100,
            monthly_income_at_retirement:
              projectionData.data.monthly_income_at_retirement || 0,
          });
        } else {
          // Fallback to mock data if API fails
          const targetAmount =
            adminUser.Projected_Pension_Amount || adminUser.Current_Savings * 5;
          const monthlyIncreaseNeeded = Math.max(
            0,
            (targetAmount - adminUser.Current_Savings) / (35 * 12),
          );

          setSummaryStats({
            current_savings: adminUser.Current_Savings,
            projected_pension: targetAmount,
            percent_to_goal: 20,
            monthly_income_at_retirement: targetAmount / 12,
          });
          setProjection({
            current_projection: adminUser.Current_Savings * 5,
            adjusted_projection: targetAmount,
            monthly_income_at_retirement: targetAmount / 12,
            monthly_increase_needed: Number(monthlyIncreaseNeeded), // Ensure it's a native JavaScript number
          });
        }
      } catch (error) {
        console.error("Error loading projection data for admin user:", error);
        // Fallback to mock data
        const targetAmount =
          adminUser.Projected_Pension_Amount || adminUser.Current_Savings * 5;
        const monthlyIncreaseNeeded = Math.max(
          0,
          (targetAmount - adminUser.Current_Savings) / (35 * 12),
        );

        setSummaryStats({
          current_savings: adminUser.Current_Savings,
          projected_pension: targetAmount,
          percent_to_goal: 20,
          monthly_income_at_retirement: targetAmount / 12,
        });
        setProjection({
          current_projection: adminUser.Current_Savings * 5,
          adjusted_projection: targetAmount,
          monthly_income_at_retirement: targetAmount / 12,
          monthly_increase_needed: Number(monthlyIncreaseNeeded), // Ensure it's a native JavaScript number
        });
      }

      // Get real peer comparison data from ML API for admin user
      try {
        const peerResponse = await fetch(
          `/api/peer_stats/${adminUser.User_ID}`,
        );
        const peerData = await peerResponse.json();

        if (peerData.success) {
          // Convert common_investment_types to investment_types format expected by SummaryCard
          const investmentTypes: Record<string, { count: number; percentage: number }> = {};
          const peerStats = peerData.data.peer_stats || {};

          console.log("Admin Peer data received:", peerData);
          console.log("Admin Peer stats:", peerStats);
          console.log(
            "Admin Common investment types:",
            peerStats.common_investment_types,
          );

          const commonInvestmentTypes = peerStats.common_investment_types as Record<string, number> | undefined;
          if (commonInvestmentTypes) {
            const totalPeers = peerStats.total_peers || 1;
            Object.entries(commonInvestmentTypes).forEach(([type, count]) => {
              const countValue = Number(count) || 0;
              investmentTypes[type] = {
                count: countValue,
                percentage: Math.round((countValue / totalPeers) * 100),
              };
            });
          }

          console.log("Admin Processed investment types:", investmentTypes);

          setPeerComparison({
            total_peers: peerStats.total_peers || 0,
            avg_age: peerStats.avg_age || 0,
            avg_income: peerStats.avg_income || 0,
            avg_savings: peerStats.avg_savings || 0,
            avg_contribution: peerStats.avg_contribution || 0,
            investment_types: investmentTypes,
          });
        } else {
          // Fallback to mock data
          setPeerComparison({
            total_peers: 100,
            avg_age: 35,
            avg_income: 75000,
            avg_savings: 25000,
            avg_contribution: 1200,
            investment_types: {
              ETF: { count: 45, percentage: 45 },
              "Managed Fund": { count: 30, percentage: 30 },
              "Index Fund": { count: 25, percentage: 25 },
            },
          });
        }
      } catch (error) {
        console.error("Error loading peer data for admin user:", error);
        // Fallback to mock data
        setPeerComparison({
          total_peers: 100,
          avg_age: 35,
          avg_income: 75000,
          avg_savings: 25000,
          avg_contribution: 1200,
          investment_types: {
            ETF: { count: 45, percentage: 45 },
            "Managed Fund": { count: 30, percentage: 30 },
            "Index Fund": { count: 25, percentage: 25 },
          },
        });
      }

      return;
    }

    // For custom login, use the custom userId
    if (customUserId) {
      try {
        setError(null);
        setLoading(true);

        console.log("Loading user profile for custom userId:", customUserId);

        // Load user profile from Supabase using the custom userId
        const userProfile = await SupabaseService.getUserProfile(customUserId);

        if (userProfile) {
          setCurrentUser(userProfile);

          // Get real projection data from ML API
          try {
            const projectionResponse = await fetch(
              `/api/projection/${customUserId}`,
            );
            const projectionData = await projectionResponse.json();

            if (projectionData.success) {
              // Calculate monthly increase needed
              // The user wants to reach their Projected_Pension_Amount goal
              // The ML model predicts they'll have adjusted_projection with current contributions
              // We need to calculate how much more they need to contribute monthly to reach their goal
              const retirementGoal =
                userProfile.Projected_Pension_Amount ||
                userProfile.Current_Savings * 5; // What they want to have
              const projectedAmount = projectionData.data.adjusted_projection; // What they'll actually have with current contributions
              const currentSavings = userProfile.Current_Savings; // What they have now
              const yearsToRetirement =
                projectionData.data.years_to_retirement || 35;

              console.log("Custom user projection calculation debug:", {
                retirementGoal,
                projectedAmount,
                currentSavings,
                yearsToRetirement,
                adjusted_projection: projectionData.data.adjusted_projection,
                years_to_retirement: projectionData.data.years_to_retirement,
                gap: retirementGoal - projectedAmount,
                totalMonths: yearsToRetirement * 12,
                isExceedingGoal: projectedAmount > retirementGoal,
              });

              // Calculate how much more they need to contribute monthly to reach their goal
              // If they're already exceeding their goal, show 0
              // If they're short, calculate the monthly increase needed
              const monthlyIncreaseNeeded = Math.max(
                0,
                (retirementGoal - projectedAmount) / (yearsToRetirement * 12),
              );

              console.log("Custom user monthly increase needed calculation:", {
                numerator: retirementGoal - projectedAmount,
                denominator: yearsToRetirement * 12,
                result: monthlyIncreaseNeeded,
                isExceedingGoal: projectedAmount > retirementGoal,
                excessAmount: projectedAmount - retirementGoal,
              });

              setProjection({
                ...projectionData.data,
                monthly_increase_needed: Number(monthlyIncreaseNeeded), // Ensure it's a native JavaScript number
              });
              setSummaryStats({
                current_savings: userProfile.Current_Savings,
                projected_pension:
                  projectionData.data.adjusted_projection ||
                  userProfile.Projected_Pension_Amount,
                percent_to_goal:
                  (userProfile.Current_Savings /
                    (projectionData.data.adjusted_projection ||
                      userProfile.Projected_Pension_Amount)) *
                  100,
                monthly_income_at_retirement:
                  projectionData.data.monthly_income_at_retirement || 0,
              });
            } else {
              // Fallback to mock data if API fails
              const targetAmount =
                userProfile.Projected_Pension_Amount ||
                userProfile.Current_Savings * 5;
              const monthlyIncreaseNeeded = Math.max(
                0,
                (targetAmount - userProfile.Current_Savings) / (35 * 12),
              ); // Assume 35 years to retirement

              setSummaryStats({
                current_savings: userProfile.Current_Savings,
                projected_pension: targetAmount,
                percent_to_goal: 20,
                monthly_income_at_retirement: targetAmount / 12,
              });
              setProjection({
                current_projection: userProfile.Current_Savings * 5,
                adjusted_projection: targetAmount,
                monthly_income_at_retirement: targetAmount / 12,
                monthly_increase_needed: Number(monthlyIncreaseNeeded), // Ensure it's a native JavaScript number
              });
            }
          } catch (error) {
            console.error("Error loading projection data:", error);
            // Fallback to mock data
            const targetAmount =
              userProfile.Projected_Pension_Amount ||
              userProfile.Current_Savings * 5;
            const monthlyIncreaseNeeded = Math.max(
              0,
              (targetAmount - userProfile.Current_Savings) / (35 * 12),
            );

            setSummaryStats({
              current_savings: userProfile.Current_Savings,
              projected_pension: targetAmount,
              percent_to_goal: 20,
              monthly_income_at_retirement: targetAmount / 12,
            });
            setProjection({
              current_projection: userProfile.Current_Savings * 5,
              adjusted_projection: targetAmount,
              monthly_income_at_retirement: targetAmount / 12,
              monthly_increase_needed: Number(monthlyIncreaseNeeded), // Ensure it's a native JavaScript number
            });
          }

          // Get real peer comparison data from ML API
          try {
            const peerResponse = await fetch(`/api/peer_stats/${customUserId}`);
            const peerData = await peerResponse.json();

            if (peerData.success) {
              // Convert common_investment_types to investment_types format expected by SummaryCard
              const investmentTypes = {};
              const peerStats = peerData.data.peer_stats || {};

              console.log("Peer data received:", peerData);
              console.log("Peer stats:", peerStats);
              console.log(
                "Common investment types:",
                peerStats.common_investment_types,
              );

              const commonInvestmentTypes = peerStats.common_investment_types as Record<string, number> | undefined;
              if (commonInvestmentTypes) {
                const totalPeers = peerStats.total_peers || 1;
                Object.entries(commonInvestmentTypes).forEach(([type, count]) => {
                  const countValue = Number(count) || 0;
                  investmentTypes[type] = {
                    count: countValue,
                    percentage: Math.round((countValue / totalPeers) * 100),
                  };
                });
              }

              console.log("Processed investment types:", investmentTypes);

              setPeerComparison({
                total_peers: peerStats.total_peers || 0,
                avg_age: peerStats.avg_age || 0,
                avg_income: peerStats.avg_income || 0,
                avg_savings: peerStats.avg_savings || 0,
                avg_contribution: peerStats.avg_contribution || 0,
                investment_types: investmentTypes,
              });
            } else {
              // Fallback to mock data
              setPeerComparison({
                total_peers: 100,
                avg_age: 35,
                avg_income: 75000,
                avg_savings: 25000,
                avg_contribution: 1200,
                investment_types: {
                  ETF: { count: 45, percentage: 45 },
                  "Managed Fund": { count: 30, percentage: 30 },
                  "Index Fund": { count: 25, percentage: 25 },
                },
              });
            }
          } catch (error) {
            console.error("Error loading peer data:", error);
            // Fallback to mock data
            setPeerComparison({
              total_peers: 100,
              avg_age: 35,
              avg_income: 75000,
              avg_savings: 25000,
              avg_contribution: 1200,
              investment_types: {
                ETF: { count: 45, percentage: 45 },
                "Managed Fund": { count: 30, percentage: 30 },
                "Index Fund": { count: 25, percentage: 25 },
              },
            });
          }
        } else {
          setError("User profile not found");
        }
      } catch (error) {
        console.error("Error loading custom user data:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }

      return;
    }

    // Fallback to Supabase auth user (if any)
    if (!user) return;

    try {
      setError(null);
      setLoading(true);

      const userProfile = await SupabaseService.getUserProfile(user.id);

      if (userProfile) {
        setCurrentUser(userProfile);
        // Generate mock data for now - you can replace with real calculations
        setSummaryStats({
          current_savings: userProfile.Current_Savings,
          projected_pension: userProfile.Current_Savings * 5,
          percent_to_goal: 20,
          monthly_income_at_retirement:
            (userProfile.Current_Savings * 0.04) / 12,
        });
        setPeerComparison({
          total_peers: 100,
          avg_age: 35,
          avg_income: 75000,
          avg_savings: 25000,
          avg_contribution: 1200,
        });
        setProjection({
          current_projection: userProfile.Current_Savings * 5,
          adjusted_projection: (userProfile.Current_Savings || 0) * 6,
          years_to_retirement:
            (userProfile.Retirement_Age_Goal || 65) - (userProfile.Age || 0),
          monthly_income_at_retirement:
            (userProfile.Current_Savings * 0.04) / 12,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (isAdminMode) {
      adminLogout();
      navigate("/user-manager");
    } else if (customUserId) {
      // Handle custom login sign out
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userSession");
      setCustomUserId(null);
      navigate("/login");
    } else {
      try {
        localStorage.removeItem("userSession");
      } catch (e) {}
      await signOut();
      navigate("/login");
    }
  };

  // Redirect to login if not authenticated (unless in admin mode)
  const redirectingRef = useRef(false);
  useEffect(() => {
    console.log("Auth check:", {
      authLoading,
      user: !!user,
      isAdminMode,
      customUserId,
      initializing,
    });
    if (redirectingRef.current) return;
    // Only redirect if we're sure there's no authentication method available and initialization is complete
    if (
      !authLoading &&
      !user &&
      !isAdminMode &&
      !customUserId &&
      !initializing
    ) {
      console.log("No authentication found, redirecting to login");
      redirectingRef.current = true;
      try {
        localStorage.removeItem("userSession");
        localStorage.removeItem("currentUser");
      } catch (e) {}
      navigate("/login", { replace: true });
    }
  }, [user, authLoading, isAdminMode, customUserId, initializing, navigate]);

  // Load user data when user is authenticated or in admin mode
  useEffect(() => {
    if (user || isAdminMode || customUserId) {
      loadUserData();
    }
  }, [user, isAdminMode, customUserId]);

  // Load advanced metrics when currentUser is set
  useEffect(() => {
    if (currentUser && (isAdminMode || customUserId || user)) {
      const userId =
        customUserId || (isAdminMode ? currentUser.User_ID : user?.id);
      if (userId) {
        loadAdvancedMetrics(userId);
      }
    }
  }, [currentUser, isAdminMode, customUserId, user]);

  const handleRiskChange = (riskTolerance: string) => {
    console.log("Risk tolerance changed to:", riskTolerance);
  };

  const handleGoalChange = (newGoals: any[]) => {
    setGoals(newGoals);
  };

  console.log("Dashboard state check:", {
    authLoading,
    loading,
    initializing,
    currentUser: !!currentUser,
  });

  if (authLoading || loading || initializing) {
    console.log("Dashboard showing loading screen");
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4'></div>
          <h2 className='text-2xl font-semibold text-card-foreground'>
            Loading your dashboard...
          </h2>
          <p className='text-muted-foreground mt-2'>
            Fetching your financial data
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    console.log("Dashboard showing no currentUser screen");
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-card-foreground mb-4'>
            Unable to load user data
          </h2>
          <p className='text-muted-foreground mb-4'>
            Please complete your profile setup
          </p>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
              <p className='text-sm'>Error: {error}</p>
            </div>
          )}
          <div className='space-x-4'>
            <Button onClick={loadUserData} className='btn-action'>
              Try Again
            </Button>
            <Button onClick={handleSignOut} variant='outline'>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Generate allocation data based on user's investment types
  const allocationData = [
    { name: "Australian Shares", current: 35, recommended: 30 },
    { name: "International Shares", current: 25, recommended: 25 },
    { name: "Property/REITs", current: 20, recommended: 20 },
    { name: "Fixed Income", current: 15, recommended: 20 },
    { name: "Cash", current: 5, recommended: 5 },
  ];

  // Generate growth projection data
  const currentSavings = currentUser?.Current_Savings || 0;
  const totalContribution = currentUser?.Total_Annual_Contribution || 0;

  const growthData = [
    {
      year: 2024,
      balance: currentSavings,
      contributions: totalContribution,
      milestone: "Current Position",
    },
    {
      year: 2025,
      balance: Math.round(currentSavings * 1.08),
      contributions: totalContribution,
    },
    {
      year: 2026,
      balance: Math.round(currentSavings * 1.16),
      contributions: totalContribution,
    },
    {
      year: 2027,
      balance: Math.round(currentSavings * 1.25),
      contributions: totalContribution,
      milestone: "Major Market Growth",
    },
    {
      year: 2028,
      balance: Math.round(currentSavings * 1.35),
      contributions: totalContribution,
    },
    {
      year: 2029,
      balance: Math.round(currentSavings * 1.46),
      contributions: totalContribution,
    },
    {
      year: 2030,
      balance: Math.round(currentSavings * 1.58),
      contributions: totalContribution,
      milestone: "Halfway Point",
    },
    {
      year: 2035,
      balance: Math.round(currentSavings * 2.16),
      contributions: totalContribution,
    },
    {
      year: 2040,
      balance: Math.round(currentSavings * 2.95),
      contributions: totalContribution,
    },
    {
      year: 2045,
      balance: Math.round(currentSavings * 4.04),
      contributions: totalContribution,
    },
    {
      year: 2050,
      balance: Math.round(currentSavings * 5.52),
      contributions: totalContribution,
      milestone: "Retirement Goal",
    },
  ];

  // Calculate goal progress
  const projectedPension =
    currentUser?.Projected_Pension_Amount || currentSavings * 5;
  const goalProgress = {
    current: currentSavings,
    target: projection?.adjusted_projection || projectedPension,
    percentage: Math.min(
      100,
      (currentSavings / (projection?.adjusted_projection || projectedPension)) *
        100,
    ),
  };

  // Handle calculator tab - navigate to retirement calculator page
  const handleTabChange = (tab: string) => {
    if (tab === "calculator") {
      navigate(`/retirement-calculator/${currentUser?.User_ID}`);
      return;
    }
    setActiveTab(tab);
  };

  // Render the appropriate page based on active tab
  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className='space-y-8'>
            <SummaryCard
              user={currentUser}
              projection={projection}
              peerComparison={peerComparison}
              summaryStats={summaryStats}
            />
            <MetricsGrid
              user={currentUser}
              summaryStats={summaryStats}
              advancedMetrics={advancedMetrics}
            />
          </div>
        );
      case "portfolio":
        return (
          <PortfolioPage
            user={currentUser}
            allocationData={allocationData}
            growthData={growthData}
          />
        );
      case "goals":
        return <GoalsPage user={currentUser} onGoalChange={handleGoalChange} />;
      case "education":
        return <EducationPage user={currentUser} />;
      case "risk":
        return <RiskPage user={currentUser} onRiskChange={handleRiskChange} />;
      case "chatbot":
        return <ChatbotPageWithSpeech user={currentUser} />;
      default:
        return (
          <div className='space-y-8'>
            <SummaryCard
              user={currentUser}
              projection={projection}
              peerComparison={peerComparison}
            />
            <MetricsGrid
              user={currentUser}
              summaryStats={summaryStats}
              advancedMetrics={advancedMetrics}
            />
          </div>
        );
    }
  };

  const userInitial =
    (currentUser?.Name || "U")?.charAt(0)?.toUpperCase() || "U";
  const yearToRetirement = projection?.years_to_retirement || 35;

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Sticky Header with Backdrop Blur */}
      <header className='sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-sm'>
        <div className='mx-auto max-w-7xl px-6 h-14 flex items-center justify-between'>
          {/* Left: Logo */}
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center'>
              <span className='text-white text-sm font-bold'>FA</span>
            </div>
            <span className='text-sm font-semibold text-slate-900'>
              SuperWise
            </span>
          </div>

          {/* Center: Nav Links */}
          {/* <nav className='hidden md:flex items-center gap-8'>
            <button className='text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors'>
              Overview
            </button>
            <button className='text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors'>
              Insights
            </button>
            <button className='text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors'>
              Support
            </button>
          </nav> */}

          {/* Right: Sign Out Button */}
          <div className='flex items-center gap-2'>
            {isAdminMode && (
              <Button
                onClick={() => navigate("/user-manager")}
                variant='outline'
                size='sm'>
                <ArrowLeft className='w-3 h-3 mr-1' />
                Back
              </Button>
            )}
            <Button onClick={handleSignOut} variant='outline' size='sm'>
              <LogOut className='w-3 h-3 mr-1' />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='mx-auto max-w-7xl px-6 py-6 space-y-6'>
        {/* Profile Hero Card */}
        <div className='bg-white rounded-lg border border-border/60 shadow-sm overflow-hidden'>
          <div className='p-6 space-y-6'>
            {/* Top Section: Split Layout */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
              {/* Left: User Profile */}
              <div className='flex gap-4'>
                {/* Avatar */}
                <div className='relative'>
                  <div className='w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0'>
                    <span className='text-2xl font-bold text-white'>
                      {userInitial}
                    </span>
                  </div>
                  {/* <div className='absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white'></div> */}
                </div>

                {/* User Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-xs font-mono text-muted-foreground bg-slate-100 px-2 py-1 rounded'>
                      {currentUser?.User_ID}
                    </span>
                  </div>
                  <h1 className='text-3xl font-bold text-slate-900 mb-1'>
                    Welcome back, {currentUser?.Name?.split(" ")[0] || "there"}
                  </h1>
                  <p className='text-sm text-muted-foreground mb-3'>
                    Let's review your retirement journey today
                  </p>

                  {/* Badges */}
                  <div className='flex flex-wrap gap-2'>
                    <span className='inline-block px-3 py-1 bg-blue-50 text-blue-900 text-xs font-medium rounded-full border border-blue-200'>
                      Age {currentUser?.Age || "--"}
                    </span>
                    <span className='inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200'>
                      {currentUser?.Marital_Status || "Not specified"}
                    </span>
                    <span className='inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200'>
                      {currentUser?.Number_of_Dependents || 0} Dependents
                    </span>
                    <span className='inline-block px-3 py-1 bg-amber-50 text-amber-900 text-xs font-medium rounded-full border border-amber-200'>
                      Risk: {currentUser?.Risk_Tolerance_Level || "Moderate"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Retirement Goal Progress */}
              <div className='flex flex-col justify-center'>
                <p className='text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2'>
                  Retirement Goal Progress
                </p>
                <div className='flex items-baseline gap-2 mb-2'>
                  <span className='text-5xl font-bold text-emerald-600'>
                    {Math.min(100, goalProgress.percentage).toFixed(0)}%
                  </span>
                  <svg
                    className='w-6 h-6 text-emerald-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                <p className='text-sm text-slate-600 mb-4'>
                  You're on track to reach your retirement goal
                </p>
                {/* Progress Bar */}
                <div className='w-full h-1 bg-slate-200 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-emerald-500 transition-all duration-300'
                    style={{
                      width: `${Math.min(100, goalProgress.percentage)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className='border-t border-border/40'></div>

            {/* Footer Strip: News Source + Update Button */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <span className='text-xs uppercase tracking-wide text-muted-foreground font-semibold'>
                  News Source
                </span>
                <select className='text-sm px-3 py-1.5 border border-border/60 rounded-md bg-white text-slate-700'>
                  <option>Reuters</option>
                  <option>Bloomberg</option>
                  <option>WSJ</option>
                </select>
              </div>
              <Button className='bg-blue-900 hover:bg-blue-800 text-white flex items-center gap-2'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
                Get Financial Update
              </Button>
            </div>
          </div>
        </div>

        {/* Financial Snapshot Card */}
        <div className='bg-white rounded-lg border border-border/60 shadow-sm overflow-hidden'>
          <div className='p-6 space-y-4'>
            {/* Header */}
            <div className='flex items-start justify-between'>
              <div>
                <h2 className='text-lg font-bold text-slate-900'>
                  Financial Snapshot
                </h2>
                <p className='text-xs text-muted-foreground mt-1'>
                  Updated just now
                </p>
              </div>
              <span className='inline-block px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full'>
                Live
              </span>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0'>
              {/* Stat 1: Current Balance */}
              <div className='lg:border-r border-border/40 lg:pr-4 space-y-3'>
                <div className='w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-blue-900'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z' />
                  </svg>
                </div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground font-semibold'>
                  Current Balance
                </p>
                <p className='text-2xl font-bold text-slate-900'>
                  ${(currentUser?.Current_Savings || 0).toLocaleString()}
                </p>
                <p className='text-xs text-emerald-600 font-medium'>
                  +4.2% this month
                </p>
              </div>

              {/* Stat 2: Monthly Contribution */}
              <div className='lg:border-r border-border/40 lg:px-4 space-y-3 sm:border-t lg:border-t-0 sm:pt-4 lg:pt-0'>
                <div className='w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-blue-900'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                    <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z' />
                  </svg>
                </div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground font-semibold'>
                  Monthly Contribution
                </p>
                <p className='text-2xl font-bold text-slate-900'>
                  ${(currentUser?.Contribution_Amount || 0).toLocaleString()}
                </p>
                <p className='text-xs text-emerald-600 font-medium'>
                  +$250 from employer
                </p>
              </div>

              {/* Stat 3: Projected at 65 */}
              <div className='lg:border-r border-border/40 lg:px-4 space-y-3 sm:border-t lg:border-t-0 sm:pt-4 lg:pt-0'>
                <div className='w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-blue-900'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
                  </svg>
                </div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground font-semibold'>
                  Projected at 65
                </p>
                <p className='text-2xl font-bold text-slate-900'>
                  $
                  {(
                    projection?.adjusted_projection || goalProgress.target
                  ).toLocaleString()}
                </p>
                <p className='text-xs text-emerald-600 font-medium'>
                  On track for goal
                </p>
              </div>

              {/* Stat 4: Years to Retirement */}
              <div className='lg:px-4 space-y-3 sm:border-t lg:border-t-0 sm:pt-4 lg:pt-0'>
                <div className='w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-blue-900'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2a1 1 0 001 1h14a1 1 0 001-1V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <p className='text-xs uppercase tracking-wide text-muted-foreground font-semibold'>
                  Years to Retirement
                </p>
                <p className='text-2xl font-bold text-slate-900'>
                  {yearToRetirement}
                </p>
                <p className='text-xs text-emerald-600 font-medium'>
                  Retiring at {currentUser?.Retirement_Age_Goal || 65}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace: Sidebar + Content */}
        <div className='grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6'>
          {/* Sidebar Navigation */}
          <div className='lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] space-y-2'>
            <div className='bg-white rounded-lg border border-border/60 shadow-sm p-2 lg:overflow-y-auto'>
              {[
                { id: "chatbot", label: "Chatbot", icon: "chat" },
                { id: "dashboard", label: "Dashboard", icon: "grid" },
                { id: "portfolio", label: "Portfolio", icon: "briefcase" },
                { id: "goals", label: "Goals", icon: "target" },
                { id: "calculator", label: "Calculator", icon: "calculator" },
                { id: "education", label: "Guide", icon: "book" },
                { id: "risk", label: "Risk", icon: "shield" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                    activeTab === tab.id
                      ? "bg-blue-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}>
                  {tab.icon === "chat" && (
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                      />
                    </svg>
                  )}
                  {tab.icon === "grid" && (
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                      />
                    </svg>
                  )}
                  {tab.icon === "briefcase" && (
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                      />
                    </svg>
                  )}
                  {tab.icon === "target" && (
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 10V3L4 14h7v7l9-11h-7z'
                      />
                    </svg>
                  )}
                  {tab.icon === "calculator" && (
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                      />
                    </svg>
                  )}
                  {tab.icon === "book" && (
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6.253v13m0-13C6.228 6.228 2 7.486 2 8.72v10.56c0 1.234 4.228 2.492 10 2.492m0-13c5.772 0 10 1.258 10 2.492v10.56c0 1.234-4.228 2.492-10 2.492m0 0V23m0-13V5.5M2 8.72v10.56c0 1.234 4.228 2.492 10 2.492m0 0'
                      />
                    </svg>
                  )}
                  {tab.icon === "shield" && (
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  )}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className='bg-white rounded-lg border border-border/60 shadow-sm p-6'>
            {renderPage()}
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <FloatingChatButton user={currentUser} />
    </div>
  );
}
