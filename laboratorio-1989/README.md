# 1989 / ARCHIVE — Laboratorio de investigación histórica

Módulo de investigación documental integrado en el repositorio Archivo Ramos, en la ruta `/laboratorio-1989/`.

## Alcance
Investigación sobre relaciones político-diplomáticas entre Argentina, México y Estados Unidos (1983–1995), con núcleo 1989–1993 y expediente central Ramos–Negroponte.

## Interfaz
- Centro de archivo: búsqueda y filtros por país, protagonista, tipo y año; fichas de fuentes y enlaces a documentos originales.
- Mapa de relaciones: grafo interactivo de cargos y adscripciones institucionales. Las relaciones históricas sustantivas requieren evidencia documental.
- Atlas geopolítico: mapa de sedes de referencia y cronología de investigación.
- Expedientes temáticos y directorio de repositorios/API.

## Fuentes y conectores
1. **NARA Catalog API** — `https://catalog.archives.gov/api/v2/records/search`. JSON, metadatos, autoridades, objetos digitales y texto OCR. Requiere clave API. Solicitar a `Catalog_API@nara.gov`. La documentación publica un límite estándar de 10.000 consultas/mes. No incluir la clave en el frontend ni en GitHub. Respetar las condiciones de uso y atribución de NARA.
2. **FRUS / Office of the Historian API** — `https://history.state.gov/api/v1/catalog`. Catálogo público XML/Atom/OPDS sin clave. Permite descubrir volúmenes y enlaces de Foreign Relations of the United States.
3. **George H. W. Bush Presidential Library** — índice de memcons/telcons 1989–1991 y PDFs de documentos digitalizados.
4. **CIA Reading Room** — repositorio de documentos desclasificados; no se ha confirmado API pública general.
5. **SRE México** — Acervo Histórico Diplomático y catálogos web; no se ha confirmado API pública general.
6. **Itamaraty Concórdia** — catálogo de acuerdos internacionales y documentación diplomática con documentación Swagger.
7. **National Security Archive** — colecciones documentales desclasificadas.
8. **Archivo General de la Nación Argentina** — catálogo institucional.

## Próxima integración segura
NARA requiere backend protegido. Añadir un servicio FastAPI y guardar `NARA_API_KEY` como variable de entorno en el proveedor de hosting. Nunca en JavaScript, HTML, archivos públicos o commits. El backend deberá consultar la API en vivo y cumplir las condiciones de NARA; no almacenar en caché ni conservar respuestas de la API sin autorización.

## Integridad histórica
- Diferenciar hecho, interpretación, alegación e hipótesis.
- Cada afirmación debe tener documento, fecha, autor/institución y página/folio.
- No inferir contactos, coordinación o causalidad por proximidad gráfica.
- El traslado administrativo de Ramos en 1992 no demuestra por sí mismo la causa política.
- John D. Negroponte fue embajador de EE. UU. en México entre 1989 y 1993; no fue director de la CIA. Fue el primer Director de Inteligencia Nacional de EE. UU. (2005–2007).

## Despliegue
El módulo es estático y puede publicarse bajo una ruta de GitHub Pages o Cloudflare Pages si el repositorio ya está conectado. Abrir `laboratorio-1989/index.html` para previsualizar localmente. Los mapas y visualizaciones cargan bibliotecas CDN y requieren conexión a internet.
