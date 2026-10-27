# Converso

Plataforma de aprendizaje con tutores IA por **voz en tiempo real**. Los usuarios crean *companions* (materia, tema, voz y estilo) y practican en sesiones conversacionales integradas con [Vapi](https://vapi.ai).

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Clerk · Supabase · Vapi (GPT-4, Deepgram, ElevenLabs)

---

## Requisitos

- Node.js 20+
- Cuentas gratuitas/de desarrollo en [Clerk](https://clerk.com), [Supabase](https://supabase.com) y [Vapi](https://vapi.ai)
- En Vapi, credenciales configuradas para **OpenAI**, **Deepgram** y **ElevenLabs** (el asistente se define en código)

---

## Puesta en marcha local

### 1. Clonar e instalar

```bash
git clone <tu-repo>
cd saas-next
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Rellena `.env.local` con las claves de cada servicio (ver comentarios en `.env.example`).

### 3. Clerk

1. Crea una aplicación en [Clerk Dashboard](https://dashboard.clerk.com).
2. Copia **Publishable key** y **Secret key** a `.env.local`.
3. En **Configure → Paths**, deja sign-in en `/sign-in` (ya incluido en el repo).

### 4. Supabase + Clerk (obligatorio para crear companions e historial)

1. Crea un proyecto en [Supabase](https://supabase.com).
2. **Project Settings → API:** copia la URL y la clave **publishable/anon** a `.env.local`.
3. Conecta Clerk y Supabase siguiendo la guía oficial:  
   [Clerk — Supabase integration](https://clerk.com/docs/integrations/databases/supabase)  
   (activa la integración en ambos dashboards; debe existir el JWT template **`supabase`**).
4. En Supabase **SQL Editor**, ejecuta el contenido de [`supabase/schema.sql`](./supabase/schema.sql).

### 5. Vapi

1. En [Vapi Dashboard](https://dashboard.vapi.ai), crea una **Public API key**.
2. Pégala en `NEXT_PUBLIC_VAPI_WEB_TOKEN`.
3. Asegúrate de tener proveedores (OpenAI, Deepgram, 11labs) configurados en tu cuenta Vapi.

### 6. Arrancar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Probar el flujo completo

1. **Sign in** (Clerk) desde la navbar.
2. **Build a new companion** (home → CTA o `/companions/new`): rellena el formulario y guarda.
3. Entrarás en **`/companions/[id]`** → **Start Session** (micrófono del navegador; HTTPS no es necesario en localhost).
4. Al terminar la llamada, la sesión se guarda en `session_history` y puede aparecer en **Recently completed sessions** en la home.
5. Explora **`/companions`**: búsqueda y filtro por materia vía query params.

La página **`/subscription`** muestra el componente de precios de Clerk (`PricingTable`); configúralo en Clerk Billing si quieres probar planes (opcional para desarrollo).

---

## Scripts

| Comando        | Descripción              |
|----------------|--------------------------|
| `npm run dev`  | Servidor de desarrollo   |
| `npm run build`| Build de producción      |
| `npm run start`| Servir build             |
| `npm run lint` | ESLint                   |

---

## Estructura relevante

| Ruta / archivo | Rol |
|----------------|-----|
| `app/companions/` | Biblioteca, creación y sesión de voz |
| `lib/actions/companion.actions.ts` | Server Actions → Supabase |
| `lib/supabase.ts` | Cliente Supabase con JWT de Clerk |
| `lib/utils.ts` | Configuración del asistente Vapi |
| `components/CompanionComponent.tsx` | UI de llamada y transcripción |
| `supabase/schema.sql` | Tablas y políticas RLS |

---

## Problemas frecuentes

| Síntoma | Qué revisar |
|---------|-------------|
| Error al crear companion | Integración Clerk–Supabase y template JWT `supabase`; políticas RLS en `schema.sql` |
| `Missing Supabase env vars` | `.env.local` y reiniciar `npm run dev` |
| La llamada Vapi no conecta | `NEXT_PUBLIC_VAPI_WEB_TOKEN`, micrófono permitido, proveedores en Vapi |
| Home sin companions | Normal si la BD está vacía; crea uno tras iniciar sesión |

---

## Licencia

Proyecto de portfolio / aprendizaje. Ajusta la licencia según prefieras.
