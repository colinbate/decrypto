import m from 'mithril';
import {connect} from 'mithril-redux';
import {enterGuess, reset} from '../actions';
import findDupes from '../find-dupes';

const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class SolverForm {
  view(ctrl, {show, words, key}) {
    console.log(key);
    const dupes = findDupes(key);
    const guessed = new Set(key.values());
    return m('form.solver.uk-form', 
      !show ? m('div') : m('div', [m('div.uk-clearfix', words.map(word => (
        m('div.word', 
          word.map(letter => (
            m('div.letter', [
              letter.punctuation ?
                m('div.punct', letter.char) :
                m('label', [
                  m('input[type="text"]', {
                    value: key.get(letter.char) || '',
                    oninput: m.withAttr('value', ctrl.enterGuess(letter.char)),
                    class: dupes.has(letter.char) ? 'uk-form-danger' : '',
                    disabled: !!letter.given
                  }),
                  m('span', letter.char)
                ])
            ])
          ))
        )
      ))),
      m('div.uk-form-row.reset-row', [
        m('div.remaining-letters', alpha.split('').map(remlet => m(
          'span', {class: guessed.has(remlet) ? 'uk-text-muted' : 'uk-text-bold'}, remlet
        )))
      ]),
      m('div.uk-form-row.reset-row', [
        m('button.uk-button', {onclick: ctrl.reset()}, 'Start New')
      ])
    ]));
  }
}

export default connect((state) => ({
  show: state.showSolver,
  words: state.letters,
  key: state.key
}), {
  enterGuess,
  reset
})(SolverForm);