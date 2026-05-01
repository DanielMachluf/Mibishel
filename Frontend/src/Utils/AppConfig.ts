class AppConfig {
    public readonly serverUrl = "http://localhost:4000";
    public readonly apiUrl = `${this.serverUrl}/api`;
}

export const appConfig = new AppConfig(); // Singleton
