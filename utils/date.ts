import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// depending on the acs I would make the format dynamic with the timezone but for now standardising is fine
export function todayInTz(zone: string): string {
  return dayjs().tz(zone).format("M/DD/YYYY");
}
