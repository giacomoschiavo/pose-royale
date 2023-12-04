import styles from "./BorderedButton.module.css";

const BordereButton = ({
  clickable = true,
  onClick,
  children,
  customStyle,
}) => {
  return (
    <div className={`${styles.background} ${customStyle}`}>
      <div className={styles.btnContainer}>
        <button
          className={styles.styledButton}
          onClick={onClick}
          style={clickable ? { cursor: "pointer" } : { cursor: "default" }}
        >
          {children}
        </button>
      </div>
    </div>
  );
};

export default BordereButton;
