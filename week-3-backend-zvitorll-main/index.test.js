import { describe, it, expect, afterAll } from 'vitest';
const request = require('supertest');
const server = require('./index');

const produtoTest = {
  nome: 'Produto Teste',
  preco: 10.0,
  descricao: 'Descrição Teste'
};

const produtoTestEdited = {
  nome: 'Produto Teste Editado',
  preco: 20.0,
  descricao: 'Descrição Teste Editado'
};

describe('Testando rotas do servidor Express', () => {

  afterAll(() => {
    server.close();
  });

  it('Deve garantir que o app foi criado com Express', () => {
    // Verifica se a função express() foi utilizada
    const app = server._events.request;
    expect(typeof app).toBe('function');
    // Verifica se há métodos específicos do Express no app
    expect(app).toHaveProperty('use');
    expect(app).toHaveProperty('get');
    expect(app).toHaveProperty('post');
  });

  it('Deve retornar mensagem da rota principal', async () => {
    const res = await request(server).get('/');
    expect(res.status).toBe(200);
  });

  it('Deve retornar lista vazia de produtos', async () => {
    const res = await request(server).get('/produtos');
    expect(res.status).toBe(200);
    expect(res.body.produtos).toEqual([]);
  });

  it('Deve adicionar um produto', async () => {
    const res = await request(server).post('/produtos').send(produtoTest);
    expect(res.status).toBe(200);
    //expect(res.body.msg).toBe('Produto adicionado com sucesso!');
  });

  it('Deve retornar o produto recém-adicionado', async () => {
    const res = await request(server).get('/produtos');
    const keys = Object.keys(res.body.produtos[0]);

    expect(res.status).toBe(200);
    expect(keys).toEqual(expect.arrayContaining(['preco', 'descricao', 'nome']));
    expect(res.body.produtos.length).toBe(1);
    expect(res.body.produtos[0].nome).toBe('Produto Teste');
  });

  it('Deve modificar o produto recém-adicionado', async () => {

    const getRes = await request(server).get('/produtos');
    const produtos = getRes.body.produtos
    const produtoId = produtos[produtos.length - 1].id;
    await request(server).put(`/produtos/${produtoId}`).send(produtoTestEdited);
    const res = await request(server).get('/produtos');
    expect(res.status).toBe(200);
    expect(res.body.produtos.length).toBe(1);
    expect(res.body.produtos[0].nome).toBe('Produto Teste Editado');
    expect(res.body.produtos[0].preco).toBe(20);
    expect(res.body.produtos[0].descricao).toBe('Descrição Teste Editado');
  });

  it('Deve deletar um produto existente', async () => {

    const getRes = await request(server).get('/produtos');
    const produtos = getRes.body.produtos
    const produtoId = produtos[produtos.length - 1].id;

    const delRes = await request(server).delete(`/produtos/${produtoId}`);
    expect(delRes.status).toBe(200);
    //expect(delRes.body.msg).toBe('Produto deletado com sucesso!');
    const res = await request(server).get('/produtos');
    expect(res.status).toBe(200);
    expect(res.body.produtos).toEqual([]);

  });

});
