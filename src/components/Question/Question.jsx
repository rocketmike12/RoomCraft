import { useState } from "react";
import s from "./Question.module.scss";

export const Question = () => {
	const [isVisible, setIsVisible] = useState(false);
	const toggleDiv = () => {
		setIsVisible((prev) => !prev);
	};

	return (
		<>
			<div className={s.que__wrap}>
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
								<span className={s.que__top}>›</span> - вгору
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
							<li className={s.que__item}>
								<span>доторк</span> - перетягнути
							</li>
							<li className={s.que__item}>
								<span>мишка</span> - перетягнути
							</li>
						</ul>
					</div>
				)}
			</div>
		</>
	);
};
