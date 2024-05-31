const config = {
    requestBaseUrl: String(import.meta.env.VITE_REQUEST_BASE_URL),
    poductionUrl: String(import.meta.env.VITE_PRODUCTION_URL),
    groupName: String(import.meta.env.VITE_GROUP_NAME),
    primary100: String(import.meta.env.VITE_PRIMARY_100),
    primary200: String(import.meta.env.VITE_PRIMARY_200),
    primary300: String(import.meta.env.VITE_PRIMARY_300),
    secondary: String(import.meta.env.VITE_SECONDARY),
}

export default config;