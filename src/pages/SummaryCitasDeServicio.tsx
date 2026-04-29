import {
  Text,
  TokenTextAppearance,
  TokenTextColor,
  TextTag,
  TextAlignment,
} from "@volkswagen-onehub/components-core";
import type { SummaryData } from "../interfaces/SummaryData.interface";
import checkProfesional from "../assets/images/check-profesional.png";

interface SummaryCitasDeServicioProps {
  showSummary: boolean;
  data: SummaryData;
}

export const SummaryCitasDeServicio = ({
  showSummary,
  data,
}: SummaryCitasDeServicioProps) => {
  if (!showSummary) return null;

  return (
    <div className="container pt-5 pb-5">
      {/* CONTENEDOR PRINCIPAL: 
        - shadow-lg: Sombra grande
        - bg-white: Fondo blanco indispensable para que la sombra se vea bien
        - rounded: Bordes redondeados
        - overflow='hidden': Evita que la imagen inferior rompa las esquinas redondeadas
      */}
      <div
        className="mx-auto shadow-lg bg-white rounded"
        style={{ maxWidth: 800, overflow: "hidden" }}
      >
        {/* CONTENEDOR DE TEXTOS CON PADDING (Para que el texto no se pegue a la sombra) */}
        <div className="p-4 p-md-5">
          <div className="row">
            {/* COLUMNA IZQUIERDA: Saludo y Confirmación */}
            <div className="col-12 col-md-6 mb-5 mb-md-0">
              <div className="mb-4">
                <Text
                  appearance={TokenTextAppearance.headline200}
                  color={TokenTextColor.tertiary}
                >
                  Apreciable
                </Text>
                <Text
                  appearance={TokenTextAppearance.headline200}
                  tag={TextTag.h1}
                  bold
                  className="d-block"
                >
                  {data.nombre} {data.apePat} {data.apeMat}
                </Text>
              </div>

              <div className="mb-4">
                <Text className="d-block">
                  Agradecemos tu preferencia. <br /> Muy pronto uno de nuestros
                  asesores se pondrá en contacto contigo para la confirmación
                  del horario solicitado.
                </Text>
              </div>

              <div className="mt-5">
                <Text color={TokenTextColor.tertiary} className="d-block">
                  La confirmación de tu cita fue enviada a:
                </Text>
                <Text bold className="d-block">
                  {data.email}
                </Text>
              </div>
            </div>

            {/* COLUMNA DERECHA: Detalles Técnicos */}
            <div className="col-12 col-md-6 border-start">
              <div className="row mb-3">
                <div className="col-12">
                  <Text
                    appearance={TokenTextAppearance.headline200}
                    bold
                    color={TokenTextColor.primary}
                    textAlign={TextAlignment.center}
                  >
                    Servicio de mantenimiento
                  </Text>
                </div>
              </div>

              <div className="row">
                {/* Columna Interna 1 */}
                <div className="col-12 col-sm-6 mb-4">
                  <div className="d-flex flex-column gap-3">
                    <Text appearance={TokenTextAppearance.copy100}>
                      {data.modelo}
                    </Text>
                    <Text appearance={TokenTextAppearance.copy100}>
                      {data.anio}
                    </Text>
                    <Text appearance={TokenTextAppearance.copy100}>
                      {data.kilometrajeServicio}
                    </Text>
                  </div>
                </div>

                {/* Columna Interna 2 */}
                <div className="col-12 col-sm-6 mb-4">
                  <div className="d-flex flex-column gap-3">
                    <Text appearance={TokenTextAppearance.copy100}>
                      VIN:{data.numeroChasis}
                    </Text>
                    <Text appearance={TokenTextAppearance.copy100}>
                      {data.kilometrajeAuto} km
                    </Text>
                    <Text appearance={TokenTextAppearance.copy100}>
                      {data.fecha} <br /> {data.horario}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Row para Información Adicional */}
              {data.comentarios && (
                <div className="row mt-2">
                  <div className="col-12">
                    <div className="pt-3">
                      <Text
                        appearance={TokenTextAppearance.headline200}
                        bold
                        className="d-block mb-2"
                      >
                        Información adicional
                      </Text>
                      <Text appearance={TokenTextAppearance.copy100}>
                        {data.comentarios}
                      </Text>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* IMAGEN:
          Se saca del div con padding para que abarque el 100% de la caja blanca.
          Se eliminan los márgenes negativos.
        */}
        <img
          src={checkProfesional}
          alt="Confirmación"
          className="w-100"
          style={{
            objectFit: "cover",
            display: "block",
            // Ajusta la altura máxima si la imagen es muy alta
            maxHeight: "300px",
          }}
        />
      </div>
    </div>
  );
};
