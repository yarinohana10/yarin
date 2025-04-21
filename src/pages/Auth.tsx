
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock, ArrowLeft, LogIn } from 'lucide-react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if already authenticated
  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('admin_authenticated');
      if (adminAuth === 'true') {
        navigate('/admin');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Hardcoded admin credentials
      if (username === 'yarin' && password === 'Yarin123123') {
        // Set admin authenticated in localStorage
        localStorage.setItem('admin_authenticated', 'true');
        
        console.log("Admin login successful");
        
        // Redirect to admin or the page they were trying to access
        const from = location.state?.from || '/admin';
        navigate(from, { replace: true });
        return;
      }
      
      // Invalid credentials
      throw new Error('Invalid login credentials');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות",
        description: error.message === "Invalid login credentials" 
          ? "שם המשתמש או הסיסמה שגויים" 
          : error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F5F2] p-4">
      <div className="absolute top-4 left-4 flex gap-2">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            חזרה לדף הראשי
          </Button>
        </Link>
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            <Lock className="h-5 w-5 text-[#D4AF7A]" />
            התחברות למסך ניהול
          </CardTitle>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-right">
              <Label htmlFor="admin-username">שם משתמש</Label>
              <Input
                id="admin-username"
                placeholder="הזן שם משתמש"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-right"
                autoFocus
              />
            </div>
            
            <div className="space-y-2 text-right">
              <Label htmlFor="admin-password">סיסמה</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="הזן סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-right"
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#F0B6BC] to-[#D4AF7A]"
              disabled={loading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? 'מתחבר...' : 'התחבר'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
