
export function dateTimestamp() {
    return currentDate(true) + " " + timestamp();
}

/**
 * 
 * @returns {string} Time in HH:MM:SS format
 */
export function timestamp() {
    let date = new Date();
    let hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return `${hour}:${minutes}:${seconds}`;
}

//return date in weekDay? MM DD, YYYY
export function currentDate(includeWeekday) {
    let date = new Date();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = includeWeekday ? days[date.getDay()] : "";
    return day + " " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}