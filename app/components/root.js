import m from 'mithril';
import QuoteEntry from './quote-entry';
import SolverForm from './solver-form';

class Root {
  view() {
    return m('div#content', [
      m('header', [
        m('h1', 'DeCryptoquote')
      ]),
      m('main', [
        QuoteEntry,
        SolverForm
      ])
    ]);
  }
}

export default new Root();