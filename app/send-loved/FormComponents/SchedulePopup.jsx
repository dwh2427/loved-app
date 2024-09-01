import React, { useState } from 'react';
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";

// Register the timezone and utc plugins
dayjs.extend(utc);
dayjs.extend(timezone);

registerLocale("es", es);

export default function SchedulePopup({ message, onClose, setScheduledTime, setScheduledDate, setIsSubmitPayment }) {
  const [selectedDates, setSelectedDates] = useState(dayjs().startOf('day'));
  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [error, setError] = useState('');

  const handleScheduleClick = (e) => {
    e.preventDefault();  // Prevent any default button actions
    if (!selectedDates || !selectedTime) {
      setIsSubmitPayment(false);
      setError('Please select both a date and a time.');
      return;
    } else {
      setError('');

      // Format the date
      const formattedDate = dayjs(selectedDates).format('DD MMM YYYY'); // e.g., "29 Aug 2024"

      // Format the time in the user's local timezone
      const formattedTime = dayjs(selectedTime)
        .tz(dayjs.tz.guess()) // Guess the user's local timezone
        .format('HH:mm:ss [GMT]Z'); // e.g., "18:00:00 GMT+0200"

      // Proceed with your scheduling logic
      setScheduledTime(formattedTime);
      setScheduledDate(formattedDate);
      setIsSubmitPayment(true);
      onClose(); 
    }
  };

  // DatePicker should disable past dates
  const isDateDisabled = (date) => {
    return dayjs(date).isBefore(dayjs().startOf('day'));
  };

  // TimePicker should disable past times if the selected date is today
  const isTimeDisabled = (time) => {
    // Allow all times if the selected date is not today
    if (!selectedDates.isSame(dayjs(), 'day')) {
      return false;
    }
    // Disable times before the current hour if the selected date is today
    return dayjs(time).isBefore(dayjs());
  };

  return (
    <div className="schedule-popup-overlay">
      <div className="schedule-popup-content">
        <button onClick={onClose} className="schedule-close-icon">&times;</button>
        <h2 className="schedule-heading">Schedule</h2>
        <div className="schedule-date-time-container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker", "TimePicker"]}>
              <DatePicker
                style={{
                  overflow: "hidden",
                }}
                value={selectedDates}
                onChange={(newValue) => setSelectedDates(dayjs(newValue).startOf('day'))}
                className="schedule-custom-datepickers"
                inputClassName="date-custom-input"
                disablePast
                shouldDisableDate={isDateDisabled}
              />
              <TimePicker
                style={{
                  overflow: "hidden",
                }}
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
                className="schedule-custom-timepickers"
                inputClassName="time-custom-input"
                shouldDisableTime={isTimeDisabled}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        {error && <p className="schedule-error-message">{error}</p>}
        <button onClick={handleScheduleClick} className="schedule-close-popup-button">
          Schedule
        </button>
      </div>
    </div>
  );
}