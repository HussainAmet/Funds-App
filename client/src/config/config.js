const config = {
    requestBaseUrl: String(import.meta.env.VITE_REQUEST_BASE_URL),
    poductionUrl: String(import.meta.env.VITE_PRODUCTION_URL),
    groupName: String(import.meta.env.VITE_GROUP_NAME),
    primary100: String(import.meta.env.VITE_PRIMARY_100),
    primary200: String(import.meta.env.VITE_PRIMARY_200),
    primary300: String(import.meta.env.VITE_PRIMARY_300),
    secondary: String(import.meta.env.VITE_SECONDARY),
    apiKey: String(import.meta.env.VITE_API_KEY),
    authDomain: String(import.meta.env.VITE_AUTH_DOMAIN),
    projectId: String(import.meta.env.VITE_PROJECT_ID),
    storageBucket: String(import.meta.env.VITE_STORAGE_BUCKET),
    messagingSenderId: String(import.meta.env.VITE_MESSAGING_SENDER_ID),
    appId: String(import.meta.env.VITE_APP_ID),
    measurementId: String(import.meta.env.VITE_MEASUREMENT_ID),
}

export default config;