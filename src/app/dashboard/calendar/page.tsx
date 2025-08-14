"use client";
import { useState, useMemo } from "react";
import {
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlogCalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });

  const { data } = useQuery({
    queryKey: ["calendar", start.toISOString(), end.toISOString()],
    queryFn: async () => {
      const qs = new URLSearchParams({
        from: start.toISOString(),
        to: end.toISOString(),
      });
      const res = await fetch(
        `/api/v1/admin/posts/scheduled?${qs.toString()}`,
        { credentials: "include" }
      );
      return res.json();
    },
  });

  const events = data?.data || [];

  const days = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">
          {format(cursor, "MMMM yyyy")} — Content Calendar
        </h2>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCursor(addDays(cursor, -30))}
          >
            Prev
          </Button>
          <Button variant="outline" onClick={() => setCursor(new Date())}>
            Today
          </Button>
          <Button
            variant="outline"
            onClick={() => setCursor(addDays(cursor, 30))}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="bg-muted/50 p-2 text-xs font-medium">
            {d}
          </div>
        ))}
        {days.map((d) => {
          const dayEvents = events.filter((e: {scheduledFor: string}) =>
            isSameDay(new Date(e.scheduledFor), d)
          );
          return (
            <div
              key={d.toISOString()}
              className="min-h-24 p-2 bg-background border"
            >
              <div className="text-xs text-muted-foreground">
                {format(d, "d")}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.map((e: {slug: string, title: string}) => (
                  <Link
                    key={e.slug}
                    href={`/dashboard/blog/${e.slug}`}
                    className="block text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900"
                    title={e.title}
                  >
                    {e.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
