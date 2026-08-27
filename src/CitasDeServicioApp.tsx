import { ThemeProvider } from "@volkswagen-onehub/components-core";
import { PageFormCitasDeServicio } from "./pages/PageFormCitasDeServicio";

export const CitasDeServicioApp = () => {
  return (
    <>
      <ThemeProvider theme={"main"}>
        <PageFormCitasDeServicio />
      </ThemeProvider>
    </>
  );
};
