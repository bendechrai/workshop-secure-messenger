import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const Message = ({ message }) => {
  return <div key={message.id} className="message">
    <date>{dayjs.utc(message.created_at).local().format('HH:mm')}</date>
    <span>
      {message.sender} wrote:{" "}
      <span className='userMessage'>{message.message}</span>
    </span>
  </div>;
};
