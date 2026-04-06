import { useState } from "react";
import {
  CTA,
  Select,
  Text,
  TextAlignment,
  TextInput,
  TextTag,
  TokenTextAppearance,
  Checkbox,
} from "@volkswagen-onehub/components-core";
import { useFormik } from "formik";
import { DateRangePicker } from "../components/DateRangePicker";
import { validationFormCitasDeServicio } from "./schemas/validationFormCitasDeServicio";
import { TycCitasDeServicio } from "../modals/TycCitasDeServicio";
import {
  onlyLettersWithAcents,
  onlyLettersAndNumbers,
} from "../utils/fieldFormsUtils";

export const FormCitasDeServicio = () => {
  const {
    values,
    touched,
    errors,
    getFieldProps,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      numeroChasis: "",
      anio: "",
      modelo: "",
      kilometrajeAuto: "",
      kilometrajeServicio: "",
      idConcesionario: "",
      estado: "",
      ciudad: "",
      dates: undefined,
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
    },
    validationSchema: validationFormCitasDeServicio,
    onSubmit: (values) => {
      console.log(values);
    },
  });

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

  const [showTyco, setShowTyco] = useState(false);
  const handleShowTyco = (visibleTyco: boolean): void => {
    setShowTyco(visibleTyco);
  };
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
            En que tipo de servicio estás interesado
          </Text>
        </div>
        <div className="col-12 pt-5 pb-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
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
                  <div className="text-danger small">{errors.numeroChasis}</div>
                )}
              </div>
            </div>
            <div className="row g-3 py-3">
              <div className="col-12 col-sm-12 col-md-6">
                <Select {...getFieldProps("anio")}>
                  <option value="">Selecciona el año de tu vehículo</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </Select>
              </div>
              <div className="col-12 col-sm-12 col-md-6">
                <Select {...getFieldProps("modelo")}>
                  <option value="">Selecciona tu vehículo</option>
                  <option value="Polo">Polo</option>
                  <option value="Jetta">Jetta</option>
                  <option value="Virtus">Virtus</option>
                  <option value="Tiguan">Tiguan</option>
                </Select>
              </div>
            </div>
            <div className="row g-3 py-3">
              <div className="col-12 col-sm-12 col-md-6 pt-sm-0">
                <TextInput
                  {...getFieldProps("kilometrajeAuto")}
                  label="Kilometraje actual del vehículo"
                  isFloating={true}
                  type="number"
                />
              </div>
              <div className="col-12 col-sm-12 col-md-6 pt-sm-0">
                <Select {...getFieldProps("kilometrajeServicio")}>
                  <option value="">Seleccione su servicio que necesite</option>
                  <option value="15,000 km / 1 año">15,000 km ó 1 año</option>
                </Select>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-12">
                <Text
                  appearance={TokenTextAppearance.headline200}
                  textAlign={TextAlignment.start}
                  tag={TextTag.h4}
                  bold
                >
                  Búsqueda de Distribuidores
                </Text>
              </div>
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
                  label="Selecciona una ciudad"
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
                  value={values.dates}
                  onChange={(range) => setFieldValue("dates", range)}
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
                  <optgroup label="2026-06-01">
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                  </optgroup>
                  <optgroup label="2026-06-02">
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                  </optgroup>
                  <optgroup label="2026-06-03">
                    <option value="09:00">09:00</option>
                    <option value="12:00">12:00</option>
                  </optgroup>
                </Select>
              </div>
              <div className="row g-3">
                <div className="col-12">
                  <Text
                    appearance={TokenTextAppearance.headline200}
                    textAlign={TextAlignment.start}
                    tag={TextTag.h4}
                    bold
                  >
                    Tus datos de contacto
                  </Text>
                </div>
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
              </div>
              <div className="row g-3">
                <div className="col-12">
                  <Text
                    appearance={TokenTextAppearance.headline200}
                    textAlign={TextAlignment.start}
                    tag={TextTag.h4}
                    bold
                  >
                    Información adicional
                  </Text>
                </div>
                <div className="col-12">
                  <TextInput
                    {...getFieldProps("comentarios")}
                    label="¿Hay algo más que quieras compartirnos? Escribelo aquí"
                    isFloating={true}
                    type="text"
                  />
                </div>
                <div className="col-12 text-center">
                  <CTA tag="button" type="submit" emphasis="primary">
                    Agendar Cita
                  </CTA>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
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
                  He leído y acepto los términos y condiciones contenidos en el{" "}
                  <CTA
                    tag="a"
                    emphasis="tertiary"
                    title="Aviso de Privacidad"
                    target="_blank"
                    href="https://www.vw.com.mx/es/legal/aviso-de-privacidad.html"
                  >
                    {" "}
                    Aviso de Privacidad
                  </CTA>
                  .
                </div>
                {touched.aceptaAviso && errors.aceptaAviso && (
                  <div className="text-danger small">{errors.aceptaAviso}</div>
                )}
                <div className="col-12 pb-2">
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
                  transferidos al Concesionario marca Volkswagen que he elegido,
                  a efecto de que le den seguimiento a mi solicitud.
                </div>
                {touched.opt_in_transferencia_datos &&
                  errors.opt_in_transferencia_datos && (
                    <div className="text-danger small">
                      {errors.opt_in_transferencia_datos}
                    </div>
                  )}
                <div className="col-12">
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
                    tag="a"
                    emphasis="tertiary"
                    title="Términos y condiciones"
                    onClick={() => handleShowTyco(true)}
                  >
                    Apartado.
                  </CTA>
                </div>
                {touched.tyco && errors.tyco && (
                  <div className="text-danger small">{errors.tyco}</div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
