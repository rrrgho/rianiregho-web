import parse, {
  HTMLReactParserOptions,
  Element,
  domToReact,
} from "html-react-parser";

/**
 * Custom HTML renderer with Tailwind styling
 * Converts HTML content to properly styled React components
 */
export function renderHtmlContent(html: string) {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      // Type guard to check if it's an Element node
      if (!(domNode instanceof Element)) {
        return;
      }

      const { name, attribs, children } = domNode;

      // Style headings
      if (name === "h1") {
        return (
          <h1 className="text-4xl font-bold text-primary mt-8 mb-4">
            {domToReact(children as any, options)}
          </h1>
        );
      }
      if (name === "h2") {
        return (
          <h2 className="text-3xl font-bold text-primary mt-6 mb-3">
            {domToReact(children as any, options)}
          </h2>
        );
      }
      if (name === "h3") {
        return (
          <h3 className="text-2xl font-bold text-primary mt-5 mb-2">
            {domToReact(children as any, options)}
          </h3>
        );
      }
      if (name === "h4") {
        return (
          <h4 className="text-xl font-bold text-primary mt-4 mb-2">
            {domToReact(children as any, options)}
          </h4>
        );
      }

      // Style paragraphs
      if (name === "p") {
        return (
          <p className="text-base leading-relaxed mb-4 text-justify">
            {domToReact(children as any, options)}
          </p>
        );
      }

      // Style lists
      if (name === "ul") {
        return (
          <ul className="list-disc list-inside mb-4 space-y-2">
            {domToReact(children as any, options)}
          </ul>
        );
      }
      if (name === "ol") {
        return (
          <ol className="list-decimal list-inside mb-4 space-y-2">
            {domToReact(children as any, options)}
          </ol>
        );
      }
      if (name === "li") {
        return <li className="ml-2">{domToReact(children as any, options)}</li>;
      }

      // Style blockquotes
      if (name === "blockquote") {
        return (
          <blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 italic text-muted-foreground">
            {domToReact(children as any, options)}
          </blockquote>
        );
      }

      // Style code
      if (name === "code") {
        return (
          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
            {domToReact(children as any, options)}
          </code>
        );
      }

      // Style code blocks
      if (name === "pre") {
        return (
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
            {domToReact(children as any, options)}
          </pre>
        );
      }

      // Style images
      if (name === "img") {
        return (
          <img
            src={attribs.src}
            alt={attribs.alt || "Image"}
            className="max-w-full h-auto rounded-lg mb-4"
          />
        );
      }

      // Style links
      if (name === "a") {
        return (
          <a
            href={attribs.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {domToReact(children as any, options)}
          </a>
        );
      }

      // Style strong/bold
      if (name === "strong" || name === "b") {
        return (
          <strong className="font-bold">
            {domToReact(children as any, options)}
          </strong>
        );
      }

      // Style emphasis/italic
      if (name === "em" || name === "i") {
        return (
          <em className="italic">{domToReact(children as any, options)}</em>
        );
      }

      // Default - don't replace, let it render normally
      return;
    },
  };

  return parse(html, options);
}
