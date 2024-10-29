import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/CreateEmailModal.css';

Modal.setAppElement('#root');

interface Event {
    id: string;
    title: string;
    start: Date;
    description?: string;
}

interface EventDetailsModalProps {
    event: Event | null; 
    isOpen: boolean;
    onClose: () => void;
    refreshEvents: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, isOpen, onClose, refreshEvents }) => {
    const [email, setEmail] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (event) {
            setEmail(event.title);
            setDate(event.start.toISOString().split('T')[0]);
            setDescription(event.description || '');
        }
    }, [event]);

    const handleUpdate = async () => {
        if (!event) return;
        try {
            await axios.put(`http://localhost:4000/api/emails/${event.id}`, { email, date, description });
            refreshEvents();
            onClose();
        } catch (err) {
            setError('Failed to update event. Please try again.');
            console.error('Failed to update event', err);
        }
    };

    const handleDelete = async () => {
        if (!event) return;
        try {
            await axios.delete(`http://localhost:4000/api/emails/${event.id}`);
            refreshEvents();
            onClose();
        } catch (err) {
            setError('Failed to delete event. Please try again.');
            console.error('Failed to delete event', err);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Event Details"
            className="custom-modal"
            overlayClassName="custom-overlay"
        >
            <h2 className="modal-title">Event Details</h2>
            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-textarea"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="modal-buttons">
                    <button type="button" onClick={handleUpdate} className="submit-button">Update</button>
                    <button type="button" onClick={handleDelete} className="delete-button">Delete</button>
                    <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

export default EventDetailsModal;
