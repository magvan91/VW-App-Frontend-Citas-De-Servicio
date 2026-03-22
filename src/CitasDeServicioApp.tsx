import { ThemeProvider } from "@volkswagen-onehub/components-core";
import { PageMultiStepForm } from "./pages/PageMultiStepForm";

export const CitasDeServicioApp = () => {
  return (
    <>
      <ThemeProvider variant="v26" theme="main">
        <PageMultiStepForm />
      </ThemeProvider>
    </>
  );
};
