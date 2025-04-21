
import React from "react";
import { Task, useTaskContext } from "@/contexts/TaskContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { updateTask, deleteTask, categories } = useTaskContext();
  
  const category = categories.find(c => c.id === task.category);
  
  const statusIcons = {
    "todo": <Circle className="h-4 w-4" />,
    "in-progress": <Clock className="h-4 w-4" />,
    "completed": <CheckCircle className="h-4 w-4" />
  };
  
  const statusClasses = {
    "todo": "bg-muted text-muted-foreground",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  };
  
  const handleStatusChange = () => {
    const statusOrder: Task["status"][] = ["todo", "in-progress", "completed"];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    updateTask(task.id, { status: nextStatus });
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-base line-clamp-1">{task.title}</h3>
          <div className="flex gap-1">
            {category && (
              <Badge style={{ backgroundColor: category.color }} className="text-white">
                {category.name}
              </Badge>
            )}
            <Badge 
              className={cn("cursor-pointer", statusClasses[task.status])}
              onClick={handleStatusChange}
            >
              <span className="flex items-center gap-1">
                {statusIcons[task.status]}
                {task.status === "in-progress" ? "In Progress" : 
                  task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {task.description || "No description provided."}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Created: {format(new Date(task.createdAt), "MMM d, yyyy")}
        </p>
      </CardContent>
      <CardFooter className="p-2 bg-muted/30 flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90" 
          onClick={() => deleteTask(task.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
