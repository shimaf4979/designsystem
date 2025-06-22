"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./page.module.scss";
import CodeCard from "@/components/code/CodeCard";

const Page = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = params.slug as string;
  const paramFirst = searchParams.get("paramfirst");
  const paramSecond = searchParams.get("paramsecond");

  const codeExample = `
"use client";

import { useParams, useSearchParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const slug = params.slug as string;
  const paramFirst = searchParams.get("paramfirst");
  const paramSecond = searchParams.get("paramsecond");

  return (
    <div>
      <p>Slug: {slug}</p>
      <p>Param First: {paramFirst}</p>
      <p>Param Second: {paramSecond}</p>
    </div>
  );
};`;

  return (
    <div className={styles.container}>
      <div className={styles.flexColumn}>
        <h2>Client Side Routing</h2>
        <div className={styles.infoSection}>
          <p>
            <strong>Slug:</strong> {slug || "なし"}
          </p>
          <p>
            <strong>Param First:</strong> {paramFirst || "なし"}
          </p>
          <p>
            <strong>Param Second:</strong> {paramSecond || "なし"}
          </p>
        </div>
        <CodeCard code={codeExample} language="tsx" />
      </div>
    </div>
  );
};

export default Page;
