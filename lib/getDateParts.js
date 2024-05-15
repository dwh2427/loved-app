 export default function getDateParts(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based, so we add 1 to get the correct month
    const year = date.getFullYear();
  
    return { day, month, year };
  }