import { useState } from "react";
import s from "./Palette.module.scss";
import palette from "../../img/icons/colors.svg";

const colors = [
  "#E63946", "#E67E22", "#F1C40F", "#2ECC71", "#3498DB", "#2980B9", "#9B5ED1",
  "#F4A6AB", "#F3C7A1", "#FAE7A0", "#A8EBC2", "#A9D4F4", "#9EC4E2", "#D8C2F0",
  "#2C2C2C", "#707070", "#FAF4EF", "#F5ECE2",
  "#7B5E3B", "#4B3621", "#C8A165", "#3B2F2F", "#875E42", "#BFA6A0",
  "#A9A9A9", "#8E8E8E", "#4A4A4A", "#D6D6D6", "#B2A89F", "#5F6A6A",
];

export const Palette = ({ selectedColor, setSelectedColor }) => {
  const [showPalette, setShowPalette] = useState(false);

  return (
    <div className={s.palette__wrap}>
      <button
        onClick={() => setShowPalette(!showPalette)}
        className={s.palette__btn}
      >
        <img src={palette} alt="palette" />
      </button>

      {showPalette && (
        <div className={s.palette__subwrap}>
          {colors.map((color) => (
            <button className={s.palette__btns}
              key={color}
              onClick={() => {
                setSelectedColor(color);
                // setShowPalette(false);
              }}
              style={{
                backgroundColor: color,
                border: selectedColor === color ? `2px solid ${color}` : "2px solid white"

              }}
              title={color}
            />
          ))}
        </div>
      )}
    </div>
  );
};
