# Supabase Setup Guide

This guide will help you set up Supabase for your Next.js application and use the provided boilerplate for fetching tasks.

## 1. Environment Variables

Create a `.env.local` file in your project root and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## 2. Database Setup

Create a `tasks` table in your Supabase database with the following SQL:

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for demo purposes)
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);
```

## 3. Usage

### Using the Custom Hook

The `useTasks` hook provides a complete interface for managing tasks:

```tsx
import { useTasks } from "@/hooks/use-tasks";

function MyComponent() {
	const {
		tasks,
		loading,
		error,
		addTask,
		updateTask,
		toggleTaskCompletion,
		deleteTask,
	} = useTasks();

	// Add a new task
	const handleAddTask = async () => {
		await addTask({
			title: "New Task",
			description: "Task description",
			is_completed: false,
		});
	};

	// Toggle task completion
	const handleToggleTask = async (id: string) => {
		await toggleTaskCompletion(id);
	};

	// Update a task
	const handleUpdateTask = async (id: string) => {
		await updateTask(id, { title: "Updated Title" });
	};

	// Delete a task
	const handleDeleteTask = async (id: string) => {
		await deleteTask(id);
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			{tasks.map((task) => (
				<div key={task.id}>
					<h3
						style={{
							textDecoration: task.is_completed ? "line-through" : "none",
						}}
					>
						{task.title}
					</h3>
					<p>{task.description}</p>
					<span>{task.is_completed ? "Completed" : "Pending"}</span>
					<button onClick={() => handleToggleTask(task.id)}>
						{task.is_completed ? "Mark Incomplete" : "Mark Complete"}
					</button>
				</div>
			))}
		</div>
	);
}
```

### Using the TasksList Component

The `TasksList` component provides a complete UI for managing tasks:

```tsx
import { TasksList } from "@/components/TasksList";

export default function MyPage() {
	return (
		<div>
			<h1>Task Management</h1>
			<TasksList />
		</div>
	);
}
```

## 4. Available Routes

- `/tasks` - Full task management page with the TasksList component

## 5. Features

The boilerplate includes:

- ✅ Fetch all tasks from the `tasks` table
- ✅ Add new tasks
- ✅ Toggle task completion (boolean field)
- ✅ Update existing tasks
- ✅ Delete tasks
- ✅ Loading states
- ✅ Error handling
- ✅ TypeScript support
- ✅ Real-time updates (tasks are refetched after operations)
- ✅ Modern UI with shadcn/ui components
- ✅ Visual indicators for completed tasks (strikethrough, opacity)

## 6. Customization

### Modify the Task Interface

Update the `Task` interface in `src/lib/supabase.ts` to match your table structure:

```tsx
export interface Task {
	id: string;
	title: string;
	description?: string;
	is_completed: boolean;
	priority?: string;
	due_date?: string;
	created_at?: string;
	updated_at?: string;
}
```

### Add More Operations

Extend the `useTasks` hook with additional operations like filtering, sorting, or pagination:

```tsx
const fetchCompletedTasks = async () => {
	const { data, error } = await supabase
		.from("tasks")
		.select("*")
		.eq("is_completed", true);

	if (error) throw error;
	return data;
};
```

## 7. Security Considerations

For production use, consider:

- Implementing proper Row Level Security (RLS) policies
- Adding user authentication
- Validating input data
- Implementing rate limiting
- Using environment-specific configurations

## 8. Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**

   - Ensure your `.env.local` file exists and contains the correct values
   - Restart your development server after adding environment variables

2. **"relation 'tasks' does not exist"**

   - Run the SQL commands in step 2 to create the table

3. **CORS errors**

   - Check your Supabase project settings and ensure your domain is allowed

4. **Authentication errors**
   - Verify your API keys are correct
   - Check if RLS policies are properly configured
