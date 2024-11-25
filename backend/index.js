const connetToMongo = require('./db');
 connetToMongo();
const express = require('express');
const cors = require('cors')
const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());

// app.get('/', (req, res) => {
//     res.send('Hello vijay..I love you')

// })

app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port , ()=>{
    console.log(`Listing Port : ${port}`)
})