import React from "react";
import styles from "./page.module.scss";
import CodeCard from "@/components/code/CodeCard";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    paramfirst?: string;
    paramsecond?: string;
  };
}

const Page = ({ params, searchParams }: PageProps) => {
  const { slug } = params;
  const { paramfirst, paramsecond } = searchParams;

  const codeExample = `
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    paramfirst?: string;
    paramsecond?: string;
  };
}

const Page = ({ params, searchParams }: PageProps) => {
  const { slug } = params;
  const { paramfirst, paramsecond } = searchParams;

  return (
    <div>
      <p>Slug: {slug}</p>
      <p>Param First: {paramfirst}</p>
      <p>Param Second: {paramsecond}</p>
    </div>
  );
};`;

  return (
    <div className={styles.container}>
      <div className={styles.flexColumn}>
        <h2>Server Side Routing</h2>
        <div className={styles.infoSection}>
          <p>
            <strong>Slug:</strong> {slug || "なし"}
          </p>
          <p>
            <strong>Param First:</strong> {paramfirst || "なし"}
          </p>
          <p>
            <strong>Param Second:</strong> {paramsecond || "なし"}
          </p>
        </div>
        <CodeCard code={codeExample} language="tsx" />
      </div>
    </div>
  );
};

export default Page;
