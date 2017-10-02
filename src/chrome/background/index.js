import config from '../../config';

require('./sync');
require('./account');
require('./utils');
require('./selector');

if (config.DEVELOPMENT) {
    require('./reloadExtension');
}
