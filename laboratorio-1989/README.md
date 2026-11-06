# 1989 / ARCHIVE — Laboratorio de investigación histórica

Módulo integrado en el repositorio Archivo Ramos, en la ruta `/laboratorio-1989/`. Esta versión reconstruye la interfaz de archivo, el directorio de protagonistas, el grafo institucional y el atlas mundial.

## Módulos disponibles en la interfaz

- **Centro de archivo:** buscador y filtros locales sobre registros iniciales; fichas de procedencia y enlaces a documentos/catálogos originales. No es todavía una búsqueda federada en NARA/FRUS.
- **Protagonistas:** cinco fichas con fotografía documental, período/cargo, breve biografía, fecha de la imagen, crédito y enlace a la ficha de procedencia.
- **Mapa de relaciones:** grafo interactivo con retratos en los nodos de personas y conexiones institucionales diferenciadas. Las aristas actuales representan cargos, titularidades y adscripciones, no contactos personales.
- **Atlas geopolítico:** mapa mundial navegable con capitales/sedes de referencia y cronología contextual.
- **Expedientes:** seis líneas temáticas de investigación.
- **Fuentes y API:** directorio de catálogos y repositorios.

## Fotografías y atribución

Las imágenes se sirven desde Wikimedia Commons y se enlaza su ficha de origen. La fecha del retrato se muestra por separado del período histórico investigado. En particular, el retrato de John D. Negroponte utilizado aquí corresponde a 2005, no a su gestión como embajador en México. La foto de Ramos corresponde a 1954 y está atribuida al Archivo Familiar de Jorge Abelardo Ramos (CC0). Verificar las condiciones de cada archivo antes de reutilizarlo fuera de este proyecto.

## Fuentes y conectores

1. **NARA Catalog API** — `https://catalog.archives.gov/api/v2/records/search`. JSON, metadatos, autoridades, objetos digitales y texto OCR. Requiere clave API. Solicitar a `Catalog_API@nara.gov`. La documentación publica un límite estándar de 10.000 consultas/mes. No incluir la clave en el frontend ni en GitHub.
2. **FRUS / Office of the Historian API** — `https://history.state.gov/api/v1/catalog`. Catálogo público XML/Atom/OPDS sin clave.
3. **George H. W. Bush Presidential Library** — índice de memcons/telcons 1989–1991 y documentos digitalizados.
4. **CIA Reading Room** — repositorio de documentos desclasificados; no se ha confirmado API pública general.
5. **SRE México** — Acervo Histórico Diplomático y catálogos web; no se ha confirmado API pública general.
6. **Itamaraty Concórdia** — catálogo de acuerdos internacionales y documentación diplomática con interfaz Swagger.
7. **National Security Archive** — colecciones documentales desclasificadas.
8. **Archivo General de la Nación Argentina** — catálogo institucional.

## Estado técnico real

- La interfaz es una aplicación estática HTML/CSS/JavaScript.
- Las bibliotecas de visualización y cartografía se cargan desde CDN.
- El buscador de archivo filtra el conjunto local de registros incorporado en el HTML. Los botones de acceso abren las fuentes originales.
- El catálogo FRUS y NARA están documentados y enlazados, pero **no hay aún conectores API activos dentro de la aplicación**.
- NARA requiere un backend protegido. Añadir un servicio (por ejemplo, FastAPI) y guardar `NARA_API_KEY` como variable de entorno del proveedor de hosting. Nunca exponerla en JavaScript, HTML, archivos públicos o commits.
- No se afirma que los agentes de investigación estén implementados ni que exista un backend de investigación.
- El despliegue público no se considera verificado por este commit. La publicación depende del proveedor conectado al repositorio y su configuración de rutas.

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
- NARA API: https://www.archives.gov/research/catalog/help/api
- FRUS API: https://history.state.gov/developer/catalog
