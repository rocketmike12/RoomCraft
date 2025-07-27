import { useState, useEffect } from "react";
import { WelcomeModal } from "../../components/WelcomeModal/WelcomeModal";
import { Header } from "../../components/Header/Header";
import { Catalog } from "../../components/Catalog/Catalog";
import style from "./MainPage.module.scss";

export const MainPage = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("visitedRoomCraft")) {
      setShowModal(true);
    }
  }, []);
  return (
    <>
      {showModal && <WelcomeModal onClose={() => setShowModal(false)} />}
      <Header />
      <main className={style.main}>
        <Catalog />
      </main>
    </>
  );
};