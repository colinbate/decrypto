import m from 'mithril';

class Root {
  view() {
    return m('div#content', [
      m('header', [
        m('h1', 'DeCryptoquote')
      ]),
      m('main')
    ]);
  }
}

export default new Root();