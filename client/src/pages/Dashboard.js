import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FoodTable from '../components/FoodTable';
import CalorieCard from '../components/CalorieCard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [foods, setFoods] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', date: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({ name: '', calories: '', category: 'Breakfast', date: '' });
  const [totalCalories, setTotalCalories] = useState(0);

  const fetchFoods = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.date) params.append('date', filters.date);

      const url = `http://localhost:5000/api/foods?${params.toString()}`;
      const res = await axios.get(url);
      setFoods(res.data);
      setTotalCalories(res.data.reduce((sum, f) => sum + f.calories, 0));
    } catch (err) {
      if (err.response?.status === 401) logout();
    }
  };

  useEffect(() => { fetchFoods(); }, [filters]);

  const openModal = (food = null) => {
    if (food) {
      setEditingFood(food);
      setFormData({
        name: food.name,
        calories: food.calories,
        category: food.category,
        date: new Date(food.date).toISOString().split('T')[0]
      });
    } else {
      setEditingFood(null);
      setFormData({ name: '', calories: '', category: 'Breakfast', date: new Date().toISOString().split('T')[0] });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await axios.put(`http://localhost:5000/api/foods/${editingFood._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/foods', formData);
      }
      setShowModal(false);
      fetchFoods();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this entry?')) {
      await axios.delete(`http://localhost:5000/api/foods/${id}`);
      fetchFoods();
    }
  };

  return (
    <div>
      <h1 className="mb-4">👋 Welcome, {user.email}!</h1>
      <div className="row mb-4">
        <div className="col-md-4">
          <CalorieCard totalCalories={totalCalories} />
        </div>
      </div>

      <button className="btn btn-success mb-3" onClick={() => openModal()}>+ Add Food Entry</button>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <input type="text" name="search" placeholder="Search food..." className="form-control" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
        </div>
        <div className="col-md-3">
          <select name="category" className="form-control" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>
        <div className="col-md-3">
          <input type="date" name="date" className="form-control" value={filters.date} onChange={e => setFilters({ ...filters, date: e.target.value })} />
        </div>
        <div className="col-md-3">
          <button className="btn btn-outline-secondary w-100" onClick={() => setFilters({ search: '', category: '', date: '' })}>Clear Filters</button>
        </div>
      </div>

      <FoodTable foods={foods} onEdit={openModal} onDelete={handleDelete} />

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingFood ? 'Edit Entry' : 'Add Food Entry'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Food Name</label>
                    <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Calories</label>
                    <input type="number" className="form-control" value={formData.calories} onChange={e => setFormData({ ...formData, calories: parseInt(e.target.value) })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-control" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">{editingFood ? 'Update' : 'Add Entry'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;