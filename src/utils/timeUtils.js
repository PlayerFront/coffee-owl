export const getAvailableTimes = (now = new Date()) => {
    // const now = new Date();
    let currentHour = now.getHours();
    let currentMinute = now.getMinutes();

    let startHour = currentHour;
    let startMinute = currentMinute <= 30 ? 30 : 0;

    if (currentMinute > 30) {
        startHour += 1;
    }

    if (startHour < 9) {
        startHour = 9;
        startMinute = 0;
    }

    const times = [];
    let hour = startHour;
    let minute = startMinute;

    while (hour < 22 || (hour === 21 && minute < 30)) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);

        minute += 30;
        if (minute >= 60) {
            hour += 1;
            minute = 0;
        }
    }

    return times;
};

export const formatTimeForDB = (time) => `${time}:00`;