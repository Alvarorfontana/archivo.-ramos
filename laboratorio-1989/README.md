# 1989 / ARCHIVE — Laboratorio de investigación histórica

Módulo integrado en el repositorio Archivo Ramos, en la ruta `/laboratorio-1989/`. Esta versión reconstruye la interfaz de archivo, el directorio de protagonistas, el grafo institucional y el atlas mundial.

## Módulos disponibles en la interfaz

- **Centro de archivo:** buscador y filtros locales sobre registros iniciales; fichas de procedencia y enlaces a documentos/catálogos originales. No es todavía una búsqueda federada en NARA/FRUS.
- **Protagonistas:** cinco fichas con fotografía documental, período/cargo, breve biografía, fecha de la imagen, crédito y enlace a la ficha de procedencia.
- **Mapa de relaciones:** grafo interactivo con retratos en los nodos de personas y conexiones institucionales diferenciadas. Las aristas actuales representan cargos, titularidades y adscripciones, no contactos personales.
- **Atlas geopolítico:** mapa mundial navegable con capitales/sedes de referencia y cronología contextual.
- **Expedientes:** siete líneas temáticas, incluida la caída del Muro de Berlín y la reunificación alemana.
- **Investigación e informes:** biblioteca ampliada de fuentes, registro local de hallazgos y redactor de informes.
- **Fuentes y API:** directorio ampliado con archivos diplomáticos de Argentina, México, Francia, Reino Unido, Alemania y Brasil; archivos presidenciales; universidades y hemerotecas.

## Fotografías y atribución

Las imágenes se sirven desde Wikimedia Commons y se enlaza su ficha de origen. La fecha del retrato se muestra por separado del período histórico investigado. Ramos aparece en una fotografía en México junto a Octavio Paz; la ficha de Commons no consigna fecha de toma y atribuye la imagen al Instituto Jorge Abelardo Ramos (CC BY-SA 4.0). Menem aparece junto a George H. W. Bush en una conferencia de prensa en Casa Rosada, el 2 de diciembre de 1990; fuente Televisión Pública Argentina / Canal 7 / RTA (CC BY-SA 2.5 AR). Negroponte continúa representado por su retrato oficial ODNI de 2005, no por una imagen de su gestión como embajador. Verificar atribución y licencia antes de cualquier reutilización.

## Fuentes y conectores

1. **NARA Catalog API** — `https://catalog.archives.gov/api/v2/records/search`. JSON, metadatos, autoridades, objetos digitales y texto OCR. Requiere clave API. Solicitar a `Catalog_API@nara.gov`. La documentación publica un límite estándar de 10.000 consultas/mes. No incluir la clave en el frontend ni en GitHub.
2. **FRUS / Office of the Historian API** — `https://history.state.gov/api/v1/catalog`. Catálogo público XML/Atom/OPDS sin clave.
3. **George H. W. Bush Presidential Library** — índice de memcons/telcons 1989–1991 y documentos digitalizados.
4. **CIA Reading Room** — repositorio de documentos desclasificados; no se ha confirmado API pública general.
5. **SRE México** — Acervo Histórico Diplomático y catálogos web; no se ha confirmado API pública general.
6. **Itamaraty Concórdia** — catálogo de acuerdos internacionales y documentación diplomática con interfaz Swagger.
7. **National Security Archive** — colecciones documentales desclasificadas.
8. **Archivo General de la Nación Argentina** — catálogo institucional.

## Informes y exportación PDF

- El redactor permite guardar un borrador y hallazgos en `localStorage` del navegador utilizado.
- **Imprimir / Guardar PDF** genera un PDF descargable A4 mediante `html2pdf.js`, incluyendo título, cuerpo del informe, fecha de generación, hallazgos registrados, fuentes y localizadores.
- Los borradores y hallazgos no se sincronizan entre usuarios ni equipos. El PDF se descarga al dispositivo; no se almacena automáticamente en un servidor o biblioteca compartida.
- La exportación requiere conexión para cargar la biblioteca `html2pdf.js` desde CDN.

## Expediente: caída del Muro de Berlín

Se incorporó una línea temática 1989–1990 con documentos del National Security Archive, Wilson Center y Bush Presidential Library. Incluye materiales sobre Hungría, Checoslovaquia, Alemania Oriental, la conferencia de Günter Schabowski, conversaciones Bush–Kohl y el proceso de reunificación. El expediente contextualiza la transformación internacional; no presupone una conexión causal con el caso Ramos–Negroponte.

## Estado técnico real

- La interfaz es una aplicación estática HTML/CSS/JavaScript.
- Las bibliotecas de visualización y cartografía se cargan desde CDN.
- El buscador de archivo filtra el conjunto local de registros incorporado en el HTML. Los botones de acceso abren las fuentes originales.
- El directorio incluye nuevos archivos diplomáticos, fondos presidenciales, guías universitarias y hemerotecas. Son referencias de búsqueda; no significa que todos los documentos estén descargados o examinados.
- En la actualización del 7/11/2026 se agregaron rutas backend para FRUS, Crossref, OpenAlex y NARA. La consulta NARA requiere `NARA_API_KEY` privada en Vercel.
- El análisis con IA y la persistencia compartida requieren Gemini y Neon, que no estaban configurados en la comprobación de producción previa a esta actualización.
- Los agentes de investigación siguen siendo una arquitectura prevista, no un conjunto de agentes autónomos ya operativo.
- La versión se publica en Vercel mediante despliegue directo de archivos. La integración GitHub–Vercel automática no está configurada.

## Integridad histórica

- Diferenciar hecho, interpretación, alegación e hipótesis.
- Cada afirmación nueva debe registrar documento, fecha, autor/institución y página/folio.
- No inferir contactos, coordinación o causalidad por proximidad gráfica.
- El Decreto 76/1992 y el Decreto 389/1992 acreditan actos administrativos sobre Ramos, pero no demuestran por sí mismos la causa política ni intervención de terceros.
- John D. Negroponte fue embajador de EE. UU. en México entre 1989 y 1993; no fue director de la CIA. Fue el primer Director de Inteligencia Nacional de EE. UU. (2005–2007).

## Fuentes históricas de referencia

- Decreto 76/1992: https://www.argentina.gob.ar/normativa/nacional/norma-8126
- Decreto 389/1992: https://www.argentina.gob.ar/normativa/nacional/norma-8427
- Bush Library, llamada Bush–Menem 20/12/1989: https://bush41library.tamu.edu/files/memcons-telcons/1989-12-20--Menem.pdf
- ADST, oral history de Negroponte: https://adst.org/oral-history/fascinating-figures/john-d-negroponte-diplomatic-life-controversy-consequence/
- National Security Archive, caída del Muro: https://nsarchive2.gwu.edu/NSAEBB/NSAEBB490/
- Bush Library, Bush–Kohl y reunificación alemana: https://www.bush41library.gov/digital-research-room/finding-aid/foia/records-memcons-and-telcons-between-president-bush-and
- Wilson Center, documentos del Muro: https://www.wilsoncenter.org/article/twenty-fifth-anniversary-the-fall-the-berlin-wall
- Archivo Nacional de la Memoria, colección fotográfica de Menem: https://catalogo.jus.gob.ar/index.php/1989-a-1999-presidencia-constitucional-de-carlos-saul-menem
- NARA API: https://www.archives.gov/research/catalog/help/api
- FRUS API: https://history.state.gov/developer/catalog


## Ampliación del centro de investigación (rama `feat/1989-research-dashboards`)

La rama incorpora un centro de trabajo separado de la portada histórica original. La navegación de la portada incluye un acceso al nuevo centro; la portada y los módulos históricos no se reemplazan.

### Dashboards

- Panel general.
- Dashboard de Relaciones, con búsqueda y filtro por tipo de entidad. El grafo ilustrativo se identifica como tal y no presenta hipótesis como vínculos probados.
- Dashboard de Personas, con búsqueda y filtro por país.
- Global Información, con selección de período y contexto internacional.
- Centro de API y repositorios.
- Investigación e informes.
- Panel de arquitectura de los 13 agentes previstos.

### Consultas de API implementadas

- **FRUS:** búsqueda del catálogo público OPDS/XML mediante backend Next.js (`/api/research/frus`).
- **Crossref Works:** búsqueda bibliográfica mediante backend (`/api/research/crossref`).
- **OpenAlex Works:** búsqueda de publicaciones académicas mediante backend (`/api/research/openalex`).
- **World Bank Indicators:** series macroeconómicas mediante `/api/data/worldbank`.
- **NARA Catalog v2:** ruta segura `/api/research/nara`; requiere `NARA_API_KEY` en el servidor y no responde mientras esa variable no esté configurada.

Los resultados se muestran por proveedor, con su procedencia y enlace original. La disponibilidad depende de cada servicio. Los metadatos no se convierten automáticamente en evidencia validada.

### Catálogo de fuentes

El catálogo visual de esta rama contiene 49 entradas entre API, servicios de datos, catálogos y repositorios. Incluye NARA, FRUS, CIA Reading Room, archivos presidenciales, AGN, SRE, Itamaraty, UN Comtrade, Banco Mundial, FMI, OECD, Eurostat, ECB, GovInfo, Federal Register, Congress.gov, SEC EDGAR, FRED, BEA, Census, UNHCR, OCHA, OMS, OIT, FAO, UNESCO, Crossref, OpenAlex, PubMed, Europe PMC, ORCID, Semantic Scholar, Google Books, Library of Congress, Wikimedia Commons, Wikidata, Open Library, Smithsonian, DPLA, Zenodo, CORE, GDELT y otros.

**Importante:** 49 entradas catalogadas no equivalen a 49 conectores activos. Los conectores de búsqueda programática implementados en esta rama son FRUS, Crossref, OpenAlex y Banco Mundial; NARA dispone de una ruta backend protegida, pero necesita una clave válida para devolver resultados. CIA y otros archivos se consultan mediante sus interfaces oficiales hasta verificar una API pública estable.

### Informes

- Guardado de borradores en el navegador local.
- Exportación de texto.
- Impresión del informe y opción del navegador para guardarlo como PDF.
- La sincronización multiusuario y el almacenamiento documental central todavía requieren backend y base de datos.

### Pendientes de infraestructura

- Backend seguro para conectores con credenciales y cuotas.
- Base documental compartida, almacenamiento de originales y metadatos.
- Ingestión automatizada, OCR, clasificación, extracción, deduplicación e indexación.
- Registro de procedencia y localizadores por documento.
- Verificación de afirmaciones, contradicciones y vacíos.
- Implementación y orquestación real de los 13 agentes.
- Pruebas de integración, accesibilidad y despliegue.

No se declaran completados los componentes pendientes ni se muestran como activos conectores que todavía no realizan consultas.


### Acceso operativo a NARA, CIA y FRUS

- **NARA:** el conector backend consulta Catalog API v2 y envía la clave privada mediante el encabezado `x-api-key`. Requiere solicitar una clave de lectura a `Catalog_API@nara.gov`; límite estándar documentado: 10.000 consultas mensuales por clave. La ruta devuelve estado `not_configured` si falta la variable en el servidor. Documentación: https://www.archives.gov/research/catalog/help/api y https://www.archives.gov/research/catalog/help/api-getting-started.
- **CIA:** el dashboard abre la búsqueda de texto completo del CIA FOIA Electronic Reading Room: https://www.cia.gov/readingroom/search/site/ . El repositorio público contiene documentos desclasificados y páginas digitalizadas; la interfaz permite consulta y acceso a documentos. No se ha confirmado una API pública general oficial, por lo que se integra mediante su buscador institucional y enlaces a los originales, sin scraping no autorizado.
- **FRUS:** el dashboard consulta el catálogo público OPDS/XML a través de la ruta backend `/api/research/frus`, sin registro ni clave en Office of the Historian. Devuelve entradas de catálogo, materias, volúmenes y enlaces oficiales. Para citar un documento se debe abrir el volumen y localizar su página o sección.

La CIA Reading Room y el catálogo NARA son fuentes públicas consultables aun cuando la automatización mediante API tenga requisitos distintos. El sistema distingue acceso público, API oficial y conector automatizado para no confundirlos.

Fuentes oficiales consultadas: NARA API help; NARA Getting Started; CIA FOIA Electronic Reading Room y CIA FAQ; Office of the Historian API documentation.


## Actualización técnica — 7 de noviembre de 2026

Se incorporó al Centro de Archivo un buscador federado que envía una misma consulta a cuatro servicios y presenta resultados separados por proveedor: FRUS, NARA, Crossref y OpenAlex. Las rutas nuevas están en `app/api/research/`; las claves permanecen exclusivamente en el servidor. Cada resultado puede registrarse como referencia en el archivo de trabajo local y se conserva su URL de origen.

**Estado de producción comprobado antes de esta actualización de código:** el endpoint World Bank responde con series reales. El chequeo de salud informó que la base de datos, Gemini, NARA y la contraseña de acceso no estaban configurados. En Vercel solo se encontró definida `GEMINI_MODEL`; no se encontraron secretos de conexión. Por eso el guardado centralizado, el análisis con IA y la consulta NARA no deben presentarse como activos hasta configurar y probar esas dependencias.

**Estado de esta rama:** se modificó GitHub, pero esta actualización no fue desplegada ni probada en producción. No afirmar que los nuevos conectores ya están disponibles en el sitio público hasta realizar un único despliegue final y comprobar respuestas reales de cada ruta.


### Documentos primarios incorporados desde el índice de la Biblioteca Bush

- 27/09/1989 — Memorando de conversación Bush–Menem en la Casa Blanca: https://bush41library.tamu.edu/files/memcons-telcons/1989-09-27--Menem.pdf
- 05/12/1990 — Almuerzo con Carlos Saúl Menem, NAID 321498039: https://catalog.archives.gov/medialz/presidential-libraries/bush/gb-nsc/321498039/1990-12-05--Menem.pdf
- 19/01/1991 — Conversación telefónica con Carlos Menem, NAID 321498139: https://catalog.archives.gov/medialz/presidential-libraries/bush/gb-nsc/321498139/1991-01-19--Menem.pdf
- 08/02/1991 — Reunión con Guido Di Tella, NAID 321498039: https://catalog.archives.gov/medialz/presidential-libraries/bush/gb-nsc/321498039/1991-02-08--Di-Tella.pdf
- 1989–1993 — Colección GB-NSC, NAID 2163580; la serie Presidential Telcon Files tiene NAID 321498139: https://www.bush41library.gov/digital-research-room/finding-aid/records-national-security-council-george-h-w-bush-administration

Se distinguen los documentos PDF originales de los instrumentos de descripción archivística. La existencia de una reunión o llamada no acredita por sí sola su contenido, acuerdos ni causalidad.


### Actualización del atlas y la red documental — 7 de noviembre de 2026

- El atlas dejó de usar la capa satelital comercial como vista predeterminada. Ahora abre cartografía editorial CARTO/OSM, con atribución cartográfica visible y capas temáticas. Las fichas de Buenos Aires, Ciudad de México y Washington incorporan registros fechados y enlaces primarios. El mapa señala ciudades e instituciones a escala urbana; no representa domicilios ni trayectos no acreditados.
- La cronología espacial se reemplazó por hitos fechados: nominación y credenciales de Negroponte, visita Bush–Menem de septiembre de 1989, visita de Salinas, registros presidenciales de 1990–1991 y decretos de 1992.
- La red se amplió a 36 nodos y 53 vínculos. Se añadieron nodos documentales separados para reuniones, llamadas y registros oficiales. Los actores se conectan con los documentos que los mencionan; no se dibuja un contacto personal directo cuando el soporte es solo una coincidencia institucional.
- El filtro de red muestra el período completo 1983–1995 por defecto; el filtro anual es opcional.

Estas modificaciones están en la rama feat/1989-research-dashboards. No se desplegaron a producción y todavía requieren prueba de interfaz en navegador.
