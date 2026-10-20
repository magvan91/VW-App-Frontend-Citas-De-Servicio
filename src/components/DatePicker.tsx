import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { addDays, format } from "date-fns";
import "react-day-picker/dist/style.css";
import "./../styles.css";

type Props = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  isMissing?: boolean; // el usuario intentó avanzar sin elegir fecha
};

const formatDate = (date?: Date) => {
  if (!date) return "";
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const DatePicker = ({ value, onChange, isMissing = false }: Props) => {
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

  const displayValue = useMemo(() => formatDate(value), [value]);

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

  const hasValue = !!value;

  const statusClass = isMissing
    ? " label-div-input-fake-calendar--error"
    : hasValue
      ? " label-div-input-fake-calendar--success"
      : "";

  return (
    <>
      <label className={`label-div-input-fake-calendar${statusClass}`}>
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
            placeholder="Selecciona una fecha.*"
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
                mode="single"
                selected={value}
                formatters={{
                  formatCaption: (date, options) =>
                    format(date, "LLLL yyyy", options),
                }}
                onSelect={(date) => {
                  onChange(date);
                  setOpen(false); // con una sola fecha, cerramos al elegir
                }}
                locale={es}
                startMonth={minDate}
                endMonth={maxDate}
                disabled={[{ before: minDate }, { dayOfWeek: [0] }]} // deshabilitamos fines de semana
              />
            </div>
          )}
        </div>
      </label>

      {isMissing && (
        <small role="alert" className="field-error-message">
          Es necesario elegir una fecha.
        </small>
      )}
    </>
  );
};
