"use strict";
//Object.defineProperty(exports, "__esModule", { value: true });

// Google Assistant deps
const actions_on_google_1 = require("actions-on-google");
const app = actions_on_google_1.dialogflow({ debug: true });
const express = require('express')
const exapp = express()
//iscn
//const fs = require('fs');
let path = 'https://sis-scraper-rit-dup-2.herokuapp.com/get_sis_data/';
//let usnip;
let dobip;
// Capture Intent
app.intent('Give me my Internals Report', async (conv) => {
    
    conv.ask(new actions_on_google_1.SimpleResponse({
        text: 'Please enter your USN Number',
        speech: 'Heyy , What is your ID number ?',
    }));
});
app.intent('USN Entry', async (conv, { usn }) => {
  conv.ask(
    new actions_on_google_1.SimpleResponse({
      text: 'You entered ' + usn + ' , enter your DOB',
      speech: 'What is your Date of Birth?',
    })
  )
  usnip = usn;
});
path = path + usnip;
app.intent('DOB entry', async (conv, { dob }) => {
    conv.ask(new actions_on_google_1.SimpleResponse({
        text: 'You entered ' + dob + ' ',
        speech: 'Fetching your details',
    }));
    dobip = dob;
    path = path + "/" + dobip;
    path = path.substr(0, path.length - 15);
    let a1 = "";
    //for testing only
    //path = 'https://sis-scraper-rit-dup-2.herokuapp.com/get_sis_data/1MS19CS129/2001-03-27';
    const axios = require("axios");
    let res = await axios.get(path);
    for (var mark in res.data.marks) {
        a1 = a1.concat(res.data.marks[mark].name + " : " + res.data.marks[mark]['final cie'] + "\n");
    }
        conv.close(
          new actions_on_google_1.SimpleResponse({
            text: 'Here you go',
            speech: 'Here is your report card',
          })
        )
    conv.close(new actions_on_google_1.BasicCard({
        title: 'CIE Report',
        text: a1,
        image: new actions_on_google_1.Image({
            url: 'https://formbuilder.ccavenue.com/media/media/Ramaiah_IOT_-_Logo.png',
            alt: 'MSRIT Logo',
        }),
        buttons: new actions_on_google_1.Button({
            title: 'Visit Website',
            url: 'http://parents.msrit.edu/index.php',
        }),
    }));
});





exapp.post('/webhook', express.json(), app)
exapp.get('/',(req,res)=>{
    res.send("hi")
})
exapp.listen(process.env.PORT || 8000)
console.log("hi")


