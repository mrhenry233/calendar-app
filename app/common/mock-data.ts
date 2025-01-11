import { Event } from "../common/types";
import dayjs from "dayjs";

export const MockEvents: Event[] = [
  {
    id: "1",
    title: "Event 1",
    start: dayjs("2025-01-06T17:00:00.000Z").toISOString(),
    end: dayjs("2025-01-06T17:00:00.000Z").toISOString(),
    allDay: true,
    extendedProps: {
      content: "This is content for event 1",
      created_by: "User1",
      created_at: dayjs("2025-01-09T12:00:00.000Z").toISOString(),
      updated_at: dayjs("2025-01-09T12:00:00.000Z").toISOString(),
    },
  },
  {
    id: "2",
    title: "Event 2",
    start: dayjs("2025-01-19T00:00:00.000Z").toISOString(),
    end: dayjs("2025-01-19T00:00:00.000Z").toISOString(),
    allDay: false,
    extendedProps: {
      content: "This is content for event 2",
      created_by: "User2",
      created_at: dayjs("2025-01-09T12:00:00.000Z").toISOString(),
      updated_at: dayjs("2025-01-09T12:00:00.000Z").toISOString(),
    },
  },
  {
    id: "3",
    title: "Event 3",
    start: dayjs("2025-01-23T00:00:00.000Z").toISOString(),
    end: dayjs("2025-01-23T00:00:00.000Z").toISOString(),
    allDay: true,
    extendedProps: {
      content: "This is content for event 3",
      created_by: "User3",
      created_at: dayjs("2025-01-09T12:00:00.000Z").toISOString(),
      updated_at: dayjs("2025-01-09T12:00:00.000Z").toISOString(),
    },
  },
  {
    id: "4",
    title: "Event 4",
    start: dayjs("2025-01-10T00:00:00.000Z").toISOString(),
    end: dayjs("2025-01-10T00:00:00.000Z").toISOString(),
    allDay: false,
    extendedProps: {
      content: "This is content for event 4",
      created_by: "User4",
      created_at: dayjs("2025-01-09T12:00:00.000Z").toISOString(),
      updated_at: dayjs("2025-01-09T12:00:00.000Z").toISOString(),
    },
  },
];
