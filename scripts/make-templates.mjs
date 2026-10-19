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
  WidthType,
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
const h1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, keepNext: true, children: [new TextRun(text)] });
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: [new TextRun(text)] });
const bullet = (text) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, keepNext: true, spacing: { after: 60 }, children: [new TextRun(text)] });
const hint = (text) => new Paragraph({ spacing: { after: 120 }, keepNext: true, children: [new TextRun({ text, italics: true, color: '5B6B80', size: 19 })] });

function cell(text, width, { shade = false, bold = false, keep = false } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders,
    margins: cellMargins,
    shading: shade ? { type: ShadingType.CLEAR, color: 'auto', fill: MINT } : undefined,
    children: [new Paragraph({ keepNext: keep, children: [new TextRun({ text: text || '', bold, color: bold ? NAVY : undefined, size: 20 })] })],
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
        height: { value: 480, rule: HeightRule.ATLEAST },
        children: [cell(label, widths[0], { shade: true, bold: true, keep }), cell('', widths[1], { keep })],
      });
    }),
  });
}

/** A bordered box to write in. */
function answerBox(height = 1600, total = PORTRAIT_W) {
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: [total],
    rows: [new TableRow({ height: { value: height, rule: HeightRule.ATLEAST }, children: [cell('', total)] })],
  });
}

/** Header row plus blank rows. */
function gridTable(headers, widths, rows = 6, rowHeight = 560) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: headers.map((h, i) => cell(h, widths[i], { shade: true, bold: true, keep: true })) }),
      ...Array.from({ length: rows }, () => new TableRow({ cantSplit: true, height: { value: rowHeight, rule: HeightRule.ATLEAST }, children: widths.map((w) => cell('', w)) })),
    ],
  });
}

const gap = () => new Paragraph({ spacing: { after: 160 }, keepNext: true, children: [] });

function docShell(title, sections) {
  const header = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: 'Exempt', bold: true, color: TEAL, size: 18 }), new TextRun({ text: 'Accommodation.com', bold: true, color: NAVY, size: 18 })],
      }),
    ],
  });
  const footer = new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({ text: `${title}. Free template from ${SITE}. Adapt it to your service and your commissioner's requirements.  Page `, color: '5B6B80', size: 16 }),
          new TextRun({ children: [PageNumber.CURRENT], color: '5B6B80', size: 16 }),
        ],
      }),
    ],
  });
  return new Document({
    creator: 'ExemptAccommodation.com',
    title,
    description: `${title} template for supported housing in England`,
    styles: {
      default: { document: { run: { font: 'Arial', size: 21 } } },
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
  const section = (title, prompts, height = 1700) => [h2(title), ...prompts.map(bullet), gap(), answerBox(height)];
  const children = [
    h1('Needs assessment'),
    p('Complete this with the resident on the day they move in, or within four weeks at the latest. The support plan is built from it, so take the time to get it right.'),
    hint('Use referral information as a starting point, not a copy. Write in plain words the resident would recognise.'),
    h2('About this assessment'),
    fieldTable([
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
    ]),
    ...section('1. Housing history', [
      'Where have you lived over the last two years?',
      'Past tenancies, and how each one ended.',
      'Any rent arrears, evictions or housing register restrictions.',
      'What has helped you keep a home before?',
    ]),
    ...section('2. Physical and mental health', [
      'Registered with a GP? Name of the practice.',
      'Current conditions, treatment and medication.',
      'Hospital stays in the last year.',
      'Mental health support in place, and who provides it.',
    ]),
    ...section('3. Drug and alcohol use', ['Current use, if any.', 'Treatment or recovery support in place.', "The resident's own goals on drug or alcohol use."], 1300),
    ...section('4. Money, debts and benefits', [
      'Income and benefits, including the status of any Housing Benefit or Universal Credit claim.',
      'Debts, and who they are owed to.',
      'Bank account and ID.',
    ], 1300),
    ...section('5. Risks', [
      'Risks to the resident, to others and from others.',
      'Offending history, licence conditions and probation contact, where relevant.',
      'Any safeguarding concerns, and who has been told.',
      'Risk information received before move-in, and anything still missing.',
    ]),
    ...section('6. Relationships, family, education and work', ['Family, children and contact arrangements.', 'Friends and support networks.', 'Education, training, volunteering or work.'], 1300),
    ...section("7. What the resident wants", ['Goals, in their own words.', 'What has helped before, and what has not.', 'Anything they do not want from support.']),
    new Paragraph({ children: [new PageBreak()] }),
    h2('Summary of needs'),
    hint('List each need found above. Priority needs go straight into the support plan.'),
    gridTable(['Need', 'Priority (high, medium, low)', 'In the support plan?'], [5200, 2400, 2038], 8, 520),
    h2('Consent to share information'),
    p('The resident agrees that we can share relevant information with the following people or services. Write each one and tick to confirm.'),
    gridTable(['Person or service', 'Reason', 'Agreed (tick)'], [4000, 4200, 1438], 5, 480),
    h2('Sign-off'),
    fieldTable(['Resident signature and date', 'Staff signature and date', 'Manager review: name, date and comments']),
  ];
  return docShell('Needs assessment', [{ children }]);
}

// ---------------------------------------------------------------- Support plan

function supportPlan() {
  const goal = (n) => [
    h2(`Goal ${n}`),
    fieldTable(
      [
        "The goal, in the resident's own words",
        'Why it matters to them',
        'First steps (the next two weeks)',
        'Support we will give: who, how often, where',
        'How we will know it is working',
        'Target date',
      ],
      PORTRAIT_W,
      3600,
    ),
  ];
  const portrait = [
    h1('Support plan'),
    p("Write goals in the resident's own words. Two to four goals is plenty. Small first steps get done, and getting them done builds trust for the harder goals."),
    hint('Review the plan at least every three months, and sooner after any big change such as a hospital stay, an incident or a change in benefits.'),
    h2('About this plan'),
    fieldTable(['Resident name', 'Key worker', 'Plan start date', 'Based on the needs assessment dated', 'Next review date']),
    ...goal(1),
    ...goal(2),
    ...goal(3),
    ...goal(4),
    h2('Managing risk'),
    gridTable(['Risk', 'What we will do', 'Who', 'Review by'], [2900, 4100, 1400, 1238], 4, 600),
    h2('Moving on'),
    fieldTable(['Where the resident wants to live next', 'What could get in the way', 'Actions and who will do them', 'Housing register and move-on scheme status']),
    h2('Sign-off'),
    fieldTable(['I helped write this plan (resident signature and date)', 'Key worker signature and date']),
    gap(),
    h1('Plan review log'),
    p('Record each review here. Look at what has been achieved as well as what has not.'),
    gridTable(['Review date', 'What has been achieved', 'What has changed', 'Changes to the plan', 'Next review', 'Resident initials'], [1250, 2250, 1950, 1950, 1050, 1188], 8, 900),
  ];
  const landscape = [
    h1('Support session record'),
    p('One row per session. Write it on the day, so someone who was not there can follow what happened and why.'),
    gridTable(
      ['Date', 'Start', 'End', 'Who was there', 'What we did', 'Plan goal', 'Risks or concerns', 'Next actions', 'Initials'],
      [1250, 850, 850, 1850, 3500, 1200, 1950, 2070, 1050],
      12,
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

function titleBlock(ws, title, intro) {
  ws.getCell('A1').value = title;
  ws.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF14304F' } };
  ws.getCell('A2').value = intro;
  ws.getCell('A2').font = { italic: true, color: { argb: 'FF5B6B80' } };
  ws.getCell('A2').alignment = { wrapText: false };
}

function guideSheet(wb, title, lines) {
  const ws = wb.addWorksheet('How to use', { properties: { tabColor: { argb: 'FF129994' } } });
  ws.getColumn(1).width = 110;
  ws.getCell('A1').value = title;
  ws.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FF14304F' } };
  lines.forEach((l, i) => {
    const c = ws.getCell(`A${i + 3}`);
    c.value = l;
    c.alignment = { wrapText: true, vertical: 'top' };
  });
  const last = ws.getCell(`A${lines.length + 5}`);
  last.value = `Free template from ${SITE}. Guidance covers England and is general information, not legal advice.`;
  last.font = { italic: true, color: { argb: 'FF5B6B80' } };
  return ws;
}

function printSetup(wb) {
  wb.eachSheet((ws) => {
    ws.pageSetup = { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 } };
    ws.headerFooter = { oddFooter: `&L&8Free template from ${SITE}&R&8Page &P of &N` };
    ws.eachRow((row, n) => {
      if (n <= 2 && ws.name !== 'How to use') return; // titles stay on one line
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
  });
  const grand = ws.getRow(sumRow + 3);
  grand.getCell(3).value = 'Total weekly charge per resident';
  grand.getCell(3).font = { bold: true, color: { argb: 'FF0E7A76' } };
  grand.getCell(5).value = { formula: `IF(${beds}=0,"",SUM($D$${first}:$D$${lastRow})/52/${beds})` };
  grand.getCell(5).numFmt = '£#,##0.00';
  grand.getCell(5).font = { bold: true, color: { argb: 'FF0E7A76' } };

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
    const start = row;
    for (const q of a.questions) {
      const r = ws.getRow(row);
      r.values = [a.title, q.id.toUpperCase(), q.text, '', '', '', '', ''];
      r.getCell(3).alignment = { wrapText: true, vertical: 'top' };
      r.getCell(1).alignment = { vertical: 'top' };
      r.getCell(4).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Yes,Partly,No,Not sure"'] };
      r.getCell(7).numFmt = 'dd/mm/yyyy';
      for (let c = 1; c <= 8; c++) r.getCell(c).border = boxed;
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
  const o = sum.getRow(srow + 1);
  o.values = ['Overall', { formula: `SUM(B5:B${srow - 1})` }, { formula: `SUM(C5:C${srow - 1})` }, { formula: `SUM(D5:D${srow - 1})` }, { formula: `SUM(E5:E${srow - 1})` }, { formula: `SUM(F5:F${srow - 1})` }, { formula: `ROUND((2*B${srow + 1}+C${srow + 1})/(2*F${srow + 1})*100,0)` }];
  o.font = { bold: true, color: { argb: 'FF0E7A76' } };
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
