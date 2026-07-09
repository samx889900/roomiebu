import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/next";
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://roomie.buconfess.in"),
  title: {
    default: "RoomieBU - Find Compatible Roommates at Bennett University",
    template: "%s | RoomieBU",
  },
  description:
    "Find verified roommates and flatmates at Bennett University. Match with compatible students, discover hostel and flat listings, and find your ideal living partner through a secure student-only platform.",
  keywords: [
    "Bennett University roommate",
    "Bennett University flatmate",
    "Bennett roommate finder",
    "Bennett hostel roommate",
    "Bennett accommodation",
    "Bennett University housing",
    "student roommate platform",
    "university roommate matching",
    "roommate finder India",
    "hostel roommate matching",
  ],
  authors: [{ name: "RoomieBU" }],
  creator: "RoomieBU",
  publisher: "RoomieBU",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://roomie.buconfess.in",
    siteName: "RoomieBU",
    title: "RoomieBU - Find Compatible Roommates at Bennett University",
    description:
      "Find verified roommates and flatmates at Bennett University. Match with compatible students, discover hostel and flat listings, and find your ideal living partner through a secure student-only platform.",
    images: [
      {
        url: "https://roomie.buconfess.in/previewimage.png",
        width: 1200,
        height: 630,
        alt: "RoomieBU Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoomieBU - Find Compatible Roommates at Bennett University",
    description:
      "Find verified roommates and flatmates at Bennett University. Match with compatible students, discover hostel and flat listings, and find your ideal living partner through a secure student-only platform.",
    images: ["https://roomie.buconfess.in/previewimage.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://roomie.buconfess.in",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "RoomieBU",
  description:
    "Verified roommate and flatmate matching platform for Bennett University students.",
  url: "https://roomie.buconfess.in",
  publisher: {
    "@type": "Organization",
    name: "RoomieBU",
    logo: {
      "@type": "ImageObject",
      url: "https://roomie.buconfess.in/previewimage.png",
    },
    email: "roomiebu@buconfess.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
