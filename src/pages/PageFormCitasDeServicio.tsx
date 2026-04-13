import {
  Text,
  TextAlignment,
  TextTag,
  TokenTextAppearance,
  TokenTextColor,
} from "@volkswagen-onehub/components-core";
import { FormCitasDeServicio } from "../forms/FormCitasDeServicio";

export const PageFormCitasDeServicio = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Text
            bold
            tag={TextTag.h1}
            appearance={TokenTextAppearance.headline600}
            textAlign={TextAlignment.center}
          >
            Citas de Servicio
          </Text>
        </div>
        <div className="col-12 pb-4">
          <Text
            appearance={TokenTextAppearance.bigcopy200}
            color={TokenTextColor.tertiary}
            tag={TextTag.h2}
            textAlign={TextAlignment.center}
          >
            Elige tu modelo y en breve nos comunicaremos contigo.
          </Text>
        </div>
        <div className="col-12">
          <FormCitasDeServicio />
        </div>
      </div>
    </div>
  );
};