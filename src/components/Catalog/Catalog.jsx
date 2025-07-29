import { useState, useRef, useEffect } from "react";
import style from "./Catalog.module.scss";

import data from "../../data/images.js";
import categories from "../../data/categories.js";

export const Catalog = ({ onAdd }) => {
  const [activeCategory, setActiveCategory] = useState("Всі");

  const catalogRef = useRef(null);

  const handleClick = function(e) {
    const id = e.target.parentElement?.dataset?.id;
    if (id == null) return;

    onAdd(Number(id));
  };

  useEffect(() => {
    const catalog = catalogRef.current;
    if (!catalog) return;

    catalog.addEventListener("click", handleClick);
  }, []);

  return (
    <div className={style.catalog} ref={catalogRef}>
      <h2 className={style.catalog__title}>Каталог</h2>
      <ul className={style.catalog__categories}>
        {categories.map((el, id) => (
          <li
            className={`${style.categories__category}${activeCategory === el ? ` ${style.active}` : ""}`}
            key={id}
          >
            <button className={style.categories__btn} onClick={() => setActiveCategory(el)}>
              {el}
            </button>
          </li>
        ))}
      </ul>
      <ul className={style.catalog__furniture}>
        {data
          .map((el, id) => ({ id: id, ...el }))
          .filter((el) => (activeCategory === "Всі" ? true : el.category === activeCategory))
          .map((el, id) => (
            <li className={style.furniture__item} data-id={el.id} key={id}>
              <img src={el.scaled} alt={el.name} className={style.furniture__img} />
            </li>
          ))}
      </ul>
    </div>
  );
};
