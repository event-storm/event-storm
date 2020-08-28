import { createVirtualModel } from 'helpers/eventBus/configure';

import model1 from './event1';
import model2 from './event2';

const handler = ({ event1, event2 }) => event1 + event2;

const event3Model = createVirtualModel(model1, model2)(handler);

export default event3Model;
