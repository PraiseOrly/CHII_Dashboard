// The database each portal reports from — the single definition.
//
// Page headers and footers previously named their own source ad hoc, so the
// same portal cited a dozen different databases ("HENT Masterclasses M&E",
// "HENT Ventures M&E", "HENT Venture Portfolio"…). A reader could not tell
// whether those were genuinely different systems or the same one under
// different names. They are the same one.

import type { Portal } from "@/theme/portals";

export const DATA_SOURCE: Record<Portal, string> = {
  executive: "CHII MELA Consolidated Database",
  hent:      "HENT Consolidated Database",
  hemp:      "HEMP Consolidated Database",
  heco:      "HECO Consolidated Database",
};
