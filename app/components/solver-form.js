import m from 'mithril';
import {connect} from 'mithril-redux';
import {enterGuess} from '../actions';
import findDupes from '../find-dupes';

class SolverForm {
  view(ctrl, {show, words, key}) {
    const dupes = findDupes(key);
    return m('form.solver.uk-form', 
      !show ? m('div') : words.map(word => (
        m('div.word', 
          word.map(letter => (
            m('div.letter', [
              letter.punctuation ?
                m('div.punct', letter.char) :
                m('label', [
                  m('input[type="text"]', {
                    value: key.get(letter.char) || '',
                    oninput: m.withAttr('value', ctrl.enterGuess(letter.char)),
                    class: dupes.has(letter.char) ? 'uk-form-danger' : ''
                  }),
                  m('span', letter.char)
                ])
            ])
          ))
        )
      ))
    );
  }
}

export default connect((state) => ({
  show: state.showSolver,
  words: state.letters,
  key: state.key
}), {
  enterGuess
})(SolverForm);