/**
 * PDF Export utility for reports
 */

interface PDFOptions {
  filename: string;
  title?: string;
  subtitle?: string;
}

/**
 * Export a chart or table to PDF
 * Note: Requires jspdf and html2pdf libraries
 */
export async function exportChartToPDF(
  elementId: string,
  options: PDFOptions
): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Dynamic import for html2pdf
    const html2pdf = (await import('html2pdf.js')).default;

    const opt = {
      margin: 10,
      filename: options.filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' },
    };

    html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Error exporting to PDF');
  }
}

/**
 * Export table data to PDF
 */
export async function exportTableToPDF(
  data: Record<string, unknown>[],
  columns: string[],
  options: PDFOptions
): Promise<void> {
  try {
    const jsPDF = (await import('jspdf')).jsPDF;
    await import('jspdf-autotable');

    const doc = new jsPDF();
    
    // Add title
    if (options.title) {
      doc.setFontSize(16);
      doc.text(options.title, 14, 15);
    }
    
    // Add subtitle
    if (options.subtitle) {
      doc.setFontSize(12);
      doc.text(options.subtitle, 14, 25);
    }

    // Add table
    (doc as unknown as { autoTable: (config: unknown) => void }).autoTable({
      head: [columns],
      body: data.map(row => columns.map(col => row[col] || '')),
      startY: options.subtitle ? 35 : 25,
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
    });

    doc.save(options.filename);
  } catch (error) {
    console.error('Error exporting table to PDF:', error);
    throw new Error('Error exporting table to PDF');
  }
}

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Download file to user's device
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/csv'
): void {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`
  );
  element.setAttribute('download', filename);
  element.style.display = 'none';
  
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Export JSON data
 */
export function exportJSON(data: Record<string, unknown>, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, filename, 'application/json');
}
