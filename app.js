"use strict";
//Object.defineProperty(exports, "__esModule", { value: true });

// Google Assistant deps
const actions_on_google_1 = require("actions-on-google");
const app = actions_on_google_1.dialogflow({ debug: true });
const express = require('express')
const exapp = express()
//iscn
//const fs = require('fs');
const path = 'https://sis-scraper-rit-dup-2.herokuapp.com/get_sis_data/';
let usnip;
let dobip;
// Capture Intent
app.intent('Give me my Internals Report', async (conv) => {

    conv.ask(new actions_on_google_1.SimpleResponse({
        text: 'Please enter your USN Number',
        speech: 'Heyy , What is your ID number ?',
    }));
});
app.intent('USN Entry', async (conv, { usn }) => {
    conv.data.path=path;
    conv.ask(
        new actions_on_google_1.SimpleResponse({
            text: 'You entered ' + usn + ' , enter your DOB',
            speech: 'What is your Date of Birth?',
        })
    )
    conv.data.usn = '';
    conv.data.usn = usn;
    
    usnip = conv.data.usn;
    usnip = usnip.substr(0, path.length - 1);
    conv.data.path = conv.data.path + usnip;
    console.log(usnip);
});

app.intent('DOB entry', async (conv, { dob }) => {
    conv.ask(new actions_on_google_1.SimpleResponse({
        text: 'You entered ' + dob + ' ',
        speech: 'Fetching your details',
    }));
    conv.data.dob = '';
    conv.data.dob = dob.toString();
    dobip = dob;
    dobip = dobip.substr(0, dobip.length - 15);
    conv.data.path = conv.data.path + "/" + dobip;

    let a1 = "";
    //for testing only
    //path = 'https://sis-scraper-rit-dup-2.herokuapp.com/get_sis_data/1MS19CS129/2001-03-27';
    const axios = require("axios");
    let res = await axios.get(path);
    for (var mark in res.data.marks) {
        if (res.data.marks[mark]['final cie'] == undefined) {
            a1 = a1.concat(res.data.marks[mark].name + " : N.A ");
        }
        else {
            a1 = a1.concat(res.data.marks[mark].name + " : " + res.data.marks[mark]['final cie'] + "\n ");
        }
    }
    if (res.data.name == undefined) {
        conv.close(
            new actions_on_google_1.SimpleResponse({
                text: 'Incorrect USN/DOB',
                speech: 'Incorrect Credentials',
            })


        )
    }
    else {
        conv.close(
            new actions_on_google_1.SimpleResponse({
                text: 'Here you go',
                speech: 'Hello '+res.data.name,
            })
        )
        conv.close(new actions_on_google_1.BasicCard({
            title: 'CIE Report-' + res.data.name + '-' + res.data.sem,
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
    }
});





exapp.post('/webhook', express.json(), app)
exapp.get('/', (req, res) => {
    res.send("path : " + path + "    usn is" + usnip)
})
exapp.listen(process.env.PORT || 8000)
console.log("hi")


