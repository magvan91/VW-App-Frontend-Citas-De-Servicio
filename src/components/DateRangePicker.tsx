import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { addDays, format } from "date-fns";
import "react-day-picker/dist/style.css";
import "./../styles.css";

type Props = {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
};

const formatDate = (date?: Date) => {
  if (!date) return "";
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const DateRangePicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
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

  //* Solo recalcula el texto formateado si `value` realmente cambia
  const displayValue = useMemo(() => {
    if (!value?.from || !value?.to) return "";
    return `${formatDate(value.from)} - ${formatDate(value.to)}`;
  }, [value]);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
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
          onClick={toggleOpen}
          value={displayValue}
          placeholder="Selecciona un rango de fechas.*"
        />

        {open && (
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
              selected={value}
              formatters={{
                formatCaption: (date, options) =>
                  format(date, "LLLL yyyy", options),
              }}
              onSelect={onChange}
              locale={es}
              startMonth={minDate}
              endMonth={maxDate}
              disabled={{ before: minDate }}
            />
          </div>
        )}
      </div>
    </label>
  );
};
