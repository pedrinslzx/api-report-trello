import { MarkedOptions } from "marked";
import path from 'path'
import { HtmlConfig, PdfConfig } from "md-to-pdf/dist/lib/config";

export const pdfConfig: Partial<PdfConfig> = {
    stylesheet: [path.join(__dirname, '..', 'styles.css')],
    // stylesheet: ['path/to/style.css', 'https://example.org/stylesheet.css'],
    // css: `body { color: tomato; }`,
    // body_class: ['markdown-body'],
    marked_options: {} satisfies MarkedOptions,
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
    as_html: false,
}

export const htmlConfig: Partial<HtmlConfig> = {
    stylesheet: [path.join(__dirname, '..', 'styles.css')],
    // css: `body { color: tomato; }`,
    // body_class: ['markdown-body'],
    marked_options: {} satisfies MarkedOptions,
    as_html: true,
    pdf_options: {
        format: 'A4',
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
