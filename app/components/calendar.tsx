"use client";

import React, { useEffect, useState } from "react";
import { Time } from "@internationalized/date";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionGridPlugin from "@fullcalendar/interaction";
import {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
} from "@fullcalendar/core/index.js";
import {
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  TimeInput,
  useDisclosure,
} from "@nextui-org/react";
import { Event, EventTimeForm } from "../common/types";
import DeleteConfirmation from "./modals/delete-confirmation";
import dayjs from "dayjs";
import { inputClassNames } from "../common/class-names";

const BlankEvent: Event = {
  id: "",
  title: "",
  start: "",
  end: "",
  allDay: false,
  extendedProps: {
    content: "",
    created_by: "henry",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

const Calendar = () => {
  let calendarRef: FullCalendar | null = null;
  let clickTimeout: NodeJS.Timeout | null = null;

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [currentEventForm, setCurrentEventForm] = useState<Event>(BlankEvent);
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(
    null
  );
  const [eventTimeForm, setEventTimeForm] = useState<EventTimeForm>({
    start: { hour: 9, minute: 0 },
    end: { hour: 9, minute: 30 },
  });

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isShowDeleteConfirmation, setIsShowDeleteConfirmation] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) setCurrentEventForm(BlankEvent);
  }, [isOpen]);

  const handleClickDate = (date: DateSelectArg) => {
    // doing double click things
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      setSelectedDate(date);

      // open add event modal
      onOpen();
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
      }, 300);
    }
  };

  const handleClickEvent = (_event: EventClickArg) => {
    setSelectedEvent(_event);
    onOpen();
    const { event } = _event;
    setCurrentEventForm({
      id: event.id,
      title: event.title,
      start: event.start?.toISOString() as string,
      end: event.end?.toISOString() as string,
      allDay: event.allDay,
      extendedProps: {
        content: event.extendedProps.content,
        created_by: event.extendedProps.created_by,
        created_at: event.extendedProps.created_at,
        updated_at: event.extendedProps.updated_at,
      },
    });
  };

  const handleAddEvent = () => {
    if (selectedDate) {
      const { start, end } = selectedDate;

      const isoStringStart = dayjs(start)
        .hour(eventTimeForm.start.hour)
        .minute(eventTimeForm.start.minute)
        .second(0)
        .millisecond(0)
        .toISOString();
      const isoStringEnd = dayjs(end)
        .hour(eventTimeForm.end.hour)
        .minute(eventTimeForm.end.minute)
        .second(0)
        .millisecond(0)
        .date(dayjs(isoStringStart).date()) // add this so the date on full calendar wont add one more day for event
        .toISOString();

      const _event: Event = {
        id: (allEvents.length + 1).toString(),
        title: currentEventForm.title,
        start: isoStringStart,
        end: isoStringEnd,
        allDay: currentEventForm.allDay,
        extendedProps: {
          content: currentEventForm.extendedProps.content,
          created_by: currentEventForm.extendedProps.created_by,
          created_at: currentEventForm.extendedProps.created_at,
          updated_at: currentEventForm.extendedProps.updated_at,
        },
      };

      setAllEvents((prev) => [...prev, _event]);
      onClose();
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setAllEvents(
        allEvents.map((event) => {
          if (event.id === currentEventForm.id) {
            const isoStringStart = dayjs(selectedEvent.event.start)
              .hour(eventTimeForm.start.hour)
              .minute(eventTimeForm.start.minute)
              .second(0)
              .millisecond(0)
              .toISOString();
            const isoStringEnd = dayjs(selectedEvent.event.end)
              .hour(eventTimeForm.end.hour)
              .minute(eventTimeForm.end.minute)
              .second(0)
              .millisecond(0)
              .date(dayjs(isoStringStart).date()) // add this so the date on full calendar wont add one more day for event
              .toISOString();

            console.log("start => ", isoStringStart);
            console.log("end => ", isoStringEnd);

            const newData: Event = {
              ...currentEventForm,
              start: isoStringStart,
              end: isoStringEnd,
            };

            return newData;
          }
          return event;
        })
      );

      onClose();
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      selectedEvent.event.remove();
      onClose();
    }
  };

  const handleDropEvent = (arg: EventDropArg) => {
    setAllEvents(
      allEvents.map((event) => {
        if (event.id === arg.event.id) {
          const { start } = arg.event;

          // compare diff days
          const dateDiff = Math.abs(
            dayjs(start).diff(dayjs(event.start), "day")
          );

          // cal end date
          if (!event.allDay) {
            if (dayjs(start).isBefore(dayjs(event.start))) {
              const newData: Event = {
                ...event,
                start: dayjs(start).toISOString(),
                end: dayjs(event.end).subtract(dateDiff, "day").toISOString(),
              };
              return newData;
            } else if (dayjs(start).isAfter(dayjs(event.start))) {
              const newData: Event = {
                ...event,
                start: dayjs(start).toISOString(),
                end: dayjs(event.end).add(dateDiff, "day").toISOString(),
              };
              return newData;
            } else return event;
          } else {
            const newData: Event = {
              ...event,
              start: dayjs(start).startOf("day").toISOString(),
              end: dayjs(start).endOf("day").toISOString(),
            };
            return newData;
          }
        }

        return event;
      })
    );
  };

  return (
    <div className="w-full flex flex-col items-center p-10">
      <div className="w-full flex justify-start items-start gap-8">
        {/* showed events */}
        <div className="w-3/12">
          <span className="text-2xl">กิจกรรม</span>
          {allEvents.length > 0 ? (
            <div className="mt-6">
              {allEvents
                .sort(
                  (a, b) =>
                    new Date(a.start).getTime() - new Date(b.start).getTime()
                )
                .map((event) => (
                  <div key={event.id} className="w-full flex flex-col mb-6">
                    <p className="font-light text-small text-gray-600">
                      {dayjs(event.start).format("dddd D, MMMM")}
                    </p>
                    <p className="font-light text-xs text-gray-600">
                      {dayjs(event.start).format("hh:mm")} น.
                    </p>
                    <div className="mt-1">
                      <p className="text-lg font-semibold">{event.title}</p>
                      <p>{event.extendedProps.content}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-gray-500 italic">ไม่มีกิจกรรม</div>
          )}
        </div>

        {/* calendar */}
        <div className="w-full">
          <FullCalendar
            height={"80vh"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionGridPlugin]}
            headerToolbar={{
              left: "prev next customToday",
              center: "title",
              right: "customMonth customWeek customDay",
            }}
            titleFormat={{
              year: "numeric",
              month: "long",
            }}
            ref={(el) => {
              calendarRef = el; // ref to instance of FullCalendar
            }}
            customButtons={{
              customToday: {
                text: "วันนี้",
                click: () => {
                  if (calendarRef) {
                    calendarRef.getApi().today();
                  }
                },
              },
              customMonth: {
                text: "เดือน",
                click: () => {
                  if (calendarRef) {
                    calendarRef.getApi().changeView("dayGridMonth");
                  }
                },
              },
              customWeek: {
                text: "สัปดาห์",
                click: () => {
                  if (calendarRef) {
                    calendarRef.getApi().changeView("timeGridWeek");
                  }
                },
              },
              customDay: {
                text: "วัน",
                click: () => {
                  if (calendarRef) {
                    calendarRef.getApi().changeView("timeGridDay");
                  }
                },
              },
            }}
            initialView="dayGridMonth"
            defaultAllDay={currentEventForm.allDay || false}
            editable
            selectable
            selectMirror
            dayMaxEvents
            select={(date: DateSelectArg) => handleClickDate(date)}
            locale="th"
            events={allEvents}
            eventDrop={(arg) => handleDropEvent(arg)}
            eventClick={(event: EventClickArg) => {
              handleClickEvent(event);
            }}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
            }}
          />
        </div>
      </div>

      {/* event modal */}
      <>
        <Modal
          classNames={{ wrapper: "w-[420px] m-auto" }}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent className="w-full">
            {() => (
              <div className="w-full">
                <ModalHeader className="w-full">
                  {/* <p>{currentEventForm.id ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}</p> */}
                  {selectedDate && (
                    <div className="flex gap-x-1">
                      <p>
                        วัน
                        {dayjs(new Date(selectedDate.start)).format(
                          "ddd D MMMM"
                        )}
                      </p>
                      <p>
                        {dayjs(new Date(selectedDate.start))
                          .add(543, "year")
                          .format("YYYY")}
                      </p>
                    </div>
                  )}
                </ModalHeader>
                <ModalBody className="w-full">
                  <form
                    className="w-full flex flex-col gap-y-4"
                    onSubmit={handleAddEvent}
                  >
                    <div className="w-full">
                      <p>ชื่อกิจกรรม</p>
                      <Input
                        value={currentEventForm.title}
                        onChange={(e) =>
                          setCurrentEventForm({
                            ...currentEventForm,
                            title: e.target.value,
                          })
                        }
                        required
                        classNames={{
                          ...inputClassNames,
                        }}
                      />
                    </div>
                    <div className="w-full">
                      <p>รายละเอียด</p>
                      <Textarea
                        value={currentEventForm.extendedProps.content}
                        minRows={2}
                        onChange={(e) => {
                          setCurrentEventForm({
                            ...currentEventForm,
                            extendedProps: {
                              ...currentEventForm.extendedProps,
                              content: e.target.value,
                            },
                          });
                        }}
                        required={false}
                        classNames={{
                          ...inputClassNames,
                        }}
                      />
                    </div>
                    <div>
                      <p className="mb-1 mt-2 text-sm text-gray-500">
                        ระยะเวลากิจกรรม
                      </p>
                      <Checkbox
                        defaultChecked={currentEventForm.allDay}
                        checked={currentEventForm.allDay}
                        onChange={(e) =>
                          setCurrentEventForm({
                            ...currentEventForm,
                            allDay: e.target.checked,
                          })
                        }
                      >
                        กิจกรรมทั้งวัน
                      </Checkbox>
                    </div>
                    {!currentEventForm.allDay && (
                      <>
                        <div className="w-full flex gap-x-2">
                          <div className="w-full">
                            <p className="mb-2">เวลาเริ่มต้น</p>
                            <TimeInput
                              defaultValue={
                                new Time(
                                  eventTimeForm.start.hour,
                                  eventTimeForm.start.minute
                                )
                              }
                              value={
                                new Time(
                                  eventTimeForm.start.hour,
                                  eventTimeForm.start.minute
                                )
                              }
                              label={null}
                              aria-label="เวลาเริ่มต้น"
                              isRequired
                              hourCycle={24}
                              onChange={(e) => {
                                if (e) {
                                  setEventTimeForm({
                                    ...eventTimeForm,
                                    start: { hour: e.hour, minute: e.minute },
                                  });
                                }
                              }}
                              classNames={{
                                ...inputClassNames,
                              }}
                            />
                          </div>
                          <div className="w-full">
                            <p className="mb-2">เวลาสิ้นสุด</p>
                            <TimeInput
                              defaultValue={
                                new Time(
                                  eventTimeForm.end.hour,
                                  eventTimeForm.end.minute
                                )
                              }
                              value={
                                new Time(
                                  eventTimeForm.end.hour,
                                  eventTimeForm.end.minute
                                )
                              }
                              label={null}
                              aria-label="เวลาสิ้นสุด"
                              isRequired
                              hourCycle={24}
                              onChange={(e) => {
                                if (e) {
                                  setEventTimeForm({
                                    ...eventTimeForm,
                                    end: { hour: e.hour, minute: e.minute },
                                  });
                                }
                              }}
                              classNames={{
                                ...inputClassNames,
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </form>
                </ModalBody>
                <ModalFooter className="flex justify-end gap-x-6">
                  <button
                    className="bg-blue-500 text-white p-3 mt-5 rounded-md min-w-[100px]"
                    disabled={
                      currentEventForm.title.length === 0 &&
                      currentEventForm.extendedProps.content.length === 0
                    }
                    onClick={() =>
                      currentEventForm.id ? handleEditEvent() : handleAddEvent()
                    }
                  >
                    {currentEventForm.id ? "บันทึก" : "เพิ่มกิจกรรม"}
                  </button>
                  {currentEventForm.id && (
                    <button
                      className="bg-white text-red-500 p-3 mt-5 rounded-md border border-red-500 min-w-[100px]"
                      onClick={() => setIsShowDeleteConfirmation(true)}
                    >
                      ลบ
                    </button>
                  )}
                </ModalFooter>
              </div>
            )}
          </ModalContent>
        </Modal>

        <DeleteConfirmation
          isOpen={isShowDeleteConfirmation}
          onConfirm={() => {
            handleDeleteEvent();
            setIsShowDeleteConfirmation(false);
          }}
          onCancel={() => setIsShowDeleteConfirmation(false)}
        />
      </>
    </div>
  );
};

export default Calendar;
