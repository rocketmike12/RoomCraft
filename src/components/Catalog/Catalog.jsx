import { useState, useRef, useEffect } from "react";
import { addObject } from "../Canvas/Canvas.jsx";
import style from "./Catalog.module.scss";

import data from "../../data/images.js";

export const Catalog = ({ onAdd }) => {
	const [activeCategory, setActiveCategory] = useState("Всі");

	const catalogRef = useRef(null);

	const handleClick = function (e) {
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
				<li className={`${style.categories__category}${activeCategory === "Всі" ? ` ${style.active}` : ""}`}>
					<button className={style.categories__btn} onClick={() => setActiveCategory("Всі")}>
						Всі
					</button>
				</li>
				<li className={`${style.categories__category}${activeCategory === "Стільці" ? ` ${style.active}` : ""}`}>
					<button className={style.categories__btn} onClick={() => setActiveCategory("Стільці")}>
						Стільці
					</button>
				</li>
				<li className={`${style.categories__category}${activeCategory === "Столи" ? ` ${style.active}` : ""}`}>
					<button className={style.categories__btn} onClick={() => setActiveCategory("Столи")}>
						Столи
					</button>
				</li>
				<li className={`${style.categories__category}${activeCategory === "Шафи" ? ` ${style.active}` : ""}`}>
					<button className={style.categories__btn} onClick={() => setActiveCategory("Шафи")}>
						Шафи
					</button>
				</li>
				<li className={`${style.categories__category}${activeCategory === "Тумбочки" ? ` ${style.active}` : ""}`}>
					<button className={style.categories__btn} onClick={() => setActiveCategory("Тумбочки")}>
						Тумбочки
					</button>
				</li>
				<li className={`${style.categories__category}${activeCategory === "Дивани" ? ` ${style.active}` : ""}`}>
					<button className={style.categories__btn} onClick={() => setActiveCategory("Дивани")}>
						Дивани
					</button>
				</li>
				<li className={`${style.categories__category}${activeCategory === "Ослінчики" ? ` ${style.active}` : ""}`}>
					<button className={style.categories__btn} onClick={() => setActiveCategory("Ослінчики")}>
						Ослінчики
					</button>
				</li>
			</ul>
			<ul className={style.catalog__furniture}>
				{data
					.filter((el) => (activeCategory === "Всі" ? true : el.category === activeCategory))
					.map((el, id) => (
						<li className={style.furniture__item} data-id={id} key={id}>
							<img src={el.scaled} alt={el.name} className={style.furniture__img} />
						</li>
					))}
			</ul>
		</div>
	);
};
