import { dialogflow, SimpleResponse, BasicCard, Image, Button} from 'actions-on-google';
exports.getIntents = () => {

// Google Assistant deps

const express = require('express')
const exapp = express()
const app = dialogflow({ debug: true });
//iscn
//const fs = require('fs');
let path = 'https://sis-scraper-rit-dup-2.herokuapp.com/get_sis_data/';
//let usnip;
let dobip;
// Capture Intent
app.intent('Give me my Internals Report', async (conv) => {
  // const data = await scrapePage();


  conv.ask(
    new SimpleResponse({
      text: 'Please enter your USN Number',

      speech: 'Heyy , What is your ID number ?',
    }),






 );
 });

// app.intent('USN Entry', async (conv, { usn }) => {
//   conv.ask(
//     new SimpleResponse({
//       text: 'You entered ' + usn + ' , enter your DOB',
//       speech: 'What is your Date of Birth?',
//     })
//   )

//   usnip = usn;
// });


// path = path + usnip;

app.intent('DOB entry', async (conv, { dob }) => {
  conv.ask(
    new SimpleResponse({
      text: 'You entered ' + dob + ' ',
      speech: 'Fetching your details',
    })
  )

  dobip = dob;
  path = path + "/" + dobip;
  path = path.substr(0, path.length - 15)



  let a1 = "";


    //for testing only
  path='https://sis-scraper-rit-dup-2.herokuapp.com/get_sis_data/1MS19CS129/2001-03-27';



  const axios = require("axios");
  let res = await axios.get(
    'https://sis-scraper-rit-dup-2.herokuapp.com/get_sis_data/1MS19CS129/2001-03-27'
  )
  
    for (var mark in res.data.marks) {
      a1 = a1.concat(res.data.marks[mark].name + " : " + res.data.marks[mark]['final cie'] + "\n");
    }
  
  
//     conv.close(
//       new SimpleResponse({
//         text: 'Here you go',
//         speech: 'Here is your report card',
//       })
//     )
  
    conv.close(
  
      new BasicCard
        ({
          title: 'CIE Report',
          text: a1,
          image: new Image({
            url: 'https://formbuilder.ccavenue.com/media/media/Ramaiah_IOT_-_Logo.png',
            alt: 'MSRIT Logo',
          }),
          buttons: new Button({
            title: 'Visit Website',
            url: 'http://parents.msrit.edu/index.php',
          }),
  
        })
    );
    
    
    
  
  
  
  });

  





exapp.post('/', express.json(), app)
exapp.listen(process.env.PORT || 8000)
}
