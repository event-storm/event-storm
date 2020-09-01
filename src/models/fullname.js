import { createVirtualModel } from 'helpers/eventBus/configure';

import nameModel from './name';
import surnameModel from './surname';

const handler = ([ name, surname ]) => name + surname;

const fullnameModel = createVirtualModel(nameModel, surnameModel)(handler);

export default fullnameModel;
