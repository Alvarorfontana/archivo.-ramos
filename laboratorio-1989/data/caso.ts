// Base documental del caso Ramos–Negroponte (1983–1995).
// Regla: cada vínculo y cada hecho declara su nivel de evidencia.
//   documentado → respaldado por documento primario o normativa citada
//   contexto    → hecho público y general del período (cargos, acontecimientos)
//   hipotesis   → línea de investigación abierta: NO es un hecho probado
// "verificar" marca fechas o datos que deben confirmarse con la fuente original.

export type Evidencia = 'documentado' | 'contexto' | 'hipotesis';
export type TipoEntidad = 'persona' | 'institucion' | 'medio' | 'programa' | 'caso';

export interface Entidad {
  id: string; nombre: string; tipo: TipoEntidad; pais: string; rol: string; periodo?: string;
  bio?: string; imagen?: string; imagenFuente?: string; lugar?: string; buscar?: string;
}
export interface Vinculo { de: string; a: string; etiqueta: string; evidencia: Evidencia; fecha?: string; fuentes?: string[]; nota?: string; }
export interface Lugar { id: string; nombre: string; lat: number; lng: number; pais: string; descripcion: string; aproximado?: boolean; }
export interface Hecho {
  id: string; fecha: string; titulo: string; resumen: string; evidencia: Evidencia; lugares: string[]; actores: string[];
  expedientes: string[]; fuentes?: string[]; verificar?: string;
}
export interface Fuente {
  id: string; titulo: string; tipo: 'documento' | 'normativa' | 'testimonio' | 'archivo' | 'prensa' | 'estudio';
  institucion: string; fecha?: string; url: string; nota?: string;
}
export interface Expediente {
  id: string; codigo: string; titulo: string; pregunta: string; resumen: string; color: string;
  actores: string[]; pendientes: string[]; busquedas: string[];
}

const WM = (f: string) => 'https://commons.wikimedia.org/wiki/Special:FilePath/' + f + '?width=400';

export const entidades: Entidad[] = [
  // Personas
  { id: 'ramos', nombre: 'Jorge Abelardo Ramos', tipo: 'persona', pais: 'AR', rol: 'Embajador argentino en México', periodo: '1989–1992 (verificar fechas por decreto)', bio: 'Historiador, ensayista y dirigente de la izquierda nacional. Autor de «Revolución y contrarrevolución en la Argentina». Menem lo designó al frente de la embajada en México. Murió en Buenos Aires en 1994.', imagen: WM('Jorge_Abelardo_Ramos.JPG'), imagenFuente: 'https://commons.wikimedia.org/wiki/File:Jorge_Abelardo_Ramos.JPG', lugar: 'cdmx', buscar: 'Jorge Abelardo Ramos' },
  { id: 'negroponte', nombre: 'John D. Negroponte', tipo: 'persona', pais: 'US', rol: 'Embajador de EE.UU. en México', periodo: '1989–1993', bio: 'Diplomático de carrera. Antes fue embajador en Honduras (1981–1985), en plena guerra de la Contra. En México acompañó la negociación del TLC. Más tarde fue el primer Director de Inteligencia Nacional (2005–2007). No fue director de la CIA.', imagen: WM('John_Negroponte_official_portrait.jpg'), imagenFuente: 'https://commons.wikimedia.org/wiki/File:John_Negroponte_official_portrait.jpg', lugar: 'cdmx', buscar: 'Negroponte Mexico' },
  { id: 'menem', nombre: 'Carlos Saúl Menem', tipo: 'persona', pais: 'AR', rol: 'Presidente de la Nación', periodo: '1989–1999', bio: 'Asumió el 8 de julio de 1989. Giro de la política exterior hacia el alineamiento con EE.UU.: Golfo, Cóndor II, relación con el Reino Unido.', imagen: WM('Carlos_menem.jpg'), imagenFuente: 'https://commons.wikimedia.org/wiki/File:Carlos_menem.jpg', lugar: 'bsas', buscar: 'Menem' },
  { id: 'bush', nombre: 'George H. W. Bush', tipo: 'persona', pais: 'US', rol: 'Presidente de EE.UU.', periodo: '1989–1993', bio: 'Presidente durante el fin de la Guerra Fría, la invasión a Panamá, la Guerra del Golfo y la negociación del TLC.', imagen: WM('George_H._W._Bush_presidential_portrait.jpg'), imagenFuente: 'https://commons.wikimedia.org/wiki/File:George_H._W._Bush_presidential_portrait.jpg', lugar: 'wash', buscar: 'Bush Menem' },
  { id: 'salinas', nombre: 'Carlos Salinas de Gortari', tipo: 'persona', pais: 'MX', rol: 'Presidente de México', periodo: '1988–1994', bio: 'Asumió el 1 de diciembre de 1988. Impulsó la apertura económica y el Tratado de Libre Comercio con EE.UU. y Canadá.', imagen: WM('Carlos_Salinas_de_Gortari_en_1989.jpeg'), imagenFuente: 'https://commons.wikimedia.org/wiki/File:Carlos_Salinas_de_Gortari_en_1989.jpeg', lugar: 'cdmx', buscar: 'Salinas de Gortari' },
  { id: 'cavallo', nombre: 'Domingo Cavallo', tipo: 'persona', pais: 'AR', rol: 'Canciller', periodo: '1989–1991', bio: 'Primer canciller de Menem; superior jerárquico de los embajadores hasta pasar a Economía en enero de 1991.', lugar: 'bsas', buscar: 'Cavallo canciller 1990' },
  { id: 'ditella', nombre: 'Guido Di Tella', tipo: 'persona', pais: 'AR', rol: 'Canciller', periodo: '1991–1999', bio: 'Reemplazó a Cavallo en Cancillería. Asociado a la doctrina de las «relaciones carnales» con EE.UU.', lugar: 'bsas', buscar: 'Di Tella' },
  { id: 'baker', nombre: 'James A. Baker III', tipo: 'persona', pais: 'US', rol: 'Secretario de Estado', periodo: '1989–1992', bio: 'Jefe del Departamento de Estado; superior de Negroponte y de Todman.', lugar: 'wash', buscar: 'James Baker Latin America 1990' },
  { id: 'todman', nombre: 'Terence Todman', tipo: 'persona', pais: 'US', rol: 'Embajador de EE.UU. en Argentina', periodo: '1989–1993', bio: 'Su carta sobre pedidos de coimas a la empresa Swift (1991) desató el «Swiftgate».', lugar: 'bsas', buscar: 'Todman Swift' },
  { id: 'solana', nombre: 'Fernando Solana', tipo: 'persona', pais: 'MX', rol: 'Secretario de Relaciones Exteriores', periodo: '1988–1993', bio: 'Canciller mexicano: interlocutor formal de los embajadores acreditados en México.', lugar: 'cdmx', buscar: 'Fernando Solana' },
  { id: 'amira', nombre: 'Amira Yoma', tipo: 'persona', pais: 'AR', rol: 'Secretaria de audiencias de Menem', periodo: '1989–1991', bio: 'Cuñada del presidente. Investigada en la causa conocida como «Yomagate» (1991).', lugar: 'bsas', buscar: 'Amira Yoma' },
  { id: 'ibrahim', nombre: 'Ibrahim al Ibrahim', tipo: 'persona', pais: 'AR', rol: 'Funcionario de la Aduana de Ezeiza', periodo: '1989–1991', bio: 'Exesposo de Amira Yoma; designado en la Aduana de Ezeiza pese a no hablar castellano. Figura en el Yomagate.', lugar: 'ezeiza', buscar: 'Ibrahim al Ibrahim' },
  { id: 'paz', nombre: 'Octavio Paz', tipo: 'persona', pais: 'MX', rol: 'Escritor · Nobel 1990', bio: 'Retratado junto a Ramos en México (foto del Instituto Jorge Abelardo Ramos). Sirve para fechar y situar la vida pública del embajador.', lugar: 'cdmx', buscar: 'Octavio Paz Abelardo Ramos' },
  { id: 'scowcroft', nombre: 'Brent Scowcroft', tipo: 'persona', pais: 'US', rol: 'Asesor de Seguridad Nacional', periodo: '1989–1993', bio: 'Conducía el NSC, que produjo los memcons y telcons de Bush con Menem.', lugar: 'wash', buscar: 'Scowcroft Argentina' },
  // Instituciones
  { id: 'emb-ar-mx', nombre: 'Embajada argentina en México', tipo: 'institucion', pais: 'AR', rol: 'Misión diplomática', lugar: 'cdmx', buscar: 'embajada argentina Mexico 1990' },
  { id: 'emb-us-mx', nombre: 'Embajada de EE.UU. en México', tipo: 'institucion', pais: 'US', rol: 'Misión diplomática', lugar: 'cdmx', buscar: 'American embassy Mexico 1991' },
  { id: 'emb-us-ar', nombre: 'Embajada de EE.UU. en Argentina', tipo: 'institucion', pais: 'US', rol: 'Misión diplomática', lugar: 'bsas', buscar: 'American embassy Buenos Aires 1991' },
  { id: 'cancilleria', nombre: 'Cancillería argentina', tipo: 'institucion', pais: 'AR', rol: 'Ministerio de Relaciones Exteriores', lugar: 'bsas', buscar: 'Cancillería argentina 1990' },
  { id: 'sre', nombre: 'SRE México', tipo: 'institucion', pais: 'MX', rol: 'Secretaría de Relaciones Exteriores', lugar: 'cdmx', buscar: 'Secretaría de Relaciones Exteriores 1990' },
  { id: 'state', nombre: 'Departamento de Estado', tipo: 'institucion', pais: 'US', rol: 'Política exterior de EE.UU.', lugar: 'wash', buscar: 'State Department Argentina 1990' },
  { id: 'nsc', nombre: 'Consejo de Seguridad Nacional (NSC)', tipo: 'institucion', pais: 'US', rol: 'Casa Blanca', lugar: 'wash', buscar: 'National Security Council Argentina' },
  { id: 'cia', nombre: 'CIA', tipo: 'institucion', pais: 'US', rol: 'Inteligencia', lugar: 'wash', buscar: 'CIA Argentina 1990' },
  { id: 'aduana', nombre: 'Aduana de Ezeiza', tipo: 'institucion', pais: 'AR', rol: 'Control aduanero', lugar: 'ezeiza', buscar: 'aduana Ezeiza 1991' },
  // Medios
  { id: 'proceso', nombre: 'Revista Proceso', tipo: 'medio', pais: 'MX', rol: 'Semanario mexicano', lugar: 'cdmx', buscar: 'Proceso Negroponte memorandum' },
  { id: 'pagina12', nombre: 'Página/12', tipo: 'medio', pais: 'AR', rol: 'Diario argentino', lugar: 'bsas', buscar: 'Página/12 1991 Swiftgate' },
  // Programas y casos
  { id: 'condor', nombre: 'Misil Cóndor II', tipo: 'programa', pais: 'AR', rol: 'Programa misilístico', periodo: '1984–1993', bio: 'Proyecto de misil balístico desarrollado en Falda del Carmen. EE.UU. presionó por su desmantelamiento.', lugar: 'falda', buscar: 'Condor II missile Argentina' },
  { id: 'tlc', nombre: 'TLC / TLCAN', tipo: 'programa', pais: 'MX', rol: 'Tratado de libre comercio', periodo: '1990–1994', lugar: 'cdmx', buscar: 'NAFTA negotiation 1991 Mexico' },
  { id: 'yomagate', nombre: 'Yomagate', tipo: 'caso', pais: 'AR', rol: 'Causa por lavado de dinero', periodo: '1991', lugar: 'ezeiza', buscar: 'Yomagate' },
  { id: 'swiftgate', nombre: 'Swiftgate', tipo: 'caso', pais: 'AR', rol: 'Denuncia de coimas', periodo: '1991', lugar: 'bsas', buscar: 'Swiftgate Todman' },
  { id: 'panama', nombre: 'Invasión a Panamá', tipo: 'caso', pais: 'US', rol: 'Operación militar', periodo: '1989–1990', lugar: 'panama', buscar: 'Panama invasion 1989 Latin America reaction' },
  { id: 'golfo', nombre: 'Guerra del Golfo', tipo: 'caso', pais: 'US', rol: 'Conflicto internacional', periodo: '1990–1991', lugar: 'golfo', buscar: 'Argentina Gulf War 1990' },
];

export const vinculos: Vinculo[] = [
  // Cargos y cadenas de mando (contexto)
  { de: 'menem', a: 'ramos', etiqueta: 'lo designa embajador', evidencia: 'contexto', fecha: '1989', nota: 'Confirmar con el decreto de designación.' },
  { de: 'ramos', a: 'emb-ar-mx', etiqueta: 'jefe de misión', evidencia: 'contexto', fecha: '1989–1992' },
  { de: 'negroponte', a: 'emb-us-mx', etiqueta: 'jefe de misión', evidencia: 'contexto', fecha: '1989–1993' },
  { de: 'todman', a: 'emb-us-ar', etiqueta: 'jefe de misión', evidencia: 'contexto', fecha: '1989–1993' },
  { de: 'emb-ar-mx', a: 'cancilleria', etiqueta: 'depende de', evidencia: 'contexto' },
  { de: 'emb-us-mx', a: 'state', etiqueta: 'depende de', evidencia: 'contexto' },
  { de: 'emb-us-ar', a: 'state', etiqueta: 'depende de', evidencia: 'contexto' },
  { de: 'cavallo', a: 'cancilleria', etiqueta: 'canciller 1989–1991', evidencia: 'contexto' },
  { de: 'ditella', a: 'cancilleria', etiqueta: 'canciller desde 1991', evidencia: 'contexto' },
  { de: 'baker', a: 'state', etiqueta: 'secretario de Estado', evidencia: 'contexto' },
  { de: 'solana', a: 'sre', etiqueta: 'canciller mexicano', evidencia: 'contexto' },
  { de: 'scowcroft', a: 'nsc', etiqueta: 'conduce', evidencia: 'contexto' },
  { de: 'bush', a: 'nsc', etiqueta: 'preside', evidencia: 'contexto' },
  { de: 'emb-ar-mx', a: 'sre', etiqueta: 'acreditada ante', evidencia: 'contexto' },
  { de: 'emb-us-mx', a: 'sre', etiqueta: 'acreditada ante', evidencia: 'contexto' },
  // Documentados por fuentes primarias
  { de: 'bush', a: 'menem', etiqueta: 'reunión en la Casa Blanca', evidencia: 'documentado', fecha: '1989-09-27', fuentes: ['memcon-1989-09-27'] },
  { de: 'bush', a: 'menem', etiqueta: 'llamada el día de la invasión a Panamá', evidencia: 'documentado', fecha: '1989-12-20', fuentes: ['telcon-1989-12-20'] },
  { de: 'bush', a: 'menem', etiqueta: 'almuerzo en Buenos Aires', evidencia: 'documentado', fecha: '1990-12-05', fuentes: ['memcon-1990-12-05'] },
  { de: 'bush', a: 'menem', etiqueta: 'llamada durante la Guerra del Golfo', evidencia: 'documentado', fecha: '1991-01-19', fuentes: ['telcon-1991-01-19'] },
  { de: 'bush', a: 'ditella', etiqueta: 'reunión en Washington', evidencia: 'documentado', fecha: '1991-02-08', fuentes: ['memcon-1991-02-08'] },
  { de: 'menem', a: 'ramos', etiqueta: 'decretos de 1992 sobre su cargo', evidencia: 'documentado', fecha: '1992', fuentes: ['decreto-76-1992', 'decreto-389-1992'], nota: 'Los decretos acreditan actos administrativos; no prueban por sí solos la causa política.' },
  { de: 'proceso', a: 'negroponte', etiqueta: 'publica su memo sobre el TLC', evidencia: 'contexto', fecha: '1991-05', nota: 'Ubicar el número exacto de Proceso y el texto del memorando.' },
  { de: 'todman', a: 'swiftgate', etiqueta: 'su carta lo desata', evidencia: 'contexto', fecha: '1991-01' },
  { de: 'amira', a: 'yomagate', etiqueta: 'investigada', evidencia: 'contexto', fecha: '1991' },
  { de: 'ibrahim', a: 'yomagate', etiqueta: 'investigado', evidencia: 'contexto', fecha: '1991' },
  { de: 'ibrahim', a: 'aduana', etiqueta: 'cargo en Ezeiza', evidencia: 'contexto' },
  { de: 'amira', a: 'menem', etiqueta: 'secretaria de audiencias / cuñada', evidencia: 'contexto' },
  { de: 'menem', a: 'condor', etiqueta: 'decide desactivarlo', evidencia: 'contexto', fecha: '1990–1993' },
  { de: 'bush', a: 'golfo', etiqueta: 'conduce la coalición', evidencia: 'contexto' },
  { de: 'menem', a: 'golfo', etiqueta: 'envía buques', evidencia: 'contexto', fecha: '1990-09' },
  { de: 'bush', a: 'panama', etiqueta: 'ordena la invasión', evidencia: 'contexto', fecha: '1989-12-20' },
  { de: 'bush', a: 'tlc', etiqueta: 'impulsa', evidencia: 'contexto' },
  { de: 'salinas', a: 'tlc', etiqueta: 'impulsa', evidencia: 'contexto' },
  { de: 'negroponte', a: 'tlc', etiqueta: 'operador diplomático', evidencia: 'contexto' },
  { de: 'paz', a: 'ramos', etiqueta: 'fotografiados juntos en México', evidencia: 'documentado', fuentes: ['foto-ramos-paz'], nota: 'La ficha de Commons no consigna la fecha de la foto.' },
  // Hipótesis de investigación (líneas abiertas)
  { de: 'ramos', a: 'negroponte', etiqueta: 'ENFRENTAMIENTO (hipótesis central)', evidencia: 'hipotesis', fecha: '1989–1992', nota: 'Buscar cables de la embajada de EE.UU., prensa mexicana y archivo de Cancillería. Definir qué se disputó, cuándo y ante quién.' },
  { de: 'negroponte', a: 'menem', etiqueta: '¿presión para remover a Ramos?', evidencia: 'hipotesis', nota: 'Requiere documento que conecte la queja estadounidense con la decisión argentina.' },
  { de: 'state', a: 'cancilleria', etiqueta: '¿gestiones sobre el embajador en México?', evidencia: 'hipotesis' },
  { de: 'condor', a: 'ramos', etiqueta: '¿la cuestión misilística en el conflicto?', evidencia: 'hipotesis' },
  { de: 'yomagate', a: 'menem', etiqueta: '¿vulnerabilidad usada como presión?', evidencia: 'hipotesis', nota: 'Línea «extorsión a Menem»: diferenciar denuncia periodística de documento.' },
  { de: 'ramos', a: 'salinas', etiqueta: '¿relación con el gobierno mexicano?', evidencia: 'hipotesis' },
  { de: 'ramos', a: 'panama', etiqueta: '¿posición pública ante la invasión?', evidencia: 'hipotesis' },
  { de: 'cia', a: 'emb-us-mx', etiqueta: '¿estación en la embajada? (buscar desclasificados)', evidencia: 'hipotesis' },
];

export const lugares: Lugar[] = [
  { id: 'bsas', nombre: 'Buenos Aires', lat: -34.6081, lng: -58.3703, pais: 'AR', descripcion: 'Casa Rosada, Cancillería y embajada de EE.UU. Centro de decisión del gobierno de Menem.' },
  { id: 'cdmx', nombre: 'Ciudad de México', lat: 19.4326, lng: -99.1332, pais: 'MX', descripcion: 'Escenario del caso: embajada argentina (Ramos), embajada de EE.UU. (Negroponte) y gobierno de Salinas.' },
  { id: 'wash', nombre: 'Washington D.C.', lat: 38.8977, lng: -77.0365, pais: 'US', descripcion: 'Casa Blanca, NSC y Departamento de Estado. Allí se producen los memcons y telcons de Bush.' },
  { id: 'panama', nombre: 'Ciudad de Panamá', lat: 8.9824, lng: -79.5199, pais: 'PA', descripcion: 'Invasión estadounidense del 20 de diciembre de 1989.' },
  { id: 'tegus', nombre: 'Tegucigalpa', lat: 14.0723, lng: -87.1921, pais: 'HN', descripcion: 'Negroponte fue embajador en Honduras (1981–1985), antecedente clave de su perfil.' },
  { id: 'berlin', nombre: 'Berlín', lat: 52.5163, lng: 13.3777, pais: 'DE', descripcion: 'Caída del Muro, 9 de noviembre de 1989. Contexto del fin de la Guerra Fría.' },
  { id: 'madrid', nombre: 'Madrid', lat: 40.4168, lng: -3.7038, pais: 'ES', descripcion: 'Acuerdos de Madrid con el Reino Unido (1990) y ramificaciones del Yomagate.' },
  { id: 'golfo', nombre: 'Golfo Pérsico', lat: 26.5, lng: 51.5, pais: '—', descripcion: 'Despliegue naval argentino en la coalición de 1990–1991.', aproximado: true },
  { id: 'falda', nombre: 'Falda del Carmen (Córdoba)', lat: -31.58, lng: -64.46, pais: 'AR', descripcion: 'Instalaciones del proyecto Cóndor II.', aproximado: true },
  { id: 'ezeiza', nombre: 'Ezeiza', lat: -34.8222, lng: -58.5358, pais: 'AR', descripcion: 'Aduana del aeropuerto, escenario del Yomagate.' },
];

export const fuentes: Fuente[] = [
  { id: 'memcon-1989-09-27', titulo: 'Memcon Bush–Menem, Casa Blanca', tipo: 'documento', institucion: 'Bush Presidential Library', fecha: '1989-09-27', url: 'https://bush41library.tamu.edu/files/memcons-telcons/1989-09-27--Menem.pdf' },
  { id: 'telcon-1989-12-20', titulo: 'Telcon Bush–Menem', tipo: 'documento', institucion: 'Bush Presidential Library', fecha: '1989-12-20', url: 'https://bush41library.tamu.edu/files/memcons-telcons/1989-12-20--Menem.pdf' },
  { id: 'memcon-1990-12-05', titulo: 'Almuerzo con Carlos Menem (NAID 321498039)', tipo: 'documento', institucion: 'NARA · Bush Library', fecha: '1990-12-05', url: 'https://catalog.archives.gov/medialz/presidential-libraries/bush/gb-nsc/321498039/1990-12-05--Menem.pdf' },
  { id: 'telcon-1991-01-19', titulo: 'Telcon con Carlos Menem (NAID 321498139)', tipo: 'documento', institucion: 'NARA · Bush Library', fecha: '1991-01-19', url: 'https://catalog.archives.gov/medialz/presidential-libraries/bush/gb-nsc/321498139/1991-01-19--Menem.pdf' },
  { id: 'memcon-1991-02-08', titulo: 'Reunión con Guido Di Tella', tipo: 'documento', institucion: 'NARA · Bush Library', fecha: '1991-02-08', url: 'https://catalog.archives.gov/medialz/presidential-libraries/bush/gb-nsc/321498039/1991-02-08--Di-Tella.pdf' },
  { id: 'decreto-76-1992', titulo: 'Decreto 76/1992', tipo: 'normativa', institucion: 'Boletín Oficial · InfoLEG', fecha: '1992', url: 'https://www.argentina.gob.ar/normativa/nacional/norma-8126' },
  { id: 'decreto-389-1992', titulo: 'Decreto 389/1992', tipo: 'normativa', institucion: 'Boletín Oficial · InfoLEG', fecha: '1992', url: 'https://www.argentina.gob.ar/normativa/nacional/norma-8427' },
  { id: 'adst-negroponte', titulo: 'Historia oral de John D. Negroponte', tipo: 'testimonio', institucion: 'ADST', url: 'https://adst.org/oral-history/fascinating-figures/john-d-negroponte-diplomatic-life-controversy-consequence/' },
  { id: 'nsc-coleccion', titulo: 'Colección GB-NSC (memcons y telcons)', tipo: 'archivo', institucion: 'Bush Presidential Library', url: 'https://www.bush41library.gov/digital-research-room/finding-aid/records-national-security-council-george-h-w-bush-administration' },
  { id: 'nsa-muro', titulo: 'La caída del Muro: documentos', tipo: 'archivo', institucion: 'National Security Archive', url: 'https://nsarchive2.gwu.edu/NSAEBB/NSAEBB490/' },
  { id: 'foto-ramos-paz', titulo: 'Ramos y Octavio Paz en México', tipo: 'archivo', institucion: 'Wikimedia Commons · Instituto J. A. Ramos', url: 'https://commons.wikimedia.org/wiki/File:Jorge_Abelardo_Ramos.JPG' },
  { id: 'anm-menem', titulo: 'Colección fotográfica presidencia Menem', tipo: 'archivo', institucion: 'Archivo Nacional de la Memoria', url: 'https://catalogo.jus.gob.ar/index.php/1989-a-1999-presidencia-constitucional-de-carlos-saul-menem' },
];

export const hechos: Hecho[] = [
  { id: 'h-negro-hn', fecha: '1981', titulo: 'Negroponte, embajador en Honduras', resumen: 'Cuatro años en Tegucigalpa durante la guerra de la Contra. Define su perfil antes de llegar a México.', evidencia: 'contexto', lugares: ['tegus', 'wash'], actores: ['negroponte'], expedientes: ['ramos-negroponte'], fuentes: ['adst-negroponte'] },
  { id: 'h-salinas', fecha: '1988-12-01', titulo: 'Salinas asume en México', resumen: 'Comienza el sexenio de la apertura y el TLC.', evidencia: 'contexto', lugares: ['cdmx'], actores: ['salinas'], expedientes: ['mexico-tlc'] },
  { id: 'h-bush', fecha: '1989-01-20', titulo: 'Bush asume en EE.UU.', resumen: 'Baker al Departamento de Estado, Scowcroft al NSC.', evidencia: 'contexto', lugares: ['wash'], actores: ['bush', 'baker', 'scowcroft'], expedientes: ['menem-bush'] },
  { id: 'h-menem', fecha: '1989-07-08', titulo: 'Menem asume la presidencia', resumen: 'Cavallo a Cancillería. Empieza el giro hacia el alineamiento con Washington.', evidencia: 'contexto', lugares: ['bsas'], actores: ['menem', 'cavallo'], expedientes: ['menem-bush'] },
  { id: 'h-negro-mx', fecha: '1989', titulo: 'Negroponte llega a la embajada en México', resumen: 'Inicio de su gestión (1989–1993) en plena antesala del TLC.', evidencia: 'contexto', lugares: ['cdmx', 'wash'], actores: ['negroponte', 'emb-us-mx'], expedientes: ['ramos-negroponte', 'mexico-tlc'], verificar: 'Fecha de credenciales ante Salinas.' },
  { id: 'h-ramos-mx', fecha: '1989', titulo: 'Ramos, embajador en México', resumen: 'Menem designa a Jorge Abelardo Ramos al frente de la misión en México.', evidencia: 'contexto', lugares: ['bsas', 'cdmx'], actores: ['ramos', 'menem', 'emb-ar-mx'], expedientes: ['ramos-negroponte'], verificar: 'Número de decreto, fecha de designación y de presentación de credenciales.' },
  { id: 'h-memcon-89', fecha: '1989-09-27', titulo: 'Bush recibe a Menem en la Casa Blanca', resumen: 'Primer encuentro presidencial. Memorando de conversación disponible.', evidencia: 'documentado', lugares: ['wash', 'bsas'], actores: ['bush', 'menem'], expedientes: ['menem-bush'], fuentes: ['memcon-1989-09-27'] },
  { id: 'h-muro', fecha: '1989-11-09', titulo: 'Cae el Muro de Berlín', resumen: 'Fin de la Guerra Fría: cambia el margen de maniobra de América Latina.', evidencia: 'contexto', lugares: ['berlin'], actores: ['bush'], expedientes: ['contexto-89'], fuentes: ['nsa-muro'] },
  { id: 'h-panama', fecha: '1989-12-20', titulo: 'Invasión a Panamá y llamada Bush–Menem', resumen: 'El mismo día de la invasión Bush habla con Menem. Clave para medir reacciones latinoamericanas, incluida la de los embajadores en México.', evidencia: 'documentado', lugares: ['panama', 'wash', 'bsas'], actores: ['bush', 'menem', 'panama'], expedientes: ['contexto-89', 'menem-bush', 'embajadores'], fuentes: ['telcon-1989-12-20'] },
  { id: 'h-madrid', fecha: '1990-02-15', titulo: 'Argentina y el Reino Unido restablecen relaciones', resumen: 'Acuerdo firmado en Madrid tras la guerra de 1982.', evidencia: 'contexto', lugares: ['madrid', 'bsas'], actores: ['menem', 'cavallo'], expedientes: ['menem-bush'] },
  { id: 'h-tlc-anuncio', fecha: '1990-06', titulo: 'EE.UU. y México anuncian el TLC', resumen: 'Bush y Salinas lanzan la negociación del libre comercio.', evidencia: 'contexto', lugares: ['wash', 'cdmx'], actores: ['bush', 'salinas', 'tlc'], expedientes: ['mexico-tlc'] },
  { id: 'h-golfo', fecha: '1990-09', titulo: 'Buques argentinos al Golfo', resumen: 'Argentina se suma a la coalición. Señal mayor del alineamiento.', evidencia: 'contexto', lugares: ['golfo', 'bsas'], actores: ['menem', 'golfo'], expedientes: ['menem-bush'] },
  { id: 'h-condor', fecha: '1990', titulo: 'Se decide desactivar el Cóndor II', resumen: 'Bajo presión de EE.UU. el gobierno avanza en el desmantelamiento del misil.', evidencia: 'contexto', lugares: ['falda', 'bsas', 'wash'], actores: ['menem', 'condor'], expedientes: ['misiles'], verificar: 'Norma y fecha exacta de la decisión.' },
  { id: 'h-carapintada', fecha: '1990-12-03', titulo: 'Alzamiento carapintada', resumen: 'Rebelión militar sofocada dos días antes de la visita de Bush.', evidencia: 'contexto', lugares: ['bsas'], actores: ['menem'], expedientes: ['menem-bush'] },
  { id: 'h-bush-ba', fecha: '1990-12-05', titulo: 'Bush en Buenos Aires', resumen: 'Visita oficial y almuerzo con Menem. Memorando disponible en NARA.', evidencia: 'documentado', lugares: ['bsas', 'wash'], actores: ['bush', 'menem'], expedientes: ['menem-bush'], fuentes: ['memcon-1990-12-05'] },
  { id: 'h-swift', fecha: '1991-01', titulo: 'Swiftgate', resumen: 'Una carta del embajador Todman denuncia pedidos de coimas a la empresa Swift.', evidencia: 'contexto', lugares: ['bsas'], actores: ['todman', 'swiftgate', 'pagina12'], expedientes: ['yomagate'] },
  { id: 'h-telcon-91', fecha: '1991-01-19', titulo: 'Llamada Bush–Menem en plena guerra', resumen: 'Conversación telefónica durante la ofensiva en el Golfo.', evidencia: 'documentado', lugares: ['wash', 'bsas', 'golfo'], actores: ['bush', 'menem'], expedientes: ['menem-bush'], fuentes: ['telcon-1991-01-19'] },
  { id: 'h-ditella', fecha: '1991-02-08', titulo: 'Di Tella en Washington', resumen: 'El nuevo canciller se reúne con Bush.', evidencia: 'documentado', lugares: ['wash', 'bsas'], actores: ['ditella', 'bush'], expedientes: ['menem-bush'], fuentes: ['memcon-1991-02-08'] },
  { id: 'h-yoma', fecha: '1991-03', titulo: 'Estalla el Yomagate', resumen: 'Causa por lavado de dinero que alcanza a Amira Yoma, con ramificaciones en España.', evidencia: 'contexto', lugares: ['ezeiza', 'bsas', 'madrid'], actores: ['amira', 'ibrahim', 'yomagate'], expedientes: ['yomagate'], verificar: 'Mes exacto y primera publicación.' },
  { id: 'h-memo-negro', fecha: '1991-05', titulo: 'Proceso publica un memo de Negroponte', resumen: 'Un memorando confidencial del embajador sobre el TLC y la política exterior mexicana sale a la luz.', evidencia: 'contexto', lugares: ['cdmx', 'wash'], actores: ['negroponte', 'proceso', 'tlc'], expedientes: ['ramos-negroponte', 'mexico-tlc'], verificar: 'Número y fecha de la edición de Proceso.' },
  { id: 'h-decretos', fecha: '1992', titulo: 'Decretos 76 y 389 de 1992 sobre Ramos', resumen: 'Actos administrativos sobre su función. Establecen el final de la gestión, no su causa.', evidencia: 'documentado', lugares: ['bsas', 'cdmx'], actores: ['ramos', 'menem'], expedientes: ['ramos-negroponte'], fuentes: ['decreto-76-1992', 'decreto-389-1992'] },
  { id: 'h-tlc-firma', fecha: '1992-12-17', titulo: 'Se firma el TLCAN', resumen: 'EE.UU., México y Canadá firman el tratado.', evidencia: 'contexto', lugares: ['wash', 'cdmx'], actores: ['bush', 'salinas', 'tlc'], expedientes: ['mexico-tlc'] },
  { id: 'h-condor-fin', fecha: '1993', titulo: 'Componentes del Cóndor salen del país', resumen: 'Cierre del programa misilístico.', evidencia: 'contexto', lugares: ['falda', 'madrid'], actores: ['condor', 'menem'], expedientes: ['misiles'], verificar: 'Destino y fecha de los envíos.' },
  { id: 'h-negro-sale', fecha: '1993', titulo: 'Negroponte deja México', resumen: 'Pasa a la embajada en Filipinas.', evidencia: 'contexto', lugares: ['cdmx'], actores: ['negroponte'], expedientes: ['ramos-negroponte'] },
  { id: 'h-ramos-muere', fecha: '1994-10-02', titulo: 'Muere Jorge Abelardo Ramos', resumen: 'Fallece en Buenos Aires.', evidencia: 'contexto', lugares: ['bsas'], actores: ['ramos'], expedientes: ['ramos-negroponte'] },
];

export const expedientes: Expediente[] = [
  { id: 'ramos-negroponte', codigo: 'EXP-01', titulo: 'Ramos vs. Negroponte', color: '#d0a85c', pregunta: '¿Qué enfrentó al embajador argentino con el estadounidense en México, y pesó en su salida?', resumen: 'Eje central del archivo. Hoy está probado que ambos coincidieron en México y que en 1992 hubo decretos sobre el cargo de Ramos. El conflicto y su efecto siguen siendo hipótesis.', actores: ['ramos', 'negroponte', 'menem', 'emb-ar-mx', 'emb-us-mx', 'state', 'cancilleria'], pendientes: ['Decreto y fecha de designación de Ramos', 'Cables de la embajada de EE.UU. en México que mencionen a Ramos (NARA, FOIA)', 'Prensa mexicana 1990–1992: Proceso, La Jornada, Excélsior', 'Texto completo de los decretos 76 y 389 de 1992', 'Testimonios de diplomáticos argentinos de la misión', 'Historia oral de Negroponte (ADST): pasajes sobre Argentina'], busquedas: ['Abelardo Ramos embajador México', 'Negroponte Argentina ambassador', 'Negroponte Mexico 1991 memorandum'] },
  { id: 'menem-bush', codigo: 'EXP-02', titulo: 'Menem y Bush: el alineamiento', color: '#7d9fc0', pregunta: '¿Cómo se negoció el giro de la política exterior argentina entre 1989 y 1991?', resumen: 'La serie más documentada: cuatro memcons y telcons de la Biblioteca Bush y la reunión con Di Tella.', actores: ['menem', 'bush', 'cavallo', 'ditella', 'nsc', 'state'], pendientes: ['Leer y fichar los cinco documentos de la Biblioteca Bush', 'Buscar menciones de México o de Ramos en esas conversaciones', 'FRUS: volúmenes de la administración Bush'], busquedas: ['Menem Bush memorandum of conversation', 'Argentina United States relations 1990', 'Di Tella Bush 1991'] },
  { id: 'misiles', codigo: 'EXP-03', titulo: 'Los misiles: Cóndor II', color: '#c77e72', pregunta: '¿La presión por el Cóndor II formó parte de la agenda que rodeó a Ramos?', resumen: 'EE.UU. pidió el desmantelamiento del misil. Hay que fechar decisiones y ver si el tema aparece en la relación con México.', actores: ['condor', 'menem', 'bush', 'state', 'cia'], pendientes: ['Norma de desactivación', 'Documentos desclasificados CIA sobre Cóndor II', 'Envío de componentes al exterior (1993)'], busquedas: ['Condor II missile Argentina', 'Condor missile CIA', 'misil Cóndor desactivación'] },
  { id: 'yomagate', codigo: 'EXP-04', titulo: 'Yomagate y presiones', color: '#a98bc4', pregunta: '¿Los escándalos de 1991 abrieron una vía de presión sobre Menem?', resumen: 'Línea «extorsión a Menem». Exige separar lo publicado por la prensa de lo que muestran los documentos.', actores: ['yomagate', 'swiftgate', 'amira', 'ibrahim', 'todman', 'menem', 'pagina12'], pendientes: ['Primeras publicaciones del Yomagate (1991)', 'Expediente judicial y su vínculo con España', 'Cable o carta de Todman sobre Swift'], busquedas: ['Yomagate', 'Amira Yoma money laundering', 'Swift Armour Todman 1991'] },
  { id: 'mexico-tlc', codigo: 'EXP-05', titulo: 'El México de Salinas y el TLC', color: '#88a995', pregunta: '¿Qué agenda tenía Negroponte en México y dónde chocaba con una voz latinoamericanista?', resumen: 'Contexto mexicano: apertura, TLC y el memorando de Negroponte publicado por Proceso.', actores: ['salinas', 'negroponte', 'tlc', 'proceso', 'sre', 'solana'], pendientes: ['Memorando Negroponte (Proceso, 1991)', 'Posición de la SRE ante la embajada argentina', 'Discursos públicos de Ramos en México'], busquedas: ['Negroponte NAFTA memo Proceso', 'Salinas NAFTA 1991', 'Mexico foreign policy 1991 United States'] },
  { id: 'embajadores', codigo: 'EXP-06', titulo: 'Embajadores latinoamericanos', color: '#5fb3b3', pregunta: '¿Cómo reaccionó el cuerpo diplomático latinoamericano en México ante Panamá y el TLC?', resumen: 'Mapa de los embajadores de la región acreditados en México y sus posiciones públicas.', actores: ['ramos', 'sre', 'panama'], pendientes: ['Lista de embajadores latinoamericanos en México 1989–1992', 'Declaraciones conjuntas tras la invasión a Panamá', 'Prensa mexicana sobre el cuerpo diplomático'], busquedas: ['Latin American ambassadors Mexico 1990', 'Panama invasion Latin America reaction', 'cuerpo diplomático México 1990'] },
  { id: 'contexto-89', codigo: 'EXP-07', titulo: 'El mundo en 1989', color: '#8a8f98', pregunta: '¿Qué cambiaba alrededor del caso?', resumen: 'Caída del Muro, Panamá, Golfo. Contexto, no causa.', actores: ['bush', 'panama', 'golfo'], pendientes: ['Cronología internacional 1989–1991'], busquedas: ['fall of Berlin Wall Latin America', '1989 Latin America Cold War end'] },
];

export const evidenciaInfo: Record<Evidencia, { label: string; color: string; desc: string }> = {
  documentado: { label: 'Documentado', color: '#88c09a', desc: 'Respaldado por documento primario o normativa' },
  contexto: { label: 'Contexto', color: '#7d9fc0', desc: 'Hecho público del período o vínculo institucional' },
  hipotesis: { label: 'Hipótesis', color: '#e07a62', desc: 'Línea abierta: falta prueba' },
};

export const tipoInfo: Record<TipoEntidad, { label: string; color: string; shape: string }> = {
  persona: { label: 'Persona', color: '#d0a85c', shape: 'circularImage' },
  institucion: { label: 'Institución', color: '#7d9fc0', shape: 'box' },
  medio: { label: 'Medio', color: '#a98bc4', shape: 'diamond' },
  programa: { label: 'Programa', color: '#c77e72', shape: 'hexagon' },
  caso: { label: 'Caso / hecho', color: '#88a995', shape: 'triangle' },
};

export const banderas: Record<string, string> = { AR: 'Argentina', MX: 'México', US: 'EE.UU.', PA: 'Panamá', HN: 'Honduras', DE: 'Alemania', ES: 'España' };

export const porId = <T extends { id: string }>(arr: T[]) => Object.fromEntries(arr.map(x => [x.id, x])) as Record<string, T>;
export const E = porId(entidades);
export const L = porId(lugares);
export const F = porId(fuentes);
export const X = porId(expedientes);
