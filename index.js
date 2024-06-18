import { config } from 'dotenv';
config()
import { Client, MessageAttachment } from 'discord.js-selfbot-v13'
import { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection  } from '@discordjs/voice'

const { TOKEN, CHANNEL_ID, GUILD_ID } = process.env

const client = new Client()
const player = createAudioPlayer()

client.on('ready', async () => {
    console.log(`${client.user.username} is ready!`);
    await joinVc(client, GUILD_ID, CHANNEL_ID)
})

client.on('voiceStateUpdate', async (oldState, newState) => {
    const oldVoice = oldState.channelId;
    const newVoice = newState.channelId;

    if (oldVoice !== newVoice) {
        if (!oldVoice) {
            // empty
        } else if (!newVoice) {
            if (oldState.member.id !== client.user.id) return;
            await joinVc(client, GUILD_ID, CHANNEL_ID);
        } else {
            if (oldState.member.id !== client.user.id) return;
            if (newVoice !== config.Channel) {
                await joinVc(client, GUILD_ID, CHANNEL_ID);
            }
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.id === client.user.id) return;
    if (message.content === 'ping') {
        const channel = getChannel(GUILD_ID, CHANNEL_ID)
        playSound('./sounds/eu-gosto-e-assim-amostradinho.mp3', channel)
    }
});

async function joinVc(client, guildId, channelId) {
    const guild = client.guilds.cache.get(guildId)
    const voiceChannel = getChannel(guildId, channelId)
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: false
    });

    const resource = createAudioResource('./sounds/eu-gosto-e-assim-amostradinho.mp3');
    player.play(resource);
    connection.subscribe(player);
}

function getChannel(guildId, channelId) {
    const guild = client.guilds.cache.get(guildId)
    return guild.channels.cache.get(channelId)
}

function playSound(sound, channel) {
    const connection =  getVoiceConnection(channel.guild.id)
    const resource = createAudioResource(sound,{ inlineVolume: true }).volume.setVolume(1);

    player.play(resource);
    connection.subscribe(player);
}

client.login(TOKEN)
