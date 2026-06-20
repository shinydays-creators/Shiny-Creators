# Glow — Guía de configuración inicial

## 1. Instalar dependencias

```bash
cd glow
npm install
```

## 2. Configurar Supabase

### 2a. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) → New project
2. Elige nombre: **glow**, región más cercana, contraseña segura

### 2b. Copiar las claves
1. En tu proyecto Supabase → **Settings → API**
2. Copia:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon / public key** → clave larga

### 2c. Crear el archivo de entorno
```bash
cp .env.local.example .env.local
```
Abre `.env.local` y pega tus valores:
```
NEXT_PUBLIC_SUPABASE_URL=https://TU_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

### 2d. Crear la tabla de perfiles
1. En Supabase → **SQL Editor → New query**
2. Pega el contenido de `supabase-setup.sql`
3. Haz clic en **Run** (▶)

### 2e. Configurar autenticación por email
1. Supabase → **Authentication → Providers → Email**
2. Asegúrate de que **Enable Email provider** está activado
3. En desarrollo puedes desactivar "Confirm email" para ir más rápido.
   En producción déjalo activado.

### 2f. Configurar la URL de redirección
1. Supabase → **Authentication → URL Configuration**
2. **Site URL**: `http://localhost:3000`
3. **Redirect URLs**: añade `http://localhost:3000/auth/callback`

## 3. Arrancar en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## 4. Añadir tus PNGs de la mascota

Coloca tus cuatro archivos en `public/mascot/`:
- `happy.png` — expresión feliz (pantalla de bienvenida, login)
- `excited.png` — expresión emocionada (registro exitoso, dashboard)
- `neutral.png` — expresión neutra
- `sleepy.png` — expresión dormida

El componente `MascotStar` los carga automáticamente. Si no existen, muestra el SVG de reserva.

## 5. Generar iconos PWA (opcional, para producción)

```bash
npm install canvas --save-dev
node scripts/generate-icons.mjs
```

Esto crea `public/icons/icon-192.png`, `icon-512.png` y `apple-touch-icon.png`.

## 6. Desplegar en Vercel

```bash
npx vercel
```

En el panel de Vercel → **Environment Variables**, añade las mismas variables que tienes en `.env.local`. Actualiza también las URLs en Supabase para que apunten a tu dominio de Vercel.

---

## Estructura del proyecto

```
glow/
├── app/
│   ├── page.tsx              ← Pantalla de bienvenida
│   ├── auth/
│   │   ├── login/page.tsx    ← Inicio de sesión
│   │   ├── signup/page.tsx   ← Registro
│   │   └── callback/route.ts ← Confirma email y redirige
│   └── dashboard/page.tsx    ← Dashboard (protegido)
├── components/
│   ├── MascotStar.tsx        ← Mascota estrella (PNG + SVG fallback)
│   ├── LogoutButton.tsx
│   └── ui/Button.tsx
├── lib/supabase/
│   ├── client.ts             ← Cliente para componentes Client
│   └── server.ts             ← Cliente para Server Components
├── middleware.ts              ← Protección de rutas
├── public/
│   ├── manifest.json         ← Config PWA
│   ├── icons/                ← Iconos de la app
│   └── mascot/               ← Pon aquí tus PNGs
└── supabase-setup.sql        ← SQL para Supabase
```
