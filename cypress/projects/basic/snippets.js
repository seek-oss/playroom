export default [
  {
    group: 'Foo',
    name: 'Default',
    code: '<Foo>Foo</Foo>',
  },
  {
    group: 'Foo',
    name: 'Red',
    code: '<Foo color="red">Red Foo</Foo>',
  },
  {
    group: 'Bar',
    name: 'Default',
    code: '<Bar>Bar</Bar>',
  },
  {
    group: 'Bar',
    name: 'Blue',
    description: 'Blue variant of the Bar component',
    code: '<Bar color="blue">Blue Bar</Bar>',
  },
  {
    group: 'Scope',
    name: 'hello world',
    code: '<Foo>{hello()} {world()}</Foo>',
  },
];
