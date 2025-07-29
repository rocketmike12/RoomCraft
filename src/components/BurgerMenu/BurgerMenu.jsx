import style from "./BurgeMenu.module.scss";

export const BurgerMenu = ({ children }) => {
  return (
    <div className={style.menu}>
      {children}
    </div>
  )
}

