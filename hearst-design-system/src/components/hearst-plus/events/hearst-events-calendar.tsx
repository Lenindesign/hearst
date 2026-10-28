"use client";

import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import classicThemePlugin from "@fullcalendar/react/themes/classic";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import listPlugin from "@fullcalendar/react/list";
import "temporal-polyfill/global";
import type { HearstEventRecord } from "@/lib/hearst-events";

function toExclusiveEndDate(date: string) {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

export function HearstEventsCalendar({ events }: { events: HearstEventRecord[] }) {
  const router = useRouter();
  const calendarEvents = events.map((event) => ({
    id: event.slug,
    title: event.title,
    start: event.startDate,
    ...(event.endDate ? { end: toExclusiveEndDate(event.endDate) } : {}),
    allDay: true,
    url: `/hearst-plus/events/${event.slug}/`,
    classNames: [event.relationship === "organized" ? "hearst-event--organized" : "hearst-event--covered"],
    extendedProps: {
      relationshipLabel: event.relationship === "organized" ? "Hearst event" : "Editorial coverage",
      brandNames: event.brandNames,
    },
  }));

  return (
    <section className="hearst-events-calendar space-y-4" aria-label="Events calendar">
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground" aria-label="Calendar key">
        <span className="inline-flex items-center gap-2"><span className="size-2.5 bg-primary" aria-hidden="true" />Organized by Hearst brands</span>
        <span className="inline-flex items-center gap-2"><span className="size-2.5 border border-foreground bg-transparent" aria-hidden="true" />Covered by our editors</span>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, listPlugin, classicThemePlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,listMonth" }}
        todayText="Today"
        monthText="Month"
        listText="Agenda"
        events={calendarEvents}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          if (info.event.url) router.push(info.event.url);
        }}
        eventContent={(info) => (
          <span className="hearst-events-calendar__event">
            <span className="hearst-events-calendar__event-type">{info.event.extendedProps.relationshipLabel}</span>
            <span className="hearst-events-calendar__event-title">{info.event.title}</span>
            <span className="hearst-events-calendar__event-brands">{(info.event.extendedProps.brandNames as string[]).join(" · ")}</span>
          </span>
        )}
        eventDisplay="block"
        height="auto"
        dayMaxEvents={2}
        moreLinkText={(count) => `+${count} more`}
        noEventsContent="No events in this period."
        firstDay={0}
        fixedWeekCount={false}
        expandRows
        navLinks
        eventInteractive
        longPressDelay={350}
        eventLongPressDelay={350}
      />
    </section>
  );
}
