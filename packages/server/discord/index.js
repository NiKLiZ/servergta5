// const Discord = require('discord.js');
// const client = new Discord.Client();
// // Create an instance of a Discord client

// /**
//  * The ready event is vital, it means that only _after_ this will your bot start reacting to information
//  * received from Discord
//  */
// client.on('ready', () => {
//   console.log('I am ready!');
// });

// client.on('message', message => {
//   // If the message is "how to embed"
//     // We can create embeds using the MessageEmbed constructor
//     // Read more about all that you can do with the constructor
//     // over at https://discord.js.org/#/docs/main/stable/class/RichEmbed
//     if(message.content === '/players') {
//       message.reply(`Игроков на сервере ${mp.players.length}`)
//       message.delete().catch(console.error)
//     }
//     if(message.content === '/members') {
//       // Send the message, mentioning the member
//       message.reply(`Сейчас в группе discord: ${message.guild.members.size}`);
//       message.delete().catch(console.error)
//     }
//     if (message.content === '/join') {
//       if (!message.guild) return;
//       // Only try to join the sender's voice channel if they are in one themselves
//       if (message.member.voiceChannel) {
//         message.member.voiceChannel.join()
//           .then(connection => { // Connection is an instance of VoiceConnection
//             message.reply('I have successfully connected to the channel!');
//             connection.playArbitraryInput('http://listen17.vdfm.ru:8000/autoradio');
//           })
//           .catch(console.error);
//       } else {
//         message.reply('You need to join a voice channel first!');
//       }
//     }
// });
// if(mp.debag){
//   client.login('NTQzMTI1OTA1MTMyODc5ODcy.Dz4Djw.AZ4tIQl3Ma-wwprSPAuTLJGEsKI');
// }
// // Log our bot in using the token from https://discordapp.com/developers/applications/me
