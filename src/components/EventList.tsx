import React from 'react';
import { Event } from '../types/event';

interface EventListProps {
    events: Event[];
    date: Date;
}

export const EventList: React.FC<EventListProps> = ({ events, date }) => {
    const dateString = date.toLocaleDateString('ru-RU', {
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="event-list">
            <h3>{dateString}</h3>
            {events.length === 0 ? (
                <p className='p-12'>Нет событий на этот день.</p>
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event.id}>
                            <div>
                                <img src="/line.svg" alt="" />
                            </div>
                            <div>
                                <p>{event.title}</p>
                                <p>{event.time}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};