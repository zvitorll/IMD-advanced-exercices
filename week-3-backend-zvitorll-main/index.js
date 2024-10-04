const produtos = { produtos: [] };

const express = require('express');
const app = express();

app.use(express.json());

const server = app.listen(8080, () => {
  console.log("deu bom na 8080");
});

app.get("/",(req,res)=>{
  res.status(200).send("mensagem principal");
});

app.get("/produtos",(req,res)=>{
  res.status(200).json(produtos);
});

app.post("/produtos",(req,res)=>{
  const produto=req.body;
  produtos.push(produto);
  res.status(200).json({ msg:"Adicionado"});
});


app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const produtoEditado = req.body;
});

const index = produtos.produtos.findIndex(produto => produto.id === parseInt(id));
if (index !== -1) {
  produtos.produtos[index] = { ...produtos.produtos[index], ...produtoEditado };  // Atualiza o produto
  res.status(200).json({ msg: 'Deu bom na modificacao!' });
} else {
  res.status(404).json({ msg: 'Item nao encontrado' });
}

app.delete("/produtos/:id", (req, res) => {
  const id = req.params.id;
  const index = produtos.produtos.findIndex(produto => produto.id === id);
  if (index !== -1) {
    produtos.produtos.splice(index, 1);
    res.status(200).json({ msg: "Item removido" });
  } else {
    res.status(404).json({ msg: "Item nao encontrado" });
  }
});

module.exports = server;