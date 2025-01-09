import { Sex, Specie } from "./enums";
import { Appointment } from "./types";
import { Event } from "../common/types";

export const MockAppointments: Appointment[] = [
  {
    id: "1",
    title: "มะลิ",
    start: "2025-01-10T11:00:00",
    end: "2025-01-10T11:40:00",
    allDay: false,
    extendedProps: {
      pet: { id: "1", name: "มะลิ", specie: Specie.CAT, sex: Sex.FEMALE },
      vet: { id: "1", name: "สมหญิง", sex: Sex.FEMALE },
      owner: { id: "1", name: "ซีวิค", phone: "0880001111" },
      appointment: {
        purpose: "วัคซีนรวมแมว",
        notes: "โน้ตสำหรับนัด",
      },
      created_by: { id: "1", name: "วรัต", position: "Nurse vet" },
      created_at: "2025-01-07T00:00:00",
      updated_at: "2025-01-07T00:00:00",
    },
  },
  {
    id: "2",
    title: "จิโบโร่",
    start: "2025-01-11T09:30:00",
    end: "2025-01-11T10:00:00",
    allDay: false,
    extendedProps: {
      pet: { id: "1", name: "จิโบโร่", specie: Specie.DOG, sex: Sex.MALE },
      vet: { id: "1", name: "สมชาย", sex: Sex.FEMALE },
      owner: { id: "1", name: "วิชัย", phone: "0880001122" },
      appointment: {
        purpose: "วัคซีนพิษสุนัขบ้า",
        notes: "โน้ตสำหรับนัด",
      },
      created_by: { id: "2", name: "สา", position: "Nurse vet" },
      created_at: "2025-01-08T00:00:00",
      updated_at: "2025-01-08T00:00:00",
    },
  },
];

export const MockEvents: Event[] = [
  {
    id: "1",
    title: "Event 1",
    start: new Date("2025-01-06T00:00:00.000Z").toISOString(),
    end: new Date("2025-01-06T00:00:00.000Z").toISOString(),
    allDay: true,
    extendedProps: {
      content: "This is content for event 1",
      created_by: "User1",
      created_at: new Date("2025-01-09T12:00:00.000Z").toISOString(),
      updated_at: new Date("2025-01-09T12:00:00.000Z").toISOString(),
      selected_date: undefined,
    },
  },
  {
    id: "2",
    title: "Event 2",
    start: new Date("2025-01-19T00:00:00.000Z").toISOString(),
    end: new Date("2025-01-19T00:00:00.000Z").toISOString(),
    allDay: false,
    extendedProps: {
      content: "This is content for event 2",
      created_by: "User2",
      created_at: new Date("2025-01-09T12:00:00.000Z").toISOString(),
      updated_at: new Date("2025-01-09T12:00:00.000Z").toISOString(),
      selected_date: undefined,
    },
  },
  {
    id: "3",
    title: "Event 3",
    start: new Date("2025-01-23T00:00:00.000Z").toISOString(),
    end: new Date("2025-01-23T00:00:00.000Z").toISOString(),
    allDay: true,
    extendedProps: {
      content: "This is content for event 3",
      created_by: "User3",
      created_at: new Date("2025-01-09T12:00:00.000Z").toISOString(),
      updated_at: new Date("2025-01-09T12:00:00.000Z").toISOString(),
      selected_date: undefined,
    },
  },
  {
    id: "4",
    title: "Event 4",
    start: new Date("2025-01-10T00:00:00.000Z").toISOString(),
    end: new Date("2025-01-10T00:00:00.000Z").toISOString(),
    allDay: false,
    extendedProps: {
      content: "This is content for event 4",
      created_by: "User4",
      created_at: new Date("2025-01-09T12:00:00.000Z").toISOString(),
      updated_at: new Date("2025-01-09T12:00:00.000Z").toISOString(),
      selected_date: undefined,
    },
  },
];
