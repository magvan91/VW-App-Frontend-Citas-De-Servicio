import {
  CTA,
  Select,
  Text,
  TextAlignment,
  TextInput,
  TextTag,
  TokenTextAppearance,
} from "@volkswagen-onehub/components-core";
import { useFormik } from "formik";

export const FormCitasDeServicio = () => {
  const { getFieldProps } = useFormik({
    initialValues: {
      numeroChasis: "",
      anio: "",
      modelo: "",
      kilometrajeAuto: "",
      kilometrajeServicio: "",
      idConcesionario: "",
      estado: "",
      ciudad: "",
      fecha: "",
      horario: "",
      nombre: "",
      apePat: "",
      apeMat: "",
      telefonoMovil: "",
      email: "",
      comentarios: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
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
          <form>
            <div className="row g-3">
              <div className="col-12">
                <TextInput
                  {...getFieldProps("numeroChasis")}
                  label="Número VIN"
                  isFloating={true}
                  required
                  type="text"
                />
              </div>
            </div>
            <div className="row g-3">
              <div className="col-12 col-sm-12 col-md-6 pt-3">
                <Select {...getFieldProps("anio")}>
                  <option value="">Selecciona el año de tu vehículo</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </Select>
              </div>
              <div className="col-12 col-sm-12 col-md-6 pt-3">
                <Select {...getFieldProps("modelo")}>
                  <option value="">Selecciona tu vehículo</option>
                  <option value="Polo">Polo</option>
                  <option value="Jetta">Jetta</option>
                  <option value="Virtus">Virtus</option>
                  <option value="Tiguan">Tiguan</option>
                </Select>
              </div>
            </div>
            <div className="row py-3">
              <div className="col-12 col-sm-12 col-md-6 pt-sm-0 pt-3">
                <TextInput
                  {...getFieldProps("kilometrajeAuto")}
                  label="Kilometraje actual del vehículo"
                  isFloating={true}
                  type="number"
                />
              </div>
              <div className="col-12 col-sm-12 col-md-6 pt-sm-0 pt-3">
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
                <Select required>
                  <option value="">Estado</option>
                  <option value="CDMX">CDMX</option>
                </Select>
              </div>
              <div className="col-12 col-sm-4 col-md-4">
                <Select required>
                  <option value="">Ciudad</option>
                  <option value="Iztapalapa">Iztapalapa</option>
                  <option value="Polanco">Polanco</option>
                  <option value="Coyoacán">Coyoacán</option>
                </Select>
              </div>
              <div className="col-12 col-sm-4 col-md-4">
                <Select required {...getFieldProps("idConcesionario")}>
                  <option value="">Distribuidor*</option>
                  <option value="VW Ola Polanco">VW Ola Polanco</option>
                </Select>
              </div>
              <div className="col-12 col-sm-6 col-md-6">
                <TextInput
                  {...getFieldProps("fecha")}
                  label="Fecha"
                  type={"month"}
                  required
                />
              </div>
              <div className="col-12 col-sm-6 col-md-6">
                <Select required {...getFieldProps("horario")}>
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
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <TextInput
                    {...getFieldProps("apePat")}
                    label="Apellido Paterno"
                    isFloating={true}
                    type="text"
                    required
                  />
                </div>
                <div className="col-12 col-sm-4">
                  <TextInput
                    {...getFieldProps("apeMat")}
                    label="Apellido Materno"
                    isFloating={true}
                    type="text"
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <TextInput
                    {...getFieldProps("telefonoMovil")}
                    label="Teléfono"
                    isFloating={true}
                    type="number"
                    required
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <TextInput
                    {...getFieldProps("email")}
                    label="Correo"
                    isFloating={true}
                    type="text"
                    required
                  />
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
