declare global {
  interface Window {
    APP_ENVIRONMENT?: string;
  }
}

class AppConfig {
  private environments = {
    development: {
      apiBaseUrl: "https://kr5dntm011.execute-api.us-west-2.amazonaws.com/dev/",
      name: "development",
      debug: true,
    },
    production: {
      apiBaseUrl: "https://v1.apartatuvw.com.mx/",
      name: "production",
      debug: false,
    },
    qa: {
      apiBaseUrl: "https://qa.apartatuvw.com.mx/",
      name: "qa",
      debug: true,
    },
  };

  private currentEnv: string;

  constructor() {
    this.currentEnv = this.detectEnvironment();
  }

  private detectEnvironment(): string {
    // Método 1: Por URL
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "localhost:5173") {
      return "development";
    }

    // Map staging hostnames to the 'qa' environment (defined in environments)
    if (hostname.includes("staging.") || hostname.includes("author-")) {
      return "qa";
    }

    // Método 2: Por parámetro en la URL (útil para testing)
    const params = new URLSearchParams(window.location.search);
    const envParam = params.get("env");
    if (
      envParam &&
      this.environments[envParam as keyof typeof this.environments]
    ) {
      return envParam;
    }

    // Método 3: Variable global (puedes setearla en index.html)
    if (window.APP_ENVIRONMENT) {
      return window.APP_ENVIRONMENT;
    }

    // Por defecto: producción
    return "production";
  }

  public getConfig() {
    return this.environments[this.currentEnv as keyof typeof this.environments];
  }

  public getCurrentEnvironment() {
    return this.currentEnv;
  }

  // Método para forzar un ambiente (útil para testing)
  public setEnvironment(env: string) {
    if (this.environments[env as keyof typeof this.environments]) {
      this.currentEnv = env;
    } else {
      console.warn(`Ambiente "${env}" no válido. Usando: ${this.currentEnv}`);
    }
  }
}

// Instancia singleton
export const appConfig = new AppConfig();
export const config = appConfig.getConfig();
