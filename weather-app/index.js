const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const axios = require('axios');
const dotenv = require('dotenv').config();
const argv = yargs(hideBin(process.argv)).argv;
const asyncFileRead = require('./utilites/asyncFileRead');
class WeatherApp {
  constructor(configPath, helpFilePath = path.join(__dirname, 'help.txt')){
    this.flags = ["c", "t", "h"];
    this.configPath = configPath;
    this.helpFilePath = helpFilePath;
    this.config = null
  }
  async init(){
    if(this.configPath){
      const data = await asyncFileRead(this.configPath);
      this.config = JSON.parse(data);
    }else {
      this.config = {
        city: "Нижний Новгород",
        apiKey: process.env.API_KEY,
        baseURL: 'http://api.weatherapi.com/v1'
      }
    }
  }
  async requestForcast(){
    this.checkFlags();
    try {
      const response = await axios.get(`${this.config.baseURL}/current.json`,{
        params:{
          q: this.config.city,
          key: this.config.apiKey
        }
      });
      console.log(response.data)
    } catch (error) {
      console.log(error.message)
    }
    
  }
  showHelp(){
    asyncFileRead(this.helpFilePath).then((data) => {
      console.log(data);
    })
  }
  checkFlags() {
    this.flags.forEach((flag) => {
      if(argv.hasOwnProperty(flag) && typeof argv[flag] == 'string'){
        switch (flag) {
          case 'c':
            this.config = {
              ...this.config,
              city: argv[flag]
            }
            break;
          case 't':
            this.config = {
              ...this.config,
              apiKey: argv[flag]
            }
            break;
          default:
            break;
        }
      }
    })
  }
  async start(){
    await this.init();
    if (argv.hasOwnProperty("h")) {
      return this.showHelp();
    }
    this.requestForcast();
  }
}
new WeatherApp().start()