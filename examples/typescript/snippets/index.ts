import dedent from 'dedent';

export default [
  {
    group: 'Foo',
    name: 'Default',
    code: dedent`
      <Foo />
    `,
  },
  {
    group: 'Foo',
    name: 'Red With Hello',
    code: dedent`
      <Foo color="red">
        <strong>Hello</strong>
      </Foo>
    `,
  },
  {
    group: 'Foo',
    name: 'With The',
    code: dedent`
      <Foo>
        <strong>The</strong>
      </Foo>
    `,
  },
  {
    group: 'Foo',
    name: 'With Quick',
    code: dedent`
      <Foo>
        <strong>Quick</strong>
      </Foo>
    `,
  },
  {
    group: 'Foo',
    name: 'With Brown',
    code: dedent`
      <Foo>
        <strong>Brown</strong>
      </Foo>
    `,
  },
  {
    group: 'Foo',
    name: 'With Fox',
    code: dedent`
      <Foo>
        <strong>Fox</strong>
      </Foo>
    `,
  },
  {
    group: 'Foo',
    name: 'With Jumps',
    code: dedent`
      <Foo>
        <strong>Jumps</strong>
      </Foo>
    `,
  },
  {
    group: 'Foo',
    name: 'Red With Over',
    code: dedent`
      <Foo color="red">
        <strong>Over</strong>
      </Foo>
    `,
  },
  {
    group: 'Foo',
    name: 'Blue With Lazy',
    code: dedent`
      <Foo color="blue">
        <strong>Lazy</strong>
      </Foo>
    `,
  },
  {
    group: 'Foo',
    name: 'With Dog',
    code: dedent`
      <Foo>
        <strong>Dog</strong>
      </Foo>
    `,
  },
  {
    group: 'Bar',
    name: 'Default',
    code: dedent`
      <Bar />
    `,
  },
  {
    group: 'Bar',
    name: 'Blue With Message',
    code: dedent`
      <Bar color="blue">
        <strong>Hello</strong>
      </Bar>
    `,
  },
];
