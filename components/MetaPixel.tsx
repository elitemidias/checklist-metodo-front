"use client";

import Script from "next/script";

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type MetaEvent =
  | "Lead"
  | "Schedule"
  | "Contact"
  | "DiagnosticStarted"
  | "QuestionAnswered"
  | "ReportViewed"
  | "QualificationStarted"
  | "QualificationCompleted"
  | "SchedulingViewed"
  | "FormError"
  | "ReportPrintRequested";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function MetaPixel() {
  if (!pixelId) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

export function trackMetaEvent(
  event: MetaEvent,
  data?: Record<string, string | number>,
) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(
      ["Lead", "Schedule", "Contact"].includes(event) ? "track" : "trackCustom",
      event,
      data ?? {},
    );
  }
}
