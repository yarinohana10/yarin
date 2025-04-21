
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ThumbsUp, ThumbsDown, HelpCircle, Clock, UsersRound 
} from "lucide-react";

type GuestStatsProps = {
  stats: {
    total: number;
    attending: number;
    declined: number;
    maybe: number;
    pending: number;
  }
};

export function GuestStats({ stats }: GuestStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-md font-medium">סה״כ</CardTitle>
          <UsersRound className="h-5 w-5 text-gray-600" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">
            סך הכל אנשים
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-md font-medium">מגיעים</CardTitle>
          <ThumbsUp className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.attending}</p>
          <p className="text-xs text-muted-foreground">
            אנשים אישרו הגעה
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-md font-medium">לא מגיעים</CardTitle>
          <ThumbsDown className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.declined}</p>
          <p className="text-xs text-muted-foreground">
            אנשים לא מגיעים
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-md font-medium">אולי מגיעים</CardTitle>
          <HelpCircle className="h-5 w-5 text-yellow-600" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.maybe}</p>
          <p className="text-xs text-muted-foreground">
            אנשים אולי מגיעים
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-md font-medium">טרם אישרו</CardTitle>
          <Clock className="h-5 w-5 text-gray-600" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-xs text-muted-foreground">
            אנשים לא אישרו עדיין
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
