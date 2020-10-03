const express = require('express')
var path = require('path');
const app = express()
const sql = require('mssql')
 
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));

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
    request.query(`select id,name from tab_CODES`,(err,result) => {
      if(err) console.log(err);
      console.log(result.recordset);
      res.render(__dirname +'\\index',{list:result.recordset})
    })
  });
  app.get('/getCode', (req, res) => {
    if( typeof req.query.id !== 'undefined')
    request.query(`select content from tab_CODES where id=${req.query.id}`,(err,result) => {
      if(err) console.log(err);
      res.send(result.recordset[0].content);
    })
  })
  
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})