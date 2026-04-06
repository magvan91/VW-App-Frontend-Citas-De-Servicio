import * as Yup from "yup";

export const validationFormCitasDeServicio = Yup.object({
  numeroChasis: Yup.string()
    .required("Número VIN es obligatorio")
    .length(17, "El VIN debe tener 17 caracteres")
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/, "VIN inválido")
    .min(3, "Deben ser mínimo 3 caracteres"),
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
  email: Yup.string()
    .email("Proporciona una dirección de correo valida")
    .required("El correo es obligatorio"),
  telefonoMovil: Yup.string()
    .required("Teléfono es obligatorio")
    .matches(/^\d{10}$/, "Sólo números (10 digitos)"),
  estado: Yup.string().required("Selecciona un estado"),
  ciudad: Yup.string().required("Selecciona una ciudad"),
  idConcesionario: Yup.string().required("Selecciona un distribuidor"),
  horario: Yup.string().required("Selecciona un horario"),
  aceptaAviso: Yup.boolean().oneOf(
    [true],
    "Debes aceptar el Aviso de Privacidad",
  ),
  opt_in_transferencia_datos: Yup.boolean().oneOf(
    [true],
    "Debes aceptar la transferencia de datos al concesionario",
  ),
  tyco: Yup.boolean().oneOf(
    [true],
    "Debes aceptar los términos y condiciones del Apartado",
  ),
});
