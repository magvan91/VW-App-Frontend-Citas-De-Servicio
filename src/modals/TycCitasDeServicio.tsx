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

interface TycCitasDeServicioProps {
  showModal: boolean;
  handleShowTyco: (show: boolean) => void;
}

export const TycCitasDeServicio = ({
  showModal,
  handleShowTyco,
}: TycCitasDeServicioProps) => {
  // 1. SOLUCIÓN CLAVE: Si showModal es false, no renderizamos nada en absoluto.
  // Esto evita que un LayerWrapper vacío bloquee la pantalla.
  if (!showModal) return null;

  const handleBtnCloseModal = (e: React.MouseEvent) => {
    e.preventDefault(); // 2. Evitamos cualquier comportamiento no deseado del botón
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
                [2] La operación que se realiza corresponde únicamente al
                apartado/anticipo de adquisición del vehículo al{" "}
                <strong>Concesionario Volkswagen seleccionado</strong>
                . El vehículo seleccionado está sujeto a la disponibilidad de
                versiones y colores. <br />
                Una vez que el{" "}
                <strong>Concesionario Volkswagen seleccionado</strong> cuente
                con el vehículo, el cliente se obliga a pagar el valor total del
                auto (de contado o utilizando algún tipo de crédito ofrecido) en
                un plazo no mayor a 90 días contados a partir de la fecha en que
                el <strong>Concesionario Volkswagen seleccionado</strong> le
                haya avisado al cliente que cuenta con el vehículo. Una vez que
                el <strong>Concesionario Volkswagen seleccionado</strong> haya
                recibido el monto por concepto de apartado/anticipo, éste último
                podrá generar el comprobante correspondiente en favor del
                cliente. El cliente instruye irrevocablemente al{" "}
                <strong>Concesionario Volkswagen seleccionado</strong> para que
                éste pueda utilizar el monto del apartado/anticipo en pago del
                Vehículo.. No obstante a la recepción del apartado/anticipo, el{" "}
                <strong>Concesionario Volkswagen seleccionado</strong> tendrá la
                facultad de rechazar la venta en cualquier tiempo, obligándose
                éste último a devolver el monto del apartado/anticipo y la
                operación será cancelada. El apartado/anticipo no generará
                rendimiento alguno. <br />
                [3] <strong>Concesionario Volkswagen seleccionado</strong> se
                pondrá en contacto con el cliente para confirmar el
                apartado/anticipo y entregar el comprobante fiscal del mismo,
                vía correo electrónico. Los datos del cliente para la emisión
                del comprobante fiscal serán recabados directamente por el{" "}
                <strong>Concesionario Volkswagen seleccionado</strong>
                .<br />
                [4] Toda vez que los vehículos mostrados en este portal son
                destinados a ser comercializados y utilizados en territorio
                nacional y con el fin de velar por la seguridad de nuestros
                clientes, el{" "}
                <strong>Concesionario Volkswagen seleccionado</strong>, se
                reserva el derecho de abstenerse a realizar la venta cuando
                tenga evidencias y/o indicios que el vehículo será
                comercializado y/o transitado permanentemente en el extranjero.
                Asimismo, y para el caso que de conformidad con la Ley Federal
                para la Prevención e identificación de Operaciones con Recursos
                de Procedencia Ilícita el Concesionario se encuentre impedido
                para realizar la venta, se procederá de conformidad con lo
                establecido en dicho ordenamiento. <br />
                [5] El valor total del vehículo, incluye IVA e ISAN; no incluye
                tenencia vehicular (o similar), pago correspondiente a placas,
                honorarios de gestores, derecho por verificación o cualquier
                otro similar o necesario para que el vehículo circule. <br />
                [6] El vehículo será entregado 90 días naturales posteriores al
                pago total del vehículo o en su caso a los 90 días naturales
                contados a partir de que el crédito se encuentre aprobado.{" "}
                <br />
                [7] El cliente podrá solicitar la cancelación del
                apartado/anticipo en un plazo no mayor a 25 días naturales
                siguientes a la fecha en que el pago del apartado/anticipo haya
                caído en firme y se le devolverá el 100% del monto del
                apartado/anticipo de la misma forma y/o misma tarjeta de la que
                se recibió. El tiempo para la devolución podrá variar debido a
                las políticas internas del banco emisor de la tarjeta de cada
                cliente, por lo que, para conocer el tiempo del mismo, se
                recomienda al cliente contactar a su Institución Bancaria. En
                caso de cancelación, el{" "}
                <strong>Concesionario Volkswagen seleccionado</strong> asimismo
                cancelará el comprobante fiscal que en su caso se haya emitido.{" "}
                <br />
                [8] Una vez que el cliente haya contactado al{" "}
                <strong>Concesionario Volkswagen seleccionado</strong> y
                concluido el proceso con éste, el vehículo será entregado en el
                domicilio del Concesionario autorizado Volkswagen que el cliente
                haya elegido dentro del sitio. <br />
                [9] Toda vez que Volkswagen de México, S.A. de C.V., no recibe
                cantidad de dinero alguna ni es responsable del proceso de
                apartado/anticipo, ni tiene relación jurídica alguna con el
                cliente, cualquier controversia que se llegase a suscitar por
                dicha operación, deberá ser resuelta entre el cliente y el
                Concesionario Volkswagen seleccionado.
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
