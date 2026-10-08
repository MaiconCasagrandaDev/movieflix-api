import { PrismaClient } from "./generated/prisma/client.js";
import express from "express";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Busca e exibe dados
app.get("/movies", async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc",
        },
        include: {
            genres: true,
            languages: true,
        },
    });
    res.json(movies);
});

// Enviar dados
app.post("/movies", async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } =
        req.body;

    try {
        const movieWithSameTitle = await prisma.movie.findFirst({
            where: { title: { equals: title, mode: "insensitive" } },
        });

        if (movieWithSameTitle) {
            return res.status(409).send({
                message: "Já existe um filme cadastrado com esse título",
            });
        }

        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date),
            },
        });
    } catch (error) {
        return res.status(500).send({ message: "Falha ao cadastrar um filme" });
    }

    res.status(201).send();
});

// Atualizar dados
app.put("/movies/:id", async (req, res) => {
    //Pega o id do registro que vai ser atualizado
    const id = Number(req.params.id);

    try {
        const movie = await prisma.movie.findUnique({
            where: {
                id,
            },
        });

        if (!movie) {
            return res.status(404).send({ message: "Filme não encontrado" });
        }

        const data = { ...req.body };
        data.release_date = data.release_date
            ? new Date(data.release_date)
            : undefined;

        //Pega os dados do filme que será atualizado e atualiza ele no prisma
        await prisma.movie.update({
            where: {
                id,
            },
            data,
        });
    } catch (error) {
        return res
            .status(500)
            .send({ message: "Falha ao atualizar o registro do filme" });
    }

    // retorna o status correto informando que o filme foi atualizado
    res.status(200).send();
});

app.listen(port, () => {
    console.log(`Servidor em execução na porta ${port}`);
});
