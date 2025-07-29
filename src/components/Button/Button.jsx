import style from "./Button.module.scss";

export const Button = ({ children, onClick }) => {
  return (
    <button className={style.button} onClick={onClick}>{children}</button>
  )
}

