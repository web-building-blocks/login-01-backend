# Backend Setup Guide: login-backend Project (Express + Supabase OAuth JWT)

## 🎯 Objective

Build a backend service that:
- Handles user signup, login, and password reset using Supabase Auth
- Uses Supabase-issued JWT tokens (no manual JWT signing needed)
- Supports Google OAuth and email/password authentication
- Communicates with a separate frontend (e.g., Next.js) via REST API

---

## 🛠️ Step-by-Step Setup

### 1. Create Project in IntelliJ IDEA

1. Open IntelliJ IDEA → File > New > Project
2. Choose Node.js (or Empty Project)
3. Set path
4. Open Terminal in project root:

```bash
pnpm init
pnpm add express cors dotenv @supabase/supabase-js
pnpm add -D typescript ts-node nodemon @types/node @types/express @types/cors
```

---

## 2. Project Structure

```
login-backend/
├── src/
│   ├── supabase/
│   │   └── client.ts          # Supabase client setup
│   ├── routes/
│   │   └── auth.ts            # Auth routes: login, signup, reset-password
│   └── server.ts              # Entry point: mounts routes and starts server
├── .env                       # Supabase environment variables
├── package.json
├── tsconfig.json
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

---

## 3. Supabase Configuration

### .env file

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

> Get these from https://supabase.com under Project Settings → API

### src/supabase/client.ts

```ts
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
```

---

## 4. Backend Logic Overview

### ✅ Signup (`/auth/signup`)
- Receives `{ email, password }`
- Calls `supabase.auth.signUp()`
- Returns success message

### ✅ Login (`/auth/login`)
- Receives `{ email, password }`
- Calls `supabase.auth.signInWithPassword()`
- Returns the access token from Supabase

### ✅ Get User (`/auth/user`)
- Extracts token from `Authorization: Bearer <token>` header
- Calls `supabase.auth.getUser(token)` to retrieve user info

### ✅ Reset Password (`/auth/reset-password`)
- Receives `{ email }`
- Calls `supabase.auth.resetPasswordForEmail()` with a redirect to:
  ```
  http://localhost:3000/update-password
  ```

---

## 5. Server Entry (server.ts)

```ts
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
```

---

## 6. Scripts (in package.json)

```json
"scripts": {
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

## 🔗 Supabase Redirect URLs

Make sure you configure these in Supabase project settings:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**:
  - `http://localhost:3000/dashboard`
  - `http://localhost:3000/update-password`

This ensures OAuth and password reset redirections work properly.

---

## ✅ Summary

- You're using **Supabase's built-in JWTs**, so you **do not need `jsonwebtoken`** or `JWT_SECRET`
- All authentication is managed by Supabase securely
- You only need to verify and forward tokens between frontend/backend

Enjoy your lightweight Supabase-powered backend! 🎉
