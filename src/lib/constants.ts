// ============================================
// RoomieBU — App Constants
// ============================================

export const APP_NAME = "RoomieBU";
export const APP_DESCRIPTION =
  "Find your perfect roommate at Bennett University. Browse compatible hostel roommates and flatmates with smart matching.";

export const BENNETT_EMAIL_DOMAIN = "@bennett.edu.in";

// ============================================
// Course Options (Bennett University)
// ============================================
export const COURSE_OPTIONS = [
  // B.Tech CSE & Tracks
  "B.Tech AI",
  "B.Tech CSE",
  "B.Tech CSE (AI)",
  "B.Tech CSE (Cloud Computing)",
  "B.Tech CSE (Data Science)",
  "B.Tech CSE (Cyber Security)",
  "B.Tech CSE (Blockchain)",
  "B.Tech CSE (RPA)",
  "B.Tech CSE (Gaming)",
  "B.Tech CSE (AR/VR)",
  "B.Tech CSE (Drones)",
  "B.Tech CSE (IoT and Robotics)",
  "B.Tech CSE (Quantum Computing)",
  "B.Tech CSE (Product Design)",
  "B.Tech CSE (DevOps)",
  "B.Tech CSE (Full Stack)",
  "B.Tech CSE (Mobile Tech)",
  "B.Tech CSE (UI/UX)",
  // Other UG Engineering
  "B.Tech ECE",
  "B.Tech EEC",
  "B.Tech ME",
  "B.Tech Biotech",
  "B.Tech EP",
  // BCA
  "BCA",
  "BCA (AI)",
  "BCA (Data Science)",
  "BCA (Cyber Security)",
  "BCA (Gaming)",
  // B.Sc
  "B.Sc. (AI)",
  // BBA
  "BBA",
  "BBA (Gen AI)",
  "BBA (Data Analytics)",
  // B.Com
  "B.Com (Hons.) F&A",
  "B.Com (Hons.) IAF (ACCA)",
  // B.Des
  "B.Des (Hons.) Communication Design",
  "B.Des (Hons.) Fashion Design",
  "B.Des (Hons.) Intelligent Textile Design",
  "B.Des (Hons.) Product Design with AI",
  "B.Des (Hons.) Game Design",
  "B.Des (Hons.) Advanced Animation & VFX",
  // BA
  "B.A. Mass Communication",
  "B.A. Film, TV & Web Series",
  "B.A. (Hons.) Liberal Arts",
  // Law
  "B.A. LL.B. (Hons.)",
  "BBA LL.B. (Hons.)",
  // PG & Diploma
  "MBA",
  "MBA (Data Science & Business Analytics)",
  "MBA (Strategy, Management & Consulting)",
  "M.Tech (AI)",
  "M.Tech (CSE)",
  "M.Tech (Biotech)",
  "M.Tech (MSE)",
  "M.Tech ECE (VLSI Design and Technology)",
  "MCA",
  "MCA (AI)",
  "M.Sc. (AI)",
  "M.Sc. Economics",
  "M.A. Mass Communication",
  "M.A. Public Policy",
  "M.Des Communication Design",
  "LL.M.",
  "PG Diploma (TV & Digital Journalism)",
  "PG Diploma (AI in Healthcare)",
  // Dual & Global Degrees
  "B.Tech + M.Tech Dual Degree",
  "B.Tech + MBA Dual Degree",
  "BBA + MBA Dual Degree",
  "BCA + MCA Dual Degree",
  "B.Tech GPP (International Track)",
  "BBA GPP (International Track)",
  "B.A. Liberal Arts GPP",
  "B.A. Film GPP",
  // Research
  "Ph.D",
  "Other",
] as const;

// ============================================
// Year Options
// ============================================
export const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
  "Postgraduate",
  "Research Scholar",
] as const;

// ============================================
// Language Options
// ============================================
export const LANGUAGE_OPTIONS = [
  "Hindi",
  "English",
  "Punjabi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Odia",
  "Assamese",
  "Urdu",
  "Sanskrit",
  "Nepali",
  "Haryanvi",
  "Other",
] as const;

// ============================================
// Compatibility Weights
// ============================================
export const COMPATIBILITY_WEIGHTS = {
  smoking: 0.3,
  drinking: 0.2,
  sleepSchedule: 0.2,
  accommodationType: 0.15,
  genderPreference: 0.15,
} as const;

// ============================================
// Listing Defaults
// ============================================
export const LISTING_EXPIRY_DAYS = 30;
export const MAX_LISTINGS_PER_USER = 5;
export const MAX_BIO_LENGTH = 300;

// ============================================
// Pagination
// ============================================
export const DEFAULT_PAGE_SIZE = 12;

// ============================================
// Navigation Items
// ============================================
export const NAV_ITEMS = [
  { label: "Feed", href: "/listings", icon: "LayoutGrid" },
  { label: "My Listings", href: "/my-listings", icon: "List" },
  { label: "Interests", href: "/interests", icon: "Heart" },
  { label: "Matches", href: "/matches", icon: "Users" },
  { label: "Saved", href: "/saved", icon: "Bookmark" },
  { label: "Profile", href: "/profile", icon: "UserCircle" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: "BarChart3" },
  { label: "Reports", href: "/admin/reports", icon: "Flag" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Listings", href: "/admin/listings", icon: "List" },
  { label: "Analytics", href: "/admin/analytics", icon: "TrendingUp" },
] as const;
