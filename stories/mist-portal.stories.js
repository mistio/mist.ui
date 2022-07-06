import { html } from 'lit';
import '../src/mist-portal.js';

export default {
  title: 'MistPortal',
  component: 'mist-portal',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <mist-portal
      style="--mist-portal-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </mist-portal>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
