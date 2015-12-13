'use strict'

class Greet{

  static get inject() {
    return ['Adonis/Addons/Config', 'Adonis/Addons/Console']
  }

  constructor (Config, Console) {
    this.config = Config
    this.console = new Console
  }

  static get signature(){
    return 'greet {name?}'
  }

  static get description(){
    return 'This command will greet a person with name'
  }

  *handle(options, flags){
    if(!options.name) {
      options.name = yield this.console.ask('What is your name')
    }
    console.log('Your google id is ' + this.config.get('social.google.APP_ID'))
    return `Hello ${options.name}`
  }

}

module.exports = Greet
