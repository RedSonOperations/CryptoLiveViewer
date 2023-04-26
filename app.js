const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
require('dotenv').config();

const app=express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/", function(req, res){
    const ticker=req.body.cryptoCurr;
    const currency=req.body.currency;
    const apiKey=process.env.API_KEY;
    const url="https://min-api.cryptocompare.com/data/price?fsym="+ticker+"&tsyms="+currency+"&appid="+apiKey;

    https.get(url, function(response){
        response.on("data", function(data){
            const cryptoData=JSON.parse(data);
            const cryptoUSD=cryptoData.USD;
            const cryptoEUR=cryptoData.EUR;
            const cryptoJPY=cryptoData.JPY;
            const now = new Date();
            const date = now.toLocaleDateString();
            const time = now.toLocaleTimeString();
            console.log(cryptoData);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.write("<!DOCTYPE html>");
            res.write("<html>");
            res.write("<head>");
            res.write("<meta charset='utf-8'>");
            res.write("<title>Crypto Results</title>");
            res.write("<style>");
            res.write("body {");
            res.write("    background-color: #1A1A1A;");
            res.write("    color: #FFFFFF;");
            res.write("    font-family: Arial, sans-serif;");
            res.write("}");
            res.write("h1 {");
            res.write("    font-size: 48px;");
            res.write("    text-align: center;");
            res.write("}");
            res.write("</style>");
            res.write("</head>");
            res.write("<body>");
            res.write("<h1>Crypto Results for "+ticker+" on "+ date+" at "+time+"</h1>");
            res.write("<div>");
            if(currency==="USD"){
                res.write("<p>The current United States Dollar value of "+ticker+" is <span style='color: #00FF00;'>$"+cryptoUSD+"</span></p>");
            }
            else if(currency==="EUR"){
                res.write("<p>The current European Euro value of "+ticker+" is <span style='color: #FFD700;'>\u20AC"+cryptoEUR+"</span></p>");
            }
            else if(currency==="JPY"){
                res.write("<p>The current Japanese Yen value of "+ticker+" is <span style='color: #00BFFF;'>\xA5"+cryptoJPY+"</span></p>");
            }
            else if(currency==="USD,EUR,JPY"){
                res.write("<p>The current United States Dollar value of "+ticker+" is <span style='color: #00FF00;'>$"+cryptoUSD+"</span></p>");
                res.write("<p>The current European Euro value of "+ticker+" is <span style='color: #FFD700;'>\u20AC"+cryptoEUR+"</span></p>");
                res.write("<p>The current Japanese Yen value of "+ticker+" is <span style='color: #00BFFF;'>\xA5"+cryptoJPY+"</span></p>");
            }
            res.write("</div>");
            res.write("</body>");
            res.write("</html>");
            res.send();
        })
    });
})

app.listen(process.env.PORT || 3000, function(){
    var url="http://localhost:3000/"
    console.log("App listening on port 3000: "+url);
})
