const express = require('express')
var path = require('path');
const app = express()
const sql = require('mssql');
var bodyParser = require('body-parser');
 
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000
const config = {
  user: 'CodeEditorUser',
  password: 'O0k1W80rzx',
  server: 'HDESKNEW', // You can use 'localhost\\instance' to connect to named instance
  database: 'CodeEditor',
  "options": {
    "encrypt": false,
    "enableArithAbort": true
  },
}

sql.connect(config, function (err) {
  if(err) console.log(err)
  const request = new sql.Request();
  app.get('/', (req, res) => {
    getCodes((ret)=>{
      res.render(__dirname +'\\index',{user:1,list:ret})
    });
  });

  app.get('/getCode', (req, res) => {
    if( typeof req.query.id !== 'undefined')
    request.query(`select content from tab_CODES where id=${req.query.id}`,(err,result) => {
      if(err) console.log(err);
      res.send(result.recordset[0].content);
    })
  });

  app.post('/addNewFile', (req,res) =>{
    if(typeof req.body.filename !== 'undefined' && typeof req.body.userid !== 'undefined') {
      request.query(`insert into tab_CODES values(1,'` + req.body.filename + `','')`, (err,result) => {
        if(err) console.log(err)
        getCodes((ret) => {
          res.render(__dirname +'\\index',{user:1,list:ret})
        });
      })
    } else 
    res.send('nok')
  });

  app.get('/deleteFile', (req,res) => {
    if(typeof req.query.id !== 'undefined' && typeof req.query.userid !== 'undefined') {
      request.query(`delete from tab_CODES where id =` + req.query.id + ` and userid=` + req.query.userid , (err,result) => {
        if(err) console.log(err)
        getCodes((ret) => {
          res.render(__dirname +'\\index',{user:1,list:ret})
        });
      })
    } else 
    res.send('nok')
  });

  function getCodes(callback){
    request.query(`select id,name from tab_CODES`,(err,result) => {
      if(err) console.log(err);
      callback(result.recordset);
    });
  }

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})