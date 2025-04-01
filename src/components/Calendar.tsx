import React, { useState } from 'react';
import { CalendarDay } from './CalendarDay';
import { EventList } from './EventList';
import { Event } from '../types/event';

interface CalendarProps {
    events: Record<string, Event[]>;
    getStaticAssetUrl: (filename: string) => string;
    avatarUrl: string | null;
}

const Calendar: React.FC<CalendarProps> = ({ events, getStaticAssetUrl, avatarUrl }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const daysInMonth = (month: number, year: number): number => {
        return new Date(year, month + 1, 0).getDate();
    };

    const firstDayOfMonth = (month: number, year: number): number => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; 
    };


    const days = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDayIndex = firstDayOfMonth(currentMonth, currentYear);

    for (let i = 0; i < firstDayIndex; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Добавляем дни месяца
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
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
    ];

    const goToPreviousMonth = () => {
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedDate(null);
    };

    const goToNextMonth = () => {
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
        setSelectedDate(null);
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        if (today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
             setSelectedDate(today);
        } else {
             setSelectedDate(null); 
        }
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
                    {avatarUrl && (
                         <div>
                            <img src={avatarUrl} alt="Avatar" />
                        </div>
                    )}
                    <div className='flex-center header-block'>
                        <div className='flex-center'>
                            <button onClick={goToPreviousMonth}>
                                <img src={getStaticAssetUrl('lb.svg')} alt="Previous" />
                            </button>
                            <button onClick={goToNextMonth}>
                                <img src={getStaticAssetUrl('rb.svg')} alt="Next" />
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
                {isCollapsed
                    ? <img src={getStaticAssetUrl('top.svg')} alt="Развернуть" />
                    : <img src={getStaticAssetUrl('bottom.svg')} alt="Свернуть" />
                }
            </button>

            {selectedDate && selectedDateString && (
                <EventList events={events[selectedDateString] || []} date={selectedDate} />
            )}
        </div>
    );
};

export default Calendar;