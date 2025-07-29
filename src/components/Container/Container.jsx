import s from "./Container.module.scss";
export const Container = ({ children }) => {
	return <div className={s.container}>{children}</div>;
};
