# HASH Ads Dashboard

Dashboard centralizado de campañas publicitarias para Google Ads, Meta Ads y Amazon Ads. Challenge técnico para la posición de Full Stack Developer Jr. (Frontend Focus) en HASH Marketing.

> Las secciones de integración con APIs reales representan una propuesta técnica basada en investigación de la documentación oficial de cada plataforma.

---

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) — redirige automáticamente a `/campaigns`.

---

## Arquitectura del proyecto

La estructura sigue una separación clara entre **dominio**, **infraestructura de UI** y **lógica de negocio**:

```
src/
├── app/                        # Rutas (Next.js App Router)
│   ├── layout.tsx              # Layout global: fuente, tema, header
│   ├── page.tsx                # Redirect a /campaigns
│   └── campaigns/
│       ├── page.tsx            # Listado con filtros y paginación
│       └── [id]/page.tsx       # Detalle de campaña con URL propia
├── components/
│   ├── ui/                     # Átomos reutilizables (Badge, Card, Skeleton…)
│   ├── campaigns/              # Componentes de dominio (CampaignCard, MetricsChart…)
│   └── layout/                 # Header global
├── data/
│   └── campaigns.mock.ts       # 25 campañas ficticias con métricas independientes
├── hooks/
│   ├── useCampaigns.ts         # Filtros + paginación centralizados
│   └── useDebounce.ts          # Debounce genérico para la búsqueda
├── lib/
│   ├── utils.ts                # formatCurrency, formatNumber, cn()
│   └── animations.ts           # Variantes de Framer Motion (nunca inline)
└── types/
    └── campaign.ts             # Interfaces Campaign, Platform, Status
```

**Decisiones clave:**

- **Ruta dinámica en lugar de modal:** El detalle de campaña vive en `/campaigns/[id]`. Esto permite compartir URLs directas, usar el botón atrás del browser naturalmente y que cada campaña sea indexable. Un modal hubiera funcionado para el scope del challenge, pero la ruta dinámica es la decisión correcta para un producto real donde el cliente necesita enviar un link de una campaña específica.

- **`useCampaigns` como única fuente de verdad:** Filtrado, búsqueda, paginación y estado viven en un solo hook. El componente de UI solo consume y renderiza. Cuando se conecte una API real, solo hay que cambiar ese hook — los componentes no se tocan.

- **`useDebounce` separado:** El debounce de 300ms en la búsqueda es un hook genérico (`useDebounce<T>`). Cuando la búsqueda llame a una API real, este hook evita disparar una request por cada tecla presionada.

- **Animaciones centralizadas en `animations.ts`:** Todas las variantes de Framer Motion están en un archivo. Si HASH Marketing decide cambiar el estilo de entrada de todas las cards, hay un solo lugar donde hacerlo.

- **Componentes de dominio vs. componentes de UI:** `CampaignCard` conoce el tipo `Campaign`. `Card` de shadcn no sabe nada de campañas. Esta separación hace que los componentes de UI sean reutilizables en cualquier otro dominio.

---

## Métricas y jerarquía visual

### Jerarquía de métricas

Las métricas se organizan en dos niveles según su impacto en la decisión de negocio:

**Nivel 1 — Métricas de performance (grid de 4 columnas):**

| Métrica | Por qué es primaria |
|---------|-------------------|
| **ROAS** | Es la métrica final: ¿está generando dinero la inversión? |
| **CTR** | Mide la relevancia del anuncio con su audiencia |
| **CPC** | Mide la eficiencia del presupuesto |
| **Conversiones** | El objetivo concreto de la campaña |

**Nivel 2 — Métricas de volumen (grid de 3 columnas):**

| Métrica | Rol |
|---------|-----|
| **Impresiones** | Alcance total; contextualiza el CTR |
| **Clicks** | Volumen de tráfico generado |
| **Gasto total** | Control de ejecución presupuestal |

### Cómo se jerarquizan visualmente

1. **Color semántico en valores:** Los valores de ROAS, CTR y CPC tienen colores basados en umbrales de industria. No es decorativo — es información. Verde = saludable, ámbar = atención, rojo = acción requerida. CPC invierte la lógica porque menor es mejor.

   ```
   ROAS:  > 3.0x → verde   |  1.5–3.0x → ámbar   |  < 1.5x → rojo
   CTR:   > 2.0% → verde   |  0.8–2.0% → ámbar   |  < 0.8% → rojo
   CPC:   < $1   → verde   |  $1–$3    → ámbar   |  > $3   → rojo
   ```

2. **Tamaño tipográfico:** El valor (`text-xl font-semibold`) domina sobre el label (`text-xs`) y el subtítulo (`text-xs text-muted-foreground`). El ojo ve primero el número.

3. **Íconos contextuales:** Cada métrica tiene un ícono de Lucide que refuerza el concepto sin necesidad de leer el label (TrendingUp para ROAS, MousePointerClick para CTR, etc.).

4. **Tooltips informativos:** Un ícono `Info` sutil junto al label explica la métrica al cliente no técnico. No interrumpe el flujo, pero está disponible.

5. **Gráfica de métricas diarias:** Permite ver la evolución en el tiempo. El total del período se muestra prominentemente arriba para dar contexto inmediato antes de analizar la curva. Los datos del mock tienen variaciones independientes entre spend, clicks y conversiones — cada campaña cuenta una historia visual diferente.

---

## Integración con APIs reales

### Arquitectura propuesta

Con Next.js App Router, la integración de APIs reales se haría a través de **Route Handlers** en el servidor, nunca exponiendo credenciales al cliente:

```
src/app/api/
├── campaigns/
│   ├── route.ts          # GET /api/campaigns → agrega las 3 plataformas
│   └── [id]/route.ts     # GET /api/campaigns/:id → detalle de una campaña
```

### Flujo de datos

```
Cliente (React) → Route Handler (Next.js) → APIs externas
                       ↓ credenciales seguras en .env
                       Google Ads API
                       Meta Marketing API
                       Amazon Ads API
```

El Route Handler actúa como BFF (Backend for Frontend): hace las tres llamadas en paralelo, normaliza los datos al tipo `Campaign` del proyecto, y devuelve un JSON unificado.

### Autenticación con cada plataforma

**Google Ads:** OAuth 2.0 con cuenta de Google Ads Manager (MCC). Se necesita un Developer Token aprobado por Google. Las credenciales van en variables de entorno del servidor.

```ts
const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_DEVELOPER_TOKEN,
})
```

**Meta Ads:** OAuth 2.0 con la API de Marketing de Meta. Se solicita un `access_token` de larga duración (60 días) que se refresca automáticamente.

```ts
const response = await fetch(
  `https://graph.facebook.com/v19.0/act_${adAccountId}/campaigns`,
  { headers: { Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}` } }
)
```

**Amazon Ads:** OAuth con Amazon Login (LWA). Requiere Client ID/Secret y un refresh token. Los access tokens expiran cada hora.

```ts
const token = await refreshAmazonToken(process.env.AMAZON_REFRESH_TOKEN)
const response = await fetch('https://advertising-api.amazon.com/v2/campaigns', {
  headers: {
    Authorization: `Bearer ${token}`,
    'Amazon-Advertising-API-ClientId': process.env.AMAZON_CLIENT_ID,
  }
})
```

### Caché y performance

Con las APIs reales, se reemplazaría `useCampaigns` con React Query:

```ts
const { data, isLoading, error } = useQuery({
  queryKey: ['campaigns', filters],
  queryFn: () => fetchCampaigns(filters),
  staleTime: 5 * 60 * 1000, // 5 min: los datos de ads no cambian por segundo
})
```

El debounce de 300ms en la búsqueda ya está implementado pensando en este escenario — evita queries innecesarias mientras el usuario escribe.

---

## Consideraciones para producción

### Rate limiting

Cada plataforma tiene límites distintos. Google Ads permite ~15,000 operaciones por día por cliente MCC. Meta limita por `app_id` con ventanas de 1 hora. Amazon es el más restrictivo con throttling por endpoint.

**Solución:** Implementar una capa de caché (Redis o el `revalidate` de Next.js) para no golpear las APIs en cada request. Para 25 campañas los límites son cómodos, pero con cientos de clientes se vuelve crítico.

### Latencia y confiabilidad

Las tres APIs externas tienen SLAs distintos y pueden fallar independientemente. Si Meta tarda 8 segundos o retorna 503, el dashboard no puede bloquearse completamente.

**Solución:** Llamadas en paralelo con `Promise.allSettled` (no `Promise.all`) para que el fallo de una plataforma no cancele las otras. El estado de error ya está implementado en `campaigns/page.tsx`.

```ts
const [google, meta, amazon] = await Promise.allSettled([
  fetchGoogleCampaigns(),
  fetchMetaCampaigns(),
  fetchAmazonCampaigns(),
])
// Mostrar datos disponibles aunque alguna plataforma falle
```

### Scopes y permisos

Para acceder a datos de clientes, se necesitan permisos específicos en cada plataforma que requieren aprobación manual de Google/Meta/Amazon. Este proceso puede tomar semanas para cuentas nuevas.

### Refresh de tokens

Los access tokens expiran. Amazon cada hora, Meta cada 60 días. Hay que implementar refresh automático sin interrumpir sesiones activas.

### Volumen de datos históricos

Las APIs devuelven grandes volúmenes de registros. Una campaña de 6 meses con métricas diarias son 180 filas. Para 50 campañas y 10 clientes, la paginación de la API y el procesamiento en servidor son obligatorios.

---

## Normalización entre plataformas

Este es el problema más interesante del proyecto. Cada plataforma tiene su propia terminología y estructura.

### Tabla de equivalencias

| Concepto | Google Ads | Meta Ads | Amazon Ads |
|----------|-----------|----------|-----------|
| Gasto | `cost_micros` (÷10⁶) | `spend` | `cost` |
| Clicks | `clicks` | `clicks` | `clicks` |
| Impresiones | `impressions` | `impressions` | `impressions` |
| Conversiones | `conversions` | `actions[type=purchase]` | `purchases` |
| ROAS | calculado manualmente | `purchase_roas` | `ROAS` |
| CTR | decimal (0.025) | porcentaje (2.5) | `clickThroughRate` |

### Capa de normalización: adaptadores por plataforma

Un adaptador por plataforma convierte los datos crudos al tipo `Campaign` del proyecto:

```ts
// adapters/google.ts
function fromGoogleCampaign(raw: GoogleCampaign): Campaign {
  const spend = raw.metrics.cost_micros / 1_000_000  // micros → USD
  const ctr = raw.metrics.ctr * 100                   // decimal → porcentaje
  return { spend, ctr, ...rest }
}

// adapters/meta.ts
function fromMetaCampaign(raw: MetaCampaign): Campaign {
  // Meta separa conversiones por tipo de acción
  const conversions = raw.actions
    ?.find(a => a.action_type === 'purchase')?.value ?? 0
  return { conversions, ...rest }
}

// adapters/amazon.ts
function fromAmazonCampaign(raw: AmazonCampaign): Campaign {
  // Amazon usa camelCase distinto al snake_case de Google/Meta
  return {
    spend: raw.cost,
    ctr: raw.clickThroughRate * 100,
    conversions: raw.purchases,
    ...rest
  }
}
```

El tipo `Campaign` en `types/campaign.ts` es el contrato interno que ningún componente de UI rompe. Los adaptadores son la única capa que conoce los detalles de cada API.

### Diferencias de granularidad temporal

Google reporta en intervalos de 1 hora si se necesita. Meta reporta por día o semana, pero no soporta rangos arbitrarios en todos los endpoints. Amazon tiene latencia de hasta 48 horas en algunos reportes.

**Solución:** Normalizar todos los datos a granularidad diaria, que es el mínimo común denominador de las tres plataformas. Documentar la latencia de Amazon en la UI para que el cliente entienda que los datos del día anterior pueden estar incompletos.

### Diferencias en el modelo de atribución

Google usa last-click por defecto. Meta usa ventana de 7 días por clic / 1 día por vista. Amazon atribuye compras dentro de los 14 días posteriores al clic. Una "conversión" en Google y una "conversión" en Meta no son estrictamente comparables.

**Solución:** Mostrar una nota de atribución por plataforma en el detalle de campaña. No intentar sumar conversiones entre plataformas sin aclarar este punto al cliente, ya que llevaría a interpretaciones incorrectas del ROI.

---

## Testing

El proyecto incluye tests unitarios con Jest para las funciones de cálculo financiero — las más críticas porque un error en formateo puede mostrar presupuestos incorrectos al cliente.

```bash
npm test
```

Se testean `formatCurrency` y `formatNumber` con 9 casos que cubren valores enteros, decimales, cero, límites exactos (1,000 y 1,000,000) y sufijos K y M. Estas funciones son el núcleo de la presentación de datos financieros en el dashboard.

---

## Stack tecnológico

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| Next.js | 16.2 | Framework principal (App Router, rutas dinámicas) |
| React | 19 | UI |
| TypeScript | 5 | Tipado estricto en todo el proyecto, sin `any` |
| Tailwind CSS | 4 | Estilos utilitarios |
| shadcn/ui | 4.7 | Componentes base (Card, Select, Skeleton, Tooltip…) |
| Framer Motion | 12 | Animaciones de entrada, transiciones, microinteracciones |
| Recharts | 3.8 | Gráfica de métricas diarias (AreaChart con gradiente) |
| next-themes | 0.4 | Dark mode sincronizado con preferencia del sistema |
| Lucide React | 1.16 | Íconos |

---

## Features implementadas

- Listado de 25 campañas con datos de marcas LATAM (Nike, Oxxo, Spotify, Liverpool…)
- Filtros por plataforma (Google / Meta / Amazon) y estado (activa / pausada / terminada)
- Búsqueda por nombre de campaña o cliente con debounce de 300ms
- Botón de reset de filtros con estado activo/inactivo
- Paginación cliente (10 campañas por página), se reinicia al cambiar filtros
- Vista tabla en desktop, cards en mobile (responsive completo)
- Página de detalle por campaña con URL propia (`/campaigns/[id]`)
- Skeleton loading (1000ms en lista, 800ms en detalle)
- Estado de error con botón de reintento — arquitectura lista para producción: cuando el fetch a la API real falle, `setHasError(true)` se dispara desde el catch automáticamente
- Estado vacío cuando no hay resultados de búsqueda
- Gráfica de métricas diarias con selector de métrica y total del período
- Color semántico en ROAS, CTR y CPC según umbrales de la industria
- Barra de presupuesto con color según porcentaje ejecutado y estado de campaña
- Íconos contextuales en cada métrica de StatCard
- Tooltips explicativos en las métricas principales (ROAS, CTR, CPC, Conversiones)
- Fechas formateadas en español ("1 de abril de 2026")
- Dark mode con transición suave y persistencia por OS/preferencia del usuario
- Animaciones de entrada en header, cards y métricas (Framer Motion)
- Microinteracciones: hover en filas de tabla, scale en StatCards, transición en filtros
- Animación de wordmark en el header al hacer hover

## Features planificadas

- **Autenticación con NextAuth:** Las campañas son datos sensibles de clientes. Un sistema de login con roles (admin, viewer) es el siguiente paso antes de hacer el dashboard accesible externamente.
- **Exportación a CSV:** Muy solicitado por equipos de marketing para llevar datos a Excel/Sheets. Se implementaría en un Route Handler que convierte el array de campañas a CSV con headers correctos.
- **Conexión a APIs reales:** Reemplazar el mock por llamadas reales a Google Ads, Meta Marketing API y Amazon Ads API a través de Route Handlers con normalización por adaptador.
- **React Query para caché:** Con APIs reales, `useQuery` con `staleTime` de 5 minutos evita requests redundantes y maneja loading/error states automáticamente.
- **Rango de fechas en filtros:** Filtrar métricas por período personalizado.
- **Comparación de campañas:** Seleccionar 2–3 campañas y comparar sus métricas lado a lado.
