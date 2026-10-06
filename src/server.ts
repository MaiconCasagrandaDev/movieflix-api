import express from "express";
import { log } from "node:console";

const port = 3000;
const app = express();

app.get("/movies", (req, res) => {
    res.send("Listagem de filmes");
});

app.listen(port, () => {
    console.log(`Servidor em execução na porta ${port}`);
});
