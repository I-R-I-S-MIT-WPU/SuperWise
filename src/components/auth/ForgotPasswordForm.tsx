import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle, ArrowLeft } from "lucide-react";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.message || "Failed to send reset email");
      }
    } catch (err) {
      console.error("Password reset error:", err);
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
            Check Your Email
          </h2>
          <p className='text-gray-600 text-center mb-6'>
            We've sent a password reset link to <strong>{email}</strong>. Please
            check your inbox and follow the instructions to reset your password.
          </p>
          <Alert className='mb-6 bg-blue-50 border-blue-200'>
            <AlertCircle className='h-4 w-4 text-blue-600' />
            <AlertDescription className='text-blue-800'>
              If you don't see the email in your inbox, check your spam folder.
            </AlertDescription>
          </Alert>
          <Button onClick={onBack} className='w-full' variant='outline'>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
        <div className='p-8'>
          <button
            onClick={onBack}
            className='mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm'>
            <ArrowLeft className='h-4 w-4' />
            Back to Login
          </button>

          <h2 className='text-2xl font-bold mb-2 text-gray-900'>
            Forgot Password?
          </h2>
          <p className='text-gray-600 mb-6'>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email address'
                required
                disabled={loading}
                className='focus:ring-blue-500'
              />
            </div>

            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700'
              disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <div className='mt-6 pt-6 border-t text-center text-sm text-gray-600'>
            <p>
              Remember your password?{" "}
              <a href='/login' className='text-blue-600 hover:underline'>
                Log in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
