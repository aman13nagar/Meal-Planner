
import React ,{useContext}from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../assets/css/LoginSuccessModal.css';
import { AuthContext } from '../../context/AuthContext';

const LoginSuccessModal = ({ show, onHide }) => {
  const {user}=useContext(AuthContext);
  return (
    <Modal show={show} onHide={onHide} centered className="login-success-modal">
      <Modal.Body className="text-center">
        <div className="modal-animation">
          <div className="circle"></div>
          <div className="checkmark"></div>
        </div>
        <h4>Hey, {user===null?'':user.name}</h4>
        <p>Your meal planning journey continues. Explore new recipes and plan your meals efficiently.</p>
        <Button variant="primary" onClick={onHide}>Start Planning</Button>
      </Modal.Body>
    </Modal>
  );
};

export default LoginSuccessModal;
