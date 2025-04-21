
import React, { useState } from "react";
import { Task, TaskStatus, useTaskContext } from "@/contexts/TaskContext";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { CategoryForm } from "@/components/CategoryForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FolderPlus, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function Dashboard() {
  const { tasks, categories } = useTaskContext();
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState<TaskStatus | "all">("all");

  // Filter tasks based on status, category, and search query
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = currentTab === "all" || task.status === currentTab;
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Handler for editing a task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  // Close task form and reset editing state
  const handleCloseTaskForm = () => {
    setTaskFormOpen(false);
    setEditingTask(undefined);
  };

  // Get tasks count by status
  const getTasksCountByStatus = (status: TaskStatus | "all") => {
    if (status === "all") return tasks.length;
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <div className="container max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="animate-slide-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 text-transparent bg-clip-text">
            Task Manager
          </h1>
          <p className="text-muted-foreground">Organize your tasks efficiently</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setTaskFormOpen(true)} className="shadow-sm bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:from-purple-700 hover:to-indigo-600">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setCategoryFormOpen(true)}
            className="shadow-sm"
          >
            <FolderPlus className="mr-2 h-4 w-4" /> New Category
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-1/2">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shadow-sm">
              <Filter className="mr-2 h-4 w-4" />
              {selectedCategory === "all" 
                ? "All Categories" 
                : categories.find(c => c.id === selectedCategory)?.name || "Category"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup 
              value={selectedCategory} 
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <DropdownMenuRadioItem value="all">
                All Categories
              </DropdownMenuRadioItem>
              {categories.map((category) => (
                <DropdownMenuRadioItem 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center"
                >
                  <span 
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs 
        defaultValue="all" 
        className="w-full"
        value={currentTab}
        onValueChange={(value) => setCurrentTab(value as TaskStatus | "all")}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            All ({getTasksCountByStatus("all")})
          </TabsTrigger>
          <TabsTrigger value="todo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            To Do ({getTasksCountByStatus("todo")})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            In Progress ({getTasksCountByStatus("in-progress")})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Completed ({getTasksCountByStatus("completed")})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 animate-float">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-200 to-indigo-200 flex items-center justify-center">
                <Plus className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground">No tasks found.</p>
              <Button 
                onClick={() => setTaskFormOpen(true)} 
                className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:from-purple-700 hover:to-indigo-600"
              >
                Create your first task
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="todo" className="mt-6">
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No tasks found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-6">
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No tasks found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No tasks found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Task form dialog */}
      <TaskForm 
        open={taskFormOpen} 
        onOpenChange={handleCloseTaskForm} 
        task={editingTask}
      />
      
      {/* Category form dialog */}
      <CategoryForm open={categoryFormOpen} onOpenChange={setCategoryFormOpen} />
    </div>
  );
}
