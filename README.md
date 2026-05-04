# Desarrollo_Aplicaciones_I
# Sistema de Subastas - Aplicación Móvil

Aplicación móvil para participar en subastas en tiempo real y gestionar artículos destinados a futuras subastas.

Este proyecto fue desarrollado como **Trabajo Práctico Obligatorio de Desarrollo de Aplicaciones I**. La aplicación permite a los usuarios registrarse, participar en subastas dinámicas, ofertar por artículos y proponer bienes propios para ser subastados.


URL al Prototipo de la aplicación (Figma): https://www.figma.com/design/3I2GpErUcZisvdbp6480uy/Subasta---App?node-id=0-1&t=u73vXLMP6eQmD4cC-1
---

## 📌 Descripción del Proyecto

La empresa de subastas cuenta con un sistema interno donde se registran las subastas, artículos, postores, ofertas y rematadores.

Esta aplicación móvil se integra con ese sistema existente mediante una **API REST**, permitiendo a los usuarios:

- Participar online en subastas presenciales.
- Realizar ofertas en tiempo real.
- Consultar catálogos de artículos.
- Registrar medios de pago.
- Proponer bienes propios para futuras subastas.

Las subastas siguen el modelo de **subasta dinámica ascendente**, donde los participantes pueden ver las ofertas de otros postores y mejorar la suya mientras la subasta permanezca abierta. :contentReference[oaicite:1]{index=1}

---

# 🧑‍💻 Funcionalidades Principales

## Registro de Usuarios

El registro se realiza en dos etapas:

1. **Registro inicial**
   - Nombre y apellido
   - Documento (foto frente y dorso)
   - Domicilio legal
   - País de origen

2. **Validación por la empresa**
   - Se asigna una categoría al usuario:
     - Común
     - Especial
     - Plata
     - Oro
     - Platino

La categoría determina a qué subastas puede acceder el usuario.

---

## Medios de Pago

Cada usuario debe registrar al menos un medio de pago para participar en subastas:

- Cuenta bancaria
- Tarjeta de crédito
- Cheque certificado

Los medios de pago deben ser **verificados antes de la subasta**.

---

## Participación en Subastas

Cada subasta posee:

- Fecha y hora
- Rematador
- Categoría mínima requerida
- Moneda (ARS o USD)
- Catálogo de artículos

Los usuarios pueden:

- Ver el artículo actual en subasta
- Ver la mejor oferta actual
- Realizar nuevas ofertas

### Reglas de Puja

- La oferta debe ser mayor a la actual.
- Debe superar la oferta actual en **al menos 1% del valor base**.
- No puede superar **20% del valor base sobre la oferta actual**.

Ejemplo:

Precio base: 10.000  
Última oferta: 15.000  

- Oferta mínima: **15.100**
- Oferta máxima: **17.000**

Estas restricciones **no aplican en subastas Oro y Platino**. :contentReference[oaicite:2]{index=2}

---

## Finalización de Subasta

Cuando no se reciben más ofertas:

- El último postor se convierte en el **nuevo propietario del bien**
- Se registra la venta
- Se genera el detalle de pago incluyendo:
  - monto ofertado
  - comisiones
  - envío

Si nadie realiza ofertas, la empresa compra el objeto al **precio base**.

---

## Gestión de Artículos para Subastar

Los usuarios también pueden **proponer artículos propios para subasta**.

Deben proporcionar:

- Descripción del objeto
- Fotografías (mínimo 6)
- Información histórica relevante
- Declaración de propiedad

La empresa puede:

- Aceptar el artículo
- Rechazarlo (indicando motivo)
- Solicitar envío para inspección

Si se acepta:

- Se asigna a una futura subasta
- Se define precio base
- Se establecen comisiones

---

## Métricas y Estadísticas

Los usuarios pueden consultar:

- Subastas en las que participó
- Subastas ganadas
- Historial de pujas
- Importes ofertados
- Categorías de subastas

---

# 🏗️ Arquitectura del Sistema

El sistema se compone de:

### Frontend
Aplicación móvil

Responsabilidades:

- Interfaz de usuario
- Visualización de subastas
- Gestión de ofertas
- Registro y perfil de usuario

### Backend

API REST encargada de:

- Gestión de usuarios
- Catálogo de subastas
- Registro de ofertas
- Validación de reglas de puja
- Integración con sistema interno de la empresa

---

# 🔌 API REST

La API permite:

- Autenticación de usuarios
- Consulta de subastas
- Registro de ofertas
- Gestión de medios de pago
- Registro de artículos

Los endpoints y códigos de respuesta siguen los estándares HTTP.

Ejemplo:
- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

# 🎨 Justificación de Diseño

## Identidad Visual

El diseño de la aplicación apunta a transmitir **exclusividad, confianza y sofisticación**, valores asociados al mundo de las subastas tradicionales. Para ello se adoptó una estética oscura y elegante, inspirada en los ambientes de remates de arte y antigüedades, combinada con detalles dorados que refuerzan la sensación de prestigio.

La tipografía principal utilizada es **EB Garamond**, una fuente con serifa de estilo clásico que evoca formalidad y seriedad, coherente con el contexto de subastas. Se complementa con **SF Pro** para elementos del sistema operativo iOS.

---

## 🎨 Paleta de Colores

La paleta fue definida con cuatro colores principales y sus variantes:

| Color | Hex | Uso |
|-------|-----|-----|
| **Azul Noche** | `#001020` | Fondo principal de todas las pantallas |
| **Azul Marino** | `#0D2039` | Fondos de tarjetas, contenedores y campos de entrada |
| **Dorado** | `#AC823E` / `#F2E189` | Botones de acción principal (gradiente dorado), bordes de iconos de categoría |
| **Arena / Gris Cálido** | `#99988B` | Textos secundarios, etiquetas, placeholders |

Adicionalmente se utilizan colores de estado y acento:

| Color | Uso |
|-------|-----|
| `#1D9E75` (Verde) | Indicador "Live" en subastas activas |
| `#FF383C` (Rojo) | Tiempo restante crítico, alertas |
| `#E8C96A` (Amarillo dorado) | Destaque de la mayor oferta actual |
| `#091525` (Casi negro) | Texto sobre botones dorados |

El gradiente dorado aplicado en los botones principales (`#AC823E → #F2E189 → #AC823E`) fue elegido deliberadamente para jerarquizar las llamadas a la acción y dotarlas de un acabado premium coherente con la propuesta de valor de la plataforma.

---

## 📱 Prototipo en Figma

El prototipo fue desarrollado íntegramente en **Figma** para el dispositivo **iPhone 16 (393 × 852 px)**, cubriendo todos los flujos funcionales de la aplicación.

### Pantallas prototipadas

El prototipo incluye las siguientes vistas, organizadas por flujo:

**Onboarding y autenticación**
- Splash screen
- Login (usuario + clave, acceso directo a registro)
- Registro — Paso 1 (datos personales, documento, domicilio)
- Registro — Paso 2 (validación y categoría)
- Añadir cuenta bancaria
- Añadir tarjeta de crédito
- Añadir cheque certificado

**Navegación principal**
- Home: muestra el perfil del usuario con su categoría, destacados de la semana y listado de subastas abiertas en tiempo real con indicadores de moneda (ARS/USD) y tiempo restante
- Productos: catálogo de artículos disponibles en subastas
- Detalle de producto (ej. Sony PlayStation 4 Pro, Sony Walkman, Sony Minicomponente)
- Pujas: historial de pujas del usuario
- Mi Perfil (tres partes): datos personales, medios de pago y estadísticas

**Flujo de subasta**
- Pantalla de subasta activa con mejor oferta, cronómetro y campo de nueva puja
- Reglas de puja (descripción de restricciones según categoría)
- Subastas totales (métricas históricas del usuario)
- Notificaciones

**Ofrecer un artículo**
- Paso 1: tipo de pieza y descripción
- Paso 2: fotografías del artículo
- Paso 3: información adicional (solo para obras de arte/colección)
- Paso 4: información histórica
- Paso 5: declaración de propiedad y envío

### Decisiones de UX destacadas

- **Barra de navegación inferior fija** con cuatro secciones (Home, Productos, Pujas, Mi Perfil) y badges numéricos para notificaciones pendientes.
- **Tarjetas de subasta** con información densa pero escaneable: nombre, moneda, mayor oferta resaltada en dorado y tiempo restante en rojo cuando es crítico.
- **Botón "ENTRAR"** visible directamente desde el Home para subastas en curso, reduciendo la cantidad de pasos hasta la puja.
- **Flujo de oferta de artículo en 5 pasos** con progresión clara, y bifurcación en el Paso 3 solo para obras de arte, evitando campos innecesarios para el resto de los usuarios.
- El prototipo incluye un banner publicitario y notas internas del equipo visible en el canvas de Figma, separados visualmente de los frames de pantalla.
