
import React, { createContext, useContext, useState, useEffect } from "react";

// Define types
export type TaskStatus = "todo" | "in-progress" | "completed";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: string;
  createdAt: Date;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

// Context type
type TaskContextType = {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  deleteCategory: (id: string) => void;
};

// Create context
export const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample data
const initialCategories: Category[] = [
  { id: "1", name: "Work", color: "#818cf8" },
  { id: "2", name: "Personal", color: "#a78bfa" },
  { id: "3", name: "Learning", color: "#6366f1" },
  { id: "4", name: "Health", color: "#7c3aed" },
];

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // States for tasks and categories
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        // Parse dates correctly
        return JSON.parse(savedTasks, (key, value) => {
          if (key === "createdAt") return new Date(value);
          return value;
        });
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error);
        return [];
      }
    }
    return [];
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : initialCategories;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // Task operations
  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Category operations
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Math.random().toString(36).substring(2, 9),
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const value = {
    tasks,
    categories,
    addTask,
    updateTask,
    deleteTask,
    addCategory,
    deleteCategory,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook for using the context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
