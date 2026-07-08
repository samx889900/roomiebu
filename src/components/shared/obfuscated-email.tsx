"use client";

import { useState, useEffect } from "react";

export function ObfuscatedEmail() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>Contact Support</span>;
  }

  const user = "roomiebu";
  const domain = "buconfess.in";
  const email = `${user}@${domain}`;

  return (
    <a href={`mailto:${email}`} className="hover:text-foreground transition-colors">
      {email}
    </a>
  );
}
