import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const dateNow = new Date();

export const dateFormated = format(
    dateNow,
    "EEEE d 'de' MMMM",
    { locale: es }
);

export const dateFormatedTwo = (dateString: string): string => {
    const date = parseISO(dateString);
    return format(date, "EEEE d 'de' MMMM", { locale: es });
};

export function formatDateToSpanish(dateString: string): string {
    const date = new Date(dateString)
    return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
}

export function getRelativeDay(dateString: string): string {
    const date = parseISO(dateString);
    const time = format(date, 'HH:mm');

    if (isToday(date)) return "hoy" + " a las " + time;
    if (isYesterday(date)) return "ayer" + "a las " + time;
    if (isTomorrow(date)) return "mañana";

    const diff = formatDistanceToNow(date, {
        locale: es,
        addSuffix: true,
    });

    return diff;
}

const today = new Date();
export const GetDay = today.toISOString()

export function normalizeToLocalMidnight(dateStr: string): Date {
    const date = new Date(dateStr)
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
