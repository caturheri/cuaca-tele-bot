require("dotenv").config();
const TeleBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = process.env.TOKEN;
const bot = new TeleBot(token, { polling: true });
const API_KEY = process.env.API_KEY;

const weatherConditions = {
  Clouds: "Berawan",
  Rain: "Hujan",
  Clear: "Cerah",
  Snow: "Salju",
  Thunderstorm: "Badai Petir",
  Drizzle: "Gerimis",
  Mist: "Kabut",
  Smoke: "Asap",
  Haze: "Kabut",
  Dust: "Debu",
  Fog: "Kabut",
  Sand: "Pasir",
  Ash: "Abu Vulkanik",
  Squall: "Angin Kencang",
  Tornado: "Angin Topan",
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = "Halo! Selamat datang di bot Cuaca Dunia.\n\n";
  const tutorialMessage =
    "Untuk mengecek cuaca suatu kota, cukup ketikkan nama kota yang Anda inginkan.\n\nContoh: Jakarta";
  const message = welcomeMessage + tutorialMessage;
  bot.sendMessage(chatId, message);
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${API_KEY}`;
    const response = await axios.get(url);
    const { weather, main, name, wind } = response.data;
    const { temp, humidity, pressure } = main;
    const { speed: windspeed } = wind;

    let weatherDescription =
      weatherConditions[weather[0].main] || "Tidak Diketahui";

    const message = `Cuaca di ${name} adalah ${weatherDescription}.\nSuhu: ${(
      temp - 273.15
    ).toFixed(
      2
    )}°C\nKelembaban: ${humidity}%.\nTekanan: ${pressure} hPa\nKecepatan Angin: ${windspeed} m/s.`;
    bot.sendMessage(chatId, message);
  } catch (error) {
    let errorMessage = "Maaf, terjadi kesalahan saat memperoleh data cuaca.";
    if (error.response && error.response.status === 404) {
      errorMessage = "Maaf, kota tidak ditemukan.";
    }
    bot.sendMessage(chatId, errorMessage);
  }
});
