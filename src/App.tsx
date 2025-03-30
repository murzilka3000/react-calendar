import React from 'react';
import Calendar from './components/Calendar';
import './App.css';

const App: React.FC = () => {
  const events = {
    '2025-03-27': [
      { id: 4, title: 'Созвон по работе', time: '16:00' },
    ],
    '2025-03-25': [
      { id: 4, title: 'Созвон по работе', time: '16:00' },
      { id: 4, title: 'Созвон по работе', time: '16:00' },
      { id: 4, title: 'Созвон по работе', time: '16:00' },
      { id: 4, title: 'Созвон по работе', time: '16:00' },
      { id: 4, title: 'Созвон по работе', time: '16:00' },
      { id: 4, title: 'Созвон по работе', time: '16:00' },
      { id: 4, title: 'Созвон по работе', time: '16:00' },
      { id: 4, title: 'Созвон по работе', time: '16:00' },
    ],
    '2025-03-15': [
      { id: 1, title: 'Поздравить коллегу с днем рождения', time: '8:00' },
    ],
    '2025-03-26': [], //Нет событий
  };

  return (
    <div className="App">
      <Calendar events={events} />
    </div>
  );
};

export default App;