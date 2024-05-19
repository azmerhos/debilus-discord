const { SlashCommandBuilder } = require("discord.js");
const { OWtoken } = require("./../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription(
      "Return the actual weather of the given city (name or zipcode format)"
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("name")
        .setDescription("Name of the city")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The city name")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const name = interaction.options.getString("name");
    const zipcode = interaction.options.getInteger("zipcode");
    const countryCode = interaction.options.getString("country_code");
    let data, pos, request;
    if (!name) {
        await interaction.reply({
          content: `Incorrect input. Is your input correct ?`,
          ephemeral: true,
        });
        return;
      } 
     else {
      request = new Request(
        `http://api.openweathermap.org/geo/1.0/direct?q=${name}&appid=${OWtoken}`
      );
    }
    pos = await cityget(request);
    data = await weatherget(pos);
    await interaction.reply(
      `Weather at ${data.get("city")} : ${data.get("weather")}, Temperature : ${data.get("temp")}°C, Humidity: ${data.get("hum")}%`
    );
  },
};

const cityget = async function (request) {
  //async because we need to wait fetch result or else pos will be undefined
  let pos = new Map(); // Map = key => value array
  await fetch(request)
    .then((response) => {
      // response = result of request
      if (!response.ok) {
        // not Status 200 ?
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // data = response.json()
      pos.set("lat", data[0].lat).set("lon", data[0].lon);
    });
  return pos;
};

const weatherget = async function (pos) {
  let values = new Map();
  const weatherRequest = new Request(
    `https://api.openweathermap.org/data/2.5/weather?lat=${pos.get("lat")}&lon=${pos.get("lon")}&appid=${OWtoken}&units=metric`
  );
  await fetch(weatherRequest)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      values
        .set("city", data.name)
        .set("weather", data.weather[0].main)
        .set("temp", data.main.temp)
        .set("hum", data.main.humidity);
    });
  return values;
};
