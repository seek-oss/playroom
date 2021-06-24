import dedent from 'dedent';

export default [
  {
    group: 'wc-foo',
    name: 'Default',
    code: dedent`
      <wc-foo></wc-foo>
    `,
  },
  {
    group: 'wc-foo',
    name: 'With Name',
    code: dedent`
      <wc-foo name="Mark"></wc-foo>
    `,
  },
  {
    group: 'wc-bar',
    name: 'Default',
    code: dedent`
      <wc-bar></wc-bar>
    `,
  },
  {
    group: 'wc-bar',
    name: 'With Name',
    code: dedent`
      <wc-bar name="Seek"></wc-bar>
    `,
  },
];
