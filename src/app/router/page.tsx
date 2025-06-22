"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import CodeCard from "@/components/code/CodeCard";
import {
  RoutingProvider,
  useRoutingDispatch,
  useRoutingState,
} from "@/contexts/router/routingContext";

const RouterContent = () => {
  const [slug, setSlug] = useState("");
  const [paramsFirst, setParamsFirst] = useState("");
  const [paramsSecond, setParamsSecond] = useState("");
  const [navigationType, setNavigationType] = useState<"Link" | "Router">(
    "Link"
  );

  const router = useRouter();
  const routingState = useRoutingState();
  const routingType = routingState?.routingType || "Server";
  const dispatch = useRoutingDispatch();

  const handleRoutingTypeChange = (type: "Server" | "Client") => {
    dispatch?.({
      type: "APPLY_TYPE",
      componentsType: type,
    });
  };

  const handleNavigation = () => {
    const path = `/router/${routingType.toLowerCase()}/${slug}${queryString}`;
    router.push(path);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  const handleBack = () => {
    router.back();
  };

  const handleForward = () => {
    router.forward();
  };

  const handleReplace = () => {
    const path = `/router/${routingType.toLowerCase()}/${slug}${queryString}`;
    router.replace(path);
  };

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (paramsFirst) params.append("paramfirst", paramsFirst);
    if (paramsSecond) params.append("paramsecond", paramsSecond);
    const result = params.toString();
    return result ? `?${result}` : "";
  }, [paramsFirst, paramsSecond]);

  const linkCode = `
<Link
  href={\`/router/\${routingType.toLowerCase()}/\${slug}\`}
>
   {\`Go to /router/\${routingType.toLowerCase()}/\${slug ?? ""} \`}
</Link>`;

  const routerCode = `
import { useRouter } from "next/navigation";

const router = useRouter();

const handleNavigation = () => {
  const path = \`/router/\${routingType.toLowerCase()}/\${slug}\${queryString}\`;
  router.push(path);
};

<button onClick={handleNavigation}>
  {\`Go to /router/\${routingType.toLowerCase()}/\${slug ?? ""}\${queryString}\`}
</button>`;

  const routerNavigationCode = `
import { useRouter } from "next/navigation";

const router = useRouter();

// ページをリフレッシュ
const handleRefresh = () => {
  router.refresh();
};

// 前のページに戻る
const handleBack = () => {
  router.back();
};

// 次のページに進む
const handleForward = () => {
  router.forward();
};

// 現在のページを置き換える（履歴に残らない）
const handleReplace = () => {
  const path = \`/router/\${routingType.toLowerCase()}/\${slug}\${queryString}\`;
  router.replace(path);
};

<button onClick={handleRefresh}>Refresh</button>
<button onClick={handleBack}>Back</button>
<button onClick={handleForward}>Forward</button>
<button onClick={handleReplace}>Replace</button>`;

  const paramsLinkCode = `
const queryString = useMemo(() => {
  const params = new URLSearchParams();
  if (paramsFirst) params.append("paramfirst", paramsFirst);
  if (paramsSecond) params.append("paramsecond", paramsSecond);
  const result = params.toString();
  return result ? \`?\${result}\` : "";
}, [paramsFirst, paramsSecond]);

<Link
  href={\`/router/\${routingType.toLowerCase()}/\${slug}\${queryString}\`}
>
  {\`Go to /router/\${routingType.toLowerCase()}/\${slug ?? ""}\${queryString}\`}
</Link>`;

  const paramsRouterCode = `
const queryString = useMemo(() => {
  const params = new URLSearchParams();
  if (paramsFirst) params.append("paramfirst", paramsFirst);
  if (paramsSecond) params.append("paramsecond", paramsSecond);
  const result = params.toString();
  return result ? \`?\${result}\` : "";
}, [paramsFirst, paramsSecond]);

const handleNavigation = () => {
  const path = \`/router/\${routingType.toLowerCase()}/\${slug}\${queryString}\`;
  router.push(path);
};

<button onClick={handleNavigation}>
  {\`Go to /router/\${routingType.toLowerCase()}/\${slug ?? ""}\${queryString}\`}
</button>`;

  return (
    <div className={styles.container}>
      <div className={styles.flexColumn}>
        <p className={styles.infoSection}>Next.js Routing(v14~/App Router)</p>
        <div className={styles.flexRow}>
          <div className={styles.routingTypeSection}>
            <div>
              Routing Type<span>→{routingType}</span>
            </div>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="routingType"
                  value="Server"
                  checked={routingType === "Server"}
                  onChange={() => handleRoutingTypeChange("Server")}
                />
                <span className={styles.radioText}>Server</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="routingType"
                  value="Client"
                  checked={routingType === "Client"}
                  onChange={() => handleRoutingTypeChange("Client")}
                />
                <span className={styles.radioText}>Client</span>
              </label>
            </div>
          </div>

          <div className={styles.routingTypeSection}>
            <div>
              Navigation Type<span>→{navigationType}</span>
            </div>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="navigationType"
                  value="Link"
                  checked={navigationType === "Link"}
                  onChange={() => setNavigationType("Link")}
                />
                <span className={styles.radioText}>Link</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="navigationType"
                  value="Router"
                  checked={navigationType === "Router"}
                  onChange={() => setNavigationType("Router")}
                />
                <span className={styles.radioText}>Router</span>
              </label>
            </div>
          </div>
        </div>

        <p>Slug Only</p>
        <div>
          <span>slug = </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={styles.input}
          />
        </div>

        {navigationType === "Link" ? (
          <Link
            href={`/router/${routingType.toLowerCase()}/${slug}`}
            className={`${styles.button} ${styles.primary}`}
          >
            {`Go to /router/${routingType.toLowerCase()}/${slug ?? ""} `}
          </Link>
        ) : (
          <button
            onClick={handleNavigation}
            className={`${styles.button} ${styles.primary}`}
          >
            {`Go to /router/${routingType.toLowerCase()}/${slug ?? ""} `}
          </button>
        )}

        <CodeCard
          code={navigationType === "Link" ? linkCode : routerCode}
          language="tsx"
        />

        <p>With Parameters</p>
        <div>
          <span>Parameter 1 = </span>
          <input
            type="text"
            value={paramsFirst}
            onChange={(e) => setParamsFirst(e.target.value)}
            placeholder="パラメータ1"
            className={styles.input}
          />{" "}
        </div>
        <div>
          <span>Parameter 2 = </span>
          <input
            type="text"
            value={paramsSecond}
            onChange={(e) => setParamsSecond(e.target.value)}
            placeholder="パラメータ2"
            className={styles.input}
          />
        </div>

        {navigationType === "Link" ? (
          <Link
            href={`/router/${routingType.toLowerCase()}/${slug}${queryString}`}
            className={`${styles.button} ${styles.primary}`}
          >
            {`Go to /router/${routingType.toLowerCase()}/${
              slug ?? ""
            }${queryString}`}
          </Link>
        ) : (
          <button
            onClick={handleNavigation}
            className={`${styles.button} ${styles.primary}`}
          >
            {`Go to /router/${routingType.toLowerCase()}/${
              slug ?? ""
            }${queryString}`}
          </button>
        )}

        <CodeCard
          code={navigationType === "Link" ? paramsLinkCode : paramsRouterCode}
          language="tsx"
        />
        {navigationType === "Router" && (
          <>
            <p>Router Navigation Methods</p>
            <div className={styles.buttonGroup}>
              <button
                onClick={handleRefresh}
                className={`${styles.button} ${styles.secondary}`}
              >
                Refresh
              </button>
              <button
                onClick={handleBack}
                className={`${styles.button} ${styles.secondary}`}
              >
                Back
              </button>
              <button
                onClick={handleForward}
                className={`${styles.button} ${styles.secondary}`}
              >
                Forward
              </button>
              <button
                onClick={handleReplace}
                className={`${styles.button} ${styles.secondary}`}
              >
                Replace
              </button>
            </div>
            <CodeCard code={routerNavigationCode} language="tsx" />
          </>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <RoutingProvider>
      <RouterContent />
    </RoutingProvider>
  );
};

export default Page;
