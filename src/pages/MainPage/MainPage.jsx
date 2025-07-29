import { useState, useEffect, useRef } from "react";
import { WelcomeModal } from "../../components/WelcomeModal/WelcomeModal";
import { Header } from "../../components/Header/Header";
import style from "./MainPage.module.scss";
import {
  Canvas,
  addObject,
  renderCanvas,
} from "../../components/Canvas/Canvas.jsx";
import { Catalog } from "../../components/Catalog/Catalog.jsx";

export const MainPage = () => {
  const [showModal, setShowModal] = useState(false);

  const canvasRef = useRef();

  const handleAdd = (id) => {
    addObject(id);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderCanvas(ctx, canvas);
  };

  useEffect(() => {
    if (!localStorage.getItem("visitedRoomCraft")) {
      setShowModal(true);
    }
  }, []);

  const [selectedColor, setSelectedColor] = useState(null);
  return (
    <>
      {showModal && <WelcomeModal onClose={() => setShowModal(false)} />}
      <Header />
      <main>
        <div className={style.main__wrap}>
          <Catalog onAdd={handleAdd} />
          <Canvas color={selectedColor} canvasRef={canvasRef} />
        </div>
      </main>
    </>
  );
};
