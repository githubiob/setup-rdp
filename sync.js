require('dotenv').config();
const inlinereply = require('discord-reply')
const {REST} = require('@discordjs/rest');
const { Console, clear } = require('console');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection , MessageEmbed} = require('discord.js');
const { config } = require('dotenv');
const randomstring = require('randomstring')
const fs = require('fs');
const path = require('path');
const { send } = require('process');



const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

// List of all commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands"); // E:\yt\discord bot\js\intro\commands
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for(const file of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.on("ready",async () => {
   console.log('i am online');
   client.user.setActivity('Kya dekh raha hai ', {type:"WATCHING"})
    // Get all ids of the servers
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    
   
    const rest = new REST({version: '9'}).setToken(process.env.TOKEN);
    for (const guildId of guild_ids)
    {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), 
            {body: commands})
        .then(() => console.log('Connected  client id is ' + guildId))
        .catch(console.error);
    }
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {
        await command.execute(interaction);
    }
    catch(error)
    {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command"});
    }
});

client.login(process.env.TOKEN);
client.on("message",async msg => {
    let isNewUser = msg.type === "GUILD_MEMBER_JOIN"
    if (isNewUser) {
        msg.author.send(' Naye Player ko Salam 🫡 ' + msg.author.username );
        msg.reply('Are you new User?')      

        }
      
   if (msg.mentions.has(client.user.id)) {
    
   
    return msg.reply(`What i do ${msg.author.username} ?`);

   }
    return msg.reply(`${randomstring.generate(80)}`)
  
   
});



const PORT = process.env.PORT

console.log('Your default port is' + PORT);
// Webhook
