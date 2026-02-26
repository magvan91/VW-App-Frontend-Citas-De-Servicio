import {
  Container,
  ThemeProvider,
} from "@volkswagen-onehub/components-core";

export const CitasDeServicioApp = () => {
  return (
    <>
      <h1>App Servicio de Citas VW</h1>
      <Container>
        <ThemeProvider variant="v26" theme="main">
        </ThemeProvider>
      </Container>
    </>
  );
};
