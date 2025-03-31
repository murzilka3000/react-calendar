import React, { useState } from 'react';
import { CalendarDay } from './CalendarDay';
import { EventList } from './EventList';
import { Event } from '../types/event';

interface CalendarProps {
    events: Record<string, Event[]>;
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const daysInMonth = (month: number, year: number): number => {
        return new Date(year, month + 1, 0).getDate();
    };

    const firstDayOfMonth = (month: number, year: number): number => {
        return new Date(year, month, 1).getDay();
    };

    const days = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);

    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const dateString = date.toISOString().slice(0, 10);

        days.push(
            <CalendarDay
                key={i}
                day={i}
                date={date}
                eventsForDay={events[dateString] || []}
                onSelect={setSelectedDate}
                isSelected={
                    selectedDate?.getDate() === i &&
                    selectedDate?.getMonth() === currentMonth &&
                    selectedDate?.getFullYear() === currentYear
                }
                eventCount={events[dateString]?.length || 0}
            />
        );
    }

    const monthNames = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ];

    const goToPreviousMonth = () => {
        setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
        setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
        setSelectedDate(null);
    };

    const goToNextMonth = () => {
        setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
        setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));
        setSelectedDate(null);
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setSelectedDate(today);
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const selectedDateString = selectedDate ? selectedDate.toISOString().slice(0, 10) : null;

    return (
        <div className={`calendar-container ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="calendar-header">
                <h2>
                    {monthNames[currentMonth]} <span>{currentYear}</span>
                </h2>
                <div className='flex-center block2'>
                    <div>
                        <img src="/avatar.svg" alt="" />
                    </div>
                    <div className='flex-center header-block'>
                        <div className='flex-center'>
                            <button onClick={goToPreviousMonth}>
                                <img src="/lb.svg" alt="" />
                            </button>
                            <button onClick={goToNextMonth}>
                                <img src="/rb.svg" alt="" />
                            </button>
                        </div>
                        <div onClick={goToToday}>
                            <p>Сегодня</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="calendar-grid">
                <div className="weekday">Пн</div>
                <div className="weekday">Вт</div>
                <div className="weekday">Ср</div>
                <div className="weekday">Чт</div>
                <div className="weekday">Пт</div>
                <div className="weekday">Сб</div>
                <div className="weekday">Вс</div>
                {days}
            </div>
            <button className="collapse-button" onClick={toggleCollapse}>
                {isCollapsed ? <img src="/top.svg" alt="Свернуть" /> : <img src="/bottom.svg" alt="Развернуть" />}
            </button>

            {selectedDate && (
                <EventList events={events[selectedDateString!] || []} date={selectedDate} />
            )}
        </div>
    );
};

export default Calendar;