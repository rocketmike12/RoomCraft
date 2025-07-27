import { useState, useEffect, use } from "react";
import s from "./WelcomeModal.module.scss";
import mishaFirst from "../../img/team/misha_first.jpg";
import mishaSecond from "../../img/team/misha_second.jpg";
import yul from "../../img/team/yul.jpg";

const modalSteps = [
  {
    title: "Ласкаво просимо до RoomCraft!",
    text: "Натисни будь-де",
  },
  {
    title:
      "Тут ти можеш створити кімнату своєї мрії — обирай меблі, розставляй як хочеш, фантазуй!",
    text: "Памʼятай, усе в твоїх руках",
  },
  {
    title:
      "RoomCraft створили молоді дизайнери та розробники, щоб зробити інтер'єрне планування веселим і доступним.",
    text: "Познайомишсь з ними ближче?",
    img: [mishaFirst, mishaSecond, yul],
  },
  {
    title: "Що ж, не будемо тебе затримувати, гарної подорожі у кімнату мрії!",
    text: "🚀 Готовий? Натисни, щоб розпочати подорож!",
  },
];

export const WelcomeModal = ({ onClose }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const visited = localStorage.getItem("visitedRoomCraft");
    if (!visited) {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleBackdropClick = () => {
    if (step < modalSteps.length - 1) {
      setStep((a) => a + 1);
    } else {
      localStorage.setItem("visitedRoomCraft", true);
      document.body.style.overflow = "auto";
      onClose();
    }
  };

  const { title, text, img } = modalSteps[step];

  return (
    <div className={s.modal__backdrop} onClick={handleBackdropClick}>
      <div className={s.modal__wrap} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.modal__title}>{title}</h2>
        <p className={s.modal__text}>{text}</p>

        {img && img.length > 0 && (
          <div className={s.modal__wrapper}>
            {img.map((src) => {
              return <img src={src} alt={src} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
