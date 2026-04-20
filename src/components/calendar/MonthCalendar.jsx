import { useState } from 'react';
import styles from '../../styles/css/calendar/MonthCalendar.module.css';

function MonthCalendar({ onDateClick, classList = [], selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 날짜 포맷 함수 (중요)
  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const today = formatDate(new Date());

  // 해당 날짜 수업 가져오기
  const getClassesByDate = (day) => {
    if (!day) return [];
    const formatted = formatDate(day);
    return classList.filter((item) => item.date === formatted);
  };

  // 달력 날짜 생성
  const getDaysInMonth = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDate; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth();

  // ✅ 클릭
  const handleClick = (day) => {
    if (!day) return;
    onDateClick(formatDate(day));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={prevMonth}>◀</button>
        <h3>
          {year}년 {month + 1}월
        </h3>
        <button onClick={nextMonth}>▶</button>
      </div>

      <div className={styles.week}>
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className={styles.grid}>
        {days.map((day, idx) => {
          const formatted = day ? formatDate(day) : null;

          const isSelected = day && selectedDate === formatted;
          const isToday = formatted === today;

          const classes = getClassesByDate(day);

          return (
            <div
              key={idx}
              className={`${styles.cell} 
                ${isSelected ? styles.selected : ''} 
                ${isToday ? styles.today : ''}`}
              onClick={() => day && handleClick(day)}
            >
              {day && (
                <>
                  <div className={styles.date}>{day.getDate()}</div>

                  <div className={styles.classList}>
                    {classes.slice(0, 2).map((c) => (
                      <p
                        key={c.id}
                        className={`${styles.classItem} ${
                          c.type === 'record' ? styles.record : ''
                        }`}
                      >
                        {c.type === 'record' ? '📝 ' : '📚 '}
                        {c.title}
                      </p>
                    ))}

                    {classes.length > 2 && (
                      <p className={styles.more}>+{classes.length - 2}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthCalendar;
