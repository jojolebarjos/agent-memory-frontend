const SHORT_FORMATTER = new Intl.DateTimeFormat(
  undefined,
  {
    dateStyle: "short",
    timeStyle: "short",
  }
);

const LONG_FORMATTER = new Intl.DateTimeFormat(
  undefined,
  {
    dateStyle: "long",
    timeStyle: "long",
  }
);

export function formatDateShort(date: Date) {
  return SHORT_FORMATTER.format(date)
}

export function formatDateLong(date: Date) {
  return LONG_FORMATTER.format(date)
}
