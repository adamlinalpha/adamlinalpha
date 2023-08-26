const input = document.querySelector('input')
const form = document.querySelector('form')
const temps = document.querySelector('.temps')
const pronom = document.querySelector('.pronom')
const infinitif = document.querySelector('.infinitif')
const traduction = document.querySelector('.traduction')
const scoreS = document.querySelector('.score')
const scoreB = document.querySelector('.scoreBloc')
const buttons = document.querySelectorAll('.bt');

let verbesR = {
  "Présent de l'indicatif": 'conjugation.Indicativo.Presente',
  "Passé simple": 'conjugation.Indicativo.PreteritoIndefinido',
  "Imparfait": 'conjugation.Indicativo.PreteritoImperfecto',
  "Présent progressif": 'conjugation.Impersonal.Gerundio',
  "Passé composé": 'conjugation.Indicativo.PreteritoPerfecto',
  "Subjonctif présent": 'conjugation.Subjuntivo.Presente',
  "Futur de l'indicatif": 'conjugation.Indicativo.FuturoImperfecto',
  "Imperatif": 'conjugation.Imperativo.Afirmativo',
  "Subjonctif imparfait": 'conjugation.Subjuntivo.PreteritoImperfectoRa',
  "Conditionnel": 'conjugation.Indicativo.CondicionalSimple'
}
let pronomsR = {
  "Yo": 0,
  "Tú": 1,
  "Él": 2,
  "Ella": 2,
  "Usted": 2,
  "Nosotros": 3,
  "Nosotras": 3,
  "Vosotros": 4,
  "Vosotras": 4,
  "Ellos": 5,
  "Ellas": 5,
  "Ustedes": 5,
}
const estar=['estoy','estás','está','estamos','estáis','están']
let correction = 'comer'
let score = []

let hello= function(){
  fetch('https://entrainement-espagnol.onrender.com/randomTense')
  .then(response => response.json()).then(function (data) {
    temps.innerText = data.tense;
  }).then(function () {
    fetch('https://entrainement-espagnol.onrender.com/randomPronoun')
      .then(response => response.json()).then(function (data) {
        if (temps.innerText == 'Imperatif') {
          let randVf = Math.random();
          if (randVf < 0.5) {
            pronom.innerText = 'Tú'
          } else if (randVf < 0.75) {
            pronom.innerText = 'Vosotros'
          } else {
            pronom.innerText = 'Vosotras'
          }
        } else {
          pronom.innerText = data.pronoun;
        }
      })
  }).then(function(){
    fetch('https://entrainement-espagnol.onrender.com/randomVerb')
    .then(response => response.json()).then(function (data) {
      infinitif.innerText = data.verb;
      traduction.innerText = data.translation;
      let object = JSON.parse(data.conjugated)
      function conjugue() {
        let codeV = verbesR[temps.innerText];
        let autrePropriete = object[0];
        const codeVArray = codeV.split('.');
        for (const prop of codeVArray) {
          autrePropriete = autrePropriete[prop];
        }
        return autrePropriete
      }
      let arrayV=conjugue()
      numberP=pronomsR[pronom.innerText]
      correction=arrayV[numberP]
      if(temps.innerText=='Présent progressif'){
        correction=`${estar[numberP]} ${arrayV}`
      }else{
        correction=arrayV[numberP]
      }
      if(correction==undefined){
        hello()
        console.log('hi')
      }
      console.log(correction)
  })
})
}
hello()
form.addEventListener('submit', function (evt) {
  evt.preventDefault()
  let reponse = evt.target.querySelector('#verbe').value
  if (reponse.toUpperCase() == correction.toUpperCase()) {
    evt.target.querySelector('#verbe').style.color = "green"
    evt.target.querySelector('#verbe').style.fontWeight = "bold"
    evt.target.querySelector('#verbe').disabled = true
    score.push(100)
  } else {
    evt.target.querySelector('#verbe').value = correction.toUpperCase()
    evt.target.querySelector('#verbe').style.color = "red"
    evt.target.querySelector('#verbe').style.fontWeight = "bold"
    evt.target.querySelector('#verbe').disabled = true
    score.push(0)
  }
  scoreB.style.visibility = 'visible'
  scoreS.innerText = `${(score.reduce((a, b) => a + b, 0) / score.length).toFixed(2)}%`;
  addEventListener('keypress', function handler(evt) {

    fetch('https://entrainement-espagnol.onrender.com/randomTense')
      .then(response => response.json()).then(function (data) {
        temps.innerText = data.tense;
      }).then(function () {
        fetch('https://entrainement-espagnol.onrender.com/randomPronoun')
          .then(response => response.json()).then(function (data) {
            if (temps.innerText == 'Imperatif') {
              let randVf = Math.random();
              if (randVf < 0.5) {
                pronom.innerText = 'Tú'
              } else if (randVf < 0.75) {
                pronom.innerText = 'Vosotros'
              } else {
                pronom.innerText = 'Vosotras'
              }
            } else {
              pronom.innerText = data.pronoun;
            }
          })
      }).then(function(){
        fetch('https://entrainement-espagnol.onrender.com/randomVerb')
        .then(response => response.json()).then(function (data) {
          infinitif.innerText = data.verb;
          traduction.innerText = data.translation;
          let object = JSON.parse(data.conjugated)
          function conjugue() {
            let codeV = verbesR[temps.innerText];
            let autrePropriete = object[0];
            const codeVArray = codeV.split('.');
            for (const prop of codeVArray) {
              autrePropriete = autrePropriete[prop];
            }
            return autrePropriete
          }
          let arrayV=conjugue()
          numberP=pronomsR[pronom.innerText]
          correction=arrayV[numberP]
          if(temps.innerText=='Présent progressif'){
            correction=`${estar[numberP]} ${arrayV}`
          }else{
            correction=arrayV[numberP]
          }
          if(correction==undefined){
            hello()
            console.log('hi')
          }
          console.log(correction)
      })


    evt.target.querySelector('#verbe').value = ''
    evt.target.querySelector('#verbe').disabled = false
    evt.target.querySelector('#verbe').style.color = "black"
    evt.target.querySelector('#verbe').style.fontWeight = "normal"
    evt.target.querySelector('#verbe').focus()
    this.removeEventListener("keypress", handler);
  })

})
})

buttons.forEach(button => {
  button.addEventListener('click', () => {
      const letter = button.textContent;
      input.value += letter;
      input.focus()
  });
});
