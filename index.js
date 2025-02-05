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

// app.post('/system/:type', (req, res) => {
//     const { type } = req.params; 
    
//     console.log('this is running');
    

//     if(!type){
//         res.status(418).send({
//             message: 'provide a type'
//        })
//     }
        
//     res.send({
//         message: `this message type is ${type}`
//     })
// })


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