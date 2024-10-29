import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/CreateEmailModal.css';

Modal.setAppElement('#root'); 

interface CreateEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    refreshEvents: () => void;
}

const CreateEmailModal: React.FC<CreateEmailModalProps> = ({ isOpen, onClose, refreshEvents }) => {
    const [email, setEmail] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/api/emails', { 
                email, date, description 
            });
            setEmail('');
            setDate('');
            setDescription('');
            refreshEvents();
            onClose();
        } catch (err) {
            setError('Failed to create email. Please try again.');
            console.error(err);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Create Email"
            className="custom-modal"
            overlayClassName="custom-overlay"
        >
            <h2 className="modal-title">Create New Email</h2>
            <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="form-textarea"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="modal-buttons">
                    <button type="submit" className="submit-button">Submit</button>
                    <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateEmailModal;
