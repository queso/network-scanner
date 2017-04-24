import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import DevicesList from '../imports/ui/devicesList';

const App = () => {
  return (
    <div>
      <h1>Welcome to the Network Scanner</h1>
      <DevicesList />
    </div>
  )
}

Meteor.startup(() => {
    render(<App />, document.getElementById('react-root'));
});
