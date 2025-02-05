const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 8000

//JP
const hiragana = require('./public/JP/hiragana.json')
const katakana = require('./public/JP/katakana.json')
const kanjiJouyou = require('./public/JP/kanji-jouyou.json')
const kanjiKyouiku = require('./public/JP/kanji-kyouiku.json')
const kanjiWaniKani = require('./public/JP/kanji-wanikani.json')

//middleware
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send({
        availablePOST: '/hiragana, '
    })   
})

app.get('/test' , (req , res)=>{
    res.status(200).send({
        message: 'testing api',
        size: 'big'
    })
})

app.get('/hiragana', (req, res) => {    
    res.status(200).send({
        hiragana: hiragana
    })

})

app.get('/katakana', (req, res) => {    
    res.status(200).send({
        katakana: katakana
    })

})

app.get('/kanji/:level', (req, res) => { 
    
    const level = req.params.level.toLowerCase();
    let kanji;

    if (level === "jouyou") {
        kanji = kanjiJouyou
    }else if(level === "kyouiku"){
        kanji = kanjiKyouiku
    }else if (level === "wanikani") {
        kanji = kanjiWaniKani
    }else {
        return res.status(400).send({ error: "Invalid kanji level" }); 
    }

    
    res.status(200).send({
        kanji: kanji
    })

})

app.get('/random', (req, res) => {
    const datasets = [
        { name: 'hiragana', data: hiragana },
        { name: 'katakana', data: katakana },
        { name: 'kanji_jouyou', data: kanjiJouyou },
        { name: 'kanji_kyouiku', data: kanjiKyouiku },
        { name: 'kanji_wanikani', data: kanjiWaniKani }
    ];

    const nonEmptyDatasets = datasets.filter(dataset => dataset.data && Object.keys(dataset.data).length > 0);

    if (nonEmptyDatasets.length === 0) {
        return res.status(400).send({
            error: "No valid datasets available"
        });
    }
    const randomDataset = nonEmptyDatasets[Math.floor(Math.random() * nonEmptyDatasets.length)];
    let randomItem;
    if (randomDataset.name.startsWith('kanji')) {
        const kanjiKeys = Object.keys(randomDataset.data);
        randomItem = randomDataset.data[kanjiKeys[Math.floor(Math.random() * kanjiKeys.length)]];
        randomItem.character = kanjiKeys[Math.floor(Math.random() * kanjiKeys.length)];
    } else {
        randomItem = randomDataset.data[Math.floor(Math.random() * randomDataset.data.length)];
    }
    res.status(200).send({
        dataset: randomDataset.name,
        random: randomItem
    });
});





//testing code
// app.post('/system/:type', (req, res) => {
//     const { type } = req.params;
//     const { logo } = req.body;

//     if(!logo){
//         res.status(418).send({
//             message: 'no logo'
//         })
//     }

//     res.send({
//         message: `this message type is ${type}, the logo is ${logo}`
//     })


// })


app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))