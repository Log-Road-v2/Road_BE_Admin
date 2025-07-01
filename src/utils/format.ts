export const formatDate = (date: Date) => {
  const dateStr = String(date);
  if (dateStr.includes('T')) {
    return dateStr.split('T')[0];
  } else {
    return dateStr;
  }
};
