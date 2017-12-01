'use strict' 

class Repository {
  constructor(console) {
    this._repo = {};
    this._console = console;
  }

  pushEvents(id, events) {
    if (!(id in this._repo)) {
      this._repo[id] = []
    }; 

    for (let event of events) {
      this._repo[id].push(event);
    }
  }

  getEvents(id) {
    return this._repo[id];
  }
}

module.exports = Repository;
