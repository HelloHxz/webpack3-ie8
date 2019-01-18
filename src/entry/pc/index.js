import $ from 'jquery';
import './index.less';
import Normal from './components/normal';

window.onload = function windonload() {
  new Normal();
  require.ensure([], () => {
    const lazy = require('./components/lazy');
    new lazy.default();
  });

  // import('./components/lazy').then((Com) => {
    
  // });
};

