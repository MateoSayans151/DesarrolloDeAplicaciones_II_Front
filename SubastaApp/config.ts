import Constants from "expo-constants";

const host = Constants.expoConfig?.hostUri?.split(":").shift() ?? "localhost";

export const API_BASE_URL = `http://${host}:8080/api/v1`;
