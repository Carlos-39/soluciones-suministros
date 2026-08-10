# Catálogo de diseños — Guía de configuración (Supabase)

El catálogo funciona en **modo demo** (imágenes de ejemplo) hasta que conectes
Supabase. Sigue estos pasos **una sola vez** para activarlo de verdad. Es gratis.

---

## 1. Crear el proyecto en Supabase

1. Entra a <https://supabase.com> → **Start your project** → inicia sesión con GitHub o correo.
2. **New project**. Ponle un nombre (ej. `soluciones-suministros`), elige una
   contraseña de base de datos (guárdala) y la región más cercana (South America / São Paulo).
3. Espera ~2 minutos a que quede listo.

## 2. Crear el "bucket" de imágenes

1. Menú izquierdo → **Storage** → **New bucket**.
2. Nombre exacto: **`catalogo`** (en minúscula, sin tilde).
3. Marca la opción **Public bucket** (para que las fotos se vean en la web). → **Save**.

## 3. Permisos (políticas)

Menú izquierdo → **SQL Editor** → **New query**, pega esto y dale **Run**:

```sql
-- Cualquiera puede VER y LISTAR las fotos del catálogo
create policy "catalogo lectura publica"
on storage.objects for select
to public
using ( bucket_id = 'catalogo' );

-- Solo usuarios con sesión pueden SUBIR / BORRAR
create policy "catalogo escritura admin"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'catalogo' );

create policy "catalogo borrar admin"
on storage.objects for delete
to authenticated
using ( bucket_id = 'catalogo' );
```

## 4. Crear el usuario de la dueña

1. Menú izquierdo → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Escribe su **correo** y una **contraseña** (esta será la clave del panel `/admin`).
3. Activa **Auto Confirm User** para que pueda entrar de una. → **Create user**.

> Opcional: en **Authentication → Providers → Email**, desactiva "Enable signups"
> para que nadie más pueda registrarse.

## 5. Conectar las llaves (el sitio está en Vercel)

1. En Supabase: menú izquierdo → **Project Settings** (engranaje) → **API**.
   Copia **Project URL** y la llave **anon public**.
2. Para **desarrollo local**, pégalas en `.env.local` (ya tiene los campos vacíos):

   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi....(la llave anon public)
   ```

3. Para **producción**, en Vercel: **Project → Settings → Environment Variables**,
   agrega esas dos mismas variables (mismo nombre, mismo valor):

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://xxxxxxxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi....` |

> La llave `anon public` es segura de exponer: está limitada por las políticas del paso 3.
> **No** uses la llave `service_role` aquí.

## 6. Publicar

En Vercel el despliegue es automático: al hacer **push** a la rama principal,
Vercel compila (`vite build`) y publica solo. Después de agregar las variables del
paso 5, entra a Vercel → **Deployments** → **Redeploy** para que tomen efecto.

- La página del catálogo queda en tu dominio (sección **Catálogo** del menú).
- El panel queda en **`tudominio.com/admin`** (la URL limpia la da `vercel.json`).

---

## Cómo lo usa la dueña (instrucciones para ella)

1. Entra a **tudominio.com/admin** desde el celular o el computador.
2. Escribe su **correo y contraseña**.
3. Toca **"elegir fotos"**, selecciona una o varias imágenes (opcional: escribe un
   nombre como "Camiseta full print floral").
4. Se suben solas y **aparecen en la página al instante**.
5. Para quitar una foto, toca el botón de la **papelera** sobre la imagen.

Las fotos se comprimen automáticamente antes de subir, así cargan rápido en celular.

---

## Notas técnicas

- **Modo demo:** si `.env.local` no tiene las llaves, o si el bucket está vacío, la
  web muestra imágenes de ejemplo con los colores de marca. No queda "roto" nunca.
- **Título del diseño:** se guarda dentro del nombre del archivo
  (`<fecha>__<titulo>.jpg`), así que no hace falta base de datos.
- **Plan gratis de Supabase:** 1 GB de almacenamiento y 5 GB de transferencia/mes.
  Con fotos comprimidas alcanza para cientos de diseños sin costo.
- **Página de admin oculta:** lleva `<meta name="robots" content="noindex">` para que
  no aparezca en Google.
- **Hosting:** el sitio se despliega en **Vercel** (el dominio de Squarespace apunta
  por DNS a Vercel). El deploy es automático con `git push`; las variables de entorno
  van en el panel de Vercel (paso 5). `vercel.json` activa las URLs limpias para `/admin`.
```
