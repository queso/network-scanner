import React from 'react';
import Tracker from 'tracker-component';
import Devices from '../collections/devices';

class DevicesList extends Tracker.Component {
  constructor(props) {
    super(props);
    this.subscribe('devices');
    this.autorun(() => {
      this.setState({
        devices: Devices.find().fetch()
      });
    });
  }
  render() {
    return (
      <div>
        <h2>Devices found:</h2>
        <table>
          <thead>
            <td>IP Address</td>
            <td>Hostname</td>
            <td>Open Ports</td>
          </thead>
          <tbody>
          {this.state.devices.map((device) => {
            return <Device key={device._id} device={device}/>
          })}
          </tbody>
        </table>
      </div>
    )
  }
}

const Device = ({device}) => {
  return (
    <tr>
      <td >{device.ipAddress}</td>
      <td>{device.hostname}</td>
      <td>{
        <Ports ports={device.openPorts} />
      }</td>
    </tr>
  )
}

const Ports = ({ports}) => {
  if (ports.length > 0) {
    return (
      <span>{ports.filter(x => !!x).map((port) => {return `${port.port} ${port.service}`}).join(', ')}</span>
    )
  } else {
    return null
  }
}
export default DevicesList;
