"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionGridPlugin from "@fullcalendar/interaction";
import {
  CalendarApi,
  DateSelectArg,
  EventClickArg,
  EventDropArg,
} from "@fullcalendar/core/index.js";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { MockEvents } from "../common/mock-data";
import { Event } from "../common/types";
import DeleteConfirmation from "./modals/delete-confirmation";
import dayjs from "dayjs";

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

  const [allEvents, setAllEvents] = useState<Event[]>(MockEvents);
  const [currentEventForm, setCurrentEventForm] = useState<Event>(BlankEvent);
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(
    null
  );

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
      const calendarApi: CalendarApi = selectedDate.view.calendar;
      calendarApi.unselect();
      // create new event
      const _event: Event = {
        id: (allEvents.length + 1).toString(),
        title: currentEventForm.title,
        start: selectedDate.start.toISOString(),
        end: selectedDate.start.toISOString(),
        allDay: currentEventForm.allDay,
        extendedProps: {
          content: currentEventForm.extendedProps.content,
          created_by: currentEventForm.extendedProps.created_by,
          created_at: currentEventForm.extendedProps.created_at,
          updated_at: currentEventForm.extendedProps.updated_at,
        },
      };
      calendarApi.addEvent(_event);
      onClose();
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      const calendarApi: CalendarApi = selectedEvent.view.calendar;
      const eventId = calendarApi.getEventById(currentEventForm.id);
      if (eventId) {
        eventId.setProp("title", currentEventForm.title);
        eventId.setExtendedProp(
          "content",
          currentEventForm.extendedProps.content
        );
      }

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
          const newData = {
            ...event,
            start: dayjs(start).toISOString(),
            end: event.allDay
              ? dayjs(start).add(1, "day").toISOString()
              : dayjs(event.end).add(1, "day").toISOString(),
          };
          return newData;
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
                      {dayjs(event.start).format("dddd D, MMM")}
                    </p>
                    <div className="">
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
                    calendarRef.getApi().today(); // กระโดดไปยังวันปัจจุบัน
                  }
                },
              },
              customMonth: {
                text: "เดือน",
                click: () => {
                  if (calendarRef) {
                    calendarRef.getApi().changeView("dayGridMonth"); // เปลี่ยนเป็นมุมมองเดือน
                  }
                },
              },
              customWeek: {
                text: "สัปดาห์",
                click: () => {
                  if (calendarRef) {
                    calendarRef.getApi().changeView("timeGridWeek"); // เปลี่ยนเป็นมุมมองเดือน
                  }
                },
              },
              customDay: {
                text: "วัน",
                click: () => {
                  if (calendarRef) {
                    calendarRef.getApi().changeView("timeGridDay"); // เปลี่ยนเป็นมุมมองเดือน
                  }
                },
              },
            }}
            initialView="dayGridMonth"
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
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {() => (
              <div>
                <ModalHeader>
                  {currentEventForm.id ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}
                </ModalHeader>
                <ModalBody>
                  <form
                    className="flex flex-col gap-y-4"
                    onSubmit={handleAddEvent}
                  >
                    <div>
                      <p>ชื่อ Event</p>
                      <input
                        type="text"
                        value={currentEventForm.title}
                        onChange={(e) =>
                          setCurrentEventForm({
                            ...currentEventForm,
                            title: e.target.value,
                          })
                        }
                        required
                        className="border border-gray-200 p-3 rounded-md text-base w-full mt-2"
                      />
                    </div>
                    <div>
                      <p>เนื้อหา Event</p>
                      <input
                        type="text"
                        value={currentEventForm.extendedProps.content}
                        onChange={(e) => {
                          setCurrentEventForm({
                            ...currentEventForm,
                            extendedProps: {
                              ...currentEventForm.extendedProps,
                              content: e.target.value,
                            },
                          });
                        }}
                        required
                        className="border border-gray-200 p-3 rounded-md text-base w-full mt-2"
                      />
                    </div>
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
