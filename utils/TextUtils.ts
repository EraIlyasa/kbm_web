/** Generates a lorem-ipsum body with a minimum number of characters. */
export function generateContentBody(minChars: number): string {
  const phrase = 'Automation Test - Lorem Ipsum Dolor Siamet. ';
  const repeat = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
  let result = phrase;
  while (result.length < minChars) {
    result += repeat;
  }
  return result;
}
