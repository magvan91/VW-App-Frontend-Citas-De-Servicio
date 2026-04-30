import { useState, useRef, useEffect } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { addDays, format } from "date-fns";
import "react-day-picker/dist/style.css";
import "./../styles.css";

type Props = {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
};

export const DateRangePicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const minDate = addDays(new Date(), 3);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date?: Date) => {
    console.log(date);
    return date
      ? date.toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";
  };

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
          onClick={() => setOpen(!open)}
          value={
            value?.from && value?.to
              ? `${formatDate(value.from)} - ${formatDate(value.to)}`
              : ""
          }
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
              endMonth={addDays(new Date(), 60)}
              disabled={{ before: minDate }}
            />
          </div>
        )}
      </div>
    </label>
  );
};
