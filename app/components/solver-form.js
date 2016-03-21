import m from 'mithril';
import {connect} from 'mithril-redux';
import {enterGuess} from '../actions';

class SolverForm {
  view(ctrl, {show, words, key}) {
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
                    oninput: m.withAttr('value', ctrl.enterGuess(letter.char))
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