# LogiTrack · Gestión de logística de paquetes (Angular)

Aplicación web hecha 100% con Angular (standalone) para gestionar envíos de correo con CRUD simulado, filtros, dashboard visual y login de prueba. Usa datos mock en `localStorage`/arrays, sin backend obligatorio.

## Funcionalidades
- Listado de envíos con búsqueda, filtro por estado y paginación simulada.
- CRUD con formularios reactivos y validaciones.
- Dashboard con métricas rápidas (totales, entregados, en tránsito, demorados) y próximas entregas.
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
│   ├─ shipment.ts                    # CRUD simulado con BehaviorSubject + localStorage
│   └─ auth.ts                        # Login local y estado de sesión
├─ guards/
│   └─ auth.guard.ts                  # Redirección a /login si no hay sesión
├─ components/
│   ├─ layout/navbar/…                # Barra superior y logout
│   ├─ dashboard/…                    # Tarjetas de métricas y próximas entregas
│   ├─ shipments/shipments-list/…     # Lista con filtros y paginación
│   └─ shipments/shipment-form/…      # Alta/edición con Reactive Forms
└─ components/auth/login/…            # Login simulado
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
   Asegúrate de habilitar GitHub Pages apuntando a la rama `gh-pages`.

2) **Vercel / Netlify**  
   - Importa el repo, establece comando de build `npm run build` y directorio de salida `dist/logistics-app`.
   - No requiere backend; solo se sirven estáticos. Si agregas API opcional, configura rutas de funciones según la plataforma.

3) **Opcional backend**  
   - Puedes añadir un `server/` con Node/Express o Nest y consumirlo desde los servicios. Mientras no exista, los servicios siguen usando los mocks.

## Personalizaciones incluidas (requisito EDI)
- Dashboard visual con métricas + próximas entregas.
- Filtros/búsqueda y paginación simulada en el listado.
- Login simulado con roles y guard de navegación.
- UI responsiva y estilos propios en CSS.

## Casos de prueba básicos
- **Login:** ingresar cualquier usuario/clave (probar `admin / 1234` y otro usuario). Debe redirigir a dashboard.
- **Crear envío:** completar todos los campos obligatorios; validar mensajes de error y aparición en la lista.
- **Editar envío:** modificar estado/prioridad y verificar actualización en tabla y dashboard.
- **Eliminar envío:** confirmar y revisar que desaparezca y se actualicen métricas.
- **Filtros:** buscar por tracking/origen/destino y combinar con filtro de estado; probar paginación.
- **Persistencia:** recargar la página y comprobar que los datos creados/edición se mantienen (localStorage).

## Capturas sugeridas
- Dashboard (tarjetas + tabla de próximas entregas).
- Listado con filtros y paginación.
- Formulario de alta/edición mostrando validaciones.
- Pantalla de login.

## Tecnologías
- Angular 20 (standalone components, routing)
- TypeScript, HTML, CSS (sin dependencias UI externas)
- RxJS para streams y filtros
- localStorage para persistencia simulada
