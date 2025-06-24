import Link from "next/link";
import React from "react";
import styles from "./page.module.scss";

const page = () => {
  return (
    <div className={styles.container}>
      <Link href="/router" className={styles.link}>
        Go Router
      </Link>
      <Link href="/mordal" className={styles.link}>
        Go Modal
      </Link>
      <Link href="/fetching" className={styles.link}>
        Go Fetch
      </Link>
    </div>
  );
};

export default page;
