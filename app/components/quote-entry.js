import m from 'mithril';
import {connect} from 'mithril-redux';
import {parseQuote, setQuote} from '../actions';



class QuoteEntry {
  view(ctrl, {show}) {
    return m('form.entry.uk-form.uk-form-stacked', [
      show ? m('fieldset[data-uk-margin]', [
        m('div.uk-form-row', [
          m('label[for="crypto"].uk-form-label', 'Cryptoquote Text'),
          m('textarea[rows=5].uk-width-1-1#crypto', {onchange: m.withAttr('value', ctrl.setQuote())})
        ]),
        m('div.uk-form-row', [
          m('button.uk-button', {onclick: ctrl.parseQuote()}, 'Start')
        ])
      ]) : m('div')
    ]);
  }
}

export default connect((state) => ({show: !state.showSolver}), {
  parseQuote,
  setQuote
})(QuoteEntry);