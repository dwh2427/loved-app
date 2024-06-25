import { v4 as uuidv4 } from "uuid";

function generatePageName(username) {
  const uniqueSuffix = uuidv4();
  return `${username}-${uniqueSuffix}`;
}

export default generatePageName;
