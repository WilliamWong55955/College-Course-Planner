import { drizzle } from "drizzle-orm/vercel-postgres";
import {sql} from "@vercel/postgres";
import * as schema from "./schema";
//import { drizzle } from "drizzle-orm/postgres-js";
//import postgres from "postgres";
//import { env } from "~/env";


//exportimport { vercel } from "@t3-oss/env-nextjs/presets";
export const db = drizzle(sql, { schema });