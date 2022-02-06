import './index.scss';

import Alpine from 'alpinejs';
window.Alpine = Alpine;

const Dashboard = require('../app/Controllers/Dashboard');
Alpine.data('Dashboard', () => Dashboard);

Alpine.start();
