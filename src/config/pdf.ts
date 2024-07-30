import { PdfConfig } from "md-to-pdf/dist/lib/config";

export const pdfConfig: Partial<PdfConfig> = {
    // stylesheet: ['path/to/style.css', 'https://example.org/stylesheet.css'],
    // css: `body { color: tomato; }`,
    // body_class: ['markdown-body'],
    marked_options: {
        headerIds: false,
        smartypants: true,
    },
    pdf_options: {
        format: 'A5',
        margin: {
            bottom: '10mm',
            top: '10mm',
            left: '10mm',
            right: '10mm',
        },
        printBackground: true,
    },
    stylesheet_encoding: 'utf-8',
}
