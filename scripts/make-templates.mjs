// Builds the free downloadable templates into public/downloads/ (served at /downloads/, kept out of search results by public/_headers so the landing pages rank instead).
// Usage: npm run templates
// Word files use the docx library, Excel files use exceljs. Both are dev dependencies.
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  HeightRule,
  LevelFormat,
  Packer,
  PageBreak,
  PageNumber,
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  TabStopType,
} from 'docx';
import ExcelJS from 'exceljs';
import { areas } from '../src/data/readiness.ts';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'public', 'downloads');
mkdirSync(out, { recursive: true });

const NAVY = '14304F';
const TEAL = '129994';
const TEAL_DARK = '0E7A76';
const MINT = 'E7F6F4';
const LINE = 'C9CFD8';
const PALE = 'F4F7FA';
const MUTED = '5B6B80';
const AUDIT_URL = 'supportaudit.co.uk/book-a-call';
const SITE = 'exemptaccommodation.com';

// ---------------------------------------------------------------- Word helpers

const A4 = { width: 11906, height: 16838 };
const MARGIN = 1134; // 2 cm
const PORTRAIT_W = A4.width - MARGIN * 2;
const LANDSCAPE_W = A4.height - MARGIN * 2;

const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 90, bottom: 90, left: 120, right: 120 };

const p = (text, opts = {}) =>
  new Paragraph({ spacing: { after: 120 }, ...opts, children: [new TextRun({ text, ...(opts.run || {}) })] });
const bullet = (text) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, keepNext: true, spacing: { after: 60 }, children: [new TextRun({ text, color: '33475E' })] });
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: none, bottom: none, left: none, right: none };
const fill = (c) => ({ type: ShadingType.CLEAR, color: 'auto', fill: c });
const run = (text, o = {}) => new TextRun({ text, ...o });

/** One-cell coloured panel used for banners, tips and calls to action. */
function panel(paragraphs, { bg = NAVY, total = PORTRAIT_W, left = null, pad = 240 } = {}) {
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: [total],
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: total, type: WidthType.DXA },
            shading: fill(bg),
            borders: left ? { ...noBorders, left: { style: BorderStyle.SINGLE, size: 36, color: left } } : noBorders,
            margins: { top: pad, bottom: pad, left: pad + 60, right: pad + 60 },
            children: paragraphs,
          }),
        ],
      }),
    ],
  });
}

/** Cover band at the top of the first page. */
function cover(title, subtitle, meta, total = PORTRAIT_W) {
  return panel(
    [
      new Paragraph({ spacing: { after: 80 }, children: [run('FREE TEMPLATE', { bold: true, color: '8FE3DC', size: 17, characterSpacing: 40 }), run('   ·   ExemptAccommodation.com', { color: 'B8C7D9', size: 17 })] }),
      new Paragraph({ spacing: { after: 100 }, children: [run(title, { bold: true, color: 'FFFFFF', size: 60 })] }),
      new Paragraph({ spacing: { after: 140 }, children: [run(subtitle, { color: 'DCE6F0', size: 22 })] }),
      new Paragraph({ children: meta.flatMap((m, i) => [run(i ? '      ' : ''), run('■ ', { color: TEAL, size: 18 }), run(m, { color: 'FFFFFF', size: 18, bold: true })]) }),
    ],
    { total, pad: 360 },
  );
}

/** Three numbered "how to use" cards. */
function steps(items, total = PORTRAIT_W) {
  const w = Math.floor(total / items.length);
  const widths = items.map((_, i) => (i === items.length - 1 ? total - w * (items.length - 1) : w));
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        cantSplit: true,
        children: items.map(
          ([head, body], i) =>
            new TableCell({
              width: { size: widths[i], type: WidthType.DXA },
              shading: fill(MINT),
              borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 24, color: TEAL }, right: { style: BorderStyle.SINGLE, size: 24, color: 'FFFFFF' } },
              margins: { top: 160, bottom: 160, left: 180, right: 180 },
              children: [
                new Paragraph({ spacing: { after: 60 }, children: [run(String(i + 1).padStart(2, '0'), { bold: true, color: TEAL, size: 32 })] }),
                new Paragraph({ spacing: { after: 40 }, children: [run(head, { bold: true, color: NAVY, size: 20 })] }),
                new Paragraph({ children: [run(body, { color: '33475E', size: 18 })] }),
              ],
            }),
        ),
      }),
    ],
  });
}

let sectionNo = 0;
/** Numbered section heading: teal number tile and a navy title on a rule. */
function h2(text, total = PORTRAIT_W) {
  const m = /^(\d+)\.\s+(.*)$/.exec(text);
  const num = m ? m[1] : String(++sectionNo);
  const label = m ? m[2] : text;
  const nw = 620;
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: [nw, total - nw],
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({ width: { size: nw, type: WidthType.DXA }, shading: fill(TEAL), borders: noBorders, verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 60, right: 60 }, children: [new Paragraph({ keepNext: true, alignment: AlignmentType.CENTER, children: [run(num.padStart(2, '0'), { bold: true, color: 'FFFFFF', size: 24 })] })] }),
          new TableCell({ width: { size: total - nw, type: WidthType.DXA }, borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 12, color: TEAL } }, verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 200, right: 60 }, children: [new Paragraph({ keepNext: true, children: [run(label, { bold: true, color: NAVY, size: 28 })] })] }),
        ],
      }),
    ],
  });
}
/** Section headings with their own spacing paragraph above. */
const H2 = (text, total) => [new Paragraph({ spacing: { before: 240, after: 0 }, keepNext: true, children: [] }), h2(text, total), new Paragraph({ spacing: { after: 100 }, keepNext: true, children: [] })];

/** Slim navy band that opens a new part of the document. */
const h1 = (text, total = PORTRAIT_W) =>
  panel([new Paragraph({ keepNext: true, children: [run(text, { bold: true, color: 'FFFFFF', size: 36 })] })], { total, pad: 200 });

const hint = (text, total = PORTRAIT_W) =>
  panel([new Paragraph({ keepNext: true, children: [run('TIP   ', { bold: true, color: TEAL_DARK, size: 17, characterSpacing: 30 }), run(text, { color: '33475E', size: 19 })] })], { bg: MINT, left: TEAL, total, pad: 140 });

function cell(text, width, { shade = false, bold = false, keep = false, head = false } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: head ? { top: none, bottom: none, left: { style: BorderStyle.SINGLE, size: 4, color: '2A4B70' }, right: { style: BorderStyle.SINGLE, size: 4, color: '2A4B70' } } : shade ? { ...borders, left: { style: BorderStyle.SINGLE, size: 24, color: TEAL } } : borders,
    margins: cellMargins,
    verticalAlign: VerticalAlign.CENTER,
    shading: head ? fill(NAVY) : shade ? fill(MINT) : undefined,
    children: [new Paragraph({ keepNext: keep, children: [new TextRun({ text: text || '', bold: bold || head, color: head ? 'FFFFFF' : bold ? NAVY : undefined, size: head ? 18 : 20 })] })],
  });
}

/** Two-column label / blank answer table. */
function fieldTable(labels, total = PORTRAIT_W, labelW = 3400) {
  const widths = [labelW, total - labelW];
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: labels.map((label, i) => {
      const keep = i < labels.length - 1; // keep the whole table on one page
      return new TableRow({
        cantSplit: true,
        height: { value: 520, rule: HeightRule.ATLEAST },
        children: [cell(label, widths[0], { shade: true, bold: true, keep }), cell('', widths[1], { keep })],
      });
    }),
  });
}

/** A bordered box to write in, with a small label. */
function answerBox(height = 1600, total = PORTRAIT_W, label = 'Notes') {
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: [total],
    rows: [
      new TableRow({
        height: { value: height, rule: HeightRule.ATLEAST },
        children: [
          new TableCell({
            width: { size: total, type: WidthType.DXA },
            borders: { ...borders, left: { style: BorderStyle.SINGLE, size: 24, color: LINE } },
            shading: fill('FBFCFD'),
            margins: cellMargins,
            children: [new Paragraph({ children: [run(label.toUpperCase(), { bold: true, color: '9AA7B6', size: 15, characterSpacing: 30 })] })],
          }),
        ],
      }),
    ],
  });
}

/** Header row plus blank rows, with light banding. */
function gridTable(headers, widths, rows = 6, rowHeight = 560) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, height: { value: 460, rule: HeightRule.ATLEAST }, children: headers.map((h, i) => cell(h, widths[i], { head: true, keep: true })) }),
      ...Array.from(
        { length: rows },
        (_, r) =>
          new TableRow({
            cantSplit: true,
            height: { value: rowHeight, rule: HeightRule.ATLEAST },
            children: widths.map((w) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders, margins: cellMargins, shading: r % 2 ? fill(PALE) : undefined, children: [new Paragraph({ children: [] })] })),
          }),
      ),
    ],
  });
}

/** Goal card: teal bar with the goal number, then the prompts. */
function goalCard(n, labels, total = PORTRAIT_W) {
  return [
    new Paragraph({ spacing: { before: 240 }, keepNext: true, children: [] }),
    keep([panel([new Paragraph({ keepNext: true, children: [run(`GOAL ${n}`, { bold: true, color: 'FFFFFF', size: 22, characterSpacing: 40 }), run("     in the resident's own words", { color: 'D6F3F0', size: 18, italics: true })] })], { bg: TEAL, total, pad: 120 }),
    fieldTable(labels, total, 3600)], total),
  ];
}

/** Closing call to action for Support Audit. */
function cta(total = PORTRAIT_W) {
  return [
    new Paragraph({ spacing: { before: 360 }, keepNext: true, children: [] }),
    keep([panel(
      [
        new Paragraph({ spacing: { after: 80 }, keepNext: true, children: [run('■ ■ ■ ■  ', { color: TEAL, size: 16 }), run('SUPPORT AUDIT', { bold: true, color: '8FE3DC', size: 17, characterSpacing: 40 })] }),
        new Paragraph({ spacing: { after: 80 }, keepNext: true, children: [run('Would your files stand up to a licensing check?', { bold: true, color: 'FFFFFF', size: 30 })] }),
        new Paragraph({ spacing: { after: 100 }, keepNext: true, children: [run('Support Audit carries out independent audits of resident support files in supported exempt accommodation. Every file is rated Gold, Green, Amber or Red, with the reason and what good looks like.', { color: 'DCE6F0', size: 19 })] }),
        new Paragraph({ children: [run('Book a free discovery call:  ', { color: 'FFFFFF', size: 19 }), run(AUDIT_URL, { bold: true, color: '8FE3DC', size: 19 })] }),
      ],
      { total, pad: 320 },
    )], total),
  ];
}

const gap = () => new Paragraph({ spacing: { after: 160 }, keepNext: true, children: [] });

/** Wraps a heading and its content in one unsplittable block, so a heading is never left alone at the foot of a page. */
function keep(children, total = PORTRAIT_W) {
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: [total],
    rows: [new TableRow({ cantSplit: true, children: [new TableCell({ width: { size: total, type: WidthType.DXA }, borders: noBorders, margins: { top: 0, bottom: 0, left: 0, right: 0 }, children: [...children, new Paragraph({ children: [] })] })] })],
  });
}
const block = (title, content, total = PORTRAIT_W) => [new Paragraph({ spacing: { before: 120 }, children: [] }), keep([h2(title, total), new Paragraph({ spacing: { after: 100 }, children: [] }), ...content], total)];

function docShell(title, sections) {
  const header = new Header({
    children: [
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: PORTRAIT_W }],
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: TEAL, space: 6 } },
        children: [run(title.toUpperCase(), { bold: true, color: MUTED, size: 15, characterSpacing: 30 }), run('\t'), run('Exempt', { bold: true, color: TEAL, size: 18 }), run('Accommodation.com', { bold: true, color: NAVY, size: 18 })],
      }),
    ],
  });
  const footer = new Footer({
    children: [
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: PORTRAIT_W }],
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 6 } },
        children: [
          run(`Free template from ${SITE}. Adapt it to your service and your commissioner's requirements.`, { color: MUTED, size: 15 }),
          run('\tPage ', { color: MUTED, size: 15 }),
          new TextRun({ children: [PageNumber.CURRENT], color: NAVY, bold: true, size: 15 }),
          run(' of ', { color: MUTED, size: 15 }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], color: NAVY, bold: true, size: 15 }),
        ],
      }),
    ],
  });
  return new Document({
    creator: 'ExemptAccommodation.com',
    title,
    description: `${title} template for supported housing in England`,
    styles: {
      default: { document: { run: { font: 'Arial', size: 21, color: '1F2D3D' } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 40, bold: true, color: NAVY }, paragraph: { spacing: { before: 120, after: 120 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 26, bold: true, color: TEAL_DARK }, paragraph: { spacing: { before: 280, after: 100 }, outlineLevel: 1 } },
      ],
    },
    numbering: {
      config: [{ reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] }],
    },
    sections: sections.map((s) => ({
      properties: {
        page: {
          size: { width: A4.width, height: A4.height, orientation: s.landscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT },
          margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
        },
      },
      headers: { default: header },
      footers: { default: footer },
      children: s.children,
    })),
  });
}

// ---------------------------------------------------------------- Needs assessment

function needsAssessment() {
  sectionNo = 0;
  const section = (title, prompts, height = 1700) => block(title, [...prompts.map(bullet), gap(), answerBox(height, PORTRAIT_W, 'What the resident told us')]);
  const children = [
    cover('Needs assessment', 'The starting point for every support plan. Complete it with the resident, in plain words they would recognise.', ['Within 4 weeks of move-in', '7 areas of need', 'Feeds the support plan']),
    gap(),
    steps([
      ['Sit down together', 'Complete it with the resident on move-in day, or within four weeks at the latest.'],
      ['Work through each area', 'Use the prompts as a guide, not a script. Write down what the resident says.'],
      ['Turn needs into goals', 'Rate each need in the summary. Priority needs go straight into the support plan.'],
    ]),
    gap(),
    hint('Use referral information as a starting point, not a copy. A reviewer will look for the resident\'s own voice.'),
    ...block('1. About this assessment', [fieldTable([
      'Resident name',
      'Date of birth',
      'Scheme and address',
      'Move-in date',
      'Assessment date',
      'Within four weeks of move-in?',
      'Completed by (name and role)',
      'Resident present and involved?',
      'Referred by',
      'Documents received from the referrer',
    ])]),
    ...section('2. Housing history', [
      'Where have you lived over the last two years?',
      'Past tenancies, and how each one ended.',
      'Any rent arrears, evictions or housing register restrictions.',
      'What has helped you keep a home before?',
    ]),
    ...section('3. Physical and mental health', [
      'Registered with a GP? Name of the practice.',
      'Current conditions, treatment and medication.',
      'Hospital stays in the last year.',
      'Mental health support in place, and who provides it.',
    ]),
    ...section('4. Drug and alcohol use', ['Current use, if any.', 'Treatment or recovery support in place.', "The resident's own goals on drug or alcohol use."], 1300),
    ...section('5. Money, debts and benefits', [
      'Income and benefits, including the status of any Housing Benefit or Universal Credit claim.',
      'Debts, and who they are owed to.',
      'Bank account and ID.',
    ], 1300),
    ...section('6. Risks', [
      'Risks to the resident, to others and from others.',
      'Offending history, licence conditions and probation contact, where relevant.',
      'Any safeguarding concerns, and who has been told.',
      'Risk information received before move-in, and anything still missing.',
    ]),
    ...section('7. Relationships, family, education and work', ['Family, children and contact arrangements.', 'Friends and support networks.', 'Education, training, volunteering or work.'], 1300),
    ...section('8. What the resident wants', ['Goals, in their own words.', 'What has helped before, and what has not.', 'Anything they do not want from support.']),
    new Paragraph({ children: [new PageBreak()] }),
    h1('Summary and sign-off'),
    ...block('9. Summary of needs', [hint('List each need found above. Priority needs go straight into the support plan.'), gap(), gridTable(['Need', 'Priority (high, medium, low)', 'In the support plan?'], [5200, 2400, 2038], 8, 520)]),
    ...block('10. Consent to share information', [p('The resident agrees that we can share relevant information with the following people or services. Write each one and tick to confirm.'), gridTable(['Person or service', 'Reason', 'Agreed (tick)'], [4000, 4200, 1438], 5, 480)]),
    ...block('11. Sign-off', [fieldTable(['Resident signature and date', 'Staff signature and date', 'Manager review: name, date and comments'])]),
    ...cta(),
  ];
  return docShell('Needs assessment', [{ children }]);
}

// ---------------------------------------------------------------- Support plan

function supportPlan() {
  sectionNo = 0;
  const goalLabels = [
    'The goal',
    'Why it matters to them',
    'First steps (the next two weeks)',
    'Support we will give: who, how often, where',
    'How we will know it is working',
    'Target date',
  ];
  const portrait = [
    cover('Support plan', 'Goals that follow from assessed needs, written with the resident and reviewed as life changes.', ['2 to 4 goals', 'Review every 3 months', 'Session record included']),
    gap(),
    steps([
      ['Start from the assessment', 'Every goal should trace back to a need recorded in the needs assessment.'],
      ['Keep goals small', "Write them in the resident's own words. Small first steps get done and build trust."],
      ['Record and review', 'Log each session against a goal, and review the plan at least every three months.'],
    ]),
    gap(),
    hint('Review sooner after any big change, such as a hospital stay, an incident or a change in benefits.'),
    ...block('About this plan', [fieldTable(['Resident name', 'Key worker', 'Plan start date', 'Based on the needs assessment dated', 'Next review date'])]),
    ...goalCard(1, goalLabels),
    ...goalCard(2, goalLabels),
    ...goalCard(3, goalLabels),
    ...goalCard(4, goalLabels),
    ...block('Managing risk', [gridTable(['Risk', 'What we will do', 'Who', 'Review by'], [2900, 4100, 1400, 1238], 4, 600)]),
    ...block('Moving on', [fieldTable(['Where the resident wants to live next', 'What could get in the way', 'Actions and who will do them', 'Housing register and move-on scheme status'])]),
    ...block('Sign-off', [fieldTable(['I helped write this plan (resident signature and date)', 'Key worker signature and date'])]),
    new Paragraph({ children: [new PageBreak()] }),
    h1('Plan review log'),
    gap(),
    hint('Record each review here. Look at what has been achieved as well as what has not.'),
    gap(),
    gridTable(['Review date', 'What has been achieved', 'What has changed', 'Changes to the plan', 'Next review', 'Resident initials'], [1250, 2250, 1950, 1950, 1050, 1188], 8, 900),
    ...cta(),
  ];
  const landscape = [
    h1('Support session record', LANDSCAPE_W),
    gap(),
    hint('One row per session. Write it on the day, so someone who was not there can follow what happened and why. Link every session to a plan goal.', LANDSCAPE_W),
    gap(),
    gridTable(
      ['Date', 'Start', 'End', 'Who was there', 'What we did', 'Plan goal', 'Risks or concerns', 'Next actions', 'Initials'],
      [1250, 850, 850, 1850, 3500, 1200, 1950, 2070, 1050],
      10,
      620,
    ),
  ];
  return docShell('Support plan', [{ children: portrait }, { children: landscape, landscape: true }]);
}

// ---------------------------------------------------------------- Excel helpers

const thin = { style: 'thin', color: { argb: 'FFC9CFD8' } };
const boxed = { top: thin, left: thin, bottom: thin, right: thin };

function styleHeader(row) {
  row.eachCell((c) => {
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF14304F' } };
    c.alignment = { vertical: 'middle', wrapText: true };
    c.border = boxed;
  });
  row.height = 32;
}

const navyFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF14304F' } };
const solid = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });

/** Navy banner across the sheet, with a mint strapline underneath. */
function titleBlock(ws, title, intro) {
  const cols = Math.max(ws.columns ? ws.columns.length : 1, 1);
  const last = String.fromCharCode(64 + cols);
  ws.views = [{ ...(ws.views && ws.views[0] ? ws.views[0] : {}), showGridLines: false }];
  ws.mergeCells(`A1:${last}1`);
  ws.mergeCells(`A2:${last}2`);
  const t = ws.getCell('A1');
  t.value = { richText: [{ text: 'EXEMPTACCOMMODATION.COM   ', font: { bold: true, size: 9, color: { argb: 'FF8FE3DC' } } }, { text: title, font: { bold: true, size: 18, color: { argb: 'FFFFFFFF' } } }] };
  t.fill = navyFill;
  t.alignment = { vertical: 'middle', indent: 1 };
  ws.getRow(1).height = 42;
  const i = ws.getCell('A2');
  i.value = intro;
  i.font = { italic: true, color: { argb: 'FF0E7A76' } };
  i.fill = solid('FFE7F6F4');
  i.alignment = { vertical: 'middle', indent: 1 };
  ws.getRow(2).height = 24;
}

function guideSheet(wb, title, lines) {
  const ws = wb.addWorksheet('How to use', { properties: { tabColor: { argb: 'FF129994' } } });
  ws.columns = [{ width: 7 }, { width: 104 }];
  titleBlock(ws, title, 'Free template. Work through the steps below, then use the other tabs.');
  lines.forEach((l, i) => {
    const r = ws.getRow(i + 4);
    const m = /^(\d+)\.\s+(.*)$/.exec(l);
    const n = r.getCell(1);
    n.value = m ? m[1].padStart(2, '0') : 'i';
    n.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
    n.fill = solid(m ? 'FF129994' : 'FF14304F');
    n.alignment = { horizontal: 'center', vertical: 'middle' };
    const c = r.getCell(2);
    c.value = m ? m[2] : l;
    c.fill = solid(i % 2 ? 'FFFFFFFF' : 'FFF4F7FA');
    c.alignment = { wrapText: true, vertical: 'middle', indent: 1 };
    c.border = { bottom: { style: 'thin', color: { argb: 'FFE1E6EC' } } };
    r.height = Math.max(30, Math.ceil(c.value.length / 95) * 16 + 12);
  });
  const ctaRow = lines.length + 6;
  ws.mergeCells(`A${ctaRow}:B${ctaRow}`);
  ws.mergeCells(`A${ctaRow + 1}:B${ctaRow + 1}`);
  const c1 = ws.getCell(`A${ctaRow}`);
  c1.value = { richText: [{ text: 'SUPPORT AUDIT   ', font: { bold: true, size: 9, color: { argb: 'FF8FE3DC' } } }, { text: 'Would your files stand up to a licensing check?', font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } } }] };
  c1.fill = navyFill;
  c1.alignment = { vertical: 'middle', indent: 1 };
  ws.getRow(ctaRow).height = 34;
  const c2 = ws.getCell(`A${ctaRow + 1}`);
  c2.value = 'Independent resident file audits, rated Gold, Green, Amber or Red. Book a free discovery call at supportaudit.co.uk/book-a-call';
  c2.font = { color: { argb: 'FFDCE6F0' } };
  c2.fill = navyFill;
  c2.alignment = { vertical: 'middle', indent: 1, wrapText: true };
  ws.getRow(ctaRow + 1).height = 30;
  const last = ws.getCell(`B${ctaRow + 3}`);
  last.value = `Free template from ${SITE}. Guidance covers England and is general information, not legal advice.`;
  last.font = { italic: true, size: 9, color: { argb: 'FF5B6B80' } };
  return ws;
}

/** Light zebra banding on data rows. */
function band(ws, from, to, cols) {
  for (let r = from; r <= to; r++) if ((r - from) % 2) for (let c = 1; c <= cols; c++) { const cell = ws.getRow(r).getCell(c); if (!cell.fill || cell.fill.type !== 'pattern') cell.fill = solid('FFF4F7FA'); }
}

function printSetup(wb) {
  wb.eachSheet((ws) => {
    // One typeface everywhere, including cells that only have a colour or bold set.
    ws.eachRow({ includeEmpty: true }, (row) => row.eachCell({ includeEmpty: true }, (c) => {
      if (c.value && typeof c.value === 'object' && c.value.richText) c.value = { richText: c.value.richText.map((t) => ({ ...t, font: { name: 'Arial', ...(t.font || {}) } })) };
      c.font = { name: 'Arial', size: 10, ...(c.font || {}) };
    }));
    ws.pageSetup = { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 } };
    ws.headerFooter = { oddFooter: `&L&8Free template from ${SITE}&R&8Page &P of &N` };
    ws.eachRow((row, n) => {
      if (n <= 2 || ws.name === 'How to use') return; // banners and the guide keep their own layout
      row.eachCell((c) => (c.alignment = { ...(c.alignment || {}), vertical: 'top', wrapText: true }));
    });
  });
}

// ---------------------------------------------------------------- Rent and service charge schedule

async function rentSchedule() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'ExemptAccommodation.com';
  guideSheet(wb, 'Rent and service charge schedule', [
    '1. Fill in the scheme details at the top of the Schedule sheet, including the number of bed spaces.',
    '2. Enter the annual cost of each line and say how it is calculated. Replace the example lines with your own.',
    '3. Set the type of each line: Eligible, Ineligible or Depends. Depends means the line is only eligible if your evidence supports it, such as intensive housing management backed by time records.',
    '4. The sheet works out the weekly charge per resident and the totals by type. Housing Benefit can only cover Eligible lines and the Depends lines you can evidence.',
    '5. Keep support, counselling and personal care out of the rent. Housing Benefit never pays for them.',
    '6. At the end of each year, fill in the Reconciliation sheet to compare what you charged with what you spent.',
    '7. Use the IHM time record for any staff whose time is split between housing management and support.',
  ]);

  const ws = wb.addWorksheet('Schedule', { views: [{ state: 'frozen', ySplit: 9 }] });
  ws.columns = [{ width: 44 }, { width: 14 }, { width: 46 }, { width: 16 }, { width: 18 }, { width: 36 }];
  titleBlock(ws, 'Rent and service charge schedule', 'Annual costs in, weekly charge per resident out. Type: Eligible, Ineligible or Depends.');
  const details = [
    ['Scheme', ''],
    ['Landlord', ''],
    ['Charging period (from and to)', ''],
    ['Number of bed spaces', 6],
    ['Prepared by and date', ''],
  ];
  details.forEach(([k, v], i) => {
    const r = ws.getRow(3 + i);
    r.getCell(1).value = k;
    r.getCell(1).font = { bold: true };
    r.getCell(2).value = v;
    r.getCell(2).border = boxed;
    r.getCell(2).fill = solid('FFFFFBEA');
    r.getCell(1).fill = solid('FFE7F6F4');
    r.getCell(1).font = { bold: true, color: { argb: 'FF14304F' } };
  });
  const beds = '$B$6';
  const head = ws.getRow(9);
  head.values = ['Charge', 'Type', 'How it is calculated', 'Annual cost (£)', 'Weekly per resident (£)', 'Evidence held'];
  styleHeader(head);

  const lines = [
    ['Core rent: lease or loan payments', 'Eligible', 'Annual lease rent from the lease schedule'],
    ['Core rent: buildings insurance', 'Eligible', 'Current policy premium'],
    ['Core rent: major repairs and replacements provision', 'Eligible', 'Planned maintenance programme'],
    ['Core rent: voids and bad debts allowance', 'Eligible', 'Percentage of rent, based on last year'],
    ['Core rent: general housing management', 'Eligible', 'Share of housing staff and overheads'],
    ['Cleaning of communal areas', 'Eligible', 'Contract price or staff time'],
    ['Heating, lighting and hot water in communal areas', 'Eligible', 'Share of bills for shared areas only'],
    ['Furniture and household equipment', 'Eligible', 'Replacement cost spread over expected life'],
    ['Communal TV aerial, door entry and laundry facilities', 'Eligible', 'Maintenance contracts'],
    ['Grounds maintenance and communal window cleaning', 'Eligible', 'Contract price'],
    ['Intensive housing management', 'Depends', 'Time records, separate from support'],
    ["Fuel for the resident's own room", 'Ineligible', 'Metered or estimated share'],
    ['Water charges', 'Ineligible', 'Water bill'],
    ['Meals', 'Ineligible', 'Not provided'],
    ['Support, counselling or key work', 'Ineligible', 'Funded by commissioner or provider'],
    ['', '', ''],
    ['', '', ''],
  ];
  const first = 10;
  lines.forEach((l, i) => {
    const r = ws.getRow(first + i);
    r.getCell(1).value = l[0];
    r.getCell(2).value = l[1];
    r.getCell(3).value = l[2];
    r.getCell(4).value = null;
    r.getCell(4).numFmt = '£#,##0.00';
    r.getCell(5).value = { formula: `IF(OR(D${first + i}="",${beds}=0),"",D${first + i}/52/${beds})` };
    r.getCell(5).numFmt = '£#,##0.00';
    for (let c = 1; c <= 6; c++) r.getCell(c).border = boxed;
    r.getCell(2).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Eligible,Ineligible,Depends"'] };
  });
  const lastRow = first + lines.length - 1;
  band(ws, first, lastRow, 6);
  ws.addConditionalFormatting({
    ref: `B${first}:B${lastRow}`,
    rules: [
      { type: 'cellIs', operator: 'equal', formulae: ['"Eligible"'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFD7F2E6' } }, font: { bold: true, color: { argb: 'FF1E7A4F' } } }, priority: 1 },
      { type: 'cellIs', operator: 'equal', formulae: ['"Depends"'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFBF0D9' } }, font: { bold: true, color: { argb: 'FF9A6A12' } } }, priority: 2 },
      { type: 'cellIs', operator: 'equal', formulae: ['"Ineligible"'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFDE1DB' } }, font: { bold: true, color: { argb: 'FFB0402B' } } }, priority: 3 },
    ],
  });
  for (let i = first; i <= lastRow; i++) ws.getRow(i).getCell(4).fill = solid('FFFFFBEA');
  const sumRow = lastRow + 2;
  const totals = [
    ['Total eligible', 'Eligible'],
    ['Total depends on evidence', 'Depends'],
    ['Total ineligible', 'Ineligible'],
  ];
  totals.forEach(([label, type], i) => {
    const r = ws.getRow(sumRow + i);
    r.getCell(3).value = label;
    r.getCell(3).font = { bold: true };
    r.getCell(4).value = { formula: `SUMIF($B$${first}:$B$${lastRow},"${type}",$D$${first}:$D$${lastRow})` };
    r.getCell(5).value = { formula: `IF(${beds}=0,"",D${sumRow + i}/52/${beds})` };
    r.getCell(4).numFmt = '£#,##0.00';
    r.getCell(5).numFmt = '£#,##0.00';
    for (let c = 3; c <= 5; c++) { r.getCell(c).fill = solid('FFE7F6F4'); r.getCell(c).border = boxed; }
  });
  const grand = ws.getRow(sumRow + 3);
  for (let c = 3; c <= 5; c++) { grand.getCell(c).fill = navyFill; grand.getCell(c).border = boxed; }
  grand.height = 26;
  grand.getCell(3).value = 'Total weekly charge per resident';
  grand.getCell(3).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  grand.getCell(5).value = { formula: `IF(${beds}=0,"",SUM($D$${first}:$D$${lastRow})/52/${beds})` };
  grand.getCell(5).numFmt = '£#,##0.00';
  grand.getCell(5).font = { bold: true, size: 13, color: { argb: 'FF8FE3DC' } };

  const rec = wb.addWorksheet('Reconciliation');
  rec.columns = [{ width: 44 }, { width: 18 }, { width: 18 }, { width: 16 }, { width: 50 }];
  titleBlock(rec, 'Service charge reconciliation', 'Compare what you charged last year with what you spent. Explain any big difference.');
  const rh = rec.getRow(4);
  rh.values = ['Charge', 'Charged (£)', 'Actual spend (£)', 'Difference (£)', 'Explanation'];
  styleHeader(rh);
  lines.slice(5, 11).forEach((l, i) => {
    const r = rec.getRow(5 + i);
    r.getCell(1).value = l[0];
    r.getCell(4).value = { formula: `IF(AND(B${5 + i}="",C${5 + i}=""),"",B${5 + i}-C${5 + i})` };
    [2, 3, 4].forEach((c) => (r.getCell(c).numFmt = '£#,##0.00'));
    for (let c = 1; c <= 5; c++) r.getCell(c).border = boxed;
  });

  const ihm = wb.addWorksheet('IHM time record');
  ihm.columns = [{ width: 14 }, { width: 22 }, { width: 44 }, { width: 14 }, { width: 44 }, { width: 14 }, { width: 18 }];
  titleBlock(ihm, 'Intensive housing management time record', 'Housing management counts towards the rent. Support does not. Record both so you can show the split.');
  const ih = ihm.getRow(4);
  ih.values = ['Date', 'Staff member', 'Housing management task', 'Minutes', 'Support task (not in the rent)', 'Minutes', 'Property or room'];
  styleHeader(ih);
  for (let i = 0; i < 40; i++) {
    const r = ihm.getRow(5 + i);
    for (let c = 1; c <= 7; c++) r.getCell(c).border = boxed;
    r.getCell(1).numFmt = 'dd/mm/yyyy';
  }
  const t = ihm.getRow(46);
  t.getCell(3).value = 'Total minutes';
  t.getCell(3).font = { bold: true };
  t.getCell(4).value = { formula: 'SUM(D5:D44)' };
  t.getCell(6).value = { formula: 'SUM(F5:F44)' };
  const share = ihm.getRow(47);
  share.getCell(3).value = 'Share of time that is housing management';
  share.getCell(3).font = { bold: true };
  share.getCell(4).value = { formula: 'IF(D46+F46=0,"",D46/(D46+F46))' };
  share.getCell(4).numFmt = '0%';

  printSetup(wb);
  return wb.xlsx.writeBuffer();
}

// ---------------------------------------------------------------- Licensing readiness checklist

async function readinessChecklist() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'ExemptAccommodation.com';
  guideSheet(wb, 'Licensing readiness checklist', [
    '1. Work through the Checklist sheet for your service, or copy the sheet once per scheme.',
    '2. Set the status of each item: Yes, Partly, No or Not sure. Treat Not sure as a gap, because a reviewer will.',
    '3. For every Yes, write where the evidence is kept. A yes with no evidence is a partly.',
    '4. Give every gap an owner and a due date. Start with anything that affects resident safety.',
    '5. The Summary sheet scores each area out of 100. Repeat the check every six months.',
    'The items follow what councils test in Housing Benefit reviews and what the April 2026 government response says licensing will test from 2027.',
  ]);

  const ws = wb.addWorksheet('Checklist', { views: [{ state: 'frozen', ySplit: 4 }] });
  ws.columns = [{ width: 26 }, { width: 7 }, { width: 70 }, { width: 13 }, { width: 34 }, { width: 18 }, { width: 13 }, { width: 34 }];
  titleBlock(ws, 'Licensing readiness checklist', 'Status: Yes, Partly, No or Not sure. Every gap needs an owner and a date.');
  const head = ws.getRow(4);
  head.values = ['Area', 'Ref', 'Item', 'Status', 'Where the evidence is', 'Owner', 'Due date', 'Notes'];
  styleHeader(head);

  const extra = {
    id: 'licensing',
    title: 'Licensing preparation',
    questions: [
      { id: 'l1', text: 'Have you listed every scheme with its address, landlord, support provider, bed spaces and commissioning status?' },
      { id: 'l2', text: 'Have you checked each scheme against the licensing exemptions and written down your reasoning?' },
      { id: 'l3', text: 'Have you mapped your service against the proposed national supported housing standards?' },
      { id: 'l4', text: "Have you contacted your council's supported housing team about its strategy and licensing plans?" },
    ],
  };
  let row = 5;
  const areaRows = {};
  for (const a of [...areas, extra]) {
    ws.mergeCells(`A${row}:H${row}`);
    const band = ws.getCell(`A${row}`);
    band.value = a.title.toUpperCase();
    band.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    band.fill = solid('FF129994');
    band.alignment = { vertical: 'middle', indent: 1 };
    ws.getRow(row).height = 22;
    row++;
    const start = row;
    for (const q of a.questions) {
      const r = ws.getRow(row);
      r.values = [a.title, q.id.toUpperCase(), q.text, '', '', '', '', ''];
      r.getCell(3).alignment = { wrapText: true, vertical: 'top' };
      r.getCell(1).alignment = { vertical: 'top' };
      r.getCell(4).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Yes,Partly,No,Not sure"'] };
      r.getCell(7).numFmt = 'dd/mm/yyyy';
      for (let c = 1; c <= 8; c++) r.getCell(c).border = boxed;
      if ((row - start) % 2) for (const c of [1, 2, 3]) r.getCell(c).fill = solid('FFF4F7FA');
      r.getCell(1).font = { color: { argb: 'FF5B6B80' }, size: 9 };
      r.getCell(2).font = { bold: true, color: { argb: 'FF129994' } };
      r.getCell(4).fill = solid('FFFFFBEA');
      r.height = 34;
      row++;
    }
    areaRows[a.title] = [start, row - 1];
  }
  const last = row - 1;
  ws.addConditionalFormatting({
    ref: `D5:D${last}`,
    rules: [
      { type: 'cellIs', operator: 'equal', formulae: ['"Yes"'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFD7F2E6' } } }, priority: 1 },
      { type: 'cellIs', operator: 'equal', formulae: ['"Partly"'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFBF0D9' } } }, priority: 2 },
      { type: 'cellIs', operator: 'equal', formulae: ['"No"'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFDE1DB' } } }, priority: 3 },
      { type: 'cellIs', operator: 'equal', formulae: ['"Not sure"'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFDE1DB' } } }, priority: 4 },
    ],
  });

  const sum = wb.addWorksheet('Summary');
  sum.columns = [{ width: 32 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }, { width: 14 }, { width: 14 }];
  titleBlock(sum, 'Readiness summary', 'Score = (2 for each Yes + 1 for each Partly) divided by twice the number of items.');
  const sh = sum.getRow(4);
  sh.values = ['Area', 'Yes', 'Partly', 'No', 'Not sure', 'Items', 'Score /100'];
  styleHeader(sh);
  let srow = 5;
  for (const [title, [a, b]] of Object.entries(areaRows)) {
    const r = sum.getRow(srow);
    const rng = `Checklist!$D$${a}:$D$${b}`;
    r.values = [
      title,
      { formula: `COUNTIF(${rng},"Yes")` },
      { formula: `COUNTIF(${rng},"Partly")` },
      { formula: `COUNTIF(${rng},"No")` },
      { formula: `COUNTIF(${rng},"Not sure")` },
      b - a + 1,
      { formula: `ROUND((2*B${srow}+C${srow})/(2*F${srow})*100,0)` },
    ];
    for (let c = 1; c <= 7; c++) r.getCell(c).border = boxed;
    srow++;
  }
  sum.addConditionalFormatting({
    ref: `G5:G${srow + 1}`,
    rules: [
      { type: 'dataBar', priority: 1, minLength: 0, maxLength: 100, cfvo: [{ type: 'num', value: 0 }, { type: 'num', value: 100 }], color: { argb: 'FF129994' }, gradient: false },
      { type: 'cellIs', operator: 'greaterThanOrEqual', formulae: ['75'], style: { font: { bold: true, color: { argb: 'FF1E7A4F' } } }, priority: 2 },
      { type: 'cellIs', operator: 'between', formulae: ['50', '74'], style: { font: { bold: true, color: { argb: 'FF9A6A12' } } }, priority: 3 },
      { type: 'cellIs', operator: 'lessThan', formulae: ['50'], style: { font: { bold: true, color: { argb: 'FFB0402B' } } }, priority: 4 },
    ],
  });
  band(sum, 5, srow - 1, 7);
  const o = sum.getRow(srow + 1);
  o.values = ['Overall', { formula: `SUM(B5:B${srow - 1})` }, { formula: `SUM(C5:C${srow - 1})` }, { formula: `SUM(D5:D${srow - 1})` }, { formula: `SUM(E5:E${srow - 1})` }, { formula: `SUM(F5:F${srow - 1})` }, { formula: `ROUND((2*B${srow + 1}+C${srow + 1})/(2*F${srow + 1})*100,0)` }];
  o.eachCell((c) => { c.fill = navyFill; c.font = { bold: true, color: { argb: 'FFFFFFFF' } }; c.border = boxed; });
  o.height = 26;
  sum.getCell(`A${srow + 3}`).value = 'Green 75 and over: ready to evidence.   Amber 50 to 74: gaps to close.   Red under 50: act now.';
  sum.getCell(`A${srow + 3}`).font = { italic: true, size: 9, color: { argb: 'FF5B6B80' } };
  printSetup(wb);
  return wb.xlsx.writeBuffer();
}

// ---------------------------------------------------------------- Write files

const files = [
  ['needs-assessment-template.docx', await Packer.toBuffer(needsAssessment())],
  ['support-plan-template.docx', await Packer.toBuffer(supportPlan())],
  ['rent-and-service-charge-schedule.xlsx', Buffer.from(await rentSchedule())],
  ['licensing-readiness-checklist.xlsx', Buffer.from(await readinessChecklist())],
];
for (const [name, buf] of files) {
  writeFileSync(path.join(out, name), buf);
  console.log(`${name}  ${(buf.length / 1024).toFixed(1)} KB`);
}
