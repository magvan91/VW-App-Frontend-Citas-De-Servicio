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
  showError?: boolean; // el usuario intentó avanzar sin elegir rango
};

const formatDate = (date?: Date) => {
  if (!date) return "";
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const isCompleteRange = (
  range?: DateRange,
): range is { from: Date; to: Date } =>
  !!range?.from && !!range?.to && !isSameDay(range.from, range.to);

export const DateRangePicker = ({
  value,
  onChange,
  disabled = false,
  showError = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  // Borrador interno: al padre solo le llegan rangos completos
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

  // Error A: eligió un solo día
  const isIncomplete = !!draft?.from && !isCompleteRange(draft);
  // Error B: intentó avanzar sin elegir nada (viene del formulario)
  const isMissing = showError && !draft?.from;
  const hasError = isIncomplete || isMissing;

  const displayValue = useMemo(() => {
    if (!draft?.from) return "";
    if (!isCompleteRange(draft)) return `${formatDate(draft.from)} - …`;
    return `${formatDate(draft.from)} - ${formatDate(draft.to)}`;
  }, [draft]);

  const handleSelect = (range: DateRange | undefined) => {
    setDraft(range);
    if (isCompleteRange(range)) {
      setOpen(false);
      onChange({ from: range.from, to: range.to }); // rango válido → petición
    } else if (value) {
      onChange(undefined); // rango incompleto → limpia, sin petición
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
          className={`div-input-fake-calendar${hasError ? " div-input-fake-calendar--error" : ""}`}
          style={{ position: "relative" }}
        >
          <input
            className={`input-fake-calendar${hasError ? " input-fake-calendar--error" : ""}`}
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
            <div className="date-range-popover">
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
        <small role="alert" className="field-error-message">
          Selecciona también la fecha final: se requiere un rango de mínimo dos
          fechas.
        </small>
      )}

      {isMissing && (
        <small role="alert" className="field-error-message">
          Es necesario elegir un rango de fechas
        </small>
      )}
    </>
  );
};
