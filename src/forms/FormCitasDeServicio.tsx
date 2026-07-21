import { useState, useRef, useEffect, useMemo } from "react";
import type { SyntheticEvent } from "react";
import {
  ButtonNext,
  Checkbox,
  Container,
  ContainerGutter,
  CTA,
  Select,
  Spinner,
  Tabs,
  Text,
  TextAlignment,
  TextInput,
  TextTag,
  ToastNotification,
  TokenTextAppearance,
  TokenTextColor,
} from "@volkswagen-onehub/components-core";

import {
  CheckmarkCircleFilled,
  CloseCircle,
} from "@volkswagen-onehub/icons-core";

import { useFormik } from "formik";
import { globalValidationSchema } from "./schemas/validationFormCitasDeServicio";
import api from "../services/api";

import { useDropdowns } from "../hooks/useDropdowns";
import { DateRangePicker } from "../components/DateRangePicker";
import { SummaryCitasDeServicio } from "../pages/SummaryCitasDeServicio"; // IMPORTACIÓN REQUERIDA
import { TycCitasDeServicio } from "../modals/TycCitasDeServicio";
import {
  formatKilometraje,
  isMobile,
  nameFieldsRequired,
  onlyLettersAndNumbers,
  onlyLettersWithAcents,
} from "../utils/fieldFormsUtils";
import {
  SERVICE_OPTIONS,
  getServiceTitleById,
  getServiceTitleEnglishById,
} from "../utils/serviceOptions";

import type { CitasServicioValues } from "../interfaces/CitasServicioValues.interface";
import type { SummaryData } from "../interfaces/SummaryData.interface";

export const FormCitasDeServicio = () => {
  const [index, setIndex] = useState(0);
  const [completedTabs, setCompletedTabs] = useState<number[]>([0]);
  const [showTyco, setShowTyco] = useState(false);
  const [showSummary, setShowSummary] = useState(false); // ESTADO REQUERIDO
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);
  const [hasSubmitError, setHasSubmitError] = useState<boolean>(false);

  const {
    values,
    touched,
    errors,
    isSubmitting,
    getFieldProps,
    setFieldValue,
    validateForm,
    setTouched,
    submitForm,
  } = useFormik<CitasServicioValues>({
    initialValues: {
      numeroChasis: "",
      anio: 0,
      modelo: "",
      kilometrajeAuto: 0,
      kilometrajeServicio: 0,
      idConcesionario: "",
      estado: "",
      ciudad: "",
      dates: null,
      fecha: "",
      horario: "",
      nombre: "",
      apePat: "",
      apeMat: "",
      telefonoMovil: "",
      email: "",
      comentarios: "",
      aceptaAviso: false,
      opt_in_transferencia_datos: false,
      tyco: false,
      tipoServicio: "",
      marca: "Volkswagen",
    },
    validationSchema: globalValidationSchema, // Asignación directa y limpia

    onSubmit: async (values) => {
      const fechaExtraida = values.horario.split("/")[0];
      const horaExtraida = values.horario.split("/")[1];
      const horaConFormato = `${horaExtraida}:00.000Z`;

      const tipoServicioKey =
        typeof values.tipoServicio === "string"
          ? parseInt(values.tipoServicio, 10)
          : values.tipoServicio;
      const tipoServicioString =
        getServiceTitleEnglishById(tipoServicioKey) || "Unknown Service";
      const tituloServicioString =
        getServiceTitleById(tipoServicioKey) || "Unknown Service";
      const payload = {
        ...values,
        tipoServicio: tipoServicioString,
        fecha: fechaExtraida,
        horario: horaConFormato,
        servicioNombreMostrar: tituloServicioString,
      };

      try {
        setHasSubmitError(false);
        const response = await api.post("/api/v1/appointments", payload);
        console.log("Cita agendada exitosamente:", response.data);
        setShowSummary(true); // Mostrar el resumen después de un envío exitoso
        setSummaryData(payload); // Guardar los datos para el resumen
      } catch (error: unknown) {
        setHasSubmitError(true);

        if (error && typeof error === "object") {
          if ("response" in error) {
            // El servidor respondió con un código de error (ej. 400, 422, 500)
            const axiosError = error as {
              response: { status: number; data: unknown };
            };
            console.error(
              "Error del servidor al agendar cita:",
              axiosError.response.status,
              axiosError.response.data,
            );
          } else if ("request" in error) {
            // La petición se hizo pero no hubo respuesta
            const axiosError = error as { request: unknown };
            console.error(
              "Error de red: No se recibió respuesta del servidor.",
              axiosError.request,
            );
          } else if ("message" in error) {
            // Error en la configuración de Axios o ejecución del frontend
            const genericError = error as { message: string };
            console.error("Error de ejecución:", genericError.message);
          }
        } else {
          console.error("Error desconocido:", error);
        }
      }
    },
  });

  // Centraliza la validación secuencial compartida entre botón y cabezal
  const validateAndUnlockStep = async (
    currentTab: number,
  ): Promise<boolean> => {
    //* 1. Forzamos la validación global (con el esquema global unificado)
    const currentErrors = await validateForm();

    //* 2. Obtenemos los campos específicos del paso actual (requisito previo)
    const fieldsInCurrentTab = nameFieldsRequired[currentTab] || [];

    //* 3. Verificamos si existe al menos un error en el paso actual
    const hasErrorsInTab = fieldsInCurrentTab.some(
      (field) => !!currentErrors[field as keyof CitasServicioValues],
    );

    //* 4. Si hay errores en el tab actual, detenemos
    if (hasErrorsInTab) {
      const touchedFields = fieldsInCurrentTab.reduce(
        (acc, curr) => {
          if (currentErrors[curr as keyof CitasServicioValues]) {
            acc[curr as keyof CitasServicioValues] = true;
          }
          return acc;
        },
        {} as Record<keyof CitasServicioValues, boolean>,
      );

      setTouched({ ...touched, ...touchedFields });
      return false; // Validación falló en el paso actual
    }

    //* 5. Si no hay errores, desbloqueamos el siguiente paso secuencial
    const nextIndex = currentTab + 1;
    if (!completedTabs.includes(nextIndex)) {
      setCompletedTabs((prev) => [...prev, nextIndex]);
    }
    return true; // Validación exitosa, paso desbloqueado
  };

  const tabErrors = useMemo(() => {
    const currentErrorsState: Record<number, boolean> = {};

    completedTabs.forEach((tab) => {
      const fields = nameFieldsRequired[tab] || [];

      // Verifica si existe al menos un error en los campos correspondientes a la pestaña iterada
      const hasError = fields.some(
        (field) => !!errors[field as keyof CitasServicioValues],
      );

      if (hasError) {
        currentErrorsState[tab] = true;
      }
    });

    return currentErrorsState;
  }, [errors, completedTabs]);

  const targetRef = useRef<HTMLDivElement | null>(null);
  const handleActionComplete = async (tabIndex: number) => {
    //* 1. Forzamos la validación global
    const currentErrors = await validateForm();

    //* 2. Obtenemos los campos específicos de la pestaña actual
    const fieldsInCurrentTab = nameFieldsRequired[tabIndex] || [];

    //* 3. Verificamos si existe al menos un error que pertenezca a los campos de esta pestaña
    const hasErrorsInTab = fieldsInCurrentTab.some(
      (field) => !!currentErrors[field as keyof CitasServicioValues],
    );

    //* 4. Si hay errores en el tab actual, los mostramos y bloqueamos avance
    if (hasErrorsInTab) {
      const touchedFields = fieldsInCurrentTab.reduce(
        (acc, curr) => {
          if (curr === "tipoServicio") {
            servicesSectionRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center", // Deja la sección en el centro de la pantalla
            });
          }
          if (currentErrors[curr as keyof CitasServicioValues]) {
            acc[curr as keyof CitasServicioValues] = true;
          }
          return acc;
        },
        {} as Record<keyof CitasServicioValues, boolean>,
      );

      // Mezclamos los campos tocados previos con los nuevos para no borrar el estado
      setTouched({ ...touched, ...touchedFields });
      return;
    }

    //* 5. Si no hay errores en el tab actual, avanzamos de forma segura
    const nextIndex = tabIndex + 1;
    if (!completedTabs.includes(nextIndex)) {
      setCompletedTabs((prev) => [...prev, nextIndex]);
    }
    // Llama a la lógica centralizada
    const success = await validateAndUnlockStep(tabIndex);

    // Si fue exitoso, avanzamos visualmente al siguiente tab
    if (success) {
      setIndex(tabIndex + 1);
    }
  };

  //* Función que llama al fieldFormsUtils onlyLetters
  const handleOnlyLettersWithAccentsChange = (
    e: React.SyntheticEvent<HTMLInputElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    const cleanValue = onlyLettersWithAcents(value);
    setFieldValue(name, cleanValue);
  };
  const handleOnlyLettersAndNumbers = (
    e: React.SyntheticEvent<HTMLInputElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    const cleanValue = onlyLettersAndNumbers(value);
    setFieldValue(name, cleanValue);
  };

  const handleShowTyco = (visibleTyco: boolean): void => {
    setShowTyco(visibleTyco);
  };
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // 1. Usamos tu nuevo hook, pasándole los valores actuales del formulario
  const { estados, ciudades, concesionarios, dealer } = useDropdowns(
    parseInt(values.estado),
    parseInt(values.ciudad),
    parseInt(values.idConcesionario),
    parseInt(values.tipoServicio),
  );

  useEffect(() => {
    if (!dealer || !dealer.services) return;
    const newSelectedServiceName = getServiceTitleEnglishById(
      parseInt(values.tipoServicio),
    );
    if (
      newSelectedServiceName &&
      !dealer.services.includes(newSelectedServiceName)
    ) {
      setFieldValue("estado", "");
      setFieldValue("ciudad", "");
      setFieldValue("idConcesionario", "");
    }
  }, [values.tipoServicio, setFieldValue, dealer]);

  // 2. Pequeños efectos de Formik para limpiar los campos hijos si el padre cambia
  useEffect(() => {
    setFieldValue("ciudad", "");
    setFieldValue("idConcesionario", "");
  }, [values.estado, setFieldValue]);

  useEffect(() => {
    setFieldValue("idConcesionario", "");
  }, [values.ciudad, setFieldValue]);

  // CONTROL DE FLUJO CONDICIONAL EN EL RENDER
  if (showSummary && summaryData) {
    // Se asegura de que summaryData exista
    return (
      <SummaryCitasDeServicio
        showSummary={showSummary}
        data={summaryData} // <--- AHORA PASAS LOS DATOS PROCESADOS
      />
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Text
            bold
            tag={TextTag.h1}
            appearance={TokenTextAppearance.headline600}
            textAlign={TextAlignment.center}
          >
            Citas de Servicio
          </Text>
        </div>
        <div className="col-12 pb-4">
          <Text
            appearance={TokenTextAppearance.bigcopy200}
            color={TokenTextColor.tertiary}
            tag={TextTag.h2}
            textAlign={TextAlignment.center}
          >
            Elige tu modelo y en breve nos comunicaremos contigo.
          </Text>
        </div>
      </div>
      <div className="row">
        {/* <BusinessCustomersPrivate /> */}
        <div className="col-12">
          {/* --- INICIO DE ZONA RESALTADA --- */}
          <div className="col-12">
            <div
              ref={servicesSectionRef} // Aquí conectamos el Auto-scroll
              className="row m-0" // m-0 para no alterar la estructura de Bootstrap
              style={{
                border:
                  touched.tipoServicio && errors.tipoServicio
                    ? "2px solid #d93025"
                    : "2px solid transparent",
                backgroundColor:
                  touched.tipoServicio && errors.tipoServicio
                    ? "#fce8e6"
                    : "transparent",
                padding: "1rem 0",
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
            >
              <div className="col-12">
                <Text
                  appearance={TokenTextAppearance.headline200}
                  textAlign={TextAlignment.center}
                  tag={TextTag.h3}
                  bold
                >
                  ¿En que tipo de servicio estás interesado?
                </Text>
              </div>

              {/* Mostrar mensaje de error si el usuario intentó enviar sin seleccionar un servicio */}
              {/* Cambiamos touched por submitCount > 0 para que coincida con el borde */}
              {touched.tipoServicio && errors.tipoServicio && (
                <div
                  className="text-danger mt-2 text-center"
                  style={{ fontWeight: "bold" }}
                >
                  {errors.tipoServicio}
                </div>
              )}

              {SERVICE_OPTIONS.map((option) => (
                // col-6 para mostrar 2 columnas en celular, col-md-3 para 4 columnas en escritorio
                <div key={option.id} className="col-6 col-md-3 mb-3 mt-5">
                  <div
                    onClick={() => {
                      const isKilometraje = option.id === 0;
                      setSelectedService(option.id);
                      setFieldValue("tipoServicio", option.id);

                      if (isMobile() && targetRef.current) {
                        // Si es la opción que expande el formulario, esperamos al siguiente frame
                        window.requestAnimationFrame(() => {
                          setTimeout(
                            () => {
                              targetRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "end",
                              });
                            },
                            isKilometraje ? 150 : 0,
                          );
                        });
                      }
                    }}
                    className="d-flex flex-column align-items-center justify-content-center p-3 rounded h-100 text-center"
                    style={{
                      cursor: "pointer",
                      // Estilos condicionales basados en la selección
                      backgroundColor:
                        selectedService === option.id ? "#f5f3ed" : "#ffffff",
                      borderColor:
                        selectedService === option.id ? "#8b7b65" : "#f2f2f2",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      minHeight: "160px",
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <div className="mb-3" style={{ color: "#001e50" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          transform: "scale(2.5)",
                        }}
                      >
                        {/* Verificación de tipo para TSX */}
                        {typeof option.icon === "string" ? (
                          <img
                            src={option.icon}
                            alt={option.title}
                            style={{
                              width: "2.5em", // Mantiene proporción con el texto
                              height: "2.em",
                              display: "block",
                            }}
                          />
                        ) : (
                          // Si no es string, TS sabe que es ReactNode/JSX.Element
                          option.icon
                        )}
                      </span>
                    </div>
                    <Text
                      appearance={TokenTextAppearance.copy200}
                      textAlign={TextAlignment.center}
                    >
                      {option.title}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* --- FIN DE ZONA RESALTADA --- */}
          <Tabs
            defaultIndex={index}
            variant="step navigation"
            idPrefix="TabsCitasDeServicio"
            // 1. Sincronizar el estado interno de la UI con tu estado de React
            onChange={(newIndex) => {
              setIndex(newIndex);
            }}
            // 2. Interceptar el salto nativo
            onBeforeChange={(proposedIndex) => {
              // Permitir salto libre hacia atrás si el tab ya fue validado
              if (completedTabs.includes(proposedIndex)) {
                return true;
              }

              // Si el usuario da clic al siguiente paso secuencial (el naranja)
              if (proposedIndex === index + 1) {
                // Ejecutamos tu función de validación (la misma del botón)
                handleActionComplete(index);

                // Retornamos false para bloquear el salto nativo síncrono.
                // Si la validación pasa, handleActionComplete actualizará el estado
                // y forzará el avance.
                return false;
              }

              // Bloquea cualquier otro intento de saltar múltiples pasos
              return false;
            }}
          >
            {{
              title: (
                <Text>
                  Datos del vehículo{" "}
                  {tabErrors[0] ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      <CloseCircle variant="default" />
                    </span>
                  ) : completedTabs.includes(1) ? (
                    <i>
                      <CheckmarkCircleFilled variant="default" />
                    </i>
                  ) : null}
                </Text>
              ),
              content: (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                  ref={targetRef}
                >
                  <div className="row g-3">
                    <div
                      className={`col-12 ${selectedService === 0 ? "col-md-12" : "col-md-6"}`}
                    >
                      <TextInput
                        {...getFieldProps("numeroChasis")}
                        label="Número VIN"
                        isFloating={true}
                        required
                        type="text"
                        maxLength={17}
                        appearance={
                          touched.numeroChasis
                            ? errors.numeroChasis
                              ? "error"
                              : "success"
                            : "default"
                        }
                        onChange={handleOnlyLettersAndNumbers}
                      />
                      {touched.numeroChasis && errors.numeroChasis && (
                        <div className="text-danger small">
                          {errors.numeroChasis}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-sm-12 col-md-6">
                      <Select
                        {...getFieldProps("anio")}
                        required
                        isFloating={true}
                        label="Año del vehículo"
                        message={
                          touched.anio && !values.anio
                            ? "Selecciona el año del vehículo"
                            : ""
                        }
                        onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                          const value = parseInt(
                            (e.target as HTMLSelectElement).value,
                            10,
                          );
                          setFieldValue("anio", value);
                        }}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        appearance={
                          touched.anio
                            ? errors.anio
                              ? "error"
                              : "success"
                            : "default"
                        }
                      >
                        <option value="">
                          Selecciona el año de tu vehículo
                        </option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                      </Select>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6">
                      <Select
                        {...getFieldProps("modelo")}
                        required
                        isFloating={true}
                        label="Vehículo"
                        message={
                          touched.modelo && !values.modelo
                            ? "Selecciona el módelo de tu vehículo"
                            : ""
                        }
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        appearance={
                          touched.modelo
                            ? errors.modelo
                              ? "error"
                              : "success"
                            : "default"
                        }
                      >
                        <option value="">Selecciona tu vehículo</option>
                        <option value="Polo">Polo</option>
                        <option value="Jetta">Jetta</option>
                        <option value="Virtus">Virtus</option>
                        <option value="Tiguan">Tiguan</option>
                      </Select>
                    </div>

                    <div className="col-12 col-md-6 position-relative">
                      <TextInput
                        {...getFieldProps("kilometrajeAuto")}
                        onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                          const rawInput = (e.target as HTMLInputElement).value;
                          const numericValue = parseInt(
                            rawInput.replace(/\D/g, "") || "0",
                            10,
                          );
                          setFieldValue("kilometrajeAuto", numericValue);
                        }}
                        value={
                          values.kilometrajeAuto && values.kilometrajeAuto !== 0
                            ? formatKilometraje(values.kilometrajeAuto)
                            : ""
                        }
                        label="Kilometraje actual del vehículo"
                        isFloating={true}
                        type="text"
                        inputMode="numeric"
                        required
                        appearance={
                          touched.kilometrajeAuto
                            ? errors.kilometrajeAuto
                              ? "error"
                              : "success"
                            : "default"
                        }
                      />

                      {/* Nodo DOM inyectado dinámicamente solo si existe un valor */}
                      {values.kilometrajeAuto > 0 && (
                        <span
                          className="position-absolute"
                          style={{
                            right: "50px", // Ajustar según el padding nativo del componente VW
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#666666",
                            pointerEvents: "none",
                            zIndex: 5,
                          }}
                        >
                          km
                        </span>
                      )}
                    </div>
                    {selectedService === 0 && (
                      <div className="col-12 col-sm-12 col-md-6 pt-sm-0">
                        <Select
                          {...getFieldProps("kilometrajeServicio")}
                          label="Servicio que necesitas"
                          isFloating={true}
                          onChange={(e: SyntheticEvent<HTMLSelectElement>) => {
                            const value = parseInt(
                              (e.target as HTMLSelectElement).value,
                              10,
                            );
                            setFieldValue("kilometrajeServicio", value || 0);
                          }}
                        >
                          <option value="">
                            Selecciona el servicio que necesitas
                          </option>
                          <option value="15000">15,000 km ó 1 año</option>
                          <option value="30000">30,000 km o 2 años</option>
                          <option value="45000">45,000 km o 3 años</option>
                          <option value="60000">60,000 km o 4 años</option>
                          <option value="75000">
                            Superior a 60,000 km o 4 años
                          </option>
                        </Select>
                      </div>
                    )}
                  </div>
                  {!completedTabs.includes(1) && (
                    <div className="col-12 text-center pt-5">
                      <ButtonNext
                        onClick={() => handleActionComplete(0)}
                        tag="button"
                        emphasis="primary"
                        size="large"
                      >
                        Siguiente paso
                      </ButtonNext>
                    </div>
                  )}
                </div>
              ),
              key: "a",
              disabled: !completedTabs.includes(0),
              role: "step-1",
            }}
            {{
              title: (
                <Text>
                  Búsqueda de Distribuidores{" "}
                  {tabErrors[1] ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      <CloseCircle variant="default" />
                    </span>
                  ) : completedTabs.includes(2) ? (
                    <i>
                      <CheckmarkCircleFilled variant="default" />
                    </i>
                  ) : null}
                </Text>
              ),
              content: (
                <div className="row g-3">
                  <div className="col-12 col-sm-4 col-md-4">
                    <Select
                      {...getFieldProps("estado")}
                      required
                      isFloating={true}
                      label="Selecciona un estado"
                      message={
                        touched.estado && !values.estado
                          ? "Selecciona un estado"
                          : ""
                      }
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      appearance={
                        touched.estado
                          ? errors.estado
                            ? "error"
                            : "success"
                          : "default"
                      }
                    >
                      <option value="">Selecciona un estado</option>
                      {estados.map((est) => (
                        <option key={est.id} value={est.id}>
                          {est.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4">
                    <Select
                      {...getFieldProps("ciudad")}
                      required
                      isFloating={true}
                      label={
                        values.estado === "CDMX"
                          ? "Selecciona una alcaldía"
                          : "Selecciona una ciudad"
                      }
                      message={
                        touched.ciudad && !values.ciudad
                          ? "Selecciona una ciudad"
                          : ""
                      }
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      appearance={
                        touched.ciudad
                          ? errors.ciudad
                            ? "error"
                            : "success"
                          : "default"
                      }
                      disabled={!values.estado}
                    >
                      <option value="">Selecciona una ciudad</option>
                      {ciudades.map((ciu) => (
                        <option key={ciu.id} value={ciu.id}>
                          {ciu.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-12 col-sm-4 col-md-4">
                    <Select
                      {...getFieldProps("idConcesionario")}
                      required
                      isFloating={true}
                      label="Selecciona un distribuidor"
                      message={
                        touched.idConcesionario && !values.idConcesionario
                          ? "Selecciona un distribuidor"
                          : ""
                      }
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      appearance={
                        touched.idConcesionario
                          ? errors.idConcesionario
                            ? "error"
                            : "success"
                          : "default"
                      }
                      disabled={!values.ciudad}
                    >
                      <option value="">Selecciona un concesionario</option>
                      {concesionarios.map((dealer) => (
                        <option
                          key={dealer.idConcesionario}
                          value={dealer.idConcesionario}
                        >
                          {dealer.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="col-12 col-sm-6 col-md-6">
                    <DateRangePicker
                      value={
                        values.dates
                          ? { from: values.dates[0], to: values.dates[1] }
                          : undefined
                      }
                      onChange={(range) =>
                        setFieldValue(
                          "dates",
                          range ? [range.from, range.to] : null,
                        )
                      }
                    />
                  </div>
                  <div className="col-12 col-sm-6 col-md-6">
                    <Select
                      required
                      {...getFieldProps("horario")}
                      isFloating={true}
                      label="Selecciona un horario"
                      message={
                        touched.horario && !values.horario
                          ? "Selecciona un distribuidor"
                          : ""
                      }
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      appearance={
                        touched.horario
                          ? errors.horario
                            ? "error"
                            : "success"
                          : "default"
                      }
                      disabled={!values.dates}
                    >
                      <option value="">Selecciona un horario</option>
                      <optgroup label="01-septiembre-26">
                        <option value="2026-06-01/09:00">09:00</option>
                        <option value="2026-06-01/10:00">10:00</option>
                      </optgroup>
                      <optgroup label="02-junio-26">
                        <option value="2026-06-02/11:00">11:00</option>
                        <option value="2026-06-02/12:00">12:00</option>
                      </optgroup>
                      <optgroup label="03-junio-26">
                        <option value="2026-06-03/09:00">09:00</option>
                        <option value="2026-06-03/12:00">12:00</option>
                      </optgroup>
                    </Select>
                  </div>
                  {!completedTabs.includes(2) && (
                    <div className="col-12 text-center">
                      <ButtonNext
                        onClick={() => handleActionComplete(1)}
                        tag="button"
                        emphasis="primary"
                      >
                        Paso siguiente
                      </ButtonNext>
                    </div>
                  )}
                </div>
              ),
              key: "b",
              disabled: !completedTabs.includes(0),
              role: "step-2",
            }}
            {{
              title: (
                <Text>
                  Tus datos de contacto{" "}
                  {tabErrors[2] && (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      <CloseCircle variant="default" />
                    </span>
                  )}
                </Text>
              ),
              content: (
                <div className="row g-3">
                  <div className="col-12 col-sm-4">
                    <TextInput
                      {...getFieldProps("nombre")}
                      label="Nombre"
                      isFloating={true}
                      type="text"
                      required
                      onChange={handleOnlyLettersWithAccentsChange}
                      appearance={
                        touched.nombre
                          ? errors.nombre
                            ? "error"
                            : "success"
                          : "default"
                      }
                    />
                    {touched.nombre && errors.nombre && (
                      <div className="text-danger small">{errors.nombre}</div>
                    )}
                  </div>
                  <div className="col-12 col-sm-4">
                    <TextInput
                      {...getFieldProps("apePat")}
                      label="Apellido Paterno"
                      isFloating={true}
                      type="text"
                      required
                      onChange={handleOnlyLettersWithAccentsChange}
                      appearance={
                        touched.apePat
                          ? errors.apePat
                            ? "error"
                            : "success"
                          : "default"
                      }
                    />
                    {touched.apePat && errors.apePat && (
                      <div className="text-danger small">{errors.apePat}</div>
                    )}
                  </div>
                  <div className="col-12 col-sm-4">
                    <TextInput
                      {...getFieldProps("apeMat")}
                      label="Apellido Materno"
                      isFloating={true}
                      type="text"
                      required
                      onChange={handleOnlyLettersWithAccentsChange}
                      appearance={
                        touched.apeMat
                          ? errors.apeMat
                            ? "error"
                            : "success"
                          : "default"
                      }
                    />
                    {touched.apeMat && errors.apeMat && (
                      <div className="text-danger small">{errors.apeMat}</div>
                    )}
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextInput
                      {...getFieldProps("telefonoMovil")}
                      type="text"
                      label="Teléfono"
                      isFloating={true}
                      maxLength={10}
                      required
                      appearance={
                        touched.telefonoMovil
                          ? errors.telefonoMovil
                            ? "error"
                            : "success"
                          : "default"
                      }
                      onChange={(e) => {
                        const soloNumeros = (e.target as HTMLInputElement).value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setFieldValue("telefonoMovil", soloNumeros);
                      }}
                    />
                    {touched.telefonoMovil && errors.telefonoMovil && (
                      <div className="text-danger small">
                        {errors.telefonoMovil}
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-sm-6">
                    <TextInput
                      {...getFieldProps("email")}
                      label="Correo"
                      isFloating={true}
                      type="email"
                      required
                      appearance={
                        touched.email
                          ? errors.email
                            ? "error"
                            : "success"
                          : "default"
                      }
                    />
                    {touched.email && errors.email && (
                      <div className="text-danger small">{errors.email}</div>
                    )}
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <TextInput
                        {...getFieldProps("comentarios")}
                        label="¿Hay algo más que quieras compartirnos? Escribelo aquí"
                        isFloating={true}
                        type="text"
                      />
                    </div>
                    <div className="row my-4">
                      <div className="col-12 mb-3">
                        <Checkbox
                          {...getFieldProps("aceptaAviso")}
                          appearance={
                            touched.aceptaAviso
                              ? errors.aceptaAviso
                                ? "error"
                                : "success"
                              : "default"
                          }
                        />
                        He leído y acepto los términos y condiciones contenidos
                        en el{" "}
                        <CTA
                          tag="a"
                          emphasis="tertiary"
                          title="Aviso de Privacidad"
                          target="_blank"
                          rel="noreferrer"
                          href="https://www.vw.com.mx/es/legal/aviso-de-privacidad.html"
                        >
                          {" "}
                          Aviso de Privacidad.
                        </CTA>
                        {touched.aceptaAviso && errors.aceptaAviso && (
                          <div className="text-danger small mt-1">
                            {errors.aceptaAviso}
                          </div>
                        )}
                      </div>

                      <div className="col-12 mb-3">
                        <Checkbox
                          {...getFieldProps("opt_in_transferencia_datos")}
                          appearance={
                            touched.opt_in_transferencia_datos
                              ? errors.opt_in_transferencia_datos
                                ? "error"
                                : "success"
                              : "default"
                          }
                        />
                        Acepto que mis datos personales aquí proporcionados sean
                        transferidos al Concesionario marca Volkswagen que he
                        elegido, a efecto de que le den seguimiento a mi
                        solicitud.
                        {touched.opt_in_transferencia_datos &&
                          errors.opt_in_transferencia_datos && (
                            <div className="text-danger small mt-1">
                              {errors.opt_in_transferencia_datos}
                            </div>
                          )}
                      </div>
                      <div className="col-12 mb-3">
                        <Checkbox
                          {...getFieldProps("tyco")}
                          appearance={
                            touched.tyco
                              ? errors.tyco
                                ? "error"
                                : "success"
                              : "default"
                          }
                        />
                        He leído y acepto los términos y condiciones{" "}
                        <CTA
                          tag="button"
                          type="button"
                          emphasis="tertiary"
                          title="Términos y condiciones"
                          onClick={() => handleShowTyco(true)}
                        >
                          Apartado.
                        </CTA>
                        {touched.tyco && errors.tyco && (
                          <div className="text-danger small mt-1">
                            {errors.tyco}
                          </div>
                        )}
                      </div>
                    </div>
                    {hasSubmitError && (
                      <div className="row">
                        <div className="col-12 pb-4">
                          <Container
                            gutter={ContainerGutter.static200}
                            wrap="always"
                          >
                            <ToastNotification
                              show
                              title="Algo salió mal, inténtalo de nuevo"
                              appearance="Alert"
                            />
                          </Container>
                        </div>
                      </div>
                    )}
                    <div className="row">
                      <div className="col-12 text-center pb-4">
                        <CTA
                          tag="button"
                          type="button"
                          emphasis="primary"
                          onClick={submitForm}
                          disabled={isSubmitting}
                        >
                          {/* Evaluamos los 3 estados posibles del botón: */}
                          {isSubmitting ? (
                            // Estado 1: Está cargando (haciendo la petición)
                            <div className="d-flex justify-content-center align-items-center">
                              <Spinner variant="large" />
                              <span className="ms-2">Enviando...</span>
                            </div>
                          ) : hasSubmitError ? (
                            // Estado 2: Hubo un error, cambiamos el texto para invitar a reintentar
                            "Volver a intentar"
                          ) : (
                            // Estado 3: Estado normal inicial
                            "Agendar Cita"
                          )}
                        </CTA>
                      </div>
                    </div>
                  </div>
                </div>
              ),
              key: "c",
              disabled: !completedTabs.includes(1),
              role: "step-3",
            }}
          </Tabs>
        </div>
      </div>
      <TycCitasDeServicio
        showModal={showTyco}
        handleShowTyco={handleShowTyco}
      />
    </div>
  );
};
