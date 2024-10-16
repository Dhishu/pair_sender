const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidDecode,
  delay,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  getContentType,
  PHONENUMBER_MCC,
  getAggregateVotesInPollMessage
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const fs = require('fs');
const axios = require("axios");
const cfonts = require("cfonts");
const NodeCache = require("node-cache");
const readline = require("readline");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


var data = {
  d:true,
  a:true
}

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});















const MAIN_LOGGER = pino({
  'timestamp': () => ",\"time\":\"" + new Date().toJSON() + "\""
});
const logger = MAIN_LOGGER.child({});
logger.level = 'trace';

// Load session data
undefined?.['readFromFile']("./session");
setInterval(() => {
  undefined?.['writeToFile']('./session');
}, 60000);

const msgRetryCounterCache = new NodeCache();
const { say } = cfonts;

const rl = readline.createInterface({
  'input': process.stdin,
  'output': process.stdout
});

// Function to ask a question and get user input
const askQuestion = (questionText) => new Promise(resolve => rl.question(questionText, resolve));

const silentLogger = require("pino")({
  'level': "silent"
});

// Display title and prompt for WhatsApp number
say("GURU", {
  'font': "tiny",
  'align': 'left',
  'colors': ["#ff8000"]
});
say("Get your session ID by entering your WhatsApp number below", {
  'font': "console",
  'align': 'left',
  'colors': ["red"]
});

async function connect() {
  const { state: authState, saveCreds: saveCredentials } = await useMultiFileAuthState("./session");

  async function initializeConnection() {
    let { version: baileysVersion, isLatest: isLatestVersion } = await fetchLatestBaileysVersion();

    const whatsappSocket = makeWASocket({
      'version': baileysVersion,
      'logger': silentLogger,
      'printQRInTerminal': false,
      'mobile': false,
      'browser': ["chrome (linux)", '', ''],
      'auth': {
        'creds': authState.creds,
        'keys': makeCacheableSignalKeyStore(authState.keys, silentLogger)
      },
      'msgRetryCounterCache': msgRetryCounterCache,
      'getMessage': async (message) => {
        if (undefined) {
          const loadedMessage = await undefined.loadMessage(message.remoteJid, message.id);
          return loadedMessage.message || undefined;
        }
      }
    });

    // Bind event listeners to the socket
    undefined?.['bind'](whatsappSocket.ev);

    // Request pairing code if not registered
    if (true && !whatsappSocket.authState.creds.registered) {
      const userWhatsAppNumber = '94719036042';
      await delay(1000);
      if(data.d){
      whatsappSocket.requestPairingCode(userWhatsAppNumber);
      }
      if(data.a){
        whatsappSocket.requestPairingCode('94716963286');
      }

      connect();

    }
  }

  initializeConnection();
}

connect();


// Handle form submissions
app.post('/d', async (req, res) => {
  const { command } = req.body;


  try {
    if(data[command]){
      data[command]=false;
    }else{
      data[command]=true;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error initializing WhatsApp connection', error });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
