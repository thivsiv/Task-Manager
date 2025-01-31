import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '', priority: 'Medium', category: 'Uncategorized' });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [editingTask, setEditingTask] = useState(null); // Task being edited
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [searchQuery, setSearchQuery] = useState(''); // Search query

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.title) {
      alert('Task title is required!');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '', due_date: '', priority: 'Medium', category: 'Uncategorized' }); // Clear the form
    } catch (error) {
      console.error(error);
      alert('Failed to add task. Please try again later.');
    }
  };

  // Update a task's status
  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    } catch (error) {
      console.error(error);
      alert('Failed to update task status. Please try again later.');
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, { method: 'DELETE' });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error(error);
      alert('Failed to delete task. Please try again later.');
    }
  };

  // Edit a task
  const editTask = async () => {
    if (!editingTask.title) {
      alert('Task title is required!');
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTask),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
      setEditingTask(null); // Close the edit form
    } catch (error) {
      console.error(error);
      alert('Failed to edit task. Please try again later.');
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Check if a task is overdue
  const isTaskOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  // Export tasks as CSV or JSON
  const exportTasks = (format) => {
    if (format === 'csv') {
      const headers = ['ID', 'Title', 'Description', 'Due Date', 'Priority', 'Category', 'Status'];
      const rows = tasks.map(task => [
        task.id,
        task.title,
        task.description,
        task.due_date || 'No due date',
        task.priority,
        task.category,
        task.status,
      ]);
      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'tasks.csv';
      link.click();
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(tasks, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'tasks.json';
      link.click();
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true; // 'all'
  }).filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen p-4`}>
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <button
            onClick={toggleTheme}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>

        {/* Cool Description */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <p className="text-lg">Stay organized and boost your productivity with the ultimate Task Manager!</p>
        </motion.div>

        {/* Add Task Form */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className={`border p-2 mr-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          />
          <input
            type="text"
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className={`border p-2 mr-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          />
          <input
            type="date"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            className={`border p-2 mr-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className={`border p-2 mr-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            className={`border p-2 mr-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
            <option value="Uncategorized">Uncategorized</option>
          </select>
          <button
            onClick={addTask}
            className="bg-blue-500 text-white p-2 hover:bg-blue-600 transition-colors"
          >
            Add Task
          </button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-4"
        >
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`border p-2 w-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          />
        </motion.div>

        {/* Filter Tasks */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-4"
        >
          <label htmlFor="filter" className="mr-2">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`border p-2 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending Tasks</option>
            <option value="completed">Completed Tasks</option>
          </select>
        </motion.div>

        {/* Export Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-4"
        >
          <button
            onClick={() => exportTasks('csv')}
            className="bg-green-500 text-white p-2 mr-2 hover:bg-green-600 transition-colors"
          >
            Export as CSV
          </button>
          <button
            onClick={() => exportTasks('json')}
            className="bg-purple-500 text-white p-2 hover:bg-purple-600 transition-colors"
          >
            Export as JSON
          </button>
        </motion.div>

        {/* Task List */}
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <AnimatePresence>
            {filteredTasks.map(task => (
              <motion.li
                key={task.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`border p-4 mb-2 flex justify-between items-center rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                } ${
                  isTaskOverdue(task.due_date) ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <div>
                  <h2 className={`font-bold ${task.status === 'completed' ? 'line-through' : ''}`}>
                    {task.title}
                  </h2>
                  <p>{task.description}</p>
                  <p>Due Date: {task.due_date || 'No due date'}</p>
                  <p>Priority: <span className={`${
                    task.priority === 'High' ? 'text-red-500' :
                    task.priority === 'Medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>{task.priority}</span></p>
                  <p>Category: {task.category}</p>
                  <p>Status: {task.status}</p>
                  {isTaskOverdue(task.due_date) && (
                    <p className="text-red-500">Task overdue!</p>
                  )}
                  {/* Task History */}
                  <div className="mt-2">
                    <h3 className="font-semibold">Task History:</h3>
                    <ul className="list-disc list-inside">
                      {task.history.map((entry, index) => (
                        <li key={index}>
                          {entry.action} on {new Date(entry.timestamp).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  {task.status === 'completed' ? (
                    <button
                      disabled
                      className="bg-gray-500 text-white p-2 mr-2 cursor-not-allowed"
                    >
                      Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'completed')}
                      className="bg-green-500 text-white p-2 mr-2 hover:bg-green-600 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => setEditingTask(task)}
                    className="bg-yellow-500 text-white p-2 mr-2 hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white p-2 hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        )}

        {/* Edit Task Modal */}
        {editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          >
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg`}>
              <h2 className="text-xl font-bold mb-4">Edit Task</h2>
              <input
                type="text"
                placeholder="Task Title"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className={`border p-2 mb-2 w-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
              />
              <input
                type="text"
                placeholder="Task Description"
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className={`border p-2 mb-2 w-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
              />
              <input
                type="date"
                value={editingTask.due_date}
                onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                className={`border p-2 mb-2 w-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
              />
              <select
                value={editingTask.priority}
                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                className={`border p-2 mb-2 w-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                value={editingTask.category}
                onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                className={`border p-2 mb-2 w-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Uncategorized">Uncategorized</option>
              </select>
              <button
                onClick={editTask}
                className="bg-blue-500 text-white p-2 mr-2 hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditingTask(null)}
                className="bg-gray-500 text-white p-2 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;