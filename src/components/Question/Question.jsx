import { useState, useEffect, useRef } from "react";
import s from "./Question.module.scss";

export const Question = () => {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef(null);

  const toggleDiv = () => {
    setIsVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div className={s.que__wrap} ref={popupRef}>
      <button className={s.que__btn} onClick={toggleDiv}>
        ?
      </button>
      {isVisible && (
        <div className={s.que__popup}>
          <h2 className={s.que__title}>Підказка</h2>
          <p className={s.que__description}>
            <span>Важливо!</span> Розвернути та видалити обʼєкт можна лише англійською розкладкою
          </p>
          <ul className={s.que__list}>
            <li className={s.que__item}>
              <span className={s.que__top}>›</span> - вверх
            </li>
            <li className={s.que__item}>
              <span className={s.que__bottom}>›</span> - вниз
            </li>
            <li className={s.que__item}>
              <span>‹</span> - вліво
            </li>
            <li className={s.que__item}>
              <span>›</span> - вправо
            </li>
            <li className={s.que__item}>
              <span>Z</span> - розвернути
            </li>
            <li className={s.que__item}>
              <span>X</span> - видалити
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
