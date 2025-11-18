# LogiTrack · Gestión de logística de paquetes (Angular)

Aplicación web hecha 100% con Angular (standalone) para gestionar envíos de correo con CRUD simulado, filtros, dashboard visual y login de prueba. Usa datos mock en `localStorage`/arrays, sin backend obligatorio.

## Funcionalidades
- Listado de envíos con búsqueda, filtro por estado y paginación simulada.
- CRUD con formularios reactivos y validaciones.
-.Dashboard con métricas rápidas (totales, entregados, en transito, demorados) y próximas entregas.
- Login simulado (rol `admin` si el usuario es `admin`).
- Datos persistidos en `localStorage` para mantener cambios al recargar.

## Estructura recomendada
```
src/app
├─ app.ts / app.html / app.css        # Shell principal + router-outlet
├─ app.routes.ts                      # Routing protegido con authGuard
├─ app.config.ts                      # Configuración Angular
├─ models/
│   ├─ shipment.model.ts              # Interfaces Shipment, estados y prioridades
│   ├─ user.model.ts                  # Usuario simulado
│   └─ stats.model.ts                 # Métricas del dashboard
├─ services/
│   ├─ shipment.ts                    # CRUD simulado con BehaviorSubject + localStorage/JSON
│   └─ auth.ts                        # Login local y estado de sesión
├─ guards/
│   └─ auth.guard.ts                  # Redirección a /login si no hay sesión
├─ components/
│   ├─ layout/navbar/...              # Barra superior y logout
│   ├─ dashboard/...                  # Tarjetas de métricas y próximas entregas
│   ├─ shipments/shipments-list/...   # Lista con filtros y paginación
│   └─ shipments/shipment-form/...    # Alta/edición con Reactive Forms
└─ components/auth/login/...          # Login simulado
```

## Datos simulados
- Se cargan 5 envíos de ejemplo al iniciar (`ShipmentService`).
- Los cambios se guardan en `localStorage` (`logistics-shipments` y `logistics-user`) para persistencia en el navegador.
- Para resetear datos, basta con limpiar `localStorage`.

## Instalación y ejecución
```bash
npm install
npm start          # alias de ng serve -o (http://localhost:4200)
npm run build      # build de producción en dist/logistics-app
```

## Despliegue (SPA estática)
1) **GitHub Pages**  
   ```bash
   ng build --base-href "/TU_REPO/"
   npx angular-cli-ghpages --dir=dist/logistics-app
   ```  
   Habilita GitHub Pages apuntando a la rama `gh-pages`.

2) **Vercel / Netlify**  
   - Importa el repo, comando de build `npm run build`, salida `dist/logistics-app`.
   - No requiere backend; si agregas API opcional, configura rutas de funciones.

3) **Backend opcional (cómo enchufarlo)**  
   1. Levanta un backend (Node/Express o Nest) con endpoints REST de envíos.  
   2. Cambia en `ShipmentService` las operaciones CRUD para llamar al backend (con `HttpClient`).  
   3. Mantén fallback al JSON/mock mientras el backend no responda.  
   4. Ajusta CORS y URL base; si despliegas como SPA, el backend debe ser público/HTTPS.

## Personalizaciones incluidas (requisito EDI)
- Dashboard visual con métricas + próximas entregas.
- Filtros/búsqueda y paginación simulada en el listado.
- Login simulado con roles y guard de navegación.
- UI responsiva y estilos propios en CSS.

## Casos de prueba básicos
- **Login:** cualquier usuario/clave (probar `admin / 1234` y otro). Redirige a dashboard.
- **Crear envío:** completar obligatorios; validar mensajes de error y aparición en la lista.
- **Editar envío:** modificar estado/prioridad y ver actualización en tabla/dashboard.
- **Eliminar envío:** confirmar y revisar métricas.
- **Filtros:** buscar por tracking/origen/destino + filtro de estado; probar paginación.
- **Persistencia:** recargar y comprobar que los datos creados/edición se mantienen (localStorage).

## Capturas sugeridas (puedes usar Lightshot y pegar los links)
- Dashboard (tarjetas + próximas entregas). Ej: https://prnt.sc/XXXXX
- Listado con filtros y paginación. Ej: https://prnt.sc/YYYYY
- Formulario de alta/edición con validaciones. Ej: https://prnt.sc/ZZZZZ
- Pantalla de login. Ej: https://prnt.sc/AAAAA

## Testing
- Unit: `npm test` (incluye `src/app/services/shipment.spec.ts` para validar carga desde localStorage y CRUD básico).
- Manual: seguir los casos listados (login, crear/editar/eliminar, filtros, persistencia).
