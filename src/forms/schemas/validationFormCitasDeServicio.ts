// schemas/validationFormCitasDeServicio.ts
import * as Yup from "yup";

export const validationFormCitasDeServicio = [
  //* Paso 0: Datos del vehículo
  //? Preguntar si los restos de los campos de este paso seran obligatorios a pesar de que estos no los son para el API
  Yup.object().shape({
    tipoServicio: Yup.number()
      .required("Por favor, selecciona un tipo de servicio")
      // Si tus IDs de servicio van del 0 al 3, puedes asegurar que no esté vacío
      .min(0, "Selecciona un servicio válido"),
    numeroChasis: Yup.string()
      .required("Número VIN es obligatorio")
      .length(17, "El VIN debe tener exactamente 17 caracteres")
      .matches(
        /^[A-HJ-NPR-Z0-9]{17}$/,
        "El VIN contiene caracteres inválidos (I, O, Q no permitidos)",
      )
      .test(
        "valida-prefijo-vin",
        "El VIN no pertenece a una planta de manufactura válida de la marca",
        (value) => {
          if (!value) return false;
          const validVinPrefixes = ["9BW", "1V2", "WVW", "3VV", "3VW"];
          return validVinPrefixes.some((prefix) =>
            value.toUpperCase().startsWith(prefix),
          );
        },
      ),
    anio: Yup.number().required("Selecciona el año"),
    modelo: Yup.string().required("Selecciona el modelo"),
    kilometrajeAuto: Yup.number()
      .required("Ingresa el kilometraje")
      .min(0, "El kilometraje no puede ser negativo"),
    // kilometrajeServicio: Yup.string().required("Selecciona el servicio"),
    kilometrajeServicio: Yup.string().when("tipoServicio", {
      is: 0,
      then: (schema) => schema.required("Selecciona el servicio que necesitas"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),

  //* Paso 1: Búsqueda de Distribuidores
  Yup.object().shape({
    estado: Yup.string().required("Selecciona un estado"),
    ciudad: Yup.string().required("Selecciona una ciudad"),
    dealer_id: Yup.string().required("Selecciona un distribuidor"),
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

export const globalValidationSchema = validationFormCitasDeServicio.reduce(
  (acc, currentSchema) => acc.concat(currentSchema),
  Yup.object(), // Valor inicial seguro
);
