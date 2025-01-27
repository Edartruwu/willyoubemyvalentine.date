// DB env vars

const db_user = process.env.DB_USER;
if (!db_user) {
  throw new Error("Environment variable DB_USER is not set");
}
export const DB_USER: string = db_user;

const db_password = process.env.DB_PASSWORD;
if (!db_password) {
  throw new Error("Environment variable DB_PASSWORD is not set");
}
export const DB_PASSWORD: string = db_password;

const db_host = process.env.DB_HOST;
if (!db_host) {
  throw new Error("Environment variable DB_HOST is not set");
}
export const DB_HOST: string = db_host;

const db_port = process.env.DB_PORT;
if (!db_port) {
  throw new Error("Environment variable DB_PORT is not set");
}
export const DB_PORT: number = parseInt(db_port, 10);

const db_name = process.env.DB_NAME;
if (!db_name) {
  throw new Error("Environment variable DB_NAME is not set");
}
export const DB_NAME: string = db_name;

const google_client_id = process.env.GOOGLE_CLIENT_ID;
if (!google_client_id) {
  throw new Error("Environment variable GOOGLE_CLIENT_ID is not set");
}

// auth env vars

export const GOOGLE_CLIENT_ID: string = google_client_id;

const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
if (!google_client_secret) {
  throw new Error("Environment variable GOOGLE_CLIENT_ID is not set");
}
export const GOOGLE_CLIENT_SECRET: string = google_client_secret;

// misc vars

function getPublicUrl(): string {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }
  throw new Error("NEXT_PUBLIC_URL is not set in the production environment.");
}

export const PUBLIC_URL: string = getPublicUrl();
