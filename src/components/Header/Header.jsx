import { Container } from "../Container/Container";
import s from "./Header.module.scss";

export const Header = () => {
  return (
    <>
      <header className={s.header}>
        <Container>
          <div className={s.header__wrap}>
            <h2 className={s.header__logo}>
              RoomCraft — <span>створи кімнату своєї мрії</span>
            </h2>
            <button className={s.header__btn}>Збережене</button>
          </div>
        </Container>
      </header>
    </>
  );
};