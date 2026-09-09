// 1. Define the icons cleanly in one place
export const ICONS = {
  image: 'image',
  pdf: 'picture_as_pdf',
  zip: 'folder_zip',
  spreadsheet: 'table_chart',
  doc: 'description',
  fallback: 'insert_drive_file'
};

// 2. Map types to their respective icon key
export const fileTypeRegistry = {
  // Images
  '.jpg': ICONS.image, '.jpeg': ICONS.image, '.png': ICONS.image,
  'image/jpeg': ICONS.image, 'image/png': ICONS.image,

  // PDF
  '.pdf': ICONS.pdf, 'application/pdf': ICONS.pdf,

  // ZIP
  '.zip': ICONS.zip, 'application/zip': ICONS.zip, 'application/x-zip-compressed': ICONS.zip,

  // Spreadsheets
  '.csv': ICONS.spreadsheet, 'text/csv': ICONS.spreadsheet,
  '.xls': ICONS.spreadsheet, '.xlsx': ICONS.spreadsheet,
  'application/vnd.ms-excel': ICONS.spreadsheet,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ICONS.spreadsheet,

  // Word Docs
  '.doc': ICONS.doc, '.docx': ICONS.doc,
  'application/msword': ICONS.doc,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ICONS.doc
};
