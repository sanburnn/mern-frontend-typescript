import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import CreateEmailModal from './CreateEmailModal';
import EventDetailsModal from './EventDetailsModal';

const localizer = momentLocalizer(moment);

interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    description: string;
}

const HomePage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/emails');
            const emails = res.data.map((email: any) => ({
                id: email._id,
                title: email.email,
                start: new Date(email.date),
                end: new Date(email.date),
                allDay: true,
                description: email.description,
            }));
            setEvents(emails);
        } catch (err) {
            console.error('Failed to fetch events', err);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    
    const openDetailsModal = (event: CalendarEvent) => {
        setSelectedEvent(event as Event);
        setIsDetailsModalOpen(true);
    };
    
    const closeDetailsModal = () => {
        setSelectedEvent(null);
        setIsDetailsModalOpen(false);
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:4000/api/auth/logout', {}, {
                headers: { 'x-auth-token': token }
            });
            localStorage.removeItem('token');
            navigate('/');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
                <button onClick={handleLogout} style={{ padding: '10px' }} className='logout-button'>Logout</button>
                <button onClick={openModal} style={{ padding: '10px' }} className='create-button'>Create</button>
            </header>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, padding: '50px' }}
                onSelectEvent={openDetailsModal}
            />
            <CreateEmailModal isOpen={isModalOpen} onClose={closeModal} refreshEvents={fetchEvents} />
            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    isOpen={isDetailsModalOpen}
                    onClose={closeDetailsModal}
                    refreshEvents={fetchEvents}
                />
            )}
        </div>
    );
};

export default HomePage;
