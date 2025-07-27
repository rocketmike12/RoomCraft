import { useState } from "react";
import Search from "../../img/search.svg";
import style from "./Catalog.module.scss";

export const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className={style.catalog}>
      <form className={style.catalog__search}>
        <input type="text" id="search" className={style.search__input} placeholder="Пошук" />
        <label htmlFor="search">
          <img className={style.search__icon} src={Search} alt="Пошук" />
        </label>
      </form>
      <ul className={style.catalog__categories}>
        <li
          className={`${style.categories__category}${activeCategory === 0 ? ` ${style.active}` : ""}`}
        >
          <button className={style.categories__btn} onClick={() => setActiveCategory(0)}>Фурнітура</button>
        </li>
        <li
          className={`${style.categories__category}${activeCategory === 1 ? ` ${style.active}` : ""}`}
        >
          <button className={style.categories__btn} onClick={() => setActiveCategory(1)}>Декор</button>
        </li>
        <li
          className={`${style.categories__category}${activeCategory === 2 ? ` ${style.active}` : ""}`}
        >
          <button className={style.categories__btn} onClick={() => setActiveCategory(2)}>Техніка</button>
        </li>
      </ul>
      <ul className={style.catalog__furniture}>
        {/* Лішки */}
      </ul>
    </div>
  )
}

