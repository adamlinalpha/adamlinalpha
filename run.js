express=require('express')
path=require('path')
app=express()
const fs = require('fs');
const bodyParser = require('body-parser');
const CNG = require("@jirimracek/conjugate-esp");
const editJsonFile = require("edit-json-file");
const cng = new CNG.Conjugator();
cng.setOrthography('1999');                  
cng.useHighlight(use = false)

let file = editJsonFile(`${__dirname}/public/tenses.json`, {autosave: true});

app.use(bodyParser.json());
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'));
//#region
let oV={}
let oP={}
let oT={}
let oTr={}

let verbsA = fs.readFileSync('./public/verbs.json');
let verbs = JSON.parse(verbsA);
verbs.forEach(
    function(object){
        const firstLetter = object.infinitive.charAt(0)
        const firstLetterCap = firstLetter.toUpperCase()
        const remainingLetters = object.infinitive.slice(1)
        let infinitive= `(${firstLetterCap + remainingLetters})`
        let perc=object.perc
        const firstLetter2 = object.translation.charAt(0)
        const firstLetterCap2 = firstLetter2.toUpperCase()
        const remainingLetters2 = object.translation.slice(1)
        let tran=`(${firstLetterCap2 + remainingLetters2})`
        oV[infinitive]=perc
        oTr[infinitive]=tran    
      }
)

let tensesA = fs.readFileSync('./public/tenses.json');
let tenses = JSON.parse(tensesA);
for(let i in tenses){
    oT[i]=tenses[i]
  }

let pronounA = fs.readFileSync('./public/pronoun.json');
let pronouns = JSON.parse(pronounA);
for(let i in pronouns){
    oP[i]=Math.pow(pronouns[i],1/3)
  }


  function weightedRand(spec) {
    var i, j, table=[];
    for (i in spec) {
      for (j=0; j<spec[i]*100000; j++) {
        table.push(i);
      }
    }
    return function() {
      return table[Math.floor(Math.random() * table.length)];
    }
  }

  function weightedRandLight(spec) {
    var i, j, table=[];
    for (i in spec) {
      for (j=0; j<spec[i]*10; j++) {
        table.push(i);
      }
    }
    return function() {
      return table[Math.floor(Math.random() * table.length)];
    }
  }

  let randTense=weightedRandLight(oT)
  let randPronoun=weightedRandLight(oP)
  let randVerb=weightedRand(oV)
//#endregion

app.listen(3000,function(){
    console.log('LISTENING ON 3000')
})

app.get('/',function(req,res){
    res.render('Accueil.ejs')
})

app.get('/temps',function(req,res){
    res.render('temps.ejs')
})

app.get('/randomTense',function(req,res){
    let randomTense = randTense();
    res.json({ tense: randomTense });
})
app.get('/randomVerb', function(req, res) {
    let randomVerb = randVerb();
    let traduction=oTr[randomVerb]
    let conjugated
    cng.conjugate(randomVerb.replace('(','').replace(')','').toLowerCase())
      .then(function(table){
        conjugated=JSON.stringify(table, null, 1)
        res.json({ verb: randomVerb,translation:traduction, conjugated:conjugated});
      })
      .catch(error => console.error(error)); 
});

app.get('/randomPronoun',function(req,res){
    let randomPronoun = randPronoun();
    res.json({ pronoun: randomPronoun });
})

app.get('/randomPronoun',function(req,res){
    let randomPronoun = randPronoun();
    res.json({ pronoun: randomPronoun });
})
app.get('/tense',function(req,res){
  let activated=req.query;
//#region

if(activated.presentI=='on'){
    file.set("Présent de l'indicatif",13)
  }else{
    file.set("Présent de l'indicatif",0)
  }
  if(activated.passeS=='on'){
    file.set("Passé simple",12)
  }else{
    file.set("Passé simple",0)
  }
  if(activated.imparfait=='on'){
    file.set("Imparfait",11,5)
  }else{
    file.set("Imparfait",0)
  }
  if(activated.presentP=='on'){
    file.set("Présent progressif",11)
  }else{
    file.set("Présent progressif",0)
  }
  if(activated.passeP=='on'){
    file.set("Passé composé",11)
  }else{
    file.set("Passé composé",0)
  }
  if(activated.subjonctifP=='on'){
    file.set("Subjonctif présent",13)
  }else{
    file.set("Subjonctif présent",0)
  }
  if(activated.futurI=='on'){
    file.set("Futur de l'indicatif",13)
  }else{
    file.set("Futur de l'indicatif",0)
  }
  if(activated.imperatif=='on'){
    file.set("Imperatif",13)
  }else{
    file.set("Imperatif",0)
  }
  if(activated.subjonctifI=='on'){
    file.set("Subjonctif imparfait",13)
  }else{
    file.set("Subjonctif imparfait",0)
  }
  if(activated.conditionnel=='on'){
    file.set("Conditionnel",13)
  }else{
    file.set("Conditionnel",0)
  }
  //#endregion
  res.render('redirect.ejs')
})

