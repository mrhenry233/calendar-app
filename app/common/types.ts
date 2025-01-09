import { DateSelectArg } from "@fullcalendar/core/index.js";
import { Sex } from "./enums";

export type ExtendedPropsAppointment = {
  pet: { id: string; name: string; specie: string; sex: Sex };
  owner: { id: string; name: string; phone: string };
  vet: { id: string; name: string; sex: Sex };
  created_by: { id: string; name: string; position: string };
  appointment: {
    purpose: string;
    notes: string;
  };
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  extendedProps: ExtendedPropsAppointment;
};

export type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  extendedProps: {
    content: string;
    created_by: string;
    created_at: string;
    updated_at: string;

    selected_date: DateSelectArg | undefined;
  };
};
