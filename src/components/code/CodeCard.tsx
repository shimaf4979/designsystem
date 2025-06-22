import styles from "./CodeCard.module.scss";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeCardProps {
  code: string;
  language?: string;
}

function CodeCard({ code, language = "javascript" }: CodeCardProps) {
  return (
    <div>
      <SyntaxHighlighter
        className={styles.codeCardContainer}
        language={language}
        style={materialDark}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeCard;
