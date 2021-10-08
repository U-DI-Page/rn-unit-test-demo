import React from 'react';
import { mount } from 'enzyme';
import App from './app';

test.only('react app', () => {
  const app = mount(<App />)
})