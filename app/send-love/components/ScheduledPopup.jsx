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
import Modal from 'react-modal';
import Image from "next/image";
// Register the timezone and utc plugins
dayjs.extend(utc);
dayjs.extend(timezone);

registerLocale("es", es);

export default function SchedulePopup({showPopup, onClose, setScheduledTime, setScheduledDate,setIsSubmitPayment, cardImage }) {
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
        .format('HH:00:00 [GMT]Z'); // e.g., "18:00:00 GMT+0200"

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

        <div className="schedule-date-time-container">
        <div className="hidden md:flex relative  items-center justify-center h-96 bg-pink-100 rounded-lg">
            <div className="Loveabsolute w-52 h-72 bg-white shadow-lg rounded-lg z-10"></div>
  
                <Image
                src={cardImage}
                alt="Default"
                width={280}
                height={298}
                className="absolute z-20"
                />
            </div>
            <div className="text-center my-6">
              <h2 className="dateTime">
                Pick a Date and Time
              </h2>
            </div>
        </div>
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
                views={['hours']}
                format="HH"
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


        {error && <p className="schedule-error-message">{error}</p>}
        <button onClick={handleScheduleClick} className="schedule-close-popup-button w-full fixed-scheudul">
          Schedule
        </button>

        <button onClick={onClose} className="text-pink-500 font-medium hover:underline">
          Cancel
        </button>

      </div>
    </div>

  );
}
