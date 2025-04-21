
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Preset colors for easy selection
const presetColors = [
  "#818cf8", // indigo-400
  "#a78bfa", // purple-400
  "#7c3aed", // purple-600
  "#6366f1", // indigo-500
  "#5b21b6", // purple-800
  "#4f46e5", // indigo-600
  "#c4b5fd", // purple-300
  "#4338ca", // indigo-700
];

export function CategoryForm({ open, onOpenChange }: CategoryFormProps) {
  const { addCategory } = useTaskContext();
  const [selectedColor, setSelectedColor] = useState(presetColors[0]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: selectedColor,
    },
  });

  // Update the form value when color is selected
  React.useEffect(() => {
    form.setValue("color", selectedColor);
  }, [selectedColor, form]);

  function onSubmit(values: FormValues) {
    // Ensure both values are present to satisfy the type
    addCategory({
      name: values.name,
      color: values.color
    });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {presetColors.map((color) => (
                      <div
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color }}
                        className={`h-8 rounded-md cursor-pointer transition-all ${
                          selectedColor === color
                            ? "ring-2 ring-offset-2 ring-ring"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
