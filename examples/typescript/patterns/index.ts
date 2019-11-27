import dedent from 'dedent';

export default [
  {
    name: 'Foo > Default',
    code: dedent`
      <Foo />
    `
  },
  {
    name: 'Foo > With Message',
    code: dedent`
      <Foo>
        <strong>Hello</strong>
      </Foo>
    `
  },
  {
    name: 'Bar > Default',
    code: dedent`
      <Bar />
    `
  },
  {
    name: 'Bar > With Message',
    code: dedent`
      <Bar>
        <strong>Hello</strong>
      </Bar>
    `
  }
];
