const config = {
    requestBaseUrl: String(import.meta.env.VITE_REQUEST_BASE_URL),
    poductionUrl: String(import.meta.env.VITE_PRODUCTION_URL),
    groupName: String(import.meta.env.VITE_GROUP_NAME),
}

export default config;