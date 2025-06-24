"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/bbs/Card";
import CodeCard from "@/components/code/CodeCard";
import styles from "./page.module.scss";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface FetchOptions {
  method: string;
  mode: RequestMode;
  cache: RequestCache;
  credentials: RequestCredentials;
  redirect: RequestRedirect;
  referrerPolicy: ReferrerPolicy;
  body?: string;
}

const FetchingPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchType, setFetchType] = useState<"client" | "server">("client");
  const [fetchOptions, setFetchOptions] = useState<FetchOptions>({
    method: "GET",
    mode: "cors",
    cache: "default",
    credentials: "same-origin",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 });
  const [sortBy, setSortBy] = useState<"id" | "title" | "userId">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterText, setFilterText] = useState("");
  const [filterUserId, setFilterUserId] = useState<number | "">("");

  // 基本的なfetch関数
  const fetchData = async (
    url: string,
    options: FetchOptions = fetchOptions
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: options.method,
        mode: options.mode,
        cache: options.cache,
        credentials: options.credentials,
        redirect: options.redirect,
        referrerPolicy: options.referrerPolicy,
        body: options.body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 投稿一覧を取得
  const fetchPosts = async () => {
    try {
      const data = await fetchData(
        "https://jsonplaceholder.typicode.com/posts?_limit=10"
      );
      setPosts(data);
    } catch (err) {
      console.error("投稿の取得に失敗しました:", err);
    }
  };

  // 投稿を追加
  const addPost = async () => {
    try {
      const data = await fetchData(
        "https://jsonplaceholder.typicode.com/posts",
        {
          ...fetchOptions,
          method: "POST",
          body: JSON.stringify(newPost),
        }
      );

      setPosts((prev) => [
        ...prev,
        { ...data, id: Math.max(...prev.map((p) => p.id)) + 1 },
      ]);
      setNewPost({ title: "", body: "", userId: 1 });
    } catch (err) {
      console.error("投稿の追加に失敗しました:", err);
    }
  };

  // 投稿を更新
  const updatePost = async (post: Post) => {
    try {
      await fetchData(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
        ...fetchOptions,
        method: "PUT",
        body: JSON.stringify(post),
      });

      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
      setEditingPost(null);
    } catch (err) {
      console.error("投稿の更新に失敗しました:", err);
    }
  };

  // 投稿を削除
  const deletePost = async (id: number) => {
    try {
      await fetchData(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        ...fetchOptions,
        method: "DELETE",
      });

      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("投稿の削除に失敗しました:", err);
    }
  };

  // フィルタリングとソートされた投稿一覧
  const filteredAndSortedPosts = posts
    .filter((post) => {
      const matchesText =
        filterText === "" ||
        post.title.toLowerCase().includes(filterText.toLowerCase()) ||
        post.body.toLowerCase().includes(filterText.toLowerCase());
      const matchesUserId = filterUserId === "" || post.userId === filterUserId;
      return matchesText && matchesUserId;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  useEffect(() => {
    fetchPosts();
  }, []);

  // Client Side用のコード例
  const getClientSideCode = () => {
    return `
"use client";

import { useState, useEffect } from "react";

const ClientSideComponent = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Client Sideでのfetch
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "${fetchOptions.method}",
        mode: "${fetchOptions.mode}",
        cache: "${fetchOptions.cache}",
        credentials: "${fetchOptions.credentials}",
        redirect: "${fetchOptions.redirect}",
        referrerPolicy: "${fetchOptions.referrerPolicy}",
        ${
          fetchOptions.body ? `body: JSON.stringify(${fetchOptions.body}),` : ""
        }
      });
      
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      {loading ? <p>読み込み中...</p> : (
        <div>
          {posts.map(post => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};`;
  };

  // Server Side用のコード例
  const getServerSideCode = () => {
    return `
// Server Component (app/posts/page.tsx)
import { Suspense } from "react";

// Server Sideでのfetch
async function getPosts() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "${fetchOptions.method}",
    mode: "${fetchOptions.mode}",
    cache: "${fetchOptions.cache}",
    credentials: "${fetchOptions.credentials}",
    redirect: "${fetchOptions.redirect}",
    referrerPolicy: "${fetchOptions.referrerPolicy}",
    ${fetchOptions.body ? `body: JSON.stringify(${fetchOptions.body}),` : ""}
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  return response.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </Suspense>
  );
}

// または、Server Actionsを使用する場合
"use server";

export async function createPost(formData: FormData) {
  const post = {
    title: formData.get("title"),
    body: formData.get("body"),
    userId: parseInt(formData.get("userId") as string)
  };
  
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    mode: "${fetchOptions.mode}",
    cache: "${fetchOptions.cache}",
    credentials: "${fetchOptions.credentials}",
    redirect: "${fetchOptions.redirect}",
    referrerPolicy: "${fetchOptions.referrerPolicy}",
    body: JSON.stringify(post)
  });
  
  return response.json();
}`;
  };

  // CRUD操作のコード例
  const getCrudCode = () => {
    return `
// CRUD操作の実装例

// 1. 取得 (GET)
const fetchPosts = async () => {
  const data = await fetchData("https://jsonplaceholder.typicode.com/posts?_limit=10");
  setPosts(data);
};

// 2. 追加 (POST)
const addPost = async (newPost) => {
  const data = await fetchData("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(newPost),
  });
  setPosts(prev => [...prev, data]);
};

// 3. 更新 (PUT)
const updatePost = async (post) => {
  await fetchData(\`https://jsonplaceholder.typicode.com/posts/\${post.id}\`, {
    method: "PUT",
    body: JSON.stringify(post),
  });
  setPosts(prev => prev.map(p => p.id === post.id ? post : p));
};

// 4. 削除 (DELETE)
const deletePost = async (id) => {
  await fetchData(\`https://jsonplaceholder.typicode.com/posts/\${id}\`, {
    method: "DELETE",
  });
  setPosts(prev => prev.filter(p => p.id !== id));
};

// 5. フィルタリングとソート
const filteredAndSortedPosts = posts
  .filter(post => {
    const matchesText = filterText === "" || 
      post.title.toLowerCase().includes(filterText.toLowerCase()) ||
      post.body.toLowerCase().includes(filterText.toLowerCase());
    const matchesUserId = filterUserId === "" || post.userId === filterUserId;
    return matchesText && matchesUserId;
  })
  .sort((a, b) => {
    const aValue = a["${sortBy}"];
    const bValue = b["${sortBy}"];
    
    if ("${sortOrder}" === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fetch API デモ</h1>

      {/* 設定セクション */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>設定</h3>

        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="client"
              checked={fetchType === "client"}
              onChange={(e) =>
                setFetchType(e.target.value as "client" | "server")
              }
            />
            Client Side
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="server"
              checked={fetchType === "server"}
              onChange={(e) =>
                setFetchType(e.target.value as "client" | "server")
              }
            />
            Server Side
          </label>
        </div>

        <div className={styles.optionsGrid}>
          <div className={styles.optionGroup}>
            <label>Method:</label>
            <select
              value={fetchOptions.method}
              onChange={(e) =>
                setFetchOptions((prev) => ({ ...prev, method: e.target.value }))
              }
              className={styles.select}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
              <option value="HEAD">HEAD</option>
              <option value="OPTIONS">OPTIONS</option>
            </select>
          </div>

          <div className={styles.optionGroup}>
            <label>Mode:</label>
            <select
              value={fetchOptions.mode}
              onChange={(e) =>
                setFetchOptions((prev) => ({
                  ...prev,
                  mode: e.target.value as RequestMode,
                }))
              }
              className={styles.select}
            >
              <option value="cors">cors</option>
              <option value="no-cors">no-cors</option>
              <option value="same-origin">same-origin</option>
              <option value="navigate">navigate</option>
            </select>
          </div>

          <div className={styles.optionGroup}>
            <label>Cache:</label>
            <select
              value={fetchOptions.cache}
              onChange={(e) =>
                setFetchOptions((prev) => ({
                  ...prev,
                  cache: e.target.value as RequestCache,
                }))
              }
              className={styles.select}
            >
              <option value="default">default</option>
              <option value="no-store">no-store</option>
              <option value="reload">reload</option>
              <option value="no-cache">no-cache</option>
              <option value="force-cache">force-cache</option>
              <option value="only-if-cached">only-if-cached</option>
            </select>
          </div>

          <div className={styles.optionGroup}>
            <label>Credentials:</label>
            <select
              value={fetchOptions.credentials}
              onChange={(e) =>
                setFetchOptions((prev) => ({
                  ...prev,
                  credentials: e.target.value as RequestCredentials,
                }))
              }
              className={styles.select}
            >
              <option value="omit">omit</option>
              <option value="same-origin">same-origin</option>
              <option value="include">include</option>
            </select>
          </div>

          <div className={styles.optionGroup}>
            <label>Redirect:</label>
            <select
              value={fetchOptions.redirect}
              onChange={(e) =>
                setFetchOptions((prev) => ({
                  ...prev,
                  redirect: e.target.value as RequestRedirect,
                }))
              }
              className={styles.select}
            >
              <option value="follow">follow</option>
              <option value="error">error</option>
              <option value="manual">manual</option>
            </select>
          </div>

          <div className={styles.optionGroup}>
            <label>Referrer Policy:</label>
            <select
              value={fetchOptions.referrerPolicy}
              onChange={(e) =>
                setFetchOptions((prev) => ({
                  ...prev,
                  referrerPolicy: e.target.value as ReferrerPolicy,
                }))
              }
              className={styles.select}
            >
              <option value="no-referrer">no-referrer</option>
              <option value="no-referrer-when-downgrade">
                no-referrer-when-downgrade
              </option>
              <option value="origin">origin</option>
              <option value="origin-when-cross-origin">
                origin-when-cross-origin
              </option>
              <option value="same-origin">same-origin</option>
              <option value="strict-origin">strict-origin</option>
              <option value="strict-origin-when-cross-origin">
                strict-origin-when-cross-origin
              </option>
              <option value="unsafe-url">unsafe-url</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client/Server Sideのコード表示 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          {fetchType === "client" ? "Client Side" : "Server Side"} の実装例
        </h3>
        <CodeCard
          code={
            fetchType === "client" ? getClientSideCode() : getServerSideCode()
          }
          language="tsx"
        />
      </div>

      {/* 新規投稿フォーム */}
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>新規投稿追加</h3>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="タイトル"
            value={newPost.title}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, title: e.target.value }))
            }
            className={`${styles.input} ${styles.inputFull}`}
          />
          <input
            type="number"
            placeholder="User ID"
            value={newPost.userId}
            onChange={(e) =>
              setNewPost((prev) => ({
                ...prev,
                userId: parseInt(e.target.value),
              }))
            }
            className={`${styles.input} ${styles.inputSmall}`}
          />
        </div>
        <textarea
          placeholder="本文"
          value={newPost.body}
          onChange={(e) =>
            setNewPost((prev) => ({ ...prev, body: e.target.value }))
          }
          className={`${styles.textarea} ${styles.textareaFull}`}
        />
        <button
          onClick={addPost}
          disabled={!newPost.title || !newPost.body}
          className={`${styles.button} ${styles.success}`}
        >
          投稿を追加
        </button>
      </div>

      {/* ソート・フィルター */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>ソート・フィルター</h3>
        <div className={styles.controls}>
          <label>
            ソート項目:
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "id" | "title" | "userId")
              }
              className={styles.select}
            >
              <option value="id">ID</option>
              <option value="title">タイトル</option>
              <option value="userId">ユーザーID</option>
            </select>
          </label>
          <label>
            順序:
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className={styles.select}
            >
              <option value="asc">昇順</option>
              <option value="desc">降順</option>
            </select>
          </label>
          <button
            onClick={fetchPosts}
            className={`${styles.button} ${styles.primary}`}
          >
            再取得
          </button>
        </div>

        {/* 絞り込み機能 */}
        <div style={{ marginTop: "15px" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>絞り込み</h4>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="タイトルまたは本文で検索..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className={`${styles.input} ${styles.inputFull}`}
            />
            <input
              type="number"
              placeholder="User ID"
              value={filterUserId}
              onChange={(e) =>
                setFilterUserId(
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              className={`${styles.input} ${styles.inputSmall}`}
            />
          </div>
        </div>
      </div>

      {/* CRUD操作のコード例 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>CRUD操作のコード例</h3>
        <CodeCard code={getCrudCode()} language="javascript" />
      </div>

      {/* 投稿一覧 */}
      <div className={styles.postsList}>
        <h3 className={styles.postsTitle}>
          投稿一覧 ({filteredAndSortedPosts.length}件)
          {filterText && ` - "${filterText}"で検索`}
          {filterUserId && ` - User ID: ${filterUserId}`}
        </h3>
        {loading && <p className={styles.loading}>読み込み中...</p>}
        {error && <p className={styles.error}>エラー: {error}</p>}

        {filteredAndSortedPosts.length === 0 && !loading ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            条件に一致する投稿が見つかりませんでした。
          </p>
        ) : (
          filteredAndSortedPosts.map((post) => (
            <Card
              key={post.id}
              {...post}
              onEdit={(id) => {
                const postToEdit = posts.find((p) => p.id === id);
                if (postToEdit) setEditingPost(postToEdit);
              }}
              onDelete={deletePost}
            />
          ))
        )}
      </div>

      {/* 編集モーダル */}
      {editingPost && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>投稿を編集</h3>
            <input
              type="text"
              placeholder="タイトル"
              value={editingPost.title}
              onChange={(e) =>
                setEditingPost((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
              className={styles.input}
            />
            <textarea
              placeholder="本文"
              value={editingPost.body}
              onChange={(e) =>
                setEditingPost((prev) =>
                  prev ? { ...prev, body: e.target.value } : null
                )
              }
              className={`${styles.textarea} ${styles.textareaFull}`}
            />
            <div className={styles.modalActions}>
              <button
                onClick={() => setEditingPost(null)}
                className={`${styles.button} ${styles.secondary}`}
              >
                キャンセル
              </button>
              <button
                onClick={() => editingPost && updatePost(editingPost)}
                className={`${styles.button} ${styles.primary}`}
              >
                更新
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchingPage;
