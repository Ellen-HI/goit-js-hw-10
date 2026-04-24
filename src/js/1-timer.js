import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetime = document.querySelector('#datetime-picker');
const button = document.querySelector('[data-start]');
button.disabled = true;
button.addEventListener('click', handleClick);
function handleClick() {
  if (interval) return;
  button.disabled = true;
  datetime.disabled = true;
  interval = setInterval(() => {
    const currentTime = Date.now();
    const time = userSelectedDate - currentTime;
    if (time <= 0) {
      clearInterval(interval);
      interval = null;
      document.querySelector('[data-days]').textContent = '00';
      document.querySelector('[data-hours]').textContent = '00';
      document.querySelector('[data-minutes]').textContent = '00';
      document.querySelector('[data-seconds]').textContent = '00';
      datetime.disabled = false;
      button.disabled = true;
      iziToast.show({
        message: 'Great!',
        color: 'green',
      });
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(time);
    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent =
      addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent =
      addLeadingZero(seconds);
  }, 1000);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

let userSelectedDate = null;
let interval = null;
const fp = flatpickr(datetime, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = Date.now();
    userSelectedDate = selectedDates[0].getTime();
    if (userSelectedDate <= currentDate) {
      button.disabled = true;
      iziToast.show({
        message: 'Please choose a date in the future',
        theme: 'dark',
        color: 'red',
      });
      return;
    }
    button.disabled = false;
  },
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);

  const hours = Math.floor((ms % day) / hour);

  const minutes = Math.floor(((ms % day) % hour) / minute);

  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
