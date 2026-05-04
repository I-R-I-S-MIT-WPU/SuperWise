import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'>
        <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-8'>
          <div className='flex justify-center mb-4'>
            <CheckCircle className='h-12 w-12 text-green-600' />
          </div>
          <h2 className='text-2xl font-bold text-center mb-4 text-gray-900'>
            Password Reset Successful
          </h2>
          <p className='text-gray-600 text-center mb-6'>
            Your password has been reset successfully. Redirecting to login
            page...
          </p>
          <Button onClick={() => navigate("/")} className='w-full'>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
        <div className='p-8'>
          <h2 className='text-2xl font-bold mb-2 text-gray-900'>
            Reset Your Password
          </h2>
          <p className='text-gray-600 mb-6'>
            Enter your new password below. It must be at least 8 characters
            long.
          </p>

          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!token && (
            <Alert variant='destructive' className='mb-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                Invalid or missing reset token
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='password'>New Password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter new password'
                required
                disabled={loading || !token}
                minLength={8}
                className='focus:ring-blue-500'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Confirm new password'
                required
                disabled={loading || !token}
                minLength={8}
                className='focus:ring-blue-500'
              />
            </div>

            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700'
              disabled={loading || !token}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          <div className='mt-6 pt-6 border-t text-center text-sm text-gray-600'>
            <p>
              Remember your password?{" "}
              <a href='/' className='text-blue-600 hover:underline'>
                Log in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
