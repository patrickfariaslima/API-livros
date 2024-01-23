const axios = require("axios");
const prompt = require("prompt-sync")();

const apiURL =
  "https://k1ztch1g-3000.brs.devtunnels.ms";

async function getAllBooks() {
  try {
    const response = await axios.get(`${apiURL}/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter a lista de livros:", error.message);
    throw new Error("Erro ao obter a lista de livros");
  } finally {
    console.log("Operação finalizada!");
  }
}

async function getBookById(id) {
  try {
    const response = await axios.get(`${apiURL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("Livro não encontrado para o ID informado.");
      return null;
    } else {
      console.error("Erro ao obter informações do livro:", error.message);
      throw new Error("Erro ao obter a lista de livros");
    }
  } finally {
    console.log("Operação finalizada!");
  }
}

async function createBook(book) {
  try {
    const response = await axios.post(`${apiURL}/`, book);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar um novo livro:", error.message);
    throw new Error("Erro ao obter a lista de livros");
  } finally {
    console.log("Operação finalizada!");
  }
}

async function updateBook(id, updatedBook) {
  const existingBook = await getBookById(id);
  if(!existingBook){
    console.log("Livro não encontrado para o ID informado. Não é possível fazer sua atualização.");
    return null;
  }
  try {
    const response = await axios.put(`${apiURL}/${id}`, updatedBook);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar livro:", error.message);
    throw new Error("Erro ao obter a informação");
    } finally {
    console.log("Operação finalizada!");
  }
}

async function deleteBook(id) {
  try {
    const response = await axios.delete(`${apiURL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("Livro não encontrado para o ID informado.");
      return null;
    } else {
      console.error("Erro ao deletar livro:", error.message);
      throw new Error("Erro ao deletar livro.");
    }
  } finally {
    console.log("Operação finalizada!");
  }
}

async function main() {
  let exit = false;

  while (!exit) {
    console.log("\nEscolha uma opção:");
    console.log("1. Obter todos os livros");
    console.log("2. Obter detalhes de um livro por ID");
    console.log("3. Criar um novo livro");
    console.log("4. Atualizar um livro por ID");
    console.log("5. Excluir um livro por ID");
    console.log("6. Sair");
    console.log("");

    const option = parseInt(prompt("Digite o número da opção desejada: "));
    if (isNaN(option)) {
      console.log("Opção inválida. Digite um número válido.");
      continue;
    }
    switch (option) {
      case 1:
        const allBooks = await getAllBooks();
        console.log("Lista de livros:", allBooks);
        break;

      case 2:
        const bookId = parseInt(prompt("Informe o ID do livro: "));
        if (isNaN(bookId)) {
          console.log("ID inválido. Digite um número válido.");
          break;
        }
        const bookById = await getBookById(parseInt(bookId));
        if (bookById !== null) {
          console.log("Detalhes do livro por ID:", bookById);
        }
        break;


      case 3:
        const newBookDetails = {
          title: prompt("Informe o título do livro: "),
          author: prompt("Informe o autor do livro: "),
          bookPublisher: prompt("Informe a editora do livro: "),
          ISBN: parseInt(prompt("Informe o ISBN do livro: ")),
          genre: prompt("Informe o gênero do livro: "),
        };
        const newBook = await createBook(newBookDetails);
        console.log("Livro criado:", newBook);
        break;

      case 4:
        const bookIdToUpdate = parseInt(
          prompt("Informe o ID do livro a ser atualizado: "),
        );
        if (isNaN(bookIdToUpdate)) {
          console.log("ID inválido. Digite um número válido.");
          break;
        }
        const existingBookToUpdata = await getBookById(bookIdToUpdate);
        if(!existingBookToUpdata){
          break;
        }
        const updatedBookDetails = {
          title: prompt("Informe o novo título do livro: "),
          author: prompt("Informe o novo autor do livro: "),
          bookPublisher: prompt("Informe a nova editora do livro: "),
          ISBN: parseInt(prompt("Informe o novo ISBN do livro: ")),
          genre: prompt("Informe o novo gênero do livro: "),
        };
        const updatedBook = await updateBook(
          bookIdToUpdate,
          updatedBookDetails,
        );
        if (updatedBook !== null){
        console.log("Livro atualizado:", updatedBook);
        }
        break;

      case 5:
        const bookIdToDelete = parseInt(
          prompt("Informe o ID do livro a ser excluído: "),
        );
        if (isNaN(bookIdToDelete)) {
          console.log("ID inválido. Digite um número válido.");
          break;
        }
        const deletedBook = await deleteBook(bookIdToDelete);
        if(deletedBook !== null){
        console.log(deletedBook);
        }
        break;

      case 6:
        console.log("Finalizando aplicação...");
        exit = true;
        break;

      default:
        console.log(
          "Opção inválida. Por favor, escolha uma opção válida (1 a 7).",
        );
    }
  }
}

main();
