import { Header } from "../../components/Header/Header";
import { Catalog } from "../../components/Catalog/Catalog";
import style from "./MainPage.module.scss";

export const MainPage = () => {
  return (
    <>
      <Header />
      <main className={style.main}>
        <Catalog />
      </main>
    </>
  );
};
