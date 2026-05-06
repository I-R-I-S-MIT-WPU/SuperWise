import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from '@/components/ui/slider';
import { Loader2, Calculator, Target, AlertCircle, Save, RotateCcw, LogOut, ArrowLeft } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useAuth } from "@/contexts/AuthContext";

interface CalculatorInputs {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  monthlyContribution: number;
  employerContribution: number;
  annualReturnRate: number;
  inflationRate: number;
  taxRate: number;
  yearlyWithdrawal: number;
  salaryGrowthRate: number;
  contributionIncreaseRate: number;
}

interface ProjectionData {
  age: number;
  year: number;
  balance: number;
  totalContributions: number;
  investmentGrowth: number;
  afterTaxBalance: number;
  inflationAdjustedBalance: number;
}

interface RetirementAnalysis {
  projectedBalance: number;
  totalContributions: number;
  investmentGrowth: number;
  yearsOfWithdrawal: number;
  monthlyRetirementIncome: number;
  inflationAdjustedIncome: number;
  shortfall: number;
}

export default function RetirementCalculator() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { ThemeToggle } = useTheme();
  const { adminUser, isAdminMode, logout: adminLogout } = useAdminAuth();
  const { user, signOut } = useAuth();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [includeInflation, setIncludeInflation] = useState(true);
  const [savedSnapshot, setSavedSnapshot] = useState<CalculatorInputs | null>(null);

  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs>({
    currentAge: 30,
    retirementAge: 65,
    currentBalance: 50000,
    monthlyContribution: 1000,
    employerContribution: 500,
    annualReturnRate: 7.5,
    inflationRate: 3.0,
    taxRate: 15,
    yearlyWithdrawal: 60000,
    salaryGrowthRate: 3.0,
    contributionIncreaseRate: 2.0
  });

  const [formulaParams, setFormulaParams] = useState({
    withdrawalRate: 0.04,
    yearsOfWithdrawal: 25,
    compoundingAnnualReturn: 0.07
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) {
        navigate('/dashboard');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('MUFG')
          .select('*')
          .eq('User_ID', userId)
          .single();

        if (data && !error) {
          setUserProfile(data);
          const initialInputs = {
            currentAge: data.Age ?? 30,
            retirementAge: data.Retirement_Age_Goal ?? 65,
            currentBalance: data.Current_Savings ?? 50000,
            monthlyContribution: data.Contribution_Amount ?? 1000,
            employerContribution: data.Employer_Contribution ?? 500,
            annualReturnRate: data.Annual_Return_Rate ?? (data.Risk_Tolerance === 'High' ? 9 : data.Risk_Tolerance === 'Low' ? 6 : 7.5),
            inflationRate: data.Inflation_Rate ?? 3.0,
            taxRate: data.Tax_Rate ?? 15,
            yearlyWithdrawal: data.Yearly_Withdrawal ?? 60000,
            salaryGrowthRate: 3.0,
            contributionIncreaseRate: 2.0
          };
          setCalculatorInputs(initialInputs);
          setSavedSnapshot(initialInputs);
        } else {
          const storedUserData = localStorage.getItem(`user_${userId}`);
          let mockProfile: any;
          if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            mockProfile = {
              id: userId,
              name: userData.name || 'Demo User',
              Age: userData.age || 30,
              Retirement_Age_Goal: userData.retirement_age_goal || 65,
              Current_Savings: userData.current_savings || 50000,
              Contribution_Amount: userData.contribution_amount || 1000,
              Employer_Contribution: userData.employer_contribution || 500,
              Risk_Tolerance: userData.risk_tolerance || 'Medium',
              Annual_Return_Rate: userData.annual_return_rate || undefined
            };
          } else {
            mockProfile = {
              id: userId,
              name: 'Demo User',
              Age: 30,
              Retirement_Age_Goal: 65,
              Current_Savings: 50000,
              Contribution_Amount: 1000,
              Employer_Contribution: 500,
              Risk_Tolerance: 'Medium'
            };
          }
          setUserProfile(mockProfile);
          const initialInputs = {
            currentAge: mockProfile.Age,
            retirementAge: mockProfile.Retirement_Age_Goal,
            currentBalance: mockProfile.Current_Savings,
            monthlyContribution: mockProfile.Contribution_Amount,
            employerContribution: mockProfile.Employer_Contribution,
            annualReturnRate: mockProfile.Annual_Return_Rate ?? (mockProfile.Risk_Tolerance === 'High' ? 9 : mockProfile.Risk_Tolerance === 'Low' ? 6 : 7.5),
            inflationRate: 3.0,
            taxRate: 15,
            yearlyWithdrawal: 60000,
            salaryGrowthRate: 3.0,
            contributionIncreaseRate: 2.0
          };
          setCalculatorInputs(initialInputs);
          setSavedSnapshot(initialInputs);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId, navigate]);

  const handleSignOut = async () => {
    if (isAdminMode) {
      adminLogout();
      navigate("/user-manager");
    } else {
      try {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("userSession");
      } catch (e) {}
      await signOut?.();
      navigate("/login");
    }
  };

  const handleCalculatorInputChange = (key: keyof CalculatorInputs, value: number) => {
    setCalculatorInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleFormulaParamChange = (key: keyof typeof formulaParams, value: number) => {
    setFormulaParams(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSnapshot = () => setSavedSnapshot({ ...calculatorInputs });
  const handleRevertToSnapshot = () => { if (savedSnapshot) setCalculatorInputs({ ...savedSnapshot }); };

  const projectionData = useMemo(() => {
    const data: ProjectionData[] = [];
    const yearsToRetirement = calculatorInputs.retirementAge - calculatorInputs.currentAge;
    let balance = calculatorInputs.currentBalance;
    let totalContributions = calculatorInputs.currentBalance;
    let monthlyContrib = calculatorInputs.monthlyContribution;
    let employerContrib = calculatorInputs.employerContribution;

    for (let i = 0; i <= yearsToRetirement; i++) {
      const age = calculatorInputs.currentAge + i;
      const year = new Date().getFullYear() + i;
      if (i > 0) {
        monthlyContrib *= (1 + calculatorInputs.contributionIncreaseRate / 100);
        employerContrib *= (1 + calculatorInputs.salaryGrowthRate / 100);
      }
      const annualContribution = (monthlyContrib + employerContrib) * 12;
      balance += annualContribution;
      totalContributions += annualContribution;
      const investmentReturn = balance * (calculatorInputs.annualReturnRate / 100);
      balance += investmentReturn;
      const investmentGrowth = balance - totalContributions;
      const taxableGains = Math.max(0, investmentGrowth * 0.7);
      const tax = taxableGains * (calculatorInputs.taxRate / 100);
      const afterTaxBalance = balance - tax;
      const inflationAdjustedBalance = includeInflation
        ? afterTaxBalance / Math.pow(1 + calculatorInputs.inflationRate / 100, i)
        : afterTaxBalance;
      data.push({ age, year, balance: Math.round(balance), totalContributions: Math.round(totalContributions), investmentGrowth: Math.round(investmentGrowth), afterTaxBalance: Math.round(afterTaxBalance), inflationAdjustedBalance: Math.round(inflationAdjustedBalance) });
    }
    return data;
  }, [calculatorInputs, includeInflation]);

  const retirementAnalysis = useMemo((): RetirementAnalysis => {
    const finalProjection = projectionData[projectionData.length - 1] || { afterTaxBalance: calculatorInputs.currentBalance, totalContributions: calculatorInputs.currentBalance, investmentGrowth: 0 };
    const projectedBalance = finalProjection.afterTaxBalance;
    const totalContributions = finalProjection.totalContributions;
    const investmentGrowth = finalProjection.investmentGrowth;
    const yearsOfWithdrawal = formulaParams.yearsOfWithdrawal;
    const totalRetirementNeeds = calculatorInputs.yearlyWithdrawal * yearsOfWithdrawal;
    const monthlyRetirementIncome = projectedBalance / yearsOfWithdrawal / 12;
    const inflationAdjustedIncome = includeInflation
      ? monthlyRetirementIncome / Math.pow(1 + calculatorInputs.inflationRate / 100, calculatorInputs.retirementAge - calculatorInputs.currentAge)
      : monthlyRetirementIncome;
    const shortfall = Math.max(0, totalRetirementNeeds - projectedBalance);
    return { projectedBalance, totalContributions, investmentGrowth, yearsOfWithdrawal, monthlyRetirementIncome, inflationAdjustedIncome, shortfall };
  }, [projectionData, calculatorInputs, formulaParams, includeInflation]);

  const balanceBreakdown = [
    { name: 'Your Contributions', value: retirementAnalysis.totalContributions, color: '#3b82f6' },
    { name: 'Investment Growth', value: retirementAnalysis.investmentGrowth, color: '#10b981' },
  ];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const formatPercent = (value: number) => `${value}%`;

  const requiredNestEggFrom4pc = Math.round(calculatorInputs.yearlyWithdrawal / formulaParams.withdrawalRate);
  const monthlyWithdrawalExample = Math.round((calculatorInputs.currentBalance * formulaParams.withdrawalRate) / 12);

  const inputClass = "w-full bg-white dark:bg-slate-950 text-zinc-900 dark:text-white border border-border rounded-lg p-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-14 h-14 text-success mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Loading Your Retirement Calculator</h2>
            <p className="text-muted-foreground">Preparing a personalized projection — hold tight.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h2>
              <p className="text-muted-foreground mb-4">We couldn't find your profile. Please try again.</p>
              <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Sticky Header — exact match to Dashboard ── */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-bold">FA</span>
            </div>
            <span className="text-sm font-semibold text-foreground">SuperWise</span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {/* Back to Dashboard */}
            <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Dashboard
            </Button>

            {/* Back to User Manager (admin only) */}
            {isAdminMode && (
              <Button onClick={() => navigate('/user-manager')} variant="outline" size="sm">
                <ArrowLeft className="w-3 h-3 mr-1" />
                Back
              </Button>
            )}

            <div className="hidden sm:flex items-center rounded-full px-1">
              <ThemeToggle />
            </div>

            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-3 h-3 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="mx-auto max-w-7xl px-6 py-6 space-y-6">

        {/* Page title row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Retirement Calculator</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Personalized projections for <span className="font-medium">{userProfile.Name ?? 'User'}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-muted-foreground">Projected balance</div>
              <div className="text-lg font-semibold text-success">{formatCurrency(retirementAnalysis.projectedBalance)}</div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveSnapshot} variant="outline" size="sm" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
              {savedSnapshot && (
                <Button onClick={handleRevertToSnapshot} variant="outline" size="sm" className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Revert
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── 3-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Inputs */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Scenario Inputs
                </CardTitle>
                <CardDescription>Adjust assumptions to see how your retirement changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="inflation-toggle">Include Inflation</Label>
                  <Switch id="inflation-toggle" checked={includeInflation} onCheckedChange={setIncludeInflation} />
                </div>

                <div>
                  <Label>Current Age: {calculatorInputs.currentAge}</Label>
                  <Slider value={[calculatorInputs.currentAge]} onValueChange={([v]) => handleCalculatorInputChange('currentAge', v)} min={18} max={70} step={1} className="mt-2" />
                </div>

                <div>
                  <Label>Retirement Age: {calculatorInputs.retirementAge}</Label>
                  <Slider value={[calculatorInputs.retirementAge]} onValueChange={([v]) => handleCalculatorInputChange('retirementAge', v)} min={50} max={80} step={1} className="mt-2" />
                </div>

                <div>
                  <Label>Current Savings: {formatCurrency(calculatorInputs.currentBalance)}</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="number" value={calculatorInputs.currentBalance} onChange={(e) => handleCalculatorInputChange('currentBalance', Number(e.target.value || 0))} className={inputClass} />
                    <Button size="sm" onClick={() => handleCalculatorInputChange('currentBalance', Math.round(calculatorInputs.currentBalance * 1.1))}>+10%</Button>
                  </div>
                </div>

                <div>
                  <Label>Monthly Contribution: {formatCurrency(calculatorInputs.monthlyContribution)}</Label>
                  <input type="number" value={calculatorInputs.monthlyContribution} onChange={(e) => handleCalculatorInputChange('monthlyContribution', Number(e.target.value || 0))} className={`${inputClass} mt-2`} />
                </div>

                <div>
                  <Label>Employer Contribution (monthly): {formatCurrency(calculatorInputs.employerContribution)}</Label>
                  <input type="number" value={calculatorInputs.employerContribution} onChange={(e) => handleCalculatorInputChange('employerContribution', Number(e.target.value || 0))} className={`${inputClass} mt-2`} />
                </div>

                <div>
                  <Label>Expected Annual Return: {formatPercent(calculatorInputs.annualReturnRate)}</Label>
                  <Slider value={[calculatorInputs.annualReturnRate]} onValueChange={([v]) => handleCalculatorInputChange('annualReturnRate', v)} min={0} max={15} step={0.25} className="mt-2" />
                </div>

                {includeInflation && (
                  <div>
                    <Label>Inflation Rate: {formatPercent(calculatorInputs.inflationRate)}</Label>
                    <Slider value={[calculatorInputs.inflationRate]} onValueChange={([v]) => handleCalculatorInputChange('inflationRate', v)} min={0} max={12} step={0.25} className="mt-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Withdrawal & Risk</CardTitle>
                <CardDescription>Set withdrawal targets and risk assumptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Annual Retirement Income Needed: {formatCurrency(calculatorInputs.yearlyWithdrawal)}</Label>
                  <input type="number" value={calculatorInputs.yearlyWithdrawal} onChange={(e) => handleCalculatorInputChange('yearlyWithdrawal', Number(e.target.value || 0))} className={`${inputClass} mt-2`} />
                </div>
                <div>
                  <Label>Tax Rate (in retirement): {calculatorInputs.taxRate}%</Label>
                  <Slider value={[calculatorInputs.taxRate]} onValueChange={([v]) => handleCalculatorInputChange('taxRate', v)} min={0} max={50} step={1} className="mt-2" />
                </div>
                <div>
                  <Label>Contribution Increase Rate (annual): {calculatorInputs.contributionIncreaseRate}%</Label>
                  <Slider value={[calculatorInputs.contributionIncreaseRate]} onValueChange={([v]) => handleCalculatorInputChange('contributionIncreaseRate', v)} min={0} max={10} step={0.25} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CENTER/RIGHT: Charts */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Retirement Journey</CardTitle>
                <CardDescription>Projected {includeInflation ? 'inflation-adjusted ' : ''}after-tax balance vs contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 380 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
                      <XAxis dataKey="age" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} label={{ value: 'Age', position: 'insideBottomRight', offset: -5, fill: '#cbd5e1' }} />
                      <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: 'rgba(148, 163, 184, 0.3)' }} labelStyle={{ color: '#e2e8f0' }} itemStyle={{ color: '#e2e8f0' }} />
                      <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                      <Line type="monotone" dataKey={includeInflation ? "inflationAdjustedBalance" : "afterTaxBalance"} stroke="#34d399" strokeWidth={3} name={includeInflation ? "Inflation-Adjusted Balance" : "Projected Balance"} dot={false} />
                      <Line type="monotone" dataKey="totalContributions" stroke="#60a5fa" strokeWidth={2} name="Total Contributions" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Balance Composition</CardTitle></CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={balanceBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={6} dataKey="value">
                          {balanceBreakdown.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Projection Snapshot</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Years to Retirement</span>
                      <span className="font-medium">{calculatorInputs.retirementAge - calculatorInputs.currentAge} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Projected Balance</span>
                      <span className="font-medium text-success">{formatCurrency(retirementAnalysis.projectedBalance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Income (est.)</span>
                      <span className="font-medium text-primary">{formatCurrency(includeInflation ? retirementAnalysis.inflationAdjustedIncome : retirementAnalysis.monthlyRetirementIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Shortfall / Surplus</span>
                      <span className={`font-medium ${retirementAnalysis.shortfall > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {retirementAnalysis.shortfall > 0 ? '-' : '+'}{formatCurrency(Math.abs(retirementAnalysis.shortfall))}
                      </span>
                    </div>
                    <div className="mt-3">
                      <Button onClick={() => window.print()}>Export / Print</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {retirementAnalysis.shortfall > 0 ? (
                  <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Action Required</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                      You have a projected shortfall of {formatCurrency(retirementAnalysis.shortfall)}. Try these:
                    </p>
                    <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
                      <li>Increase monthly contribution by {formatCurrency(Math.round(retirementAnalysis.shortfall / ((calculatorInputs.retirementAge - calculatorInputs.currentAge) * 12)))}</li>
                      <li>Delay retirement age by 2–3 years</li>
                      <li>Consider a small increase in risk tolerance to improve expected return</li>
                    </ul>
                  </div>
                ) : (
                  <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">On Track</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                      You're projected to meet your retirement need with current assumptions. Consider optimizations:
                    </p>
                    <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>Review asset allocation annually</li>
                      <li>Tax-efficient withdrawal strategy</li>
                      <li>Regularly increase contributions with income</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Formulas panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Calculator Parameters</CardTitle>
              <CardDescription>Adjust key parameters that drive the calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Withdrawal Rate (%)</Label>
                  <input type="number" step={0.1} min={1} max={10} value={formulaParams.withdrawalRate * 100} onChange={(e) => handleFormulaParamChange('withdrawalRate', Number(e.target.value || 0) / 100)} className={`${inputClass} mt-1`} />
                  <div className="text-xs text-muted-foreground mt-1">Percentage of savings withdrawn annually</div>
                </div>
                <div>
                  <Label>Years of Withdrawal</Label>
                  <input type="number" min={5} max={60} value={formulaParams.yearsOfWithdrawal} onChange={(e) => handleFormulaParamChange('yearsOfWithdrawal', Number(e.target.value || 0))} className={`${inputClass} mt-1`} />
                  <div className="text-xs text-muted-foreground mt-1">Expected duration of retirement</div>
                </div>
                <div>
                  <Label>Compounding Return (%)</Label>
                  <input type="number" step={0.1} min={0} max={20} value={formulaParams.compoundingAnnualReturn * 100} onChange={(e) => handleFormulaParamChange('compoundingAnnualReturn', Number(e.target.value || 0) / 100)} className={`${inputClass} mt-1`} />
                  <div className="text-xs text-muted-foreground mt-1">Used in accumulation calculations</div>
                </div>
              </div>

              <div className="bg-muted/50 dark:bg-muted/70 p-4 rounded-md">
                <h4 className="font-semibold mb-2">Example Calculations</h4>
                <div className="text-sm space-y-2">
                  <div>
                    <strong>Required Nest Egg:</strong> {formatCurrency(calculatorInputs.yearlyWithdrawal)} / {formulaParams.withdrawalRate * 100}% = <span className="font-medium">{formatCurrency(requiredNestEggFrom4pc)}</span>
                  </div>
                  <div>
                    <strong>Monthly Withdrawal from Current Savings:</strong> ({formatCurrency(calculatorInputs.currentBalance)} × {formulaParams.withdrawalRate * 100}%) / 12 = <span className="font-medium">{formatCurrency(monthlyWithdrawalExample)}</span>
                  </div>
                </div>
              </div>

              <Button onClick={() => setFormulaParams({ withdrawalRate: 0.04, yearsOfWithdrawal: 25, compoundingAnnualReturn: 0.07 })}>
                Reset to defaults
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quick Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Projected Balance</span>
                  <span className="font-semibold">{formatCurrency(retirementAnalysis.projectedBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Contributions</span>
                  <span className="font-semibold">{formatCurrency(retirementAnalysis.totalContributions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Investment Growth</span>
                  <span className="font-semibold text-success">{formatCurrency(retirementAnalysis.investmentGrowth)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Income (est.)</span>
                  <span className="font-semibold text-primary">{formatCurrency(includeInflation ? retirementAnalysis.inflationAdjustedIncome : retirementAnalysis.monthlyRetirementIncome)}</span>
                </div>
                <div className="pt-3">
                  <Button onClick={() => {
                    if (retirementAnalysis.shortfall > 0) {
                      const yearsLeft = Math.max(1, calculatorInputs.retirementAge - calculatorInputs.currentAge);
                      const extraMonthly = Math.ceil(retirementAnalysis.shortfall / (yearsLeft * 12));
                      handleCalculatorInputChange('monthlyContribution', calculatorInputs.monthlyContribution + extraMonthly);
                    } else {
                      alert('You are on track — no immediate extra contribution needed.');
                    }
                  }}>
                    {retirementAnalysis.shortfall > 0 ? 'Auto-suggest increase' : 'All good — actions'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}