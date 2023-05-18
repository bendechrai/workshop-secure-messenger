import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const Message = ({ message }) => {
  return <div key={message.id} className="message">
    <span className='date'>{dayjs.utc(message.created_at).local().format('HH:mm')}</span>
    <span className='sender'>{message.sender} wrote:{" "}</span>
    <span className='messageText'>{message.message}</span>
  </div>;
};
