import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export let API_URL = 'http://localhost:3001/employees';

const initialState = {
    employees: [],
    status: 'idle',
    error: null
};

// Async thunk to fetch employees data
export const fetchEmployees = createAsyncThunk('dashboard/fetchEmployees', async () => {
    const response = await axios.get(`${API_URL}`);
    return response.data;
});

// Async thunk to add a new employee
export const addEmployee = createAsyncThunk('dashboard/addEmployee', async (newEmployee) => {
    const employeeWithTasks = { ...newEmployee, tasks: [] };
    const response = await axios.post(`${API_URL}`, employeeWithTasks);
    return response.data;
});


// Async thunk to assign a task to an employee
export const assignTask = createAsyncThunk('dashboard/assignTask', async ({ employeeId, task }) => {
    const response = await axios.get(`${API_URL}/${employeeId}`);
    const employee = response.data;
    const updatedTasks = employee.tasks ? [...employee.tasks, task] : [task];
    await axios.patch(`${API_URL}/${employeeId}`, { tasks: updatedTasks });
    return { id: employeeId, task };
});


// Async thunk to delete an employee
export const deleteEmployee = createAsyncThunk('dashboard/deleteEmployee', async (employeeId) => {
    await axios.delete(`${API_URL}/${employeeId}`);
    return employeeId;
});

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.employees = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.employees.push(action.payload);
            })
            .addCase(assignTask.fulfilled, (state, action) => {
                const { id, task } = action.payload;
                const existingEmployee = state.employees.find(emp => emp.id === id);
                if (existingEmployee) {
                    if (!existingEmployee.tasks) {
                        existingEmployee.tasks = [];
                    }
                    existingEmployee.tasks.push(task);
                }
            })            
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                const employeeId = action.payload;
                state.employees = state.employees.filter(emp => emp.id !== employeeId);
            });
    },
});

export const { actions } = dashboardSlice;
//export { fetchEmployees, addEmployee, assignTask, deleteEmployee };
export default dashboardSlice.reducer;