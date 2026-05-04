import os
import time
import secrets
import hashlib
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client
from bcrypt import hashpw, checkpw, gensalt

# Load environment variables from project root
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
try:
    load_dotenv(env_path)
except Exception as e:
    print(f"Warning: Could not load .env file at {env_path}: {e}")
    # Use default values if .env loading fails

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://imtmbgbktomztqtoyuvh.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltdG1iZ2JrdG9tenRxdG95dXZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQzMzUwMSwiZXhwIjoyMDczMDA5NTAxfQ.skNHNAimBcivIo18Lm9XzEB6oi7Fz7WHP3EMmVbpRQc")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Database table names
USER_PROFILES_TABLE = "MUFG"

# User profile model - mapped to MUFG table columns
class UserProfile:
    def __init__(self, data: dict):
        self.id = data.get("User_ID")
        self.email = data.get("email", "N/A")  # Not in MUFG table
        self.name = data.get("Name")
        self.age = data.get("Age")
        self.gender = data.get("Gender")
        self.country = data.get("Country")
        self.employment_status = data.get("Employment_Status")
        self.annual_income = data.get("Annual_Income")
        self.current_savings = data.get("Current_Savings")
        self.retirement_age_goal = data.get("Retirement_Age_Goal")
        self.risk_tolerance = data.get("Risk_Tolerance")
        self.contribution_amount = data.get("Contribution_Amount")
        self.contribution_frequency = data.get("Contribution_Frequency")
        self.employer_contribution = data.get("Employer_Contribution")
        self.years_contributed = data.get("Years_Contributed")
        self.investment_type = data.get("Investment_Type")
        self.fund_name = data.get("Fund_Name")
        self.marital_status = data.get("Marital_Status")
        self.number_of_dependents = data.get("Number_of_Dependents")
        self.education_level = data.get("Education_Level")
        self.health_status = data.get("Health_Status")
        self.home_ownership_status = data.get("Home_Ownership_Status")
        self.investment_experience_level = data.get("Investment_Experience_Level")
        self.financial_goals = data.get("Financial_Goals")
        self.insurance_coverage = data.get("Insurance_Coverage")
        self.pension_type = data.get("Pension_Type")
        self.withdrawal_strategy = data.get("Withdrawal_Strategy")
        self.created_at = data.get("created_at", "N/A")  # Not in MUFG table
        self.updated_at = data.get("updated_at", "N/A")   # Not in MUFG table
        
        # Additional MUFG-specific fields
        self.total_annual_contribution = data.get("Total_Annual_Contribution")
        self.annual_return_rate = data.get("Annual_Return_Rate")
        self.volatility = data.get("Volatility")
        self.fees_percentage = data.get("Fees_Percentage")
        self.projected_pension_amount = data.get("Projected_Pension_Amount")
        self.expected_annual_payout = data.get("Expected_Annual_Payout")
        self.inflation_adjusted_payout = data.get("Inflation_Adjusted_Payout")
        self.years_of_payout = data.get("Years_of_Payout")
        self.survivor_benefits = data.get("Survivor_Benefits")
        self.life_expectancy_estimate = data.get("Life_Expectancy_Estimate")
        self.debt_level = data.get("Debt_Level")
        self.monthly_expenses = data.get("Monthly_Expenses")
        self.savings_rate = data.get("Savings_Rate")
        self.portfolio_diversity_score = data.get("Portfolio_Diversity_Score")
        self.tax_benefits_eligibility = data.get("Tax_Benefits_Eligibility")
        self.government_pension_eligibility = data.get("Government_Pension_Eligibility")
        self.private_pension_eligibility = data.get("Private_Pension_Eligibility")
    
    def to_dict(self):
        """Convert UserProfile to dictionary"""
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "age": self.age,
            "gender": self.gender,
            "country": self.country,
            "employment_status": self.employment_status,
            "annual_income": self.annual_income,
            "current_savings": self.current_savings,
            "retirement_age_goal": self.retirement_age_goal,
            "risk_tolerance": self.risk_tolerance,
            "contribution_amount": self.contribution_amount,
            "contribution_frequency": self.contribution_frequency,
            "employer_contribution": self.employer_contribution,
            "years_contributed": self.years_contributed,
            "investment_type": self.investment_type,
            "fund_name": self.fund_name,
            "marital_status": self.marital_status,
            "number_of_dependents": self.number_of_dependents,
            "education_level": self.education_level,
            "health_status": self.health_status,
            "home_ownership_status": self.home_ownership_status,
            "investment_experience_level": self.investment_experience_level,
            "financial_goals": self.financial_goals,
            "insurance_coverage": self.insurance_coverage,
            "pension_type": self.pension_type,
            "withdrawal_strategy": self.withdrawal_strategy,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            # Additional MUFG fields
            "total_annual_contribution": self.total_annual_contribution,
            "annual_return_rate": self.annual_return_rate,
            "volatility": self.volatility,
            "fees_percentage": self.fees_percentage,
            "projected_pension_amount": self.projected_pension_amount,
            "expected_annual_payout": self.expected_annual_payout,
            "inflation_adjusted_payout": self.inflation_adjusted_payout,
            "years_of_payout": self.years_of_payout,
            "survivor_benefits": self.survivor_benefits,
            "life_expectancy_estimate": self.life_expectancy_estimate,
            "debt_level": self.debt_level,
            "monthly_expenses": self.monthly_expenses,
            "savings_rate": self.savings_rate,
            "portfolio_diversity_score": self.portfolio_diversity_score,
            "tax_benefits_eligibility": self.tax_benefits_eligibility,
            "government_pension_eligibility": self.government_pension_eligibility,
            "private_pension_eligibility": self.private_pension_eligibility
        }

# Supabase service functions
class SupabaseService:
    @staticmethod
    async def get_user_profile(user_id: str) -> UserProfile:
        """Get user profile by ID"""
        try:
            response = supabase.table(USER_PROFILES_TABLE).select("*").eq("User_ID", user_id).execute()
            if response.data:
                return UserProfile(response.data[0])
            return None
        except Exception as e:
            print(f"Error fetching user profile: {e}")
            return None

    @staticmethod
    async def get_all_user_profiles() -> list[UserProfile]:
        """Get all user profiles"""
        try:
            response = supabase.table(USER_PROFILES_TABLE).select("*").execute()
            return [UserProfile(user_data) for user_data in response.data]
        except Exception as e:
            print(f"Error fetching all user profiles: {e}")
            # Return empty list when Supabase is not available
            return []

    @staticmethod
    async def create_user_profile(user_data: dict) -> bool:
        """Create a new user profile"""
        try:
            response = supabase.table(USER_PROFILES_TABLE).insert(user_data).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Error creating user profile: {e}")
            return False

    @staticmethod
    async def update_user_profile(user_id: str, updates: dict) -> bool:
        """Update user profile"""
        try:
            response = supabase.table(USER_PROFILES_TABLE).update(updates).eq("id", user_id).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"Error updating user profile: {e}")
            return False

    @staticmethod
    async def delete_user_profile(user_id: str) -> bool:
        """Delete user profile"""
        try:
            response = supabase.table(USER_PROFILES_TABLE).delete().eq("id", user_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting user profile: {e}")
            return False

    @staticmethod
    async def search_users(search_term: str) -> list[UserProfile]:
        """Search users by name or email"""
        try:
            response = supabase.table(USER_PROFILES_TABLE).select("*").or_(f"name.ilike.%{search_term}%,email.ilike.%{search_term}%").execute()
            return [UserProfile(user_data) for user_data in response.data]
        except Exception as e:
            print(f"Error searching users: {e}")
            return []

    @staticmethod
    async def get_users_by_filter(filter_type: str, value: str) -> list[UserProfile]:
        """Get users by specific filter"""
        try:
            if filter_type == "risk_tolerance":
                response = supabase.table(USER_PROFILES_TABLE).select("*").eq("risk_tolerance", value).execute()
            elif filter_type == "age_range":
                min_age, max_age = map(int, value.split("-"))
                response = supabase.table(USER_PROFILES_TABLE).select("*").gte("age", min_age).lte("age", max_age).execute()
            elif filter_type == "income_range":
                min_income, max_income = map(float, value.split("-"))
                response = supabase.table(USER_PROFILES_TABLE).select("*").gte("annual_income", min_income).lte("annual_income", max_income).execute()
            else:
                response = supabase.table(USER_PROFILES_TABLE).select("*").execute()
            
            return [UserProfile(user_data) for user_data in response.data]
        except Exception as e:
            print(f"Error filtering users: {e}")
            return []

    @staticmethod
    async def login_user(username: str, password: str) -> dict:
        """Login user with username/email and password"""
        try:
            # Query Supabase only (no CSV fallback)
            response = supabase.table(USER_PROFILES_TABLE).select("*").eq("username", username).execute()
            
            if not response.data:
                return {"success": False, "message": "Invalid credentials"}
            
            user_data = response.data[0]
            stored_password = user_data.get("Password") or ""
            
            # Verify bcrypt-hashed password
            try:
                if stored_password.startswith("$2"):  # bcrypt hash
                    is_valid = checkpw(password.encode('utf-8'), stored_password.encode('utf-8'))
                else:  # Fallback for plaintext (during migration)
                    is_valid = password == stored_password
            except:
                is_valid = False
            
            if not is_valid:
                return {"success": False, "message": "Invalid credentials"}
            
            return {
                "success": True,
                "userId": user_data.get("User_ID"),
                "name": user_data.get("Name"),
                "username": user_data.get("username"),
                "message": "Login successful"
            }
        except Exception as e:
            print(f"Login error: {e}")
            return {"success": False, "message": "Invalid credentials"}

    @staticmethod
    async def send_password_reset_email(email: str) -> dict:
        """Send password reset email with secure token"""
        try:
            # Check if user exists
            response = supabase.table(USER_PROFILES_TABLE).select("*").eq("username", email).execute()
            
            if not response.data:
                # For security, don't reveal if email exists
                return {"success": True, "message": "If email exists, a reset link has been sent"}
            
            user_data = response.data[0]
            user_id = user_data.get('User_ID')
            user_name = user_data.get('Name', 'User')
            
            # Create cryptographically secure token
            reset_token = secrets.token_urlsafe(32)
            token_hash = hashlib.sha256(reset_token.encode()).hexdigest()
            expires_at = (datetime.utcnow() + timedelta(hours=24)).isoformat()
            
            # Store token in database (create password_resets table if needed)
            try:
                supabase.table("password_resets").insert({
                    "user_id": user_id,
                    "token_hash": token_hash,
                    "expires_at": expires_at,
                    "used": False
                }).execute()
            except:
                # If table doesn't exist, just send email with token
                pass
            
            reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
            
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Password Reset Request</h2>
                    <p>Hi {user_name},</p>
                    <p>You requested a password reset for your MUFG Superannuation account.</p>
                    <p><a href="{reset_link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
                    <p>If you didn't request this, please ignore this email. This link expires in 24 hours.</p>
                    <br>
                    <p>Best regards,<br>MUFG Superannuation Team</p>
                </body>
            </html>
            """
            
            try:
                from email_service import email_service
                email_sent = email_service.send_email(
                    to_email=email,
                    subject="Password Reset - MUFG Superannuation",
                    html_content=html_content
                )
                if email_sent:
                    print(f"Password reset email sent to: {email}")
            except Exception as e:
                print(f"Email service error: {e}")
                
            return {"success": True, "message": "If email exists, a reset link has been sent"}
                
        except Exception as e:
            print(f"Password reset error: {e}")
            return {"success": True, "message": "If email exists, a reset link has been sent"}

    @staticmethod
    async def reset_password(token: str, new_password: str) -> dict:
        """Reset password with token validation"""
        try:
            # Hash the token to find it in database
            token_hash = hashlib.sha256(token.encode()).hexdigest()
            
            # Find and validate token
            try:
                reset_response = supabase.table("password_resets").select("*").eq("token_hash", token_hash).eq("used", False).execute()
                
                if not reset_response.data:
                    return {"success": False, "message": "Invalid or expired reset link"}
                
                reset_data = reset_response.data[0]
                
                # Check expiration
                expires_at = datetime.fromisoformat(reset_data.get('expires_at'))
                if datetime.utcnow() > expires_at:
                    return {"success": False, "message": "Reset link has expired"}
                
                user_id = reset_data.get('user_id')
            except Exception as db_error:
                print(f"Token validation error: {db_error}")
                return {"success": False, "message": "Invalid reset link"}
            
            # Hash new password
            hashed_password = hashpw(new_password.encode('utf-8'), gensalt()).decode('utf-8')
            
            # Update user password
            update_response = supabase.table(USER_PROFILES_TABLE).update({
                "Password": hashed_password
            }).eq("User_ID", user_id).execute()
            
            # Mark token as used
            supabase.table("password_resets").update({"used": True}).eq("token_hash", token_hash).execute()
            
            return {"success": True, "message": "Password reset successful"}
        except Exception as e:
            print(f"Password reset error: {e}")
            return {"success": False, "message": f"Error resetting password: {str(e)}"}

    @staticmethod
    def get_mock_user_profiles() -> list[UserProfile]:
        """Get mock user profiles for testing when Supabase is not available"""
        import datetime
        
        mock_users = [
            {
                "id": "user-001",
                "email": "john.smith@example.com",
                "name": "John Smith",
                "age": 35,
                "gender": "Male",
                "country": "Australia",
                "employment_status": "Employed",
                "annual_income": 85000,
                "current_savings": 45000,
                "retirement_age_goal": 65,
                "risk_tolerance": "Medium",
                "contribution_amount": 1200,
                "contribution_frequency": "Monthly",
                "employer_contribution": 600,
                "years_contributed": 8,
                "investment_type": "Superannuation",
                "fund_name": "AustralianSuper",
                "marital_status": "Married",
                "number_of_dependents": 2,
                "education_level": "Bachelor's Degree",
                "health_status": "Good",
                "home_ownership_status": "Own",
                "investment_experience_level": "Intermediate",
                "financial_goals": "Retirement planning and children's education",
                "insurance_coverage": "Comprehensive",
                "pension_type": "Superannuation",
                "withdrawal_strategy": "Balanced",
                "created_at": "2024-01-15T10:30:00Z"
            },
            {
                "id": "user-002",
                "email": "sarah.johnson@example.com",
                "name": "Sarah Johnson",
                "age": 28,
                "gender": "Female",
                "country": "Australia",
                "employment_status": "Employed",
                "annual_income": 65000,
                "current_savings": 18000,
                "retirement_age_goal": 60,
                "risk_tolerance": "High",
                "contribution_amount": 800,
                "contribution_frequency": "Monthly",
                "employer_contribution": 400,
                "years_contributed": 3,
                "investment_type": "Superannuation",
                "fund_name": "Rest Super",
                "marital_status": "Single",
                "number_of_dependents": 0,
                "education_level": "Master's Degree",
                "health_status": "Excellent",
                "home_ownership_status": "Renting",
                "investment_experience_level": "Beginner",
                "financial_goals": "Early retirement and travel",
                "insurance_coverage": "Basic",
                "pension_type": "Superannuation",
                "withdrawal_strategy": "Aggressive",
                "created_at": "2024-02-20T14:15:00Z"
            },
            {
                "id": "user-003",
                "email": "michael.brown@example.com",
                "name": "Michael Brown",
                "age": 52,
                "gender": "Male",
                "country": "Australia",
                "employment_status": "Self-employed",
                "annual_income": 120000,
                "current_savings": 180000,
                "retirement_age_goal": 65,
                "risk_tolerance": "Low",
                "contribution_amount": 2000,
                "contribution_frequency": "Monthly",
                "employer_contribution": 0,
                "years_contributed": 25,
                "investment_type": "Superannuation",
                "fund_name": "UniSuper",
                "marital_status": "Married",
                "number_of_dependents": 1,
                "education_level": "PhD",
                "health_status": "Good",
                "home_ownership_status": "Own",
                "investment_experience_level": "Expert",
                "financial_goals": "Comfortable retirement",
                "insurance_coverage": "Comprehensive",
                "pension_type": "Superannuation",
                "withdrawal_strategy": "Conservative",
                "created_at": "2024-01-05T09:45:00Z"
            },
            {
                "id": "user-004",
                "email": "emma.wilson@example.com",
                "name": "Emma Wilson",
                "age": 41,
                "gender": "Female",
                "country": "Australia",
                "employment_status": "Employed",
                "annual_income": 95000,
                "current_savings": 75000,
                "retirement_age_goal": 62,
                "risk_tolerance": "Medium",
                "contribution_amount": 1500,
                "contribution_frequency": "Monthly",
                "employer_contribution": 750,
                "years_contributed": 15,
                "investment_type": "Superannuation",
                "fund_name": "Hostplus",
                "marital_status": "Divorced",
                "number_of_dependents": 1,
                "education_level": "Bachelor's Degree",
                "health_status": "Good",
                "home_ownership_status": "Own",
                "investment_experience_level": "Intermediate",
                "financial_goals": "Financial independence",
                "insurance_coverage": "Standard",
                "pension_type": "Superannuation",
                "withdrawal_strategy": "Balanced",
                "created_at": "2024-03-10T16:20:00Z"
            },
            {
                "id": "user-005",
                "email": "david.lee@example.com",
                "name": "David Lee",
                "age": 29,
                "gender": "Male",
                "country": "Australia",
                "employment_status": "Employed",
                "annual_income": 72000,
                "current_savings": 25000,
                "retirement_age_goal": 65,
                "risk_tolerance": "High",
                "contribution_amount": 900,
                "contribution_frequency": "Monthly",
                "employer_contribution": 450,
                "years_contributed": 4,
                "investment_type": "Superannuation",
                "fund_name": "Cbus",
                "marital_status": "Single",
                "number_of_dependents": 0,
                "education_level": "Bachelor's Degree",
                "health_status": "Excellent",
                "home_ownership_status": "Renting",
                "investment_experience_level": "Beginner",
                "financial_goals": "Wealth building and property investment",
                "insurance_coverage": "Basic",
                "pension_type": "Superannuation",
                "withdrawal_strategy": "Aggressive",
                "created_at": "2024-02-28T11:30:00Z"
            }
        ]
        
        return [UserProfile(user_data) for user_data in mock_users]
