import {
  Text,
  TokenTextAppearance,
  TokenTextColor,
  TextTag,
} from "@volkswagen-onehub/components-core";
import type { SummaryData } from "../interfaces/SummaryData.interface";

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
      <div className="row">
        {/* COLUMNA IZQUIERDA: Saludo y Confirmación */}
        <div className="col-12 col-md-6">
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
            <Text
              appearance={TokenTextAppearance.bigcopy100}
              className="d-block"
            >
              Agradecemos tu preferencia. <br></br> Muy pronto uno de nuestros
              asesores se pondrá en contacto contigo para la confirmación del
              horario solicitado.
            </Text>
          </div>

          <div className="mt-5">
            <Text
              appearance={TokenTextAppearance.bigcopy100}
              color={TokenTextColor.tertiary}
            >
              La confirmación de tu cita fue enviada a:
            </Text>
            <Text
              appearance={TokenTextAppearance.bigcopy100}
              bold
              className="d-block"
            >
              {data.email}
            </Text>
          </div>
        </div>

        {/* COLUMNA DERECHA: Detalles Técnicos y Comentarios */}
        <div className="col-6 col-md-6">
          {/* Row para las dos columnas internas */}
          <div className="row">
            <div className="col-12 ">
              <Text
                appearance={TokenTextAppearance.headline400}
                bold
                color={TokenTextColor.primary}
              >
                Servicio de mantenimiento
              </Text>
            </div>
          </div>

          <div className="row mt-3">
            {/* Columna Interna 1 */}
            <div className="col-12 col-sm-6 mb-4">
              <div className="d-flex flex-column gap-3">
                <div>
                  <Text appearance={TokenTextAppearance.bigcopy100}>
                    {data.modelo}
                  </Text>
                </div>
                <div>
                  <Text appearance={TokenTextAppearance.bigcopy100}>
                    {data.anio}
                  </Text>
                </div>
                <div>
                  <Text appearance={TokenTextAppearance.bigcopy100}>
                    {data.kilometrajeServicio}
                  </Text>
                </div>
              </div>
            </div>

            {/* Columna Interna 2 */}
            <div className="col-12 col-sm-6 mb-4">
              <div className="d-flex flex-column gap-3">
                {/* Espaciador para alinear con el título de la col 1 */}
                <div>
                  <Text appearance={TokenTextAppearance.bigcopy100}>
                    VIN {data.numeroChasis}
                  </Text>
                </div>
                <div>
                  <Text appearance={TokenTextAppearance.bigcopy100}>
                    {data.kilometrajeAuto} km
                  </Text>
                </div>
                <div>
                  <Text appearance={TokenTextAppearance.bigcopy100}>
                    {data.fecha}
                    {data.horario} hrs
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Row para Información Adicional debajo de las internas */}
          {data.comentarios && (
            <div className="row mt-2">
              <div className="col-12">
                <div className="pt-3 border-top">
                  <Text
                    appearance={TokenTextAppearance.headline200}
                    bold
                    className="d-block mb-2"
                  >
                    Información adicional
                  </Text>
                  <Text appearance={TokenTextAppearance.bigcopy100}>
                    {data.comentarios}
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
