#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generar_informe_pdf.py — Genera un informe PDF del dataset Ramos a partir de variables.

Mismas variables del generador web:
  --fuente cruces|ideas|vars
  --origen tipo de origen (autor/obra/concepto/propuesta/peronismo o tematica/discurso/ausencia)
  --destino tipo de destino
  --intensidad 0|1|2
  --texto filtro libre
  --solo-citas  solo filas con cita verificada
  --salida archivo.pdf

Ejemplo:
  python3 generar_informe_pdf.py --fuente cruces --texto Malvinas --salida informe_malvinas.pdf
"""
import argparse, csv, json, sys, datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak)

INK = colors.HexColor('#12100d'); ACCENT = colors.HexColor('#b03a26')
GOLD = colors.HexColor('#9c7c2e'); MUT = colors.HexColor('#7c7058'); LINE = colors.HexColor('#d9cdae')

S = {
 'tit': ParagraphStyle('tit', fontName='Helvetica-Bold', fontSize=22, textColor=INK, leading=26),
 'kick': ParagraphStyle('kick', fontName='Helvetica-Bold', fontSize=9, textColor=ACCENT, leading=12),
 'h': ParagraphStyle('h', fontName='Helvetica-Bold', fontSize=13, textColor=INK, leading=16, spaceBefore=14, spaceAfter=6),
 'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10, textColor=INK, leading=14.5, alignment=TA_JUSTIFY),
 'cita': ParagraphStyle('cita', fontName='Helvetica-Oblique', fontSize=9.5, textColor=MUT, leading=13, leftIndent=14, borderPadding=(4,0,4,8)),
 'small': ParagraphStyle('small', fontName='Helvetica', fontSize=8.5, textColor=MUT, leading=11),
 'cell': ParagraphStyle('cell', fontName='Helvetica', fontSize=8.6, leading=11.5),
 'cellb': ParagraphStyle('cellb', fontName='Helvetica-Bold', fontSize=8.6, leading=11.5),
}

def load(fuente):
    if fuente == 'ideas':
        rows = []
        for r in csv.DictReader(open('/mnt/agents/output/sitio_ramos/ideas.csv', encoding='utf-8')) if False else []:
            pass
        # ideas desde el HTML
        import re
        d = open('/mnt/agents/output/prof/ideas.html', encoding='utf-8').read()
        pat = re.compile(r'<h3>(.*?)</h3>\s*<p class="def">(.*?)</p>.*?<p class="cit">(.*?)</p>.*?<b>Para discutir:</b> (.*?)</p>', re.S)
        for m in pat.finditer(d):
            cl = lambda s: re.sub(r'<[^>]+>', '', s).strip()
            rows.append({'origen': cl(m.group(1)), 'origen_tipo': 'idea', 'destino': 'debate abierto',
                         'destino_tipo': 'debate', 'vinculo': 'Pregunta: ' + cl(m.group(4)),
                         'intensidad': '2', 'cita': cl(m.group(3)), 'fuente_cita': '', 'obra_ramos': '', 'notas': ''})
        return rows
    if fuente == 'vars':
        rows = []
        for r in csv.DictReader(open('/mnt/agents/output/variables_analisis_ramos.csv', encoding='utf-8')):
            rows.append({'origen': r['variable'], 'origen_tipo': r['tipo'], 'destino': 'libros de Ramos',
                         'destino_tipo': 'obra', 'vinculo': r['definicion'], 'intensidad': '2',
                         'cita': 'Términos: ' + r['terminos_busqueda'], 'fuente_cita': r['nota_de_uso'],
                         'obra_ramos': r['obras_clave'], 'notas': ''})
        return rows
    return list(csv.DictReader(open('/mnt/agents/output/cruce_ramos.csv', encoding='utf-8')))

def narrativa(filas, params):
    grados = {}
    for r in filas:
        grados[r['origen']] = grados.get(r['origen'], 0) + 1
        grados[r['destino']] = grados.get(r['destino'], 0) + 1
    nodos = list(grados.keys())
    fr = []
    if not filas:
        return ["El filtro no produjo resultados: conviene ampliar las variables (bajar la intensidad mínima, incluir cruces sin cita o ampliar el texto de búsqueda)."]
    fr.append("El recorte selecciona %d cruces que conectan %d nodos del campo ideológico de Ramos. "
              % (len(filas), len(nodos)))
    top = max(nodos, key=lambda n: grados[n])
    tipos = set()
    for r in filas:
        if r['origen'] == top: tipos.add(r['destino_tipo'])
        if r['destino'] == top: tipos.add(r['origen_tipo'])
    fr.append("El nodo de mayor densidad es «%s» (%d vínculos), que en este recorte dialoga con %d categorías distintas: "
              % (top, grados[top], len(tipos))
              + ("se trata de un integrador conceptual, un punto donde varios registros del pensamiento de Ramos se tocan. "
                 if len(tipos) > 1 else "su funcionamiento aquí es especializado, circunscrito a un solo registro. "))
    citas = [r for r in filas if r['cita'].strip()]
    fuentes = {r['fuente_cita'] for r in citas if r['fuente_cita'].strip()}
    if citas:
        fr.append("El informe reúne %d citas textuales procedentes de %d fuentes. "
                  % (len(citas), len(fuentes))
                  + ("La diversidad de fuentes es baja: antes de usarlas en un trabajo conviene contrastarlas con la edición impresa correspondiente. "
                     if len(fuentes) <= 2 else
                     "La diversidad de fuentes permite triangulación, aunque la regla del módulo sigue vigente: verificar contra la edición impresa antes de citar. "))
    alertas = [r for r in filas if any(k in (r.get('notas') or '').lower() for k in ['verificar', 'atribu', 'varían', 'dudosa'])]
    if alertas:
        fr.append("Se detectaron %d cruces con advertencia de verificación (atribución dudosa o cifras que varían entre fuentes), que se listan al final del informe. " % len(alertas))
    fr.append("Lectura global: este recorte muestra que las ideas de Ramos no operan aisladas sino en constelación; el análisis de una sola variable suele confirmar la tesis del módulo — que el pensamiento nacional es, ante todo, una red de relaciones disputadas.")
    return fr

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--fuente', default='cruces', choices=['cruces', 'ideas', 'vars'])
    ap.add_argument('--origen', default='')
    ap.add_argument('--destino', default='')
    ap.add_argument('--intensidad', type=int, default=0)
    ap.add_argument('--texto', default='')
    ap.add_argument('--solo-citas', action='store_true')
    ap.add_argument('--salida', default='informe_ramos.pdf')
    a = ap.parse_args()

    base = load(a.fuente)
    t = a.texto.lower()
    filas = [r for r in base if
        (not a.origen or r['origen_tipo'] == a.origen) and
        (not a.destino or r['destino_tipo'] == a.destino) and
        (int(r['intensidad']) >= a.intensidad) and
        (not a.solo_citas or r['cita'].strip()) and
        (not t or t in (' '.join(str(r.get(k,'')) for k in r)).lower())]

    nom = {'cruces': 'Dataset de cruces', 'ideas': 'Diccionario de ideas', 'vars': 'Variables del codebook'}
    story = []
    story.append(Paragraph('ARCHIVO RAMOS', S['kick']))
    story.append(Paragraph('Informe generado por variables', S['tit']))
    story.append(Spacer(1, 4))
    story.append(Paragraph('Generado: %s · Fuente: %s (%d filas totales) · Dataset v1.0' % (
        datetime.datetime.now().strftime('%d/%m/%Y %H:%M'), nom[a.fuente], len(base)), S['small']))
    story.append(Spacer(1, 8))
    story.append(Paragraph('<b>Variables aplicadas:</b> origen=%s · destino=%s · intensidad≥%d · solo citas verificadas=%s · texto="%s"' % (
        a.origen or '(todas)', a.destino or '(todas)', a.intensidad, 'sí' if a.solo_citas else 'no', a.texto or '(ninguno)'), S['small']))
    story.append(Spacer(1, 10))

    story.append(Paragraph('Lectura del informe', S['h']))
    for p in narrativa(filas, a):
        story.append(Paragraph(p, S['body'])); story.append(Spacer(1, 5))

    # listas de variables
    listas = {}
    for r in filas:
        listas.setdefault(r['origen_tipo'], {}).setdefault(r['origen'], 0)
        listas[r['origen_tipo']][r['origen']] += 1
        listas.setdefault(r['destino_tipo'], {}).setdefault(r['destino'], 0)
        listas[r['destino_tipo']][r['destino']] += 1
    if listas:
        story.append(Paragraph('Listas de variables del informe', S['h']))
        nm = {'autor':'Autores','obra':'Obras','concepto':'Conceptos','propuesta':'Propuestas','peronismo':'Peronismo',
              'idea':'Ideas','debate':'Debates','tematica':'Variables temáticas','discurso':'Variables de discurso','ausencia':'Variables de ausencia'}
        for k, items in listas.items():
            line = ', '.join('%s (%d)' % (n, c) for n, c in sorted(items.items(), key=lambda x: -x[1]))
            story.append(Paragraph('<b>%s</b> (%d): %s' % (nm.get(k, k), len(items), line), S['body']))
            story.append(Spacer(1, 3))

    story.append(Paragraph('Detalle de los cruces', S['h']))
    data = [[Paragraph('<b>Origen</b>', S['cellb']), Paragraph('<b>Destino</b>', S['cellb']),
             Paragraph('<b>Vínculo</b>', S['cellb']), Paragraph('<b>Cita / fuente</b>', S['cellb'])]]
    for r in filas:
        cit = ('<i>%s</i><br/><font size=7 color="#7c7058">%s%s</font>' % (
            r['cita'], r['fuente_cita'], ' · ' + r['obra_ramos'] if r['obra_ramos'] else '')) if r['cita'].strip() else '—'
        data.append([Paragraph('<b>%s</b>' % r['origen'], S['cell']), Paragraph(r['destino'], S['cell']),
                     Paragraph(r['vinculo'], S['cell']), Paragraph(cit, S['cell'])])
    tbl = Table(data, colWidths=[34*mm, 30*mm, 52*mm, 62*mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), INK), ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, LINE), ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f4eee1')]),
        ('LEFTPADDING', (0,0), (-1,-1), 5), ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4)]))
    story.append(tbl)

    alertas = [r for r in filas if any(k in (r.get('notas') or '').lower() for k in ['verificar', 'atribu', 'varían', 'dudosa'])]
    if alertas:
        story.append(Paragraph('Alertas de verificación', S['h']))
        for r in alertas:
            story.append(Paragraph('• <b>%s × %s:</b> %s' % (r['origen'], r['destino'], r['notas']), S['body']))
            story.append(Spacer(1, 3))
    story.append(Spacer(1, 14))
    story.append(Paragraph('Advertencia: las citas provienen de fuentes secundarias verificadas por el módulo; contrastar siempre con la edición impresa antes de citar en trabajo académico.', S['small']))

    def onpage(canv, doc):
        canv.saveState(); canv.setFont('Helvetica', 7.5); canv.setFillColor(MUT)
        canv.drawString(20*mm, 12*mm, 'Archivo Ramos · informe generado por variables · dataset v1.0')
        canv.drawRightString(190*mm, 12*mm, 'pág. %d' % doc.page)
        canv.setStrokeColor(LINE); canv.setLineWidth(0.5); canv.line(20*mm, 15*mm, 190*mm, 15*mm)
        canv.restoreState()

    doc = SimpleDocTemplate(a.salida, pagesize=A4, leftMargin=20*mm, rightMargin=20*mm, topMargin=18*mm, bottomMargin=20*mm,
                            title='Informe Archivo Ramos', author='Módulo de historia política latinoamericana')
    doc.build(story, onFirstPage=onpage, onLaterPages=onpage)
    print('PDF generado: %s (%d cruces incluidos)' % (a.salida, len(filas)))

if __name__ == '__main__':
    main()
