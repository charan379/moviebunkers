function addHoursToDate(date: Date, hours: number) {
    // 👇 Make copy with "Date" constructor.
    const dateCopy = new Date(date);

    dateCopy.setHours(dateCopy.getHours() + hours);

    return dateCopy;
}

export default addHoursToDate;