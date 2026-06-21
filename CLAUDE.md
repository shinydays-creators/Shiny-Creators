# Shiny Creators — Estado del proyecto

## ¿Qué es esta app?
PWA para content creators en YouTube, TikTok e Instagram. Ayuda a mantener constancia, aprender y crecer como creador. Nombre: **Shiny Creators**.

## Stack técnico
- **Framework**: Next.js 15 App Router + TypeScript
- **Estilos**: Tailwind CSS con colores custom (glow-gold, glow-pink, glow-cream)
- **Base de datos y auth**: Supabase (email/password login, RLS, Server Actions)
- **Despliegue**: Vercel (cuenta: infoshinydays-3475, equipo: shiny-creators)
- **Node.js**: Gestionado con NVM — SIEMPRE ejecutar `source ~/.nvm/nvm.sh` antes de usar node/npm/vercel en terminal

## Credenciales importantes
- Supabase URL: `https://qurxuefvoiattujmbnab.supabase.co`
- Clave anon: en `.env.local` (nunca subir a GitHub)
- Las variables de entorno YA están añadidas al proyecto en Vercel

## Estructura de rutas
| Ruta | Descripción |
|------|-------------|
| `/` | Landing page |
| `/auth/login` | Login / registro con email |
| `/onboarding` | Preguntas iniciales (plataforma, seguidores, retos...) |
| `/home` | Home con racha diaria (StreakTracker) |
| `/aprender` | Biblioteca de contenido (gratis/pago) |
| `/perfil` | Perfil del usuario con datos del onboarding |

## Base de datos (Supabase)
Tablas principales:
- `profiles` — datos de cada usuario (onboarding_done, platform, followers, etc.)
- `daily_logs` — registro diario para calcular la racha
- `content_items` — biblioteca de contenido

Nota importante: el trigger `on_auth_user_created` que crea el perfil automáticamente **no estaba configurado**. Se resolvió con SQL manual y usando **Server Actions** para guardar el onboarding (no client-side).

## Componentes clave
- `components/ShinyTitle.tsx` — Logo "Shiny Creators" con ı sin punto + ✦ estrella dorada
- `components/MascotStar.tsx` — Estrella mascota PNG con fondo difuminado (mask-image CSS)
- `components/BottomNav.tsx` — Navegación inferior: Inicio / Aprender / Perfil
- `components/StreakTracker.tsx` — Racha de días consecutivos
- `app/onboarding/actions.ts` — Server Action para guardar el onboarding en Supabase

## Lo que está completado ✅
- Landing page con mascota y botón de inicio
- Auth: registro y login por email (magic link desactivado)
- Onboarding completo: plataforma, seguidores, edición, retos, razones, nicho, metas
- Home con racha diaria
- Perfil con todos los datos del onboarding en tarjetas bonitas
- Biblioteca Aprender (estructura base, gratis vs pago)
- PWA (manifest.json, instalable en móvil)
- Fix TypeScript en PerfilClient.tsx (cast `as Record<string, string>`)
- Variables de entorno añadidas a Vercel

## Pendiente para próximas sesiones 🔜

### Prioritario
- **Completar despliegue en Vercel**: el último intento se interrumpió. Ejecutar:
  ```
  source ~/.nvm/nvm.sh && cd ~/glow && vercel --prod
  ```
  Luego abrir la URL en el móvil e instalar como PWA.

### Mejoras planificadas
- Perfeccionar sección **Aprender**: añadir más contenido, videos, categorías
- Sistema de **notificaciones** para recordar publicar
- Añadir soporte a más plataformas (Pinterest ya está en la lista)
- Posible **app nativa** en el futuro (React Native o capacitor)

## Cómo arrancar en local
```bash
source ~/.nvm/nvm.sh
cd ~/glow
npm run dev
```
Luego abrir: http://localhost:3000

## Cómo desplegar a Vercel
```bash
source ~/.nvm/nvm.sh
cd ~/glow
vercel --prod
```

## Notas importantes
- GitHub no funciona (el keychain de macOS bloquea el push). El código se despliega directamente desde Vercel CLI.
- El correo de "deployment attempted" que llega de Vercel es **normal** — es una notificación de seguridad automática, no un error.
- `.env.local` está en `.gitignore` — nunca se sube. Las claves están en Vercel dashboard.
