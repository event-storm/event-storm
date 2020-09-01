import { createVirtualModel } from 'helpers/eventBus/configure';

import nameModel from './name';
import fullnameModel from './fullname';

const handler = ([ name, fullname ]) => `${name} + ${fullname}`;

const combinedModel = createVirtualModel(nameModel, fullnameModel)(handler);

export default combinedModel;
