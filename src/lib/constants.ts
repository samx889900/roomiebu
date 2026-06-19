// ============================================
// RoomieBU — App Constants
// ============================================

export const APP_NAME = "RoomieBU";
export const APP_DESCRIPTION =
  "Find your perfect roommate at Bennett University. Browse compatible hostel roommates and flatmates with smart matching.";

export const BENNETT_EMAIL_DOMAIN = "@bennett.edu.in";

// ============================================
// Course Options
// ============================================
export const COURSE_OPTIONS = [
  "B.Tech CSE",
  "B.Tech CSE (AI/ML)",
  "B.Tech CSE (Data Science)",
  "B.Tech CSE (Cyber Security)",
  "B.Tech CSE (Cloud Computing)",
  "B.Tech CSE (DevOps)",
  "B.Tech CSE (Full Stack)",
  "B.Tech CSE (Gaming)",
  "B.Tech ECE",
  "B.Tech Biotechnology",
  "B.Tech Mechanical",
  "B.Tech Civil",
  "BBA",
  "BBA (Digital Marketing)",
  "BA LLB",
  "BBA LLB",
  "B.Des",
  "BA (Journalism)",
  "BA (Liberal Arts)",
  "B.Sc",
  "M.Tech",
  "MBA",
  "MA",
  "M.Sc",
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
