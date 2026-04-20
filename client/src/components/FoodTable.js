import React from 'react';

const FoodTable = ({ foods, onEdit, onDelete }) => (
  <table className="table table-hover table-striped align-middle">
    <thead className="table-dark">
      <tr>
        <th>Date</th>
        <th>Food</th>
        <th>Category</th>
        <th className="text-end">Calories</th>
        <th className="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {foods.map(food => (
        <tr key={food._id}>
          <td>{new Date(food.date).toLocaleDateString()}</td>
          <td>{food.name}</td>
          <td><span className="badge bg-info">{food.category}</span></td>
          <td className="text-end fw-bold">{food.calories}</td>
          <td className="text-center">
            <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(food)}>✏️</button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(food._id)}>🗑️</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default FoodTable;