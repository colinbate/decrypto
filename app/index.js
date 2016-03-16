import m from 'mithril';
import {Provider} from 'mithril-redux';
import configStore from './store';
import Root from './components/root';

const store = configStore();

m.mount(document.body, Provider.init(store, m, Root));