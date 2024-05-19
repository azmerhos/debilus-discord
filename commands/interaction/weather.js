const { SlashCommandBuilder } = require('discord.js');
const OWKey = "ecb581a494e3a4f27e66c29c72970b6f"

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Return the actual weather of the given city (city or zipcode format)')
        .addSubcommand(subcommand =>
            subcommand
                .setName('name')
                .setDescription('Name of the city')
                .addStringOption(option => option
                    .setName('target')
                    .setDescription('The city name')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('zipcode')
                .setDescription('Zipcode of the city'))
                .addIntegerOption(option => option
                    .setName('target')
                    .setDescription('The city zipcode')
                    .setRequired(true)),
	async execute(interaction) {
        const name = interaction.option.getString('name');
        const zipcode = interaction.option.getInteger('zipcode');
		if (!name) {
            if (!zipcode) {
                await interaction.reply({ content: `Incorrect inputs. Is your input correct ?`, ephemeral: true});
            }
			else {
                await interaction.reply(`aaaa`);
            }
		}
        else {
            const data = cityget(name);
            await interaction.reply(`Weather at ${data[0]} : ${data[1]}, Temperature : ${data[2]}, Humidity: ${data[3]}`);
        }
	},
};

const cityget = function(name) {
    const cityRequest = new Request(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&appid=${OWKey}`);
    fetch(myRequest)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = weatherget(response[0].lon, response[0].lat);
        return data;
    })
}

const weatherget = function(lon, lat) {
    const weatherRequest = new Request(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWKey}`);
    fetch(myRequest)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const name = response.name;
        const weather = response.weather[0].main;
        const temperature = response.weather.main.temp;
        const humidity = response.weather.main.humidity;
        return [name, weather, temperature, humidity];
    })
}