import TaskList from '@/components/TaskList';
import { mockTasks } from '@/constants/mockTasks';

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4">
      <TaskList tasks={mockTasks} />
    </main>
  );
}
