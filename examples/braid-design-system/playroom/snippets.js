import dedent from 'dedent';

export default [
  {
    group: 'Text',
    name: 'Default',
    code: dedent`
      <Text>Text</Text>
    `,
  },
  {
    group: 'Checkbox',
    name: 'Unchecked',
    code: dedent`
      <Checkbox id="1" label="This is a checkbox" checked={false} message={false} onChange={() => {}} />
    `,
  },
  {
    group: 'Checkbox',
    name: 'Checked',
    code: dedent`
      <Checkbox id="1" label="This is a checkbox" checked message={false} onChange={() => {}} />
    `,
  },
];
