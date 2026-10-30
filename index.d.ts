declare function parse(header: string): Record<string, string>[];

declare namespace parse {
  export { parse };
}

export = parse;
