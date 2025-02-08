import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../ui/toastService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../features/dashboardSlice';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/${userId}`);
        setTasks(response.data.tasks || []); // Ensure tasks is always an array
      } catch (error) {
        showErrorToast('Failed to fetch tasks.');
      }
    };

    fetchTasks();
  }, [userId]);

  const completeTask = async (taskIndex) => {
    try {
      const completedTask = tasks[taskIndex];
      const updatedTasks = tasks.filter((_, index) => index !== taskIndex);
      await axios.put(`${API_URL}/${userId}`, { tasks: updatedTasks, completedTask });
      setTasks(updatedTasks);

      // Increment completed task count for the specific employee in local storage
      let completedTaskCount = localStorage.getItem(`completedTaskCount_${userId}`) || 0;
      completedTaskCount = parseInt(completedTaskCount) + 1;
      localStorage.setItem(`completedTaskCount_${userId}`, completedTaskCount);

      showSuccessToast('Task completed successfully!');
    } catch (error) {
      showErrorToast('Failed to complete task.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto p-6">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
          Employee Dashboard
        </h1>
        
        {/* Task Container */}
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Tasks</h2>
          
          {tasks.length === 0 ? (
            <p className="text-center text-lg text-gray-500">No tasks assigned yet!</p>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg p-4 shadow-md transition-all"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-800">{task.task}</h3>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                  </div>
                  
                  <button
                    className="ml-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    onClick={() => completeTask(index)}
                  >
                    Completed Task
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;