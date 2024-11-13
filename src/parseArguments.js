import { Command } from 'commander';

function parseArguments() {
  const program = new Command();
  program
    .name('page-loader')
    .description('Скачивает HTML страницу и сохраняет ее в указанной директории')
    .option('-o, --output <dir>', 'Директория для сохранения', process.cwd())
    .argument('<url>', 'URL страницы для скачивания')
    .parse(process.argv);

  const options = program.opts();
  const url = program.args[0];
  const outputDir = options.output;

  return { url, outputDir };
}

export default parseArguments;
