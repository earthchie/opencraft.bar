import type { StandardContent } from './types';

export const th: StandardContent = {
  meta: {
    title: 'BLF — ข้อกำหนดรูปแบบข้อมูลเครื่องดื่ม',
    description:
      'BLF v1.0 มาตรฐานเปิดรูปแบบหนึ่งบรรทัดสำหรับข้อมูลเครื่องดื่ม ที่ทั้งคนและเครื่องอ่านได้ เสนอโดย OpenCraft',
  },

  playground: {
    label: 'BLF v1.0 · ตรวจสอบสด',
    description: 'วางหรือพิมพ์ BLF รูปแบบย่อหนึ่งเรกคอร์ดต่อบรรทัด การ์ดจะอัปเดตขณะพิมพ์',
    inputLabel: 'BLF ของคุณ',
    outputLabel: 'รายการที่แยกแล้ว',
    sampleButton: 'โหลดตัวอย่าง',
    clearButton: 'ล้าง',
    empty: 'วางบรรทัด BLF ด้านบนเพื่อดูการ์ดที่แยกแล้ว',
    statusParsed: 'แยกแล้ว',
    statusWarnings: 'คำเตือน',
    statusErrors: 'ข้อผิดพลาด',
    lineLabel: 'บรรทัด',
    unknownToken: 'โทเคนที่ไม่รู้จัก: {token}',
    vatMismatch: 'VAT ไม่ตรงกัน ({field}): คาดว่า {expected} แต่ได้ {actual}',
    missingProducer: 'ต้องระบุชื่อผู้ผลิต',
    labels: {
      order: 'ลำดับ',
      producer: 'ผู้ผลิต',
      beverage: 'เครื่องดื่ม',
      style: 'สไตล์',
      abv: 'ABV',
      size: 'ขนาด',
      container: 'บรรจุภัณฑ์',
      currency: 'สกุลเงิน',
      costExVat: 'ต้นทุน (ไม่รวม VAT)',
      costIncVat: 'ต้นทุน (รวม VAT)',
      vat: 'VAT',
      stock: 'คงเหลือ',
      retailPriceExVat: 'ราคาขาย (ไม่รวม VAT)',
      retailPriceIncVat: 'ราคาขาย (รวม VAT)',
    },
  },

  hero: {
    eyebrow: 'ข้อกำหนดเปิด · เวอร์ชัน 1.0',
    title: 'OpenCraft Beverage Line Format',
    acronym: 'BLF',
    subtitle:
      'ภาษากลางสำหรับรายการเครื่องดื่ม — คนอ่านเข้าใจ เครื่องแยกข้อมูลได้ และใช้ได้กับเครื่องดื่มทุกประเภท',
    published: 'เผยแพร่โดย OpenCraft · 3 พฤศจิกายน 2026',
    chips: [
      'หนึ่งบรรทัด หนึ่งสินค้า',
      'บังคับเฉพาะชื่อผู้ผลิต',
      'ใช้ได้กับเครื่องดื่มทุกประเภท',
      'มีเวอร์ชัน · v1.0',
    ],
  },

  toc: {
    label: 'ในหน้านี้',
    items: [
      { id: 'why', label: 'ทำไมต้องมี BLF' },
      { id: 'anatomy', label: 'โครงสร้างหนึ่งบรรทัด' },
      { id: 'fields', label: 'ตารางฟิลด์' },
      { id: 'forms', label: 'รูปแบบย่อและขยาย' },
      { id: 'vat', label: 'กฎ VAT' },
      { id: 'examples', label: 'ตัวอย่าง' },
      { id: 'machine', label: 'สำหรับนักพัฒนา' },
      { id: 'beyond', label: 'ไม่จำกัดแค่เบียร์' },
      { id: 'roadmap', label: 'ข้อจำกัดและแผนงาน' },
      { id: 'feedback', label: 'ความคิดเห็น' },
    ],
  },

  why: {
    heading: 'ทำไมต้องมี BLF',
    lead: [
      'รายการเครื่องดื่มเดินทางระหว่างผู้ผลิต ผู้จัดจำหน่าย บาร์ และลูกค้าทุกวัน — ผ่านแชท เมนูพิมพ์ สเปรดชีต และใบสั่งซื้อ แต่ละฝ่ายจัดรูปแบบต่างกัน คนรับจึงต้องพิมพ์ข้อมูลซ้ำใหม่ทุกครั้ง',
      'BLF (Beverage Line Format) คือมาตรฐานขนาดเล็กที่ OpenCraft เสนอ หนึ่งบรรทัดบอกหนึ่งเครื่องดื่ม: ใครผลิต ชื่ออะไร สไตล์ไหน แรงแค่ไหน บรรจุอย่างไร ต้นทุนเท่าไหร่ เหลือกี่ชิ้น และขายเท่าไหร่ คนอ่านเข้าใจได้ทันที และเครื่องแยกข้อมูลได้ด้วยกฎที่ไม่ต้องเดา',
    ],
    principles: [
      {
        icon: '👁️',
        title: 'คนต้องอ่านได้ก่อน',
        body: 'บรรทัดหนึ่งต้องเข้าใจได้โดยบาร์เทนเดอร์หรือผู้ซื้อ โดยไม่ต้องมีเครื่องมือ ไม่มี XML ไม่มีออบเจ็กต์ซ้อนกัน — แค่ข้อความธรรมดา',
      },
      {
        icon: '⚙️',
        title: 'เครื่องแยกได้ตามกฎ',
        body: 'ทุกโทเคนมีคำนำ คำต่อท้าย หรือหน่วยที่ชัดเจน เครื่องแยกข้อมูลจึงไม่ต้องเดาขอบเขตของฟิลด์',
      },
      {
        icon: '◻️',
        title: 'ทุกฟิลด์ไม่บังคับ',
        body: 'บังคับเฉพาะชื่อผู้ผลิต รายการสามารถเริ่มจากข้อมูลน้อยแล้วค่อยเพิ่มความสมบูรณ์ภายหลังได้โดยไม่พัง',
      },
      {
        icon: '🧩',
        title: 'คำศัพท์ขยายได้',
        body: 'ประเภทบรรจุภัณฑ์และสไตล์เป็นรายการควบคุมที่เพิ่มได้ BLF เป็นรูปแบบของเครื่องดื่ม ไม่ใช่ของเบียร์เท่านั้น',
      },
    ],
  },

  anatomy: {
    heading: 'โครงสร้างของหนึ่งบรรทัด',
    lead: 'อ่านจากซ้ายไปขวา ลำดับและชื่อผู้ผลิตคือส่วนหัวของบรรทัด หลังจากนั้นคือพารามิเตอร์ที่ระบุด้วยสัญลักษณ์ หน่วย หรือรหัสสกุลเงินของตัวเอง ไม่ได้อ้างอิงตำแหน่ง',
    pattern:
      '<order>. <producer>: <beverage>, <style> <abv> <size> <container> <currency> @<cost> [V<vat>] [@<cost-incl>v] x<stock> / <price> [<price-incl>v]',
    patternLabel: 'แพตเทิร์น',
    exampleLabel: 'ตัวอย่าง',
    exampleSegments: [
      { text: '2.', kind: 'order' },
      { text: ' ', kind: 'plain' },
      { text: 'Sample Brewing', kind: 'producer' },
      { text: ':', kind: 'plain' },
      { text: ' ', kind: 'plain' },
      { text: 'Sea Breeze', kind: 'beverage' },
      { text: ',', kind: 'plain' },
      { text: ' ', kind: 'plain' },
      { text: 'Pale Ale', kind: 'style' },
      { text: ' ', kind: 'plain' },
      { text: '5%', kind: 'abv' },
      { text: ' ', kind: 'plain' },
      { text: '440ml', kind: 'size' },
      { text: ' ', kind: 'plain' },
      { text: 'Can', kind: 'container' },
      { text: ' ', kind: 'plain' },
      { text: 'THB', kind: 'currency' },
      { text: ' ', kind: 'plain' },
      { text: '@180', kind: 'cost' },
      { text: ' ', kind: 'plain' },
      { text: 'V7.0', kind: 'vat' },
      { text: ' ', kind: 'plain' },
      { text: '@192.6v', kind: 'costInc' },
      { text: ' ', kind: 'plain' },
      { text: 'x8', kind: 'stock' },
      { text: ' ', kind: 'plain' },
      { text: '/320', kind: 'price' },
      { text: ' ', kind: 'plain' },
      { text: '342.4v', kind: 'priceInc' },
    ],
    tokenHeaders: ['โทเคน', 'ฟิลด์', 'ความหมาย'],
    tokens: [
      { token: '2.', field: 'ลำดับ (Order Number)', note: 'ดัชนีในรายการ ไม่ใช่รหัสสินค้า' },
      { token: 'Sample Brewing', field: 'ชื่อผู้ผลิต (Producer Name)', note: 'ฟิลด์เดียวที่บังคับ สิ้นสุดที่เครื่องหมาย :' },
      { token: 'Sea Breeze', field: 'ชื่อเครื่องดื่ม (Beverage Name)', note: 'อยู่หลังเครื่องหมาย : และก่อนจุลภาคตัวสุดท้าย' },
      { token: 'Pale Ale', field: 'สไตล์ (Style)', note: 'อยู่หลังจุลภาคตัวสุดท้ายในส่วนหัว' },
      { token: '5%', field: 'ABV', note: 'แอลกอฮอล์โดยปริมาตร รองรับทศนิยม' },
      { token: '440ml', field: 'ขนาดบรรจุ (Container Size)', note: 'หน่วย ml, cl, L หรือ oz' },
      { token: 'Can', field: 'ประเภทบรรจุ (Container Type)', note: 'Can, Bottle, Keg, Cask, Growler และเพิ่มเติมได้ในอนาคต' },
      { token: 'THB', field: 'สกุลเงิน (Currency)', note: 'รหัส ISO 4217 มีผลกับทุกจำนวนในเรกคอร์ด' },
      { token: '@180', field: 'ต้นทุน (ไม่รวม VAT)', note: 'ต่อหนึ่งหน่วยบรรจุ ในสกุลเงินที่ระบุหรือตกลงกัน' },
      { token: 'V7.0', field: 'อัตรา VAT', note: 'เปอร์เซ็นต์ มีผลกับทั้งเรกคอร์ด' },
      { token: '@192.6v', field: 'ต้นทุน (รวม VAT)', note: 'คำต่อท้าย v หมายถึงจำนวนที่รวม VAT แล้ว' },
      { token: 'x8', field: 'จำนวนคงเหลือ (Stock Amount)', note: 'จำนวนเต็มของหน่วยบรรจุ' },
      { token: '/320', field: 'ราคาขายปลีก (ไม่รวม VAT)', note: 'ต่อหนึ่งหน่วยบรรจุ' },
      { token: '342.4v', field: 'ราคาขายปลีก (รวม VAT)', note: 'คำต่อท้าย v หมายถึงจำนวนที่รวม VAT แล้ว' },
    ],
    footnote:
      'พารามิเตอร์สลับลำดับได้: 5% 440ml Can กับ 440ml 5% Can ให้ความหมายเดียวกัน ลำดับด้านบนคือลำดับมาตรฐานที่แนะนำ ลำดับก็ไม่บังคับเช่นกัน — ถ้าไม่ระบุ บรรทัดจะเริ่มที่ชื่อผู้ผลิต',
  },

  fields: {
    heading: 'ตารางฟิลด์',
    lead: 'ทุกฟิลด์เป็นตัวเลือก ยกเว้นชื่อผู้ผลิต ลำดับด้านล่างคือลำดับมาตรฐานที่แนะนำสำหรับทั้งรูปแบบย่อและรูปแบบขยาย',
    headers: ['ฟิลด์', 'บังคับ', 'ไวยากรณ์', 'หมายเหตุ'],
    required: 'บังคับ',
    optional: 'ไม่บังคับ',
    rows: [
      {
        field: 'ลำดับ (Order Number)',
        required: false,
        syntax: '1.',
        notes: 'ดัชนีของบรรทัด ต้องไม่ซ้ำกันภายในรายการที่เผยแพร่ ใช้เพื่อการแสดงผลเท่านั้น ไม่ใช่รหัสสินค้าถาวร',
      },
      {
        field: 'ชื่อผู้ผลิต (Producer Name)',
        required: true,
        syntax: 'Sample Brewing:',
        notes: 'แบรนด์ โรงเบียร์ หรือผู้ผลิต อาจมีจุลภาคได้ ฟิลด์สิ้นสุดที่เครื่องหมาย :',
      },
      {
        field: 'ชื่อเครื่องดื่ม (Beverage Name)',
        required: false,
        syntax: 'Sea Breeze,',
        notes: 'ชื่อสินค้า แยกจากสไตล์ที่จุลภาคตัวสุดท้ายในส่วนหัว',
      },
      {
        field: 'สไตล์ (Style)',
        required: false,
        syntax: 'Pale Ale',
        notes: 'ข้อความอิสระใน v1.0 กำลังวางแผนทะเบียนสไตล์ร่วมกัน',
      },
      {
        field: 'ABV',
        required: false,
        syntax: '5%',
        notes: 'แอลกอฮอล์โดยปริมาตรเป็นเปอร์เซ็นต์ รองรับทศนิยม และ 0% ถือว่าถูกต้อง',
      },
      {
        field: 'ขนาดบรรจุ (Container Size)',
        required: false,
        syntax: '440ml',
        notes: 'ตัวเลขพร้อมหน่วย ml, cl, L หรือ oz โดย oz คือ US fluid ounce (29.5735 ml) แปลงเป็นมิลลิลิตรเมื่อต้องเปรียบเทียบ',
      },
      {
        field: 'ประเภทบรรจุ (Container Type)',
        required: false,
        syntax: 'Can',
        notes: 'Can, Bottle, Keg, Cask, Growler และเพิ่มเติมได้',
      },
      {
        field: 'สกุลเงิน (Currency)',
        required: false,
        syntax: 'THB',
        notes: 'รหัส ISO 4217 มีผลกับทุกจำนวนในเรกคอร์ด ถ้าไม่ระบุจะใช้สกุลเงินที่ตกลงกันของรายการ',
      },
      {
        field: 'ต้นทุน (ไม่รวม VAT)',
        required: false,
        syntax: '@180',
        notes: 'ต้นทุนต่อหนึ่งหน่วยบรรจุ ในสกุลเงินที่ระบุหรือตกลงกัน คำว่า Cost เป็นคำย่อของฟิลด์นี้',
      },
      {
        field: 'อัตรา VAT',
        required: false,
        syntax: 'V7.0',
        notes: 'เปอร์เซ็นต์ มีผลกับทุกจำนวนในเรกคอร์ด ในประเทศไทยคือ 7.0',
      },
      {
        field: 'ต้นทุน (รวม VAT)',
        required: false,
        syntax: '@192.6v',
        notes: 'ระบุตรงหรือคำนวณก็ได้ ต้องมีคำต่อท้าย v',
      },
      {
        field: 'จำนวนคงเหลือ (Stock Amount)',
        required: false,
        syntax: 'x8',
        notes: 'จำนวนเต็มของหน่วยบรรจุ — กระป๋อง ขวด หรือถัง ไม่ใช่จำนวนที่เสิร์ฟ',
      },
      {
        field: 'ราคาขายปลีก (ไม่รวม VAT)',
        required: false,
        syntax: '/320',
        notes: 'ราคาต่อหนึ่งหน่วยบรรจุ คำว่า Retail Price เป็นคำย่อของฟิลด์นี้',
      },
      {
        field: 'ราคาขายปลีก (รวม VAT)',
        required: false,
        syntax: '342.4v',
        notes: 'ระบุตรงหรือคำนวณก็ได้ ต้องมีคำต่อท้าย v',
      },
    ],
    footnote:
      'จำนวนที่ไม่มีคำต่อท้าย v ถือว่าไม่รวม VAT ถ้าไม่ระบุสกุลเงิน จำนวนจะใช้สกุลเงินที่ตกลงกันของรายการ หนึ่งเรกคอร์ดไม่ควรมีหลายสกุลเงิน',
  },

  forms: {
    heading: 'สองรูปแบบที่เทียบเท่ากัน',
    lead: 'รูปแบบย่อเหมาะกับข้อความแชทและป้ายชั้นวาง รูปแบบขยายเหมาะกับการตรวจทาน แก้ไข และควบคุมเวอร์ชัน ทั้งสองรูปแบบบรรจุข้อมูลชุดเดียวกันและแปลงกลับไปมาได้โดยไม่สูญเสียข้อมูล',
    compact: {
      title: 'รูปแบบย่อ — หนึ่งบรรทัดต่อสินค้า',
      body: 'ลำดับและชื่อผู้ผลิตนำหน้าบรรทัด ตามด้วยพารามิเตอร์ที่ระบุด้วยสัญลักษณ์ หน่วย หรือรหัสสกุลเงิน ISO ตำแหน่งไม่มีความหมาย ลำดับมาตรฐานจึงเป็นเพียงธรรมเนียมเพื่อให้อ่านง่าย ไม่ใช่ข้อบังคับในการแยกข้อมูล',
      code: `1. Mock Brewery: Night Owl, Chocolate Milk Stout 5.6% 12oz Bottle THB @120 x5 / 260
2. Sample Brewing: Sea Breeze, Pale Ale 5% 440ml Can THB @180 V7.0 @192.6v x8 / 320 342.4v
3. Demo Lagerhaus, Munich Helles 5.5%`,
      notes: [
        'พารามิเตอร์ถูกตรวจจับด้วย @, V, x, / และหน่วยอย่าง %, ml และ L',
        'จำนวนเงินใช้จุดทศนิยม ห้ามใช้จุลภาคคั่นหลักพันภายในจำนวน',
        'หนึ่งเรกคอร์ดต่อหนึ่งบรรทัด บรรทัดว่างคั่นระหว่างเรกคอร์ดได้',
        'คำสำคัญและหน่วยไม่แยกตัวพิมพ์ใหญ่เล็ก การเขียนตัวพิมพ์ตามตัวอย่างคือรูปแบบมาตรฐาน',
        'สกุลเงินใช้รหัส ISO 4217 เช่น THB วางไว้ก่อนจำนวนแรก',
        'เว้นวรรคหลัง @ หรือ / ได้ จึงเขียน @180 หรือ @ 180 ก็ให้ผลเดียวกัน',
        'หนึ่งบรรทัดต่อหนึ่งรูปแบบบรรจุที่ขายจริง — เบียร์เดียวกันขนาด 330ml กับ 500ml คือสองบรรทัด',
        'ถ้าชื่อมีข้อความที่หน้าตาเหมือนโทเคน หรือสไตล์มีจุลภาค ให้ใช้รูปแบบขยายแทน',
      ],
    },
    expanded: {
      title: 'รูปแบบขยาย — หนึ่งฟิลด์ต่อบรรทัด',
      body: 'เขียน ชื่อฟิลด์: ค่า แล้วคั่นเรกคอร์ดด้วยบรรทัดว่าง รูปแบบนี้ตรวจทาน diff และกรอกด้วยมือได้ง่ายกว่า และปลอดภัยที่สุดเมื่อชื่อมีจุลภาค ตัวเลข หรือหน่วย',
      code: `Order Number: 2
Producer Name: Sample Brewing
Beverage Name: Sea Breeze
Style: Pale Ale
ABV: 5%
Container Size: 440ml
Container Type: Can
Currency: THB
Cost (VAT Excluded): 180
VAT: 7.0%
Cost (VAT Included): 192.6
Stock Amount: 8
Retail Price (VAT Excluded): 320
Retail Price (VAT Included): 342.4`,
      notes: [
        'ชื่อฟิลด์ไม่แยกตัวพิมพ์ใหญ่เล็ก แต่แนะนำให้ใช้รูปแบบมาตรฐานเมื่อเผยแพร่',
        'Cost และ Retail Price เป็นคำยอมรับได้ของฟิลด์ไม่รวม VAT',
        'เครื่องอ่านควรข้ามฟิลด์ที่ไม่รู้จัก ไม่ใช่ปฏิเสธทั้งเรกคอร์ด',
        'บรรทัดว่างเป็นตัวจบเรกคอร์ด ฟิลด์ที่ไม่ระบุถือว่าไม่มีข้อมูล',
      ],
    },
  },

  vat: {
    heading: 'กฎ VAT',
    lead: 'จำนวนเงินเป็นแบบไม่รวม VAT โดยค่าเริ่มต้น เพราะเป็นวิธีที่รายการซื้อขายส่วนใหญ่ใช้กัน คำต่อท้าย v หมายถึงจำนวนนั้นรวม VAT แล้ว ทั้งสองแบบอยู่ร่วมกันในเรกคอร์ดเดียวได้',
    rules: [
      {
        title: 'ค่าเริ่มต้นคือไม่รวม VAT',
        body: 'จำนวนใดที่ไม่มีคำต่อท้าย v ถือว่าไม่รวม VAT ใช้กับทั้งต้นทุนและราคาขายปลีก',
      },
      {
        title: 'v หมายถึงรวม VAT',
        body: 'ต่อท้ายจำนวนโดยตรง: @192.6v หรือ /342.4v และยอมรับจำนวนเปล่าที่ลงท้ายด้วย v ต่อจากจำนวนไม่รวม VAT ที่เกี่ยวข้องด้วย แต่รูปแบบนั้นอ้างอิงตำแหน่ง สำหรับรายการใหม่แนะนำให้ต่อ v กับสัญลักษณ์ @ หรือ / โดยตรง',
      },
      {
        title: 'V<rate> ประกาศอัตรา',
        body: 'อัตรามีผลกับทุกจำนวนในเรกคอร์ด ในประเทศไทยอัตรามาตรฐานคือ V7.0',
      },
      {
        title: 'คำนวณจำนวนรวม VAT',
        body: 'เมื่อรู้จำนวนไม่รวม VAT และอัตรา ให้คำนวณ จำนวน × (1 + อัตรา / 100) แล้วปัดครึ่งขึ้นที่ทศนิยมสองตำแหน่ง',
      },
      {
        title: 'ตรวจความสอดคล้อง',
        body: 'ถ้าเรกคอร์ดระบุทั้งจำนวนไม่รวมและรวม VAT ค่าทั้งคู่ควรต่างกันไม่เกิน 0.01 หากต่างมากกว่านั้นถือเป็นข้อมูลผิด',
      },
      {
        title: 'ไม่จำเป็นต้องมีอัตราเสมอ',
        body: 'จำนวนที่ลงท้ายด้วย v โดยไม่ระบุอัตราได้ หมายความว่าจำนวนนั้นรวม VAT แต่ไม่ทราบอัตรา — ห้ามเดา',
      },
    ],
    exampleTitle: 'ตัวอย่างการคำนวณ: เรกคอร์ดที่ 2',
    exampleCode: `Currency: THB
Cost (VAT Excluded): 180
VAT: 7.0%
Cost (VAT Included): 192.6
Retail Price (VAT Excluded): 320
Retail Price (VAT Included): 342.4`,
    exampleNote: '180 × 1.07 = 192.60 และ 320 × 1.07 = 342.40 ทั้งคู่ลงตัวที่ทศนิยมสองตำแหน่ง',
  },

  examples: {
    heading: 'ตัวอย่างสมมติทั้งหก',
    lead: 'เรกคอร์ดทั้งหกด้านล่างเป็นข้อมูลสมมติ ใช้ทดสอบทุกส่วนของรูปแบบ แต่ละการ์ดแสดงรูปแบบย่อและฟิลด์ในรูปแบบขยาย',
    expandedLabel: 'ฟิลด์แบบขยาย',
    cards: [
      {
        title: 'Mock Brewery — Night Owl',
        compact: '1. Mock Brewery: Night Owl, Chocolate Milk Stout 5.6% 12oz Bottle THB @120 x5 / 260',
        fields: [
          { key: 'ลำดับ', value: '1' },
          { key: 'ชื่อผู้ผลิต', value: 'Mock Brewery' },
          { key: 'ชื่อเครื่องดื่ม', value: 'Night Owl' },
          { key: 'สไตล์', value: 'Chocolate Milk Stout' },
          { key: 'ABV', value: '5.6%' },
          { key: 'ขนาดบรรจุ', value: '12oz' },
          { key: 'ประเภทบรรจุ', value: 'Bottle' },
          { key: 'สกุลเงิน', value: 'THB' },
          { key: 'ต้นทุน (ไม่รวม VAT)', value: '120' },
          { key: 'จำนวนคงเหลือ', value: '5' },
          { key: 'ราคาขายปลีก (ไม่รวม VAT)', value: '260' },
        ],
        note: 'ไม่มีการระบุ VAT จำนวนเงินทั้งสองจึงเป็นแบบไม่รวม VAT ตามค่าเริ่มต้น ขนาด 12oz แสดงการรองรับหน่วย oz',
      },
      {
        title: 'Sample Brewing — Sea Breeze',
        compact: '2. Sample Brewing: Sea Breeze, Pale Ale 5% 440ml Can THB @180 V7.0 @192.6v x8 / 320 342.4v',
        fields: [
          { key: 'ลำดับ', value: '2' },
          { key: 'ชื่อผู้ผลิต', value: 'Sample Brewing' },
          { key: 'ชื่อเครื่องดื่ม', value: 'Sea Breeze' },
          { key: 'สไตล์', value: 'Pale Ale' },
          { key: 'ABV', value: '5%' },
          { key: 'ขนาดบรรจุ', value: '440ml' },
          { key: 'ประเภทบรรจุ', value: 'Can' },
          { key: 'สกุลเงิน', value: 'THB' },
          { key: 'ต้นทุน (ไม่รวม VAT)', value: '180' },
          { key: 'VAT', value: '7.0%' },
          { key: 'ต้นทุน (รวม VAT)', value: '192.6' },
          { key: 'จำนวนคงเหลือ', value: '8' },
          { key: 'ราคาขายปลีก (ไม่รวม VAT)', value: '320' },
          { key: 'ราคาขายปลีก (รวม VAT)', value: '342.4' },
        ],
        note: 'เรกคอร์ดสมมติที่สมบูรณ์ที่สุด: มีทั้งอัตรา จำนวนคงเหลือ และต้นทุนกับราคาทั้งแบบไม่รวมและรวม VAT',
      },
      {
        title: 'Sample Brewing — Sunbeam',
        compact: '3. Sample Brewing: Sunbeam, Fruity Pale Ale 4.8% 440ml Can THB @150v x10 / 280v',
        fields: [
          { key: 'ลำดับ', value: '3' },
          { key: 'ชื่อผู้ผลิต', value: 'Sample Brewing' },
          { key: 'ชื่อเครื่องดื่ม', value: 'Sunbeam' },
          { key: 'สไตล์', value: 'Fruity Pale Ale' },
          { key: 'ABV', value: '4.8%' },
          { key: 'ขนาดบรรจุ', value: '440ml' },
          { key: 'ประเภทบรรจุ', value: 'Can' },
          { key: 'สกุลเงิน', value: 'THB' },
          { key: 'ต้นทุน (รวม VAT)', value: '150' },
          { key: 'จำนวนคงเหลือ', value: '10' },
          { key: 'ราคาขายปลีก (รวม VAT)', value: '280' },
        ],
        note: 'จำนวนแบบรวม VAT โดยไม่ระบุอัตราถือว่าถูกต้อง อัตราจะคงเป็นไม่ทราบ ไม่ใช่เดา',
      },
      {
        title: 'Demo Lagerhaus — Munich Helles',
        compact: '4. Demo Lagerhaus, Munich Helles 5.5%',
        fields: [
          { key: 'ลำดับ', value: '4' },
          { key: 'ชื่อผู้ผลิต', value: 'Demo Lagerhaus' },
          { key: 'สไตล์', value: 'Munich Helles' },
          { key: 'ABV', value: '5.5%' },
        ],
        note: 'ไม่มีเครื่องหมาย : — จุลภาคแยกผู้ผลิตออกจากสไตล์ และไม่มีชื่อเครื่องดื่ม',
      },
      {
        title: 'Mock Cocktail Co. — Citrus Club',
        compact: '5. Mock Cocktail Co.: Citrus Club, Pre-made Cocktail 330ml 5%',
        fields: [
          { key: 'ลำดับ', value: '5' },
          { key: 'ชื่อผู้ผลิต', value: 'Mock Cocktail Co.' },
          { key: 'ชื่อเครื่องดื่ม', value: 'Citrus Club' },
          { key: 'สไตล์', value: 'Pre-made Cocktail' },
          { key: 'ขนาดบรรจุ', value: '330ml' },
          { key: 'ABV', value: '5%' },
        ],
        note: 'ขนาดมาก่อน ABV — พารามิเตอร์สลับลำดับได้ และนี่คือเครื่องดื่มที่ไม่ใช่เบียร์ในรูปแบบเดียวกัน',
      },
      {
        title: 'Demo Brewing — Love, Laugh, and Sorrow',
        compact: '6. Demo Brewing: Love, Laugh, and Sorrow, QDH Hazy IPA 7.5% 20L Keg',
        fields: [
          { key: 'ลำดับ', value: '6' },
          { key: 'ชื่อผู้ผลิต', value: 'Demo Brewing' },
          { key: 'ชื่อเครื่องดื่ม', value: 'Love, Laugh, and Sorrow' },
          { key: 'สไตล์', value: 'QDH Hazy IPA' },
          { key: 'ABV', value: '7.5%' },
          { key: 'ขนาดบรรจุ', value: '20L' },
          { key: 'ประเภทบรรจุ', value: 'Keg' },
        ],
        note: 'จุลภาคตัวสุดท้ายแยกชื่อเครื่องดื่มออกจากสไตล์ จุลภาคภายในชื่อเครื่องดื่มจึงปลอดภัย',
      },
    ],
  },

  machine: {
    heading: 'สำหรับนักพัฒนา',
    lead: 'BLF ถูกออกแบบให้แยกโทเคนด้วย regular expression ไม่กี่ตัวและกฎสั้น ๆ โดยไม่ต้องมีไลบรารีเฉพาะ',
    tokenHeaders: ['โทเคน', 'แพตเทิร์น'],
    tokenRows: [
      { token: 'ลำดับ', pattern: '^\\d+\\.' },
      { token: 'ABV', pattern: '\\d+(?:\\.\\d+)?%' },
      { token: 'ขนาดบรรจุ', pattern: '\\d+(?:\\.\\d+)?(?:ml|cl|L|oz)\\b' },
      { token: 'ประเภทบรรจุ', pattern: '\\b(?:Bottle|Can|Keg|Cask|Growler)\\b' },
      { token: 'สกุลเงิน (ISO 4217)', pattern: '\\b[A-Z]{3}\\b' },
      { token: 'ต้นทุน (ไม่รวม VAT)', pattern: '@\\d+(?:\\.\\d+)?' },
      { token: 'อัตรา VAT', pattern: 'V\\d+(?:\\.\\d+)?' },
      { token: 'ต้นทุน (รวม VAT)', pattern: '@?\\d+(?:\\.\\d+)?v' },
      { token: 'จำนวนคงเหลือ', pattern: 'x\\d+' },
      { token: 'ราคาขายปลีก (ไม่รวม VAT)', pattern: '/\\d+(?:\\.\\d+)?' },
      { token: 'ราคาขายปลีก (รวม VAT)', pattern: '/?\\d+(?:\\.\\d+)?v' },
    ],
    stepsTitle: 'การแยกรูปแบบย่อ',
    parserTitle: 'Reference parser (JavaScript)',
    parserLead:
      'parser ตัวเดียวกับที่ขับเคลื่อนตัวตรวจสอบสดด้านบน ไม่มี dependency และคัดลอกไปใช้ต่อในโปรเจกต์ได้',
    copyButton: 'คัดลอกโค้ด',
    copiedButton: 'คัดลอกแล้ว',
    selectedButton: 'เลือกแล้ว — กด Ctrl+C',
    steps: [
      'ตัดช่องว่างหัวท้ายและข้ามบรรทัดว่าง หนึ่งบรรทัดที่ไม่ว่างคือหนึ่งเรกคอร์ด',
      'อ่านลำดับที่ต้นบรรทัดถ้ามี ด้วยแพตเทิร์น ^\\d+\\.',
      'ถ้ามีรหัส ISO 4217 เดี่ยว ๆ (เช่น THB) ในส่วนพารามิเตอร์ ให้บันทึกเป็นสกุลเงินของทุกจำนวนในเรกคอร์ด',
      'แยกส่วนหัวที่เครื่องหมาย : ตัวแรก ถ้าไม่มี : ให้แยกที่จุลภาคตัวแรก: ก่อนหน้าคือผู้ผลิต หลังคือสไตล์',
      'ในส่วนหัวหลัง : ให้แยกที่จุลภาคตัวสุดท้าย: ก่อนหน้าคือชื่อเครื่องดื่ม หลังคือสไตล์ ถ้าไม่มีจุลภาค ทั้งส่วนคือชื่อเครื่องดื่ม',
      'สแกนข้อความที่เหลือเพื่อหาพารามิเตอร์ด้วยแพตเทิร์นของแต่ละโทเคน ลำดับของพารามิเตอร์ไม่สำคัญ',
      'แปลงขนาดบรรจุเป็นมิลลิลิตรเมื่อต้องเปรียบเทียบ (1 oz = 29.5735 ml) แต่เก็บหน่วยเดิมไว้แสดงผล',
      'ใช้กฎ VAT และปฏิเสธเรกคอร์ดที่จำนวนไม่รวมและรวม VAT ต่างกันเกิน 0.01',
    ],
    jsonTitle: 'การแมปเป็น JSON มาตรฐาน',
    jsonCode: `{
  "orderNumber": 2,
  "producerName": "Sample Brewing",
  "beverageName": "Sea Breeze",
  "style": "Pale Ale",
  "abv": 5,
  "containerSize": { "value": 440, "unit": "ml" },
  "containerType": "Can",
  "currency": "THB",
  "costExVat": 180,
  "vatRate": 7.0,
  "costIncVat": 192.6,
  "stockAmount": 8,
  "retailPriceExVat": 320,
  "retailPriceIncVat": 342.4
}`,
    jsonNote:
      'ฟิลด์ที่ไม่มีให้ละไว้ ไม่ต้องใส่ null จำนวนเงินเป็น JSON number สกุลเงินใช้รหัส ISO 4217 และเก็บหน่วยบรรจุเดิมไว้ ถ้าไม่ระบุสกุลเงิน จะใช้สกุลเงินที่ตกลงกันของรายการ',
  },

  beyond: {
    heading: 'ไม่จำกัดแค่เบียร์',
    lead: 'BLF ย่อมาจาก Beverage Line Format และทุกฟิลด์ใช้ได้กับเครื่องดื่มบรรจุทุกประเภท เบียร์เป็นเพียงหนึ่งในหลายหมวดหมู่',
    cards: [
      {
        icon: '🍸',
        title: 'ค็อกเทลพร้อมดื่ม',
        body: 'ฟิลด์เดียวกันอธิบายค็อกเทลกระป๋องได้ สไตล์บอกหมวดสินค้า และ ABV ยังคงใช้ได้',
        example: '5. Mock Cocktail Co.: Citrus Club, Pre-made Cocktail 330ml 5%',
      },
      {
        icon: '🍷',
        title: 'มี้ด ไวน์ และสาเก',
        body: 'ผู้ผลิต ชื่อ สไตล์ ABV บรรจุภัณฑ์ และราคา ไม่มีอะไรผูกกับเบียร์ ใช้คำศัพท์สไตล์ที่เหมาะสม',
        example: '7. Mock Meadery: Wildflower, Semi-Sweet Mead 12% 375ml Bottle THB @320 x12 / 650',
      },
      {
        icon: '💧',
        title: 'ไม่มีแอลกอฮอล์',
        body: '0% เป็น ABV ที่ถูกต้อง ใช้สไตล์เช่น Non-Alcoholic, Hop Water หรือ Soft Drink',
        example: '8. Mock Brewery: Hop Water, Non-Alcoholic Sparkling 0% 330ml Can THB @28 x24 / 65',
      },
    ],
  },

  roadmap: {
    heading: 'ข้อจำกัดและเส้นทางสู่ v1.1',
    lead: 'มาตรฐานที่ดีต้องบอกข้อจำกัดของตัวเอง นี่คือช่องว่างของ v1.0 ที่ OpenCraft กำลังพิจารณาสำหรับเวอร์ชันถัดไป',
    versionLabel: 'เสนอ',
    items: [
      {
        version: 'v1.1',
        title: 'รหัสสินค้าถาวร',
        body: 'ลำดับเป็นเพียงดัชนีแสดงผล โทเคน SKU ที่ไม่บังคับจะช่วยให้ระบบจับคู่สินค้าเดียวกันข้ามการอัปเดตได้',
      },
      {
        version: 'v1.1',
        title: 'ส่วนหัวของรายการและข้อมูลเมตา',
        body: 'ส่วนหัวระดับรายการสามารถประกาศเวอร์ชัน BLF สกุลเงินเริ่มต้น อัตรา VAT เริ่มต้น และวันที่มีผลครั้งเดียว แทนการเขียนซ้ำในทุกเรกคอร์ด',
      },
      {
        version: 'v1.1',
        title: 'ทะเบียนสไตล์',
        body: 'สไตล์เป็นข้อความอิสระใน v1.0 ทะเบียนชื่อมาตรฐานร่วมกันจะทำให้ค้นหาและกรองได้แม่นยำ โดยยังอนุญาตข้อความอิสระ',
      },
      {
        version: 'v1.1',
        title: 'การ escape และ quoting',
        body: 'ชื่อที่มีข้อความคล้ายโทเคน เช่นเครื่องดื่มที่ชื่อ “440ml” ต้องมีทางหนี รูปแบบขยายคือทางออกชั่วคราว',
      },
      {
        version: 'v1.2',
        title: 'ชุดทดสอบอ้างอิง',
        body: 'ชุดทดสอบสาธารณะจะทำให้ parser สองตัวตีความตรงกันทุกกรณี',
      },
    ],
  },

  feedback: {
    heading: 'ลองใช้ แล้วบอกเราว่าพังตรงไหน',
    body: 'BLF เป็นข้อเสนอเปิด ยังไม่ใช่มาตรฐานอุตสาหกรรมที่เสร็จสมบูรณ์ ลองนำไปใช้กับรายการจริงของคุณ ทดสอบ และส่งข้อแก้ไขหรือกรณีขอบมาให้เรา ตัวอย่างจากโลกจริงคือทางที่เร็วที่สุดที่จะทำให้ v1.1 ดีขึ้น',
    email: 'hi@opencraft.bar',
    button: 'ส่งความคิดเห็น',
    footer: 'BLF v1.0 · เสนอโดย OpenCraft · 3 พฤศจิกายน 2026',
  },
};
