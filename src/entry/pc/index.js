import './index.less';
import Normal from './components/normal';

window.onload = function windonload() {
  new Normal();
  import('./components/lazy').then((Com) => {
    new Com['default']();
  });
};

