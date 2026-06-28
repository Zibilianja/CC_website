const US_STATE_NAMES: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  DC: 'District of Columbia',
  PR: 'Puerto Rico',
  VI: 'U.S. Virgin Islands',
  GU: 'Guam',
};

export function inferStateAbbr(
  areaDesc: string,
  senderName?: string
): string | null {
  const fromArea = areaDesc.match(/,\s*([A-Z]{2})\b/);
  if (fromArea?.[1]) return fromArea[1];

  if (senderName) {
    const fromSender = senderName.match(/NWS(?:\s+[\w\s./'-]+)?\s+([A-Z]{2})\s*$/);
    if (fromSender?.[1]) return fromSender[1];
  }

  return null;
}

export function parseAreaList(areaDesc: string): string[] {
  return areaDesc
    .replace(/\s*\([^)]+\)\s*$/, '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function sameFipsToCountyZone(
  same: string,
  stateAbbr: string
): string | null {
  if (!/^\d{6}$/.test(same) || !stateAbbr) return null;
  return `${stateAbbr}C${same.slice(3)}`;
}

export function formatAlertRegion(stateAbbr: string | null): string {
  if (!stateAbbr) return 'United States';
  const stateName = US_STATE_NAMES[stateAbbr] ?? stateAbbr;
  return `${stateName}, United States`;
}

export function formatAreaDescription(
  areaDesc: string,
  stateAbbr: string | null
): string {
  if (!areaDesc) return '—';

  const parts = parseAreaList(areaDesc);
  const stateName = stateAbbr ? US_STATE_NAMES[stateAbbr] ?? stateAbbr : null;

  if (parts.length > 1) {
    const joined = parts.join('; ');
    return stateName && !areaDesc.includes(',') ? `${joined} (${stateName})` : joined;
  }

  if (areaDesc.includes(',') || !stateName) return areaDesc;
  return `${areaDesc} (${stateName})`;
}

export function primaryAreaLabel(areaDesc: string): string {
  const first = areaDesc.split(';')[0]?.trim();
  return first || areaDesc;
}
