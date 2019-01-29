const config = require("./config.json");
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    client.commands.set(props.help.name, props);
  });
});
client.on("ready", async () => {
  console.log(`${client.user.username} is online on ${client.guilds.size} servers!`);

  client.user.setActivity("FREE NADEKO 2K19", {type: "PLAYING"});
});

client.on("message", async message => {
 // let prefix = config.prefix
 // if (!message.content.startsWith(prefix)) return; 
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

  if (!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
        prefix: config.prefix
    };
  }

  let prefix = prefixes[message.guild.id].prefix;
  if (!message.content.startsWith(prefix)) return; 

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  let commandfile = client.commands.get(command.slice());
  if(commandfile) commandfile.run(client, message, args);
});

client.login(process.env.BOT_TOKEN);
