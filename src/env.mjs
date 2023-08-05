import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({

  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().min(1) : z.string().url(),
    ),
    GMAIL_ADDRESS: z.string(),
    GMAIL_PASSWORD: z.string(),
  },

  client: {
    NEXT_PUBLIC_USER_ICON_BUCKET: z.string(),
    NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET: z.string(),
    NEXT_PUBLIC_ASSETS_BUCKET: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_PROJECT: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_USER_ICON_BUCKET: process.env.NEXT_PUBLIC_USER_ICON_BUCKET,
    NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET: process.env.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET,
    NEXT_PUBLIC_ASSETS_BUCKET: process.env.NEXT_PUBLIC_ASSETS_BUCKET,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PROJECT: process.env.NEXT_PUBLIC_SUPABASE_PROJECT,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    GMAIL_ADDRESS: process.env.GMAIL_ADDRESS,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
