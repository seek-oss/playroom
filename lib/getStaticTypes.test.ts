import { resolve } from 'node:path';

// @ts-expect-error No types
import getStaticTypes from './getStaticTypes';

describe('getStaticTypes', () => {
  it('should get static types from typescript components', async () => {
    const result = await getStaticTypes({
      cwd: resolve(__dirname, '../cypress/projects/typescript'),
    });

    expect(result).toMatchInlineSnapshot(`
      {
        "Bar": {
          "color": [
            "red",
            "blue",
            "black",
          ],
        },
        "Foo": {
          "color": [
            "red",
            "blue",
            "black",
          ],
        },
      }
    `);
  });
});
