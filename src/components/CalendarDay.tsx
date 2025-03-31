import React from 'react';
import { Event } from '../types/event';

interface CalendarDayProps {
    day: number;
    date: Date;
    eventsForDay: Event[];
    onSelect: (date: Date) => void;
    isSelected: boolean;
    eventCount: number;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({ day, date, eventsForDay, onSelect, isSelected, eventCount }) => {
    const indicatorWidth = Math.min(20, 3 + eventCount * 2);
    const indicatorHeight = 3;

    return (
        <div className={`calendar-day ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(date)}>
            <span className="day-number">{day}</span>
            {eventsForDay.length > 0 && (
                <span className="event-indicator" style={{ width: indicatorWidth, height: indicatorHeight, borderRadius: "2px" }}></span>
            )}
        </div>
    );
};