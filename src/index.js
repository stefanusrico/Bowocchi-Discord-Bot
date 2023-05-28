require("dotenv").config()
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
} = require("discord.js")
const { Configuration, OpenAIApi } = require("openai") //gpt
const ping = require("ping")
const eventHandler = require("./handlers/eventHandler")

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
})

let status = [
  {
    name: "ギターと孤独と蒼い惑星",
    type: ActivityType.Listening,
  },
  {
    name: "星座になれたら",
    type: ActivityType.Listening,
  },
  {
    name: "青春コンプレックス",
    type: ActivityType.Listening,
  },
  {
    name: "カラカラ",
    type: ActivityType.Listening,
  },
  {
    name: "あのバンド",
    type: ActivityType.Listening,
  },
]

const configuration = new Configuration({
  apiKey: process.env.API_KEY, //gpt
})
const openai = new OpenAIApi(configuration) //gpt

eventHandler(client)

client.on("ready", (c) => {
  console.log(`✅ ${c.user.tag} is online.`)

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length)
    client.user.setActivity(status[random])
  }, 180000)
})

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return
  }
  //gpt start
  // if (message.channel.id !== process.env.CHANNEL_ID) return
  // if (message.content.startsWith("!")) return

  // let conversationLog = [
  //   { role: "system", content: "You are a friendly chatbot." },
  // ]

  // try {
  //   await message.channel.sendTyping()

  //   let prevMessages = await message.channel.messages.fetch({ limit: 15 })
  //   prevMessages.reverse()

  //   prevMessages.forEach((msg) => {
  //     if (message.content.startsWith("!")) return
  //     if (msg.author.id !== client.user.id && message.author.bot) return
  //     if (msg.author.id !== message.author.id) return

  //     conversationLog.push({
  //       role: "user",
  //       content: msg.content,
  //     })
  //   })

  //   const result = await openai
  //     .createChatCompletion({
  //       model: "gpt-3.5-turbo",
  //       messages: conversationLog,
  //       // max_tokens: 256, // limit token usage
  //     })
  //     .catch((error) => {
  //       console.log(`OPENAI ERR: ${error}`)
  //     })

  //   message.reply(result.data.choices[0].message)
  // } catch (error) {
  //   console.log(`ERR: ${error}`)
  // }
  //gpt ends

  if (message.content === "hello") {
    message.reply("hello")
  }
  if (message.content.startsWith("!janken")) {
    const args = message.content.slice(7).trim().toLowerCase()
    if (!args) return message.reply("Please choose rock, paper or scissors.")
    if (args !== "rock" && args !== "paper" && args !== "scissors")
      return message.reply("Please choose rock, paper or scissors.")

    const choices = ["rock", "paper", "scissors"]
    const computerChoice = choices[Math.floor(Math.random() * choices.length)]

    let result
    if (computerChoice === args) {
      result = `I choose ${computerChoice}, It's a tie! .`
    } else if (
      (computerChoice === "rock" && args === "scissors") ||
      (computerChoice === "scissors" && args === "paper") ||
      (computerChoice === "paper" && args === "rock")
    ) {
      result = `I choose ${computerChoice}, You lost! .`
    } else {
      result = `I choose ${computerChoice}, You won! .`
    }

    message.reply(result)
  }

  if (message.content.startsWith("!ping")) {
    const args = message.content.slice(6).trim().toLowerCase().split(" ")
    const pingUrl = args[0]
    const count = args[1] || 1

    if (!pingUrl) return message.reply("Please specify a domain to ping.")

    const loadingMessage = await message.reply("Pinging...")

    // Ping the specified URL using the ping package
    ping.promise
      .probe(pingUrl, {
        timeout: 10000,
        min_reply: count,
      })
      .then((result) => {
        // Reply to the message with a response
        message.reply(
          `Pinging ${pingUrl} ${count} time${
            count > 1 ? "s" : ""
          }...\nStatus: ${
            result.alive ? "Alive" : "Dead"
          }\nMinimum response time: ${
            result.min || "N/A"
          }ms\nMaximum response time: ${
            result.max || "N/A"
          }ms\nAverage response time: ${result.avg || "N/A"}ms\nPacket loss: ${
            result.packetLoss
          }%`
        )
        loadingMessage.delete()
      })
      .catch((error) => {
        console.error(error)
        message.reply("An error occurred while pinging the specified domain.")
        loadingMessage.delete()
      })
  }
})

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === "hey") {
    interaction.reply("hey")
  }

  if (interaction.commandName === "avatar") {
    const avatarUrl =
      interaction.user.avatarURL({
        format: "png",
        dynamic: true,
        size: 1024,
      }) || interaction.user.defaultAvatarURL
    const botAvatarUrl =
      interaction.client.user.avatarURL({
        format: "png",
        dynamic: true,
        size: 1024,
      }) || interaction.client.user.defaultAvatarURL
    const joinedDate = interaction.member.joinedAt.toLocaleDateString()
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username}'s profile picture`)
      .setDescription(`You joined this server at ${joinedDate}`)
      .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${avatarUrl}` })
      .setColor("Random")
      .setThumbnail(`${avatarUrl}`)
      .setTimestamp()
      .setFooter({
        text: `${interaction.client.user.tag}`,
        iconURL: `${botAvatarUrl}`,
      })

    interaction.reply({
      embeds: [embed],
    })
  }
  if (interaction.commandName === "avatarbot") {
    const botAvatarUrl =
      interaction.client.user.avatarURL({
        format: "png",
        dynamic: true,
        size: 1024,
      }) || interaction.client.user.defaultAvatarURL
    const joinedDate = interaction.member.joinedAt
    const embed = new EmbedBuilder()
      .setTitle(`${interaction.client.user.username}'s profile picture`)
      .setDescription(`${joinedDate}`)
      .setAuthor({
        name: `${interaction.client.user.tag}`,
        iconURL: `${botAvatarUrl}`,
      })
      .setColor("Random")
      .setThumbnail(`${botAvatarUrl}`)
      .setTimestamp()
      .setFooter({
        text: `${interaction.client.user.tag}`,
        iconURL: `${botAvatarUrl}`,
      })

    interaction.reply({
      embeds: [embed],
    })
  }
})

client.login(process.env.TOKEN)
