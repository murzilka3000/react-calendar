import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import './App.css';
import { Event } from './types/event';

const AVATAR_FILENAME = 'avatar.svg';

const origin = window.location.origin;
let basePath = window.location.pathname;
if (!basePath.endsWith('/')) {
    basePath += '/';
}
const apiUrl = `${origin}/reminders`;
const staticBaseUrl = `${origin}${basePath}`;

const App: React.FC = () => {
    const [events, setEvents] = useState<Record<string, Event[]>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [userId, setUserId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [projectName, setProjectName] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userIdParam = urlParams.get('t_user_id');
        const tokenParam = urlParams.get('token');
        const projectNameParam = urlParams.get('project_name');

        let parseError = null;

        if (userIdParam) {
            const parsedUserId = parseInt(userIdParam, 10);
            if (!isNaN(parsedUserId)) {
                setUserId(parsedUserId);
            } else {
                parseError = "Некорректный User ID в параметре URL 't_user_id'.";
            }
        } else {
            parseError = "Отсутствует User ID в параметре URL 't_user_id'.";
        }

        if (tokenParam) {
            setToken(tokenParam);
        } else {
            if (!parseError) {
                parseError = "Отсутствует Token в параметре URL 'token'.";
            }
        }

        if (projectNameParam) {
            setProjectName(projectNameParam);
        } else {
            setProjectName(null);
        }

        if (parseError) {
            setError(parseError);
            setIsLoading(false);
        }

    }, []);

    const getStaticAssetUrl = (filename: string): string => {
        const cleanFilename = filename.startsWith('/') ? filename.substring(1) : filename;

        if (cleanFilename === AVATAR_FILENAME) {
            if (projectName) {
                const projectFolder = projectName.toLowerCase();
                const projectAvatarUrl = `${staticBaseUrl}${projectFolder}/${cleanFilename}`;
                return projectAvatarUrl;
            } else {
                const defaultAvatarUrl = `${staticBaseUrl}${cleanFilename}`;
                return defaultAvatarUrl;
            }
        } else {
            const standardUrl = `${staticBaseUrl}${cleanFilename}`;
            return standardUrl;
        }
    };

    useEffect(() => {
        if (!userId || !token || error) {
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ t_user_id: userId }),
                });

                if (!response.ok) {
                    let errorBody = null;
                    try { errorBody = await response.json(); } catch { /* ignore */ }
                    throw new Error(`HTTP ошибка! Статус: ${response.status}${errorBody?.message ? ` (${errorBody.message})` : ''}`);
                }

                const data = await response.json();

                if (data.status === 'ok' && data.reminders) {
                    const formattedEvents: Record<string, Event[]> = {};
                    for (const key in data.reminders) {
                        const reminder = data.reminders[key];
                        if (!reminder.reminder_on_datetime) {
                            continue;
                        }
                        let reminderDateTime;
                        try {
                            reminderDateTime = new Date(reminder.reminder_on_datetime);
                            if (isNaN(reminderDateTime.getTime())) {
                                throw new Error(`Invalid date format: ${reminder.reminder_on_datetime}`);
                            }
                        } catch {
                            continue;
                        }
                        const reminderDate = reminderDateTime.toISOString().slice(0, 10);
                        const reminderTime = reminderDateTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
                        const event: Event = { id: key, title: reminder.reminder_text || 'Без названия', date: reminderDate, time: reminderTime };
                        if (!formattedEvents[reminderDate]) { formattedEvents[reminderDate] = []; }
                        formattedEvents[reminderDate].push(event);
                    }
                    setEvents(formattedEvents);
                    setError(null);
                } else {
                    const errorMessage = `Не удалось загрузить напоминания: ${data.message || 'Статус ответа не "ok"'}`;
                    setError(errorMessage);
                    setEvents({});
                }

            } catch (fetchError) {
                setError(`Ошибка при получении данных: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
                setEvents({});
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

    }, [userId, token, error]);

    if (error) {
        return <div className="App App-error">Ошибка: {error}</div>;
    }
    if (!userId || !token) {
        return <div className="App App-waiting">Ожидание параметров из URL...</div>;
    }
    if (isLoading) {
        return <div className="App App-loading">Загрузка календаря...</div>;
    }
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