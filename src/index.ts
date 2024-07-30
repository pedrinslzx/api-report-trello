import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import morgan from "morgan";

import { mdToPdf } from "md-to-pdf";
import { parseTrello, TrelloItem } from "./trello";
import { calculeReport, generateCleanReport, generateReport, generateReportMax, ReportItem } from "./report";
import { pdfConfig } from "./config/pdf";

const app = express();

app.use(bodyParser.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

app.post("/", (req: Request, res: Response) => {
  try {
    const dataToSave = req.body;

    const trelloItems = Object.entries(dataToSave as Record<string, string>).map(([key, value]) => [key, parseTrello(value)] as const).reduce((l, n) => ({ ...l, [n[0]]: n[1] }), {} as Record<string, TrelloItem[]>)
    const reportItems = Object.entries(trelloItems).map(([key, value]) => [key, calculeReport(value)] as const).reduce((l, n) => ({ ...l, [n[0]]: n[1] }), {} as Record<string, ReportItem[]>)
    const reportMarkdown = generateReport(reportItems)
    const cleanReportMarkdown = generateCleanReport(reportItems)
    const maxReportMarkdown = generateReportMax(reportItems)

    const timestamp = Date.now();

    // fs.writeFileSync(
    //   path.join(dataDir, `data_${timestamp}_1.json`),
    //   JSON.stringify(
    //     dataToSave,
    //     null,
    //     2,
    //   ),
    // );
    fs.writeFileSync(
      path.join(dataDir, `data_${timestamp}_2.json`),
      JSON.stringify(
        trelloItems,
        null,
        2,
      ),
    );
    // fs.writeFileSync(
    //   path.join(dataDir, `data_${timestamp}_3.json`),
    //   JSON.stringify(
    //     reportItems,
    //     null,
    //     2,
    //   ),
    // );
    fs.writeFileSync(
      path.join(dataDir, `data_${timestamp}.md`),
      reportMarkdown,
    );

    mdToPdf({ content: reportMarkdown }, pdfConfig).then(output => {
      // fs.writeFileSync(path.join(dataDir, `data_${timestamp}.pdf`), output.content);
      fs.writeFileSync(path.join(dataDir, `report.pdf`), output.content);
    })
    mdToPdf({ content: cleanReportMarkdown }, pdfConfig).then(output => {
      // fs.writeFileSync(path.join(dataDir, `data_${timestamp}.pdf`), output.content);
      fs.writeFileSync(path.join(dataDir, `report_clean.pdf`), output.content);
    })
    mdToPdf({ content: maxReportMarkdown }, pdfConfig).then(output => {
      // fs.writeFileSync(path.join(dataDir, `data_${timestamp}.pdf`), output.content);
      fs.writeFileSync(path.join(dataDir, `report_max.pdf`), output.content);
    })

    res
      .status(200)
      .json({ message: "Dados salvos com sucesso!", body: req.body });
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
    res.status(500).json({ error: "Erro ao salvar os dados" });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(dataDir, `report.pdf`))
})
app.get('/max', (req, res) => {
  res.sendFile(path.join(dataDir, `report_max.pdf`))
})
app.get('/clean', (req, res) => {
  res.sendFile(path.join(dataDir, `report_clean.pdf`))
})

app.listen(3000, () => {
  console.log(`Servidor rodando em http://localhost:${3000}/`);
});
