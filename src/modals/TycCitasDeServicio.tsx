import React from "react";
import {
  CTA,
  Text,
  TokenTextAppearance,
  LayerWrapper,
  ShimLayer,
  FocusLayer,
  TokenTextColor,
} from "@volkswagen-onehub/components-core";

// 1. Definir la interfaz de las propiedades
interface TycCitasDeServicioProps {
  showModal: boolean;
  handleShowTyco: (show: boolean) => void;
}

// 2. Destructurar las propiedades usando llaves {}
export const TycCitasDeServicio = ({
  showModal,
  handleShowTyco,
}: TycCitasDeServicioProps) => {
  // 3. Early return: Si es false, no renderiza el DOM del modal ni sus capas
  if (!showModal) return null;

  const handleBtnCloseModal = (e: React.MouseEvent) => {
    e.preventDefault();
    handleShowTyco(false);
  };

  return (
    <LayerWrapper contentCentered>
      <ShimLayer />
      <FocusLayer active size="A">
        <div className="container pt-5">
          <div className="row px-2">
            <div className="col-12 text-center py-3">
              <Text appearance={TokenTextAppearance.headline200} bold>
                TÉRMINOS Y CONDICIONES “APARTADO”
              </Text>
            </div>
            <div className="col-12">
              <Text
                color={TokenTextColor.primary}
                appearance={TokenTextAppearance.headline100}
              >
                [1] El Apartado/anticipo se entenderá la cantidad de dinero que
                el cliente entrega al Concesionario Volkswagen seleccionado para
                la posterior adquisición y pago del vehículo marca Volkswagen
                seleccionado; las especificaciones, colores e información
                técnica de los autos pueden consultarse en{" "}
                <a
                  href="https://www.vw.com.mx/"
                  target="_blank"
                  rel="noreferrer"
                >
                  www.vw.com.mx{" "}
                </a>{" "}
                directamente en su Concesionario autorizado Volkswagen. <br />
                {/* ... Resto de tus textos legales ... */}
              </Text>
            </div>
            <div className="col-12 text-center pt-3 pb-5">
              <CTA
                onClick={handleBtnCloseModal}
                tag="button"
                type="button"
                emphasis="primary"
              >
                Cerrar
              </CTA>
            </div>
          </div>
        </div>
      </FocusLayer>
    </LayerWrapper>
  );
};
