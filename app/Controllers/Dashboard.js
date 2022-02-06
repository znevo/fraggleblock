import Pusher from 'pusher-js';
const pusher = new Pusher(process.env.PUSHER_APP_KEY, { cluster: process.env.PUSH_APP_CLUSTER });
const channel = pusher.subscribe(process.env.PUSHER_APP_CHANNEL);

import Flash from '../Helpers/flash.js';
const flash = new Flash();

import moment from 'moment';

const Dashboard = {
    init() {
        this.isMining(3000);
        this.isMining(3001);
        this.isMining(3002);

        var that = this;
        channel.bind('block-mined', function(data) {
            that.stats[3000] = data.stats['Miner 1'];
            that.stats[3001] = data.stats['Miner 2'];
            that.stats[3002] = data.stats['Miner 3'];
            that.blocks.unshift(data.block);
        });
    },

    blocks: [],

    mining: {
      3000: false,
      3001: false,
      3002: false,
    },

    stats: {
      3000: 0,
      3001: 0,
      3002: 0,
    },

    at(time) {
      return moment(time).format('dddd h:mm:ss a');
    },

    latestBlocks() {
        return this.blocks.slice(0,15);
    },

    isMining(port) {
        var that = this;
        fetch(`http://localhost:${port}/mining`).then((response) => {
          return response.json();
        }).then((response) => {
          this.mining[port] = response.mining;
        }).catch(() => {
          this.mining[port] = false;
          flash.error(`Cannot communicate with the miner at port ${port}.`);
        });
    },

    start(port) {
        var that = this;
        fetch(`http://localhost:${port}/start`).then((response) => {
          return response.json();
        }).then((response) => {
          if (response.status === 'error') {
            flash.error(response.message);
          } else if ( response.mining ) {
            flash.msg(`The miner at port ${port} has started mining.`);
          }

          this.mining[port] = response.mining;
        }).catch(() => {
          this.mining[port] = false;
          flash.error(`Cannot communicate with the miner at port ${port}.`);
        });
    },

    stop(port) {
        fetch(`http://localhost:${port}/stop`).then((response) => {
          return response.json();
        }).then((response) => {
          this.mining[port] = response.mining;
          flash.error(`The miner at port ${port} has stopped mining.`);
        }).catch(() => {
          this.mining[port] = false;
          flash.error(`Cannot communicate with the miner at port ${port}.`);
        });
    },
}

module.exports = Dashboard;
