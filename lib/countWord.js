export function countWords(text='') {
  // Remove leading and trailing white spaces
  text = text.trim();
  // Split the text into an array of words using white space as the delimiter
  const words = text.split(/\s+/);
  // Return the number of words
  return words.length;
}

export function getFirstWords(text = "", numWords) {
  // Remove leading and trailing white spaces
  text = text?.trim();
  // Split the text into an array of words using white space as the delimiter
  const words = text?.split(/\s+/);
  // Return the first numWords words
  return words.slice(0, numWords).join(" ");
}
