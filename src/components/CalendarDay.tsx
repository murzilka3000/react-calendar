import React from 'react';

interface CalendarDayProps {
  day: number;
  eventsForDay: any[];
  onSelect: () => void;
  isSelected: boolean;
  eventCount: number; 
}

export const CalendarDay: React.FC<CalendarDayProps> = ({ day, eventsForDay, onSelect, isSelected, eventCount }) => {
  const indicatorWidth = Math.min(20, 3 + eventCount * 2);
  const indicatorHeight = 3;

  return (
    <div className={`calendar-day ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <span className="day-number">{day}</span>
      {eventsForDay.length > 0 && (
        <span className="event-indicator" style={{ width: indicatorWidth, height: indicatorHeight, borderRadius: "2px" }}></span>
      )}
    </div>
  );
};