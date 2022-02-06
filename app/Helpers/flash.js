import * as bulmaToast from 'bulma-toast'
import 'animate.css';

class Flash {
  msg(msg, status = 'success') {
    bulmaToast.toast({
      message: msg,
      type: status == 'success' ? 'is-success' : 'is-danger',
      animate: { in: 'fadeInUp', out: 'fadeOut' },
      position: 'bottom-center',
      dismissible: true,
    });
  }

  error(msg) {
    this.msg(msg, 'error');
  }
}

export default Flash;
