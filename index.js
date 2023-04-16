import express from "express";

const app = express()

app.listen(5001, () => {
    console.log('API Running on port 5001')
})

app.get('/', (req, res) => res.json( `<div>Lala</div>` ))