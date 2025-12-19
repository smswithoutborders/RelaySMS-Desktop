/**
 * Lightweight replacement for date-fns formatDistanceToNow
 * Formats the distance between a given date and now in human-readable format
 * @param {Date|number} date - The date to format (Date object or timestamp)
 * @param {Object} options - Options object
 * @param {boolean} options.addSuffix - Whether to add 'ago' suffix
 * @returns {string} Formatted distance string
 */
export function formatDistanceToNow(date, options = {}) {
  const now = Date.now();
  const then = date instanceof Date ? date.getTime() : date;
  const diffMs = now - then;
  const diffSec = Math.floor(Math.abs(diffMs) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  let result;
  
  if (diffYear > 0) {
    result = diffYear === 1 ? '1 year' : `${diffYear} years`;
  } else if (diffMonth > 0) {
    result = diffMonth === 1 ? '1 month' : `${diffMonth} months`;
  } else if (diffDay > 0) {
    result = diffDay === 1 ? '1 day' : `${diffDay} days`;
  } else if (diffHour > 0) {
    result = diffHour === 1 ? '1 hour' : `${diffHour} hours`;
  } else if (diffMin > 0) {
    result = diffMin === 1 ? '1 minute' : `${diffMin} minutes`;
  } else {
    result = 'less than a minute';
  }

  if (options.addSuffix) {
    return diffMs < 0 ? `in ${result}` : `${result} ago`;
  }
  
  return result;
}
