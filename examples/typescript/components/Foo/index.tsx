// Because of the way TypeScript works, this will export the following in plain
// JavaScript:
//
// {
//   Foo: <React component>,
//   FooProps: undefined,
//   NotAComponent: <...>
// }
//
// It's expected that FooProps is exported as undefined, because it only exists
// in the TypeScript realm.
export { Foo, FooProps, NotAComponent } from './Foo';
