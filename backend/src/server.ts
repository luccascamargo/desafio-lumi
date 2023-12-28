import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import PdfController from "./controllers/PdfController";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(fileUpload());

app.use(express.urlencoded({ extended: true }));

const pdfController = new PdfController();

app.post("/upload", pdfController.upload);

app.post("/download/:id?", pdfController.download);

app.get("/list", pdfController.list);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
