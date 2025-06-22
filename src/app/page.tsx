import Link from "next/link";
import React from "react";
import styles from "./page.module.scss";

const page = () => {
  return (
    <div className={styles.container}>
      page
      <Link href="/router" className={styles.link}>
        Go Router
      </Link>
    </div>
  );
};

export default page;
