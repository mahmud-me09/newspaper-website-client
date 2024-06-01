import dateFormat from "dateformat";
const now = new Date();

function DateToday() {
	const dateNow = dateFormat(now, "fullDate");
	return <>{dateNow}</>;
}

export default DateToday;
