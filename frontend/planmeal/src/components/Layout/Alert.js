import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Alert = () => {
  const { error } = useContext(AuthContext);

  return (
    error && <div className="alert alert-danger">{error}</div>
  );
};

export default Alert;
