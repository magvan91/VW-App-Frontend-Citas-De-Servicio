import { useState, useRef } from "react";
import {
  CTA,
  Select,
  Text,
  TextAlignment,
  TextInput,
  TextTag,
  TokenTextAppearance,
  Checkbox,
  Tabs,
  ButtonNext,
} from "@volkswagen-onehub/components-core";

import { useFormik } from "formik";
import { DateRangePicker } from "../components/DateRangePicker";
import { validationFormCitasDeServicio } from "./schemas/validationFormCitasDeServicio";
import { TycCitasDeServicio } from "../modals/TycCitasDeServicio";
import { SummaryCitasDeServicio } from "../pages/SummaryCitasDeServicio"; // IMPORTACIÓN REQUERIDA
import {
  onlyLettersWithAcents,
  onlyLettersAndNumbers,
  formatKilometraje,
} from "../utils/fieldFormsUtils";
import type { CitasServicioValues } from "../interfaces/CitasServicioValues.interface";
import { CheckmarkCircleFilled } from "@volkswagen-onehub/icons-core";

import type { ServiceOption } from "../interfaces/ServiceOption.interface";
import MantenimientoIcon from "../assets/images/servicioMantenimiento.svg";
import ReparacionIcon from "../assets/images/diagnosticoReparacion.svg";

import PinturaIcon from "../assets/images/ojalateriaPintura.svg";

import AccesoriosIcon from "../assets/images/cotizacionAccesorios.svg";

export const FormCitasDeServicio = () => {
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  const [index, setIndex] = useState(0);
  const [completedTabs, setCompletedTabs] = useState<number[]>([0]);
  const [showTyco, setShowTyco] = useState(false);
  const [showSummary, setShowSummary] = useState(false); // ESTADO REQUERIDO
  const [summaryData, setSummaryData] = useState<any>(null);

  const {
    values,
    touched,
    errors,
    getFieldProps,
    setFieldValue,
    validateForm,
    setTouched,
    submitForm,
  } = useFormik<CitasServicioValues>({
    initialValues: {
      numeroChasis: "",
      anio: "",
      modelo: "",
      kilometrajeAuto: "",
      kilometrajeServicio: "",
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
      tipoServicio: 0,
    },
    validationSchema: validationFormCitasDeServicio[index],
    onSubmit: (values) => {
      // 1. Extraer los componentes mediante desestructuración de arreglos
      const [fechaExtraida, horaExtraida] = values.horario.split("/");

      // 2. Crear un objeto de envío con los campos normalizados
      const payload = {
        ...values,
        fecha: fechaExtraida, // Asigna '2026-06-01'
        horario: horaExtraida, // Asigna '09:00'
      };

      // 3. Proceder con el renderizado del resumen o el envío al backend
      console.log("Datos procesados para el backend:", payload);
      setSummaryData(payload); // Guardamos los datos procesados para pasarlos al resumen
      setShowSummary(true);
    },
  });
  const targetRef = useRef<HTMLDivElement | null>(null);
  const handleActionComplete = async (tabIndex: number) => {
    //* 1. Forzamos la validación del esquema actual
    const currentErrors = await validateForm();

    //* 2. Si hay errores, tocamos los campos para que se muestren en rojo en la UI
    if (Object.keys(currentErrors).length > 0) {
      const touchedFields = Object.keys(currentErrors).reduce(
        (acc, curr) => {
          acc[curr as keyof CitasServicioValues] = true;
          return acc;
        },
        {} as Record<keyof CitasServicioValues, boolean>,
      );

      setTouched(touchedFields);
      return; //! Detenemos la función para no avanzar de Tab
    }
    //* 3. Si no hay errores, avanzamos al siguiente Tab de forma segura
    const nextIndex = tabIndex + 1;
    if (!completedTabs.includes(nextIndex)) {
      setCompletedTabs((prev) => [...prev, nextIndex]);
    }
    setIndex(nextIndex);
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
  const [selectedService, setSelectedService] = useState<number>(0);
  const serviceOptions: ServiceOption[] = [
    {
      id: 0,
      title: "Servicio de mantenimiento",
      icon: MantenimientoIcon,
    },
    {
      id: 1,
      title: "Diagnostico",
      icon: ReparacionIcon,
    },
    {
      id: 2,
      title: "Hojalatería y pintura",
      icon: PinturaIcon,
    },
    {
      id: 3,
      title: "Cotización e instalación de accesorios",
      icon: AccesoriosIcon,
    },
  ];

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
            appearance={TokenTextAppearance.headline200}
            textAlign={TextAlignment.center}
            tag={TextTag.h3}
            bold
          >
            ¿En que tipo de servicio estás interesado?
          </Text>
        </div>

        {serviceOptions.map((option) => (
          // col-6 para mostrar 2 columnas en celular, col-md-3 para 4 columnas en escritorio
          <div key={option.id} className="col-6 col-md-3 mb-3 mt-5">
            <div
              onClick={() => {
                setSelectedService(option.id);
                setFieldValue("tipoServicio", option.id);
                if (option.id !== 0) {
                  setFieldValue("kilometrajeServicio", "");
                }

                // 👇 scroll SOLO en móvil
                if (isMobile() && targetRef.current) {
                  targetRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
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
                  style={{ display: "inline-flex", transform: "scale(2.5)" }}
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
        {/* <BusinessCustomersPrivate /> */}
        <div></div>
        <div className="col-12">
          <Tabs
            defaultIndex={index}
            variant="step navigation"
            idPrefix="TabsCitasDeServicio"
            onChange={(index) => {
              console.log("onChange", index);
            }}
            onBeforeChange={(index) => {
              if (completedTabs.includes(index)) {
                return true;
              }
              return false;
            }}
          >
            {{
              title: (
                <Text>
                  Datos de Vehículo{" "}
                  {completedTabs.includes(1) && (
                    <i>
                      <CheckmarkCircleFilled variant="default" />
                    </i>
                  )}
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
                        onChange={(e: any) => {
                          const rawInput = e.target ? e.target.value : e;
                          const numericValue = rawInput.replace(/\D/g, "");
                          setFieldValue("kilometrajeAuto", numericValue);
                        }}
                        value={formatKilometraje(values.kilometrajeAuto)}
                        label="Kilometraje actual del vehículo*"
                        isFloating={true}
                        type="text"
                        inputMode="numeric"
                      />

                      {/* Nodo DOM inyectado dinámicamente solo si existe un valor */}
                      {values.kilometrajeAuto && (
                        <span
                          className="position-absolute"
                          style={{
                            right: "30px", // Ajustar según el padding nativo del componente VW
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
                        >
                          <option value="">
                            Selecciona el servicio que necesitas
                          </option>
                          <option value="15,000 km / 1 año">
                            15,000 km ó 1 año
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
                  {completedTabs.includes(2) && (
                    <i>
                      <CheckmarkCircleFilled variant="default" />
                    </i>
                  )}
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
                      <option value="">Estado</option>
                      <option value="CDMX">CDMX</option>
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
                      <option value="">Ciudad</option>
                      <option value="Iztapalapa">Iztapalapa</option>
                      <option value="Polanco">Polanco</option>
                      <option value="Coyoacán">Coyoacán</option>
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
                      <option value="">Distribuidor*</option>
                      <option value="VW Ola Polanco">VW Ola Polanco</option>
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
                      <optgroup label="2026-06-02">
                        <option value="2026-06-02/11:00">11:00</option>
                        <option value="2026-06-02/12:00">12:00</option>
                      </optgroup>
                      <optgroup label="2026-06-03">
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
              disabled: !completedTabs.includes(1),
              role: "step-2",
            }}
            {{
              title: (
                <Text>
                  Tus datos de contacto{" "}
                  {completedTabs.includes(3) && (
                    <i>
                      <CheckmarkCircleFilled variant="default" />
                    </i>
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
                    <div className="row">
                      <div className="col-12 text-center pb-4">
                        <CTA
                          tag="button"
                          type="button"
                          emphasis="primary"
                          onClick={submitForm}
                        >
                          Agendar Cita
                        </CTA>
                      </div>
                    </div>
                  </div>
                </div>
              ),
              key: "c",
              disabled: !completedTabs.includes(2),
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
