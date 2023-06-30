function getDateTime(isoDate: string | Date): string {
    try {
        const options: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
            timeZone: "Asia/Kolkata",
        };

        const date = new Date(isoDate).toLocaleString("en-IN", options);

        return date;
    } catch (error) {
        return "00-000-0000";
    }
}

export default getDateTime;
