import React from 'react';

const CalorieCard = ({ totalCalories }) => (
  <div className="card text-center shadow-sm border-0 h-100">
    <div className="card-body">
      <h5 className="card-title text-muted">Total Calories</h5>
      <h1 className="display-4 fw-bold text-primary">{totalCalories}</h1>
      <small className="text-success">from filtered entries</small>
    </div>
  </div>
);

export default CalorieCard;