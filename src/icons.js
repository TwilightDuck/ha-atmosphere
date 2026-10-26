const paths = {
  temperature:
    '<path d="M9 14.5V5a3 3 0 0 1 6 0v9.5a5 5 0 1 1-6 0Z"/><path d="M12 7v10"/>',
  rain: '<path d="M12 3S5.5 10.5 5.5 15a6.5 6.5 0 0 0 13 0C18.5 10.5 12 3 12 3Z"/><path d="M9 16a3 3 0 0 0 3 3"/>',
  wind: '<path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M5 17h5a2.5 2.5 0 1 1-2.5 2.5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  location:
    '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
  back: '<path d="m10 6-6 6 6 6M4 12h16"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  arrow: '<path d="M6 18 18 6M6 6h12v12"/>',
  hourly: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  daily:
    '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18M7 14h2m6 0h2m-10 4h2"/>',
  sun: '<circle cx="12" cy="11" r="4"/><path d="M12 2v2M4.2 3.2l1.4 1.4M1 11h2m18 0h2M18.4 4.6l1.4-1.4M3 19h18M12 21v1"/>',
  air: '<path d="M3 7h13a2.5 2.5 0 1 0-2.5-2.5M3 12h17M3 17h10a2.5 2.5 0 1 1-2.5 2.5"/>',
  uv: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M20.5 14A9 9 0 0 1 10 3a9 9 0 1 0 10.5 11Z"/>',
  humidity:
    '<path d="M12 3S5.5 10.5 5.5 15a6.5 6.5 0 0 0 13 0C18.5 10.5 12 3 12 3Z"/><path d="m9 17 6-6"/><circle cx="9" cy="11" r=".5"/><circle cx="15" cy="17" r=".5"/>',
  visibility:
    '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  pressure:
    '<path d="M4 19a10 10 0 1 1 16 0M12 12l5-5"/><circle cx="12" cy="12" r="2"/><path d="M12 3v2M4 11h2m12 0h2"/>',
  radar:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 6-7"/><circle cx="9" cy="15" r=".7"/>',
  warnings:
    '<path d="m10.3 3.5-8 14a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 8v5m0 4h.01"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
};
export function glyph(name, size = 20) {
  const key =
    { feels: "temperature", sunrise: "sun", sunset: "sun" }[name] || name;
  return `<svg class="ui-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[key] || paths.info}</svg>`;
}
