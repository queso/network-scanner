import { Meteor } from 'meteor/meteor';
import arp from 'arp-a';
import nmap from 'node-nmap';

import Devices from '../imports/collections/devices'

Meteor.startup(() => {
  Meteor.setInterval(scanArp, 30000)
});

const scanArp = () => {
  arp.table((err, entry) => {
    if (err) {
      console.log(err);
    } else {
      if (entry) {
        Devices.upsert(
          {ipAddress: entry.ip},
          {$setOnInsert: {openPorts: []}, $set: {seenOn: entry.ifname, macAddress: entry.mac, lastSeenAt: new Date()}}
        )
        scanNmap(entry.ip);
      }
    }
  });
}

const scanNmap = (ip) => {
  scan = new nmap.nodenmap.QueuedNmapScan(ip);
  connected = new Promise( function( resolve ){
    scan.on( 'complete', function(data) {resolve(data)} )
  })
  scan.startRunScan();
  connected.then((result) => {
    console.log(result[0]);
    let { ip, hostname, openPorts, scanTime } = result[0];
    console.log(ip)
    Devices.upsert({ipAddress: ip}, {$set: {hostname, openPorts, scanTime}})
  })
}

Meteor.publish('devices', function() {
  return Devices.find();
});
