"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionGridPlugin from "@fullcalendar/interaction";
import {
  CalendarApi,
  DateSelectArg,
  EventApi,
  EventClickArg,
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
    selected_date: undefined,
  },
};

const Calendar = () => {
  let calendarRef: FullCalendar | null = null;
  let clickTimeout: NodeJS.Timeout | null = null;

  const [allEvents, setAllEvents] = useState<EventApi[]>([]);
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
        selected_date: event.extendedProps.selected_date,
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
          selected_date: selectedDate,
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

    // if (currentEvent.extendedProps.selected_date) {
    //   const calendarApi: CalendarApi =
    //     currentEvent.extendedProps.selected_date.view.calendar;
    //   calendarApi.unselect();

    //   calendarApi
    //     .getEventById(currentEvent.id)
    //     ?.setProp("title", currentEvent.title);

    //   calendarApi
    //     .getEventById(currentEvent.id)
    //     ?.setExtendedProp("content", currentEvent.extendedProps.content);
    //   onClose();
    // }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      selectedEvent.event.remove();
      onClose();
    }
  };

  // this will save all events, full calendar's things
  const handleSetEvents = (events: EventApi[]) => {
    setAllEvents(events);
  };

  return (
    <div className="w-full flex flex-col items-center p-10">
      <div className="w-full flex justify-start items-start gap-8">
        {/* showed events */}
        <div className="w-3/12">
          <span className="text-2xl">กิจกรรม</span>
          {allEvents.length > 0 ? (
            <div className="">
              <ul>
                {allEvents
                  .sort(
                    (a, b) =>
                      new Date(a.start as Date).getTime() -
                      new Date(b.start as Date).getTime()
                  )
                  .map((event: EventApi) => (
                    <li key={event.id}>
                      <span>
                        {event.start?.toLocaleDateString()} {event.title}
                      </span>
                    </li>
                  ))}
              </ul>
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
            events={MockEvents}
            eventsSet={(events) => handleSetEvents(events)}
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
