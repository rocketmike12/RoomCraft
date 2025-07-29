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
    text: "Познайомишся з ними ближче?",
    description: "При натисканні на фото відкриється профіль GitHub",
    develops: [
      {
        nickname: "Miha77777ua",
        src: mishaFirst,
        gitHub: "https://github.com/Miha77777ua",
      },
      {
        nickname: "rocketmike12",
        src: mishaSecond,
        gitHub: "https://github.com/rocketmike12",
      },
      {
        nickname: "Yul1aPedchenko",
        src: yul,
        gitHub: "https://github.com/Yul1aPedchenko",
      },
    ],
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

  const { title, text, description, develops } = modalSteps[step];

  return (
    <div className={s.modal__backdrop} onClick={handleBackdropClick}>
      <div className={s.modal__wrap} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.modal__title}>{title}</h2>
        <p className={s.modal__text}>{text}</p>

        {develops && develops.length > 0 && (
          <div className={s.modal__wrapper}>
            {develops.map((develop, id) => {
              return <a className={s.modal__link} href={develop.gitHub} target="blank_" key={id}>
                <div className={s['modal__wrap--develop']}>
                  <img className={s.modal__img} src={develop.src} alt={develop.nickname} />
                  <p className={s.modal__nickname}>{develop.nickname}</p>
                </div>
              </a>;
            })}
          </div>
        )}
        {description && (
          <p className={s.modal__description}>{description}</p>
        )}
      </div>
    </div>
  );
};

