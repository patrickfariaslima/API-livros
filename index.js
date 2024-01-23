const express = require('express');
const Sequelize = require('sequelize');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: './books.db'
});

// DEFIINIÇÃO DE COMO SERÁ O BANCO DE DADOS - MODELS:

const Book = database.define('book', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false
  },
  bookPublisher: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ISBN: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  genre: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

function routes(app){

// (GET ALL BOOKS) - DANDO GET EM TODOS OS LIVROS:
  app.get("/", async (request, response) => {
    let {limit} = request.query;

    let bookList = await Book.findAll({ limit });

    response.json(bookList);
  });

  // (GET ONE BOOK) - DANDO GET EM APENAS UM LIVRO:
  app.get("/:id", async (request, response) => {
    const book = await Book.findByPk(request.params.id);
    if(!book) return response.status(404).end("O livro não foi encontrado! :( ");

    response.json(book);
  });

  // (CREATE ONE BOOK) - CRIANDO UM LIVRO NA LISTA:
  app.post("/", async (request, response) =>{
    const book = await Book.create(request.body);

    response.status(201).json(book);
  });

  // (UPDATE ONE BOOK) - ATUALIZANDO UM LIVRO NA LISTA:
  app.put("/:id", async (request, response) =>{

    const filter = {
      where: { id: request.params.id },
    };

    const [bookAffected] = await Book.update(request.body, filter);

    if(bookAffected === 0) return response.status(404).end("O livro não foi encontrado :(");

    const updatedBook = await Book.findByPk(request.params.id);

    response.json(updatedBook);
  });

  // (DELETE ONE BOOK) - DELETANDO UM LIVRO DA LISTA:
  app.delete("/:id", async (request, response) => {
    const filter = { where: { id: request.params.id } };

    const countDeleted = await Book.destroy(filter);
    if(countDeleted <=0) return response.status(404).end("O livro não foi encontrado! :( ");

    response.end("Livro removido da lista com sucesso! :D ");
  });
}

async function main(){
  await database.sync();

  const app = express();
  app.use(express.json());

  routes(app);

  const PORT = 3000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}!`));
}

main();