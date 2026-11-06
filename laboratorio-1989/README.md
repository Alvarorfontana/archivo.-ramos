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
- El catálogo FRUS y NARA están documentados y enlazados, pero **no hay aún conectores API activos dentro de la aplicación**.
- NARA requiere un backend protegido. Añadir un servicio (por ejemplo, FastAPI) y guardar `NARA_API_KEY` como variable de entorno del proveedor de hosting. Nunca exponerla en JavaScript, HTML, archivos públicos o commits.
- No se afirma que los agentes de investigación estén implementados ni que exista un backend de investigación.
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
