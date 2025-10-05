const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

let db;
async function initDatabase() {
    db = await mysql.createConnection({
        host: ""
    })
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})