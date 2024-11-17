import parseArguments from '../src/parseArguments.js';

describe('parseArguments', () => {
  test('parses arguments correctly with output directory', () => {
    const url = 'https://example.com';
    const outputDir = './output';

    process.argv = ['node', 'main.js', '-o', outputDir, url];
    const args = parseArguments();

    expect(args.url).toBe(url);
    expect(args.outputDir).toBe(outputDir);
  });

  test('uses default output directory when not specified', () => {
    const url = 'https://example.com';

    process.argv = ['node', 'main.js', url];
    const args = parseArguments();

    expect(args.url).toBe(url);
    expect(args.outputDir).toBe(process.cwd());
  });

  test('throws error when URL is not provided', () => {
    process.argv = ['node', 'main.js'];

    const stderrWriteMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});

    expect(() => {
      parseArguments();
    }).toThrow("error: missing required argument 'url'");

    stderrWriteMock.mockRestore();
  });
});
