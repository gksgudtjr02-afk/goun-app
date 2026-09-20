"use client";

import { useEffect, useRef } from "react";
import { GOUN_MARKUP } from "./gounMarkup";
import { initGounApp } from "./gounAppLogic";
import { createClient } from "@/lib/supabaseClient";

export default function GounApp() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Created client-side only: avoids running Supabase's env var
    // validation during server-side prerendering.
    const supabase = createClient();
    const cleanup = initGounApp(containerRef.current, supabase);
    return cleanup;
  }, []);

  return (
    <div
      id="app"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: GOUN_MARKUP }}
    />
  );
}
