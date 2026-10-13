import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { addDays, format, isSameDay } from "date-fns";
import "react-day-picker/dist/style.css";
import "./../styles.css";
type Props = {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  disabled?: boolean;
};

const isCompleteRange = (
  range?: DateRange,
): range is { from: Date; to: Date } =>
  !!range?.from && !!range?.to && !isSameDay(range.from, range.to);

const formatDate = (date?: Date) => {
  if (!date) return "";
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const DateRangePicker = ({
  value,
  onChange,
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  // Borrador interno: puede tener solo "from". Al padre solo le llegan rangos completos.
  const [draft, setDraft] = useState<DateRange | undefined>(value);
  const ref = useRef<HTMLDivElement>(null);

  const minDate = useMemo(() => addDays(new Date(), 3), []);
  const maxDate = useMemo(() => addDays(new Date(), 60), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isIncomplete = !!draft?.from && !isCompleteRange(draft);

  const displayValue = useMemo(() => {
    if (!draft?.from) return "";
    if (!isCompleteRange(draft)) return `${formatDate(draft.from)} - …`;
    return `${formatDate(draft.from)} - ${formatDate(draft.to)}`;
  }, [draft]);

  const handleSelect = (range: DateRange | undefined) => {
    setDraft(range);
    if (isCompleteRange(range)) {
      setOpen(false);
      onChange({ from: range.from, to: range.to }); // 2 días distintos → petición
    } else if (value) {
      onChange(undefined); // 1 solo día → limpia, sin petición
    }
  };

  const toggleOpen = useCallback(() => {
    if (disabled) return;
    setOpen((prev) => !prev);
  }, [disabled]);

  return (
    <>
      <label className="label-div-input-fake-calendar">
        <div
          ref={ref}
          className="div-input-fake-calendar"
          style={{ position: "relative" }}
        >
          <input
            className="input-fake-calendar"
            type="text"
            readOnly
            disabled={disabled}
            onClick={toggleOpen}
            value={displayValue}
            placeholder="Selecciona un rango de fechas.*"
            style={
              disabled ? { cursor: "not-allowed", opacity: 0.6 } : undefined
            }
          />

          {open && !disabled && (
            <div
              style={{
                position: "absolute",
                zIndex: 10,
                background: "white",
                padding: "10px",
              }}
            >
              <DayPicker
                mode="range"
                min={1}
                selected={draft}
                formatters={{
                  formatCaption: (date, options) =>
                    format(date, "LLLL yyyy", options),
                }}
                onSelect={handleSelect}
                locale={es}
                startMonth={minDate}
                endMonth={maxDate}
                disabled={{ before: minDate }}
              />
            </div>
          )}
        </div>
      </label>

      {isIncomplete && (
        <small
          role="alert"
          style={{ color: "#d93025", display: "block", marginTop: 4 }}
        >
          Selecciona también la fecha final: se requiere un rango de fechas.
        </small>
      )}
    </>
  );
};
