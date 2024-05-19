const { SlashCommandBuilder } = require('discord.js');
const hello = ["Hello", "Hi", "Howdy", "Hey", "Bonjour", "Hola", "Buongiorno", "Allo"]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Replies hello in various way'),
	async execute(interaction) {
		await interaction.reply({ content: `${hello[Math.floor(Math.random() * hello.length)]} ${interaction.user.username} ! `, ephemeral: true});
	},
};
