import { useState } from "react";
import Search from "../../img/search.svg";
import style from "./Catalog.module.scss";

import data from "../../data/images.js";

export const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState("Всі");

  return (
    <div className={style.catalog}>
      <h2 className={style.catalog__title}>Каталог</h2>
      <ul className={style.catalog__categories}>
        <li
          className={`${style.categories__category}${activeCategory === "Всі" ? ` ${style.active}` : ""}`}
        >
          <button className={style.categories__btn} onClick={() => setActiveCategory("Всі")}>Всі</button>
        </li>
        <li
          className={`${style.categories__category}${activeCategory === "Стільці" ? ` ${style.active}` : ""}`}
        >
          <button className={style.categories__btn} onClick={() => setActiveCategory("Стільці")}>Стільці</button>
        </li>
        <li
          className={`${style.categories__category}${activeCategory === "Столи" ? ` ${style.active}` : ""}`}
        >
          <button className={style.categories__btn} onClick={() => setActiveCategory("Столи")}>Столи</button>
        </li>
        <li
          className={`${style.categories__category}${activeCategory === "Шафи" ? ` ${style.active}` : ""}`}
        >
          <button className={style.categories__btn} onClick={() => setActiveCategory("Шафи")}>Шафи</button>
        </li>
        <li
          className={`${style.categories__category}${activeCategory === "Тумбочки" ? ` ${style.active}` : ""}`}
        >
          <button className={style.categories__btn} onClick={() => setActiveCategory("Тумбочки")}>Тумбочки</button>
        </li>
        <li
          className={`${style.categories__category}${activeCategory === "Дивани" ? ` ${style.active}` : ""}`}
        >
          <button className={style.categories__btn} onClick={() => setActiveCategory("Дивани")}>Дивани</button>
        </li>
        <li
          className={`${style.categories__category}${activeCategory === "Ослінчики" ? ` ${style.active}` : ""}`}
        >
          <button className={style.categories__btn} onClick={() => setActiveCategory("Ослінчики")}>Ослінчики</button>
        </li>
      </ul>
      <ul className={style.catalog__furniture}>
        {data.filter(el => activeCategory === "Всі" ? true : el.category === activeCategory).map((el, id) => (
          <li className={style.furniture__item} key={id} >
            <img src={el.scaled} alt={el.name} className={style.furniture__img} />
          </li>
        ))}
      </ul>
    </div>
  )
}

