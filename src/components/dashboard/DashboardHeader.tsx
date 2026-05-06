import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/lib/supabase";
import { Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

interface DashboardHeaderProps {
  user: UserProfile;
  goalProgress: any;
}

export function DashboardHeader({ user, goalProgress }: DashboardHeaderProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [newsSource, setNewsSource] = useState("newsapi");
  const { toast } = useToast();
  const { ThemeToggle } = useTheme();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-success/15 text-success-foreground border-success/30';
      case 'Medium': return 'bg-warning/15 text-warning-foreground border-warning/30';
      case 'High': return 'bg-danger/15 text-danger-foreground border-danger/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      const response = await fetch(`http://localhost:8000/trigger-email/${newsSource}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        const sourceName = newsSource === "gemini" ? "Gemini AI" : "NewsAPI";
        toast({
          title: "Email Sent! 📧",
          description: `Financial update email sent successfully using ${sourceName}.`,
        });
      } else {
        toast({
          title: "Email Failed",
          description: "Failed to send email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="dashboard-card mb-8 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10 dark:via-background dark:to-background border-0 shadow-card">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
        <div className="flex items-center gap-6 flex-1">
          <Avatar className="w-20 h-20 lg:w-24 lg:h-24 ring-2 ring-primary/20">
            <AvatarImage src="" alt={user.User_ID || user.Name || 'User'} />
            <AvatarFallback className="text-2xl lg:text-3xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              {user.User_ID ? user.User_ID.slice(-2) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Welcome back, {user.Name || user.User_ID || 'User'}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-sm py-1.5 px-3 font-medium bg-muted/50">
                Age {user.Age ?? 'N/A'}
              </Badge>
              <Badge variant="outline" className="text-sm py-1.5 px-3 font-medium bg-muted/50">
                {user.Marital_Status || 'N/A'}
              </Badge>
              <Badge variant="outline" className="text-sm py-1.5 px-3 font-medium bg-muted/50">
                {user.Number_of_Dependents ?? 0} {(user.Number_of_Dependents ?? 0) === 1 ? 'Dependent' : 'Dependents'}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-sm py-1.5 px-3 font-medium border ${getRiskColor(user.Risk_Tolerance || 'Medium')}`} 
              >
                {user.Risk_Tolerance || 'Medium'} Risk
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="lg:ml-auto text-center lg:text-right">
          <div className="text-sm text-muted-foreground mb-2 font-medium">Retirement Goal Progress</div>
          <div className="text-4xl lg:text-5xl font-bold text-success mb-3">
            {Math.round(goalProgress?.percentage || 0)}%
          </div>
          <div className="text-base text-success font-semibold mb-4">
            You're on track! Keep it up! 🎯
          </div>
        </div>
      </div>
      
      {/* Email & Settings Section */}
      <div className="mt-8 pt-6 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Financial News Source</label>
          <Select value={newsSource} onValueChange={setNewsSource}>
            <SelectTrigger className="w-full shadow-sm">
              <SelectValue placeholder="Select news source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newsapi">📰 NewsAPI (Real-time)</SelectItem>
              <SelectItem value="gemini">🤖 Gemini AI (Generated)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
          <Button
            onClick={handleSendEmail}
            disabled={isSendingEmail}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
          >
            {isSendingEmail ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Get Update
              </>
            )}
          </Button>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 p-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}