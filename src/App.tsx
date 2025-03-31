import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import './App.css';
import { Event } from './types/event';

const App: React.FC = () => {
    const [events, setEvents] = useState<Record<string, Event[]>>({});
    const userId = 749991690;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjc0OTk5MTY5MCwiaWF0IjoxNzQzNDQwNTY4LCJleHAiOjE3NzQ5NzY1Njh9.wtf6a9w2q0UqQUmDXuxiehN_B4RXD93TkdUlFwC6skY";

    const getProjectNameFromUrl = (): string | null => {
        const urlParams = new URLSearchParams(window.location.search);
        const projectName = urlParams.get('project_name');
        return projectName;
    };

    const projectName = getProjectNameFromUrl();

    const getStaticAssetUrl = (filename: string) => {
         if (!projectName) {
            return "/avatar.svg"; 
         }

        return `https://static-sda.ru/static/${projectName}/${filename}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://evabot1.ru/reminders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ t_user_id: userId }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'ok' && data.reminders) {
                    const formattedEvents: Record<string, Event[]> = {};

                    for (const key in data.reminders) {
                        const reminder = data.reminders[key];
                        const reminderDateTime = new Date(reminder.reminder_on_datetime);

                        const reminderDate = reminderDateTime.toISOString().slice(0, 10);

                        const reminderTime = reminderDateTime.toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'UTC', 
                        });

                        const event: Event = {
                            id: key,
                            title: reminder.reminder_text,
                            date: reminderDate,
                            time: reminderTime,
                        };

                        if (!formattedEvents[reminderDate]) {
                            formattedEvents[reminderDate] = [];
                        }
                        formattedEvents[reminderDate].push(event);
                    }

                    setEvents(formattedEvents);
                } else {
                    console.warn('Не удалось получить напоминания:', data);
                }
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="App">
            <Calendar
                events={events}
                getStaticAssetUrl={getStaticAssetUrl}
            />
        </div>
    );
};

export default App;