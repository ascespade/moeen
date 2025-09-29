"use client";

import { useEffect } from "react";

// Import Preline scripts to enable interactive components.
import "preline/preline";

export default function PrelineInit() {
  useEffect(() => {
    // No-op: script import bootstraps Preline on the client.
  }, []);

  return null;
}

