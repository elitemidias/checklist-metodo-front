"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CAL_LINK } from "@/lib/funnel";

export default function BookingCalendar({
  name,
  email,
  onBooked,
}: {
  name: string;
  email: string;
  onBooked: (date: string, uid: string) => void;
}) {
  useEffect(() => {
    let active = true;
    void getCalApi()
      .then((cal) => {
        if (!active) return;
        cal("ui", {
          theme: "dark",
          hideEventTypeDetails: false,
          layout: "month_view",
        });
        cal("on", {
          action: "bookingSuccessfulV2",
          callback: (event) => {
            const data = event.detail.data as {
              startTime?: string;
              uid?: string;
              booking?: { uid?: string; startTime?: string };
            };
            const start = data.startTime ?? data.booking?.startTime;
            if (active && start)
              onBooked(start, data.uid ?? data.booking?.uid ?? "");
          },
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [onBooked]);
  return (
    <div className="calendar-embed">
      <Cal
        calLink={CAL_LINK}
        config={{ theme: "dark", name, email, layout: "month_view" }}
        style={{ width: "100%", height: "100%", minHeight: "680px" }}
      />
    </div>
  );
}
