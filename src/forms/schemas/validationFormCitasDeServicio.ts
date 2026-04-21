// schemas/validationFormCitasDeServicio.ts
import * as Yup from "yup";

export const validationFormCitasDeServicio = [
  //* Paso 0: Datos del vehículo
  //? Preguntar si los restos de los campos de este paso seran obligatorios a pesar de que estos no los son para el API
  Yup.object().shape({
    numeroChasis: Yup.string()
      .required("Número VIN es obligatorio")
      .length(17, "El VIN debe tener 17 caracteres")
      .matches(/^[A-HJ-NPR-Z0-9]{17}$/, "VIN inválido")
      .min(3, "Deben ser mínimo 3 caracteres"),
    // anio: Yup.string().required("Selecciona el año"),
    // modelo: Yup.string().required("Selecciona el modelo"),
    // kilometrajeAuto: Yup.number().required("Ingresa el kilometraje"),
    // kilometrajeServicio: Yup.string().required("Selecciona el servicio"),
    // kilometrajeServicio: Yup.string().when("tipoServicio", {
    //   is: 0,
    //   then: (schema) => schema.required("Selecciona el servicio que necesitas"),
    //   otherwise: (schema) => schema.notRequired(),
    // }),
  }),

  //* Paso 1: Búsqueda de Distribuidores
  Yup.object().shape({
    estado: Yup.string().required("Selecciona un estado"),
    ciudad: Yup.string().required("Selecciona una ciudad"),
    idConcesionario: Yup.string().required("Selecciona un distribuidor"),
    horario: Yup.string()
      .required("Selecciona un horario")
      .matches(
        /^\d{4}-\d{2}-\d{2}\/\d{2}:\d{2}$/,
        "El formato de selección es inválido",
      ),
  }),

  //* Paso 2: Tus datos de contacto
  Yup.object().shape({
    nombre: Yup.string()
      .required("Nombre obligatorio")
      .matches(
        /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ\s]+$/,
        "El nombre solo puede contener letras y espacios",
      )
      .min(3, "Deben ser mínimo 3 caracteres"),
    apePat: Yup.string()
      .required("El apellido apellido paterno")
      .matches(
        /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ\s]+$/,
        "El apellido paterno solo puede contener letras y espacios",
      )
      .min(3, "Deben ser mínimo 3 caracteres"),
    apeMat: Yup.string()
      .required("El apellido materno es obligatorio")
      .matches(
        /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ\s]+$/,
        "El apellido materno solo puede contener letras y espacios",
      )
      .min(3, "Deben ser mínimo 3 caracteres"),
    telefonoMovil: Yup.string()
      .required("Teléfono es obligatorio")
      .matches(/^\d{10}$/, "Sólo números (10 digitos)"),
    email: Yup.string()
      .email("Proporciona una dirección de correo valida")
      .required("El correo es obligatorio"),
  }),

  //* Paso 3 Comentarios y TyCos
  Yup.object().shape({
    aceptaAviso: Yup.boolean().oneOf(
      [true],
      "Debes aceptar el aviso de privacidad",
    ),
    opt_in_transferencia_datos: Yup.boolean().oneOf(
      [true],
      "Debes aceptar la transferencia",
    ),
    tyco: Yup.boolean().oneOf(
      [true],
      "Debes aceptar los términos y condiciones",
    ),
  }),
];
