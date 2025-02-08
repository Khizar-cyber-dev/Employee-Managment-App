import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  addEmployee,
  assignTask,
  deleteEmployee,
} from "../features/dashboardSlice";
import { showSuccessToast, showErrorToast } from "../ui/toastService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employees = useSelector((state) => state.dashboard.employees) || [];
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", password: "" });
  const [newTask, setNewTask] = useState({ employeeId: "", task: "", description: "" });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.password) {
      showErrorToast("All fields are required!");
      return;
    }

    try {
      const employeeWithTasks = { ...newEmployee, tasks: [], completedTasks: 0 };
      await dispatch(addEmployee(employeeWithTasks));
      showSuccessToast("Employee added successfully!");
      setNewEmployee({ name: "", email: "", password: "" });
    } catch (error) {
      showErrorToast("Failed to add employee.");
    }
  };

  const handleAssignTask = async () => {
    if (!newTask.employeeId || !newTask.task || !newTask.description) {
      showErrorToast("Please select an employee and enter task details.");
      return;
    }

    try {
      const taskData = {
        task: newTask.task,
        description: newTask.description,
      };
      await dispatch(assignTask({ employeeId: newTask.employeeId, task: taskData }));
      showSuccessToast("Task assigned successfully!");
      setNewTask({ employeeId: "", task: "", description: "" });
    } catch (error) {
      showErrorToast("Failed to assign task.");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await dispatch(deleteEmployee(employeeId));
      showSuccessToast("Employee deleted successfully!");
    } catch (error) {
      showErrorToast("Failed to delete employee.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    showSuccessToast('Logout successful!');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Admin Dashboard</h1>
          <button
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Add New Employee */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Add New Employee</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border border-gray-300 p-2 rounded-md"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 p-2 rounded-md"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 p-2 rounded-md"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
            />
          </div>
          <button
            className="mt-4 w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleAddEmployee}
          >
            Add Employee
          </button>
        </div>

        {/* Assign Task */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Assign Task</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={newTask.employeeId}
              onChange={(e) => setNewTask({ ...newTask, employeeId: e.target.value })}
              className="border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Task"
              className="border border-gray-300 p-2 rounded-md"
              value={newTask.task}
              onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="border border-gray-300 p-2 rounded-md"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <button
            className="mt-4 w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={handleAssignTask}
          >
            Assign Task
          </button>
        </div>

        {/* Employee List */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Employee List</h2>
          {employees.length > 0 ? (
            employees.map((employee) => {
              const completedTaskCount = localStorage.getItem(`completedTaskCount_${employee.id}`) || 0;
              return (
                <div key={employee.id} className="border-b border-gray-300 py-4">
                  <h3 className="text-xl font-medium">{employee.name}</h3>
                  <p className="text-gray-600">Email: {employee.email}</p>
                  <p className="text-gray-600">Tasks:</p>
                  {Array.isArray(employee.tasks) && employee.tasks.length > 0 ? (
                    employee.tasks.map((task, index) => (
                      <div key={index} className="text-gray-600">
                        <p>
                          <strong>Task:</strong> {task.task}
                        </p>
                        <p>
                          <strong>Description:</strong> {task.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No tasks assigned yet.</p>
                  )}
                  <p className="text-gray-600">Completed Tasks: {completedTaskCount}</p>
                  <button
                    className="mt-2 bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    Delete Employee
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">No employees found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;