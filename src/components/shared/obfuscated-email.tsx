"use client";

import { useState, useEffect } from "react";

export function ObfuscatedEmail() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Reconstruct the email on the client to hide it from simple scrapers
    const user = "roomiebu";
    const domain = "buconfess.in";
    setEmail(`${user}@${domain}`);
  }, []);

  if (!email) {
    return <span>Contact Support</span>;
  }

  return (
    <a href={`mailto:${email}`} className="hover:text-foreground transition-colors">
      {email}
    </a>
  );
}
