import { formatDistanceToNow, isToday, isYesterday } from "date-fns";

const formatedDate = ({ dateString }) => {

  const date = new Date(dateString);
  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  const daysAgo = formatDistanceToNow(date, { addSuffix: true });
  return daysAgo;
};

export default formatedDate;
