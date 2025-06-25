import useUtilities from "@/composables/useUtilities";
import { addMinutes, isPast } from "date-fns";
import { computed, ref } from "vue";

export default function useAvailabilitySchedule(props: {
  settings: any;
  schedules: any[];
  appointments: any[];
}) {
  const {
    parseDate,
    parseIsoDatetimeWithoutTz,
    parseTime12,
    parseTime24,
    createIntervalsFromHours,
    today
  } = useUtilities();

  const slotDuration = computed(() => {
    const slot = 30;
    if (!props.settings) return slot;
    if (!props.settings.slotDuration) return slot;

    const hoursAsMinutes = parseInt(props.settings.slotDuration.split(":")[0]) * 60;
    const minutes = parseInt(props.settings.slotDuration.split(":")[1]);

    return (hoursAsMinutes + minutes);
  });

  const intervalHours = ref<string[]>([]);

  const isReserved = (startSchedule: string, endSchedule: string) => {
    if (!props.appointments) { return false }

    for (let j = 0; j < props.appointments.length; j++) {
      if (
        props.appointments[j].end > startSchedule &&
        props.appointments[j].start < endSchedule
      ) {
        return true;
      }
    }

    return false;
  };

  const getHoursSlots = (intervalHours: any[]) => {
    const tempInvervalHours = intervalHours.filter(
      (_, index: number) => index != intervalHours.length - 1
    );

    return tempInvervalHours.map((item: string) => {
      const start = parseIsoDatetimeWithoutTz(today() + " " + item);
      const endDate = addMinutes(new Date(start), slotDuration.value);
      const end = parseIsoDatetimeWithoutTz(endDate.toISOString());
      const startText = parseTime12(today() + " " + item);

      return {
        text: startText,
        value: start,
        disabled: isReserved(start, end) || isPast(new Date(start)),
      };
    }).filter(h => !h.disabled);
  };

  const availableHoursAppointmentsAndRequestsCount = computed(() => {
    const availableHours: any[] = [];
    const schedulesOfDay = props.schedules.filter(
      (sch: any) => parseDate(sch.date) == today() && !sch.title.toLowerCase().includes('teleconsulta')
    );

    schedulesOfDay.forEach((schedule: any) => {
      intervalHours.value = createIntervalsFromHours(
        today(),
        parseTime24(schedule.start),
        parseTime24(schedule.end),
        slotDuration.value
      );

      availableHours.push(...getHoursSlots(intervalHours.value));
    });

    return availableHours;
  });

  const hasTeleconsulta = computed(() => {
    const schedulesOfDay = props.schedules.filter(
      (sch: any) => parseDate(sch.date) == today()
    );
    
    return schedulesOfDay.some((schedule: any) => 
      schedule.title && schedule.title.toLowerCase().includes('teleconsulta')
    );
  });

  return {
    availableHoursCount: availableHoursAppointmentsAndRequestsCount,
    hasTeleconsulta
  };
}
