//imports
const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
//config.
const PORT = 3000;
const app = express()
//banco de dados
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority&appName=LaerthBancodeDados`)
.then(()=> console.log("conectado ao banco de dados"))
.catch(err => console.log("erro ao conectar no banco de dados", err))

//middlewares
app.use(express.json())

//models
const Pessoa = mongoose.model('pessoa', { nome: String})

// rotas
app.post('/pessoa', async (req, res) => {
    const pessoa = new Pessoa(req.body)
    const pessoaCriada = await pessoa.save()
    res.status(201).json(pessoaCriada)
})
app.get('/pessoas', async (req, res) => {
    const pessoas = await Pessoa.find()
    res.json(pessoas)
})

app.get('/pessoas/:id', async (req, res) => {
    const pessoa = await Pessoa.findById(req.params.id)
    res.json(pessoa)
})

app.delete('/pessoas/:id', async (req, res) => {
    await Pessoa.findByIdAndDelete(req.params.id)
    res.json({ mensagem: "Pessoa excluida com sucesso!"})
})

app.put('/pessoas/:id', async (req, res) => {
    const pessoaAtualizada = await Pessoa.findByIdAndUpdate(req.params.id, req.body, { new: true})
    res.json(pessoaAtualizada)
})

//start
app.listen(PORT, () => {
    console.log(`Aplicação rodando na porta ${PORT}`)
})