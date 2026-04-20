import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/users').then(res => setUsers(res.data));
    axios.get('http://localhost:5000/api/admin/foods').then(res => setFoods(res.data));
  }, []);

  const deleteFood = async (id) => {
    if (window.confirm('Delete this food entry permanently?')) {
      await axios.delete(`http://localhost:5000/api/admin/foods/${id}`);
      const res = await axios.get('http://localhost:5000/api/admin/foods');
      setFoods(res.data);
    }
  };

  return (
    <div>
      <h1 className="mb-4">🔧 Admin Dashboard</h1>

      <h4>Users ({users.length})</h4>
      <table className="table table-striped mb-5">
        <thead><tr><th>Email</th><th>Role</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}><td>{u.email}</td><td><span className="badge bg-secondary">{u.role}</span></td></tr>
          ))}
        </tbody>
      </table>

      <h4>All Food Entries ({foods.length})</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>User</th>
            <th>Food</th>
            <th>Category</th>
            <th>Calories</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {foods.map(f => (
            <tr key={f._id}>
              <td>{f.userId?.email}</td>
              <td>{f.name}</td>
              <td>{f.category}</td>
              <td>{f.calories}</td>
              <td>{new Date(f.date).toLocaleDateString()}</td>
              <td><button className="btn btn-danger btn-sm" onClick={() => deleteFood(f._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;