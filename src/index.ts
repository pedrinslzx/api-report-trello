import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import morgan from "morgan";

// import { mdToPdf } from "md-to-pdf";
import { parseTrello, TrelloItem } from "./trello";

const app = express();
const port = 3000;

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

    const timestamp = Date.now();

    fs.writeFileSync(
      path.join(dataDir, `data_${timestamp}.json`),
      JSON.stringify(
        Object.entries(dataToSave as Record<string, string>).map(([key, value]) => [key, parseTrello(value)] as const).reduce((l,n) => ({...l, [n[0]]: n[1]}), {} as Record<string, TrelloItem[]>),
        null,
        2,
      ),
    );

    // mdToPdf({content:dataToSave.data}).then(output => {
    //     fs.writeFileSync(path.join(dataDir, output.filename || `data_${timestamp}.pdf`), output.content);
    // })

    res
      .status(200)
      .json({ message: "Dados salvos com sucesso!", body: req.body });
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
    res.status(500).json({ error: "Erro ao salvar os dados" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/`);
});
