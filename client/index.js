import config from "./src/config/config";

document.getElementById("title").innerText = config.groupName;

document.documentElement.style.setProperty('--primary-100', config.primary100);
document.documentElement.style.setProperty('--primary-200', config.primary200);
document.documentElement.style.setProperty('--primary-300', config.primary300);
document.documentElement.style.setProperty('--secondary', config.secondary);