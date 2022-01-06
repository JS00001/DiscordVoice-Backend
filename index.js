const { token, password, guild } = require('./config.json');
const { Client, Intents } = require('discord.js');
const express = require('express');
const util = require('./util');
const cors = require('cors');
const app = express();

let disconnectEnabled = false;
let deafenedEnabled = false;
let muteEnabled = false;

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_VOICE_STATES,
    ] 
});

// When Client is Online
client.on('ready', () => {
    console.log("[Bot] Bot Online")
})

app.use(cors())

// When User Joins Voice Call
client.on('voiceStateUpdate', async (oldState, newState) => {
    let user = await util.getUser();

    // Disconnect User
    if (disconnectEnabled) {
        if (newState.channelId !== null) {
            if (newState.member.user.id == user) {
                newState.disconnect()
            }
        }
    }

    // Deafen User
    if (deafenedEnabled) {
        if (newState.member.user.id == user) {
            if (!newState.member.voice.deaf) {
                newState.member.voice.setDeaf();
            }
        }
    }

    // Mute User
    if (muteEnabled) {
        if (newState.member.user.id == user) {
            if (!newState.member.voice.mute) {
                newState.member.voice.setMute();
            }
        }
    }
})


// Toggle Permanent Disconnect
app.get('/update/disconnect', async (req, res) => {
    let user = await util.getUser();
    disconnectEnabled = !disconnectEnabled;
    if (disconnectEnabled) try { client.guilds.cache.get(guild).members.cache.get(user).voice.disconnect() } catch {}
    res.status(200).json({success: true});
})

// Toggle Permanent Mute
app.get('/update/mute', async (req, res) => {
    let user = await util.getUser();
    muteEnabled = !muteEnabled
    if (muteEnabled) try { client.guilds.cache.get(guild).members.cache.get(user).voice.setMute()} catch {}
    res.status(200).json({success: true});
})

// Toggle Permanent Deafen
app.get('/update/deafen', async (req, res) => {
    let user = await util.getUser();
    deafenedEnabled = !deafenedEnabled
    if (deafenedEnabled) try { client.guilds.cache.get(guild).members.cache.get(user).voice.setDeaf()} catch {}
    res.status(200).json({success: true});
})

// Update User
app.get('/update/user', (req, res) => {
    if (!req.query.user) return res.json({error: true});
    util.updateUser(req.query.user);
    res.status(200).json({success: true});
})

app.get('/status', async (req, res) => {
    let user = await util.getUser();
    res.status(200).json({
        user,
        muteEnabled,
        deafenedEnabled, 
        disconnectEnabled
    })
})

app.listen(8080, () => {
    client.login(token);
    console.log(`[Server] Server Online - 8080`)
})