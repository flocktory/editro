module.exports = function(Editro) {
  const { type: { Controller, Instrument, SelectComponent } } = Editro;

  class WidgetSettings extends Controller {
    onElementSelected(el) {
      const enabled = el.getTag() === 'body';
      this.toggle(enabled);
      if (!enabled) {
        return;
      }

      if (this.select) {
        this.select.removeAllListeners('change');
        this.select.destroy();
      }

      this.node.innerHTML = '<h3 class="EditroController-title">Widget settings</h3>';

      this.select = new SelectComponent(el.getAttribute('data-type'), {
        choices: ['popup', 'fixed', 'embedded'],
        label: this.editro.i18n('Type')
      });
      this.select.on('change', v => el.setAttribute('data-type', v));

      this.node.appendChild(this.select.el);
    }
    getPane() {
      return 'settings';
    }
  }

  Editro.defineHelper('controllers', 'WidgetSettings', WidgetSettings);

  Editro.defineInitHook(editro => {
    editro.addInstrument(new Instrument(editro, {
      icon: require('../../images/cog.svg'),
      title: 'Setup widget',
      onClick: () => editro.selectByQuery('body'),
      group: 'settings'
    }));
  });
};
