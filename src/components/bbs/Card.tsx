import React from "react";
import styles from "./Card.module.scss";

interface CardProps {
  id: number;
  title: string;
  body: string;
  userId: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  body,
  userId,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.body}>{body}</p>
          <small className={styles.meta}>
            User ID: {userId} | Post ID: {id}
          </small>
        </div>
        <div className={styles.actions}>
          {onEdit && (
            <button
              onClick={() => onEdit(id)}
              className={`${styles.button} ${styles.edit}`}
            >
              編集
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(id)} className={`${styles.button}`}>
              削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
