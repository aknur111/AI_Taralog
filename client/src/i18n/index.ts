import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        history: 'History',
        profile: 'Profile',
        prompts: 'Prompts',
        login: 'Sign In',
        logout: 'Sign Out'
      },
      home: {
        title: 'Discover Your Destiny',
        subtitle: 'Ancient wisdom of Tarot will reveal the secrets of your future. Let the cards guide you on the path of truth.',
        startJourney: 'Begin Your Journey',
        startReading: 'Start Reading'
      },
      services: {
        tarot: {
          title: 'Tarot Spread',
          desc: 'Classic 5-card spread reveals past, present, and future. Let the cards speak.',
          btn: 'Get Reading'
        },
        love: {
          title: 'Love Question',
          desc: 'Find answers to matters of the heart. Love, relationships, compatibility.',
          btn: 'Ask Question'
        },
        money: {
          title: 'Money Question',
          desc: 'Finances and material well-being. Discover what awaits in your financial affairs.',
          btn: 'Ask Question'
        },
        work: {
          title: 'Career Question',
          desc: 'Work, career, calling. Unlock your potential and find the right path.',
          btn: 'Ask Question'
        },
        general: {
          title: 'General Question',
          desc: 'Any question that troubles your soul. Ask — and the cosmos will answer.',
          btn: 'Ask Question'
        }
      },
      auth: {
        welcome: 'Welcome Back',
        welcomeSub: 'Sign in to discover the secrets of fate',
        createAccount: 'Join Us',
        createSub: 'Create an account to unlock the gates of knowledge',
        email: 'Email',
        password: 'Password',
        username: 'Username',
        signIn: 'Sign In',
        signUp: 'Create Account',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        register: 'Register',
        login: 'Sign In',
        optionalData: 'Personal data for readings (optional)',
        optionalHint: 'This data will help the tarot reader give more accurate answers. You can skip if you don\'t know.',
        birthPlacePlaceholder: 'City, Country',
        birthDataTitle: 'Birth Data for Destiny Matrix',
        birthDataHint: 'This data is required to build your personal destiny matrix and provide accurate readings.',
        optional: 'optional'
      },
      tarot: {
        title: 'Five Card Spread',
        subtitle: 'Click on the cards to reveal them',
        getInterpretation: 'Get Interpretation',
        interpretation: 'Card Interpretation',
        loading: [
          'The spirits are reading the cards...',
          'The arcana reveal their secrets...',
          'Ancient wisdom awakens...',
          'The symbols align...',
          'Destiny unfolds...'
        ],
        positions: {
          you: 'You',
          past: 'Past',
          present: 'Present',
          future: 'Future',
          advice: 'Advice'
        },
        reversed: 'Reversed'
      },
      question: {
        love: 'Love Question',
        money: 'Financial Question',
        work: 'Career Question',
        general: 'General Question',
        placeholder: 'Describe what concerns you...',
        submit: 'Get Answer',
        newQuestion: 'New Question',
        loading: [
          'The spirits are seeking an answer...',
          'Reading the stars...',
          'The cards are whispering...',
          'Connecting with the cosmos...',
          'The veil is lifting...',
          'Deciphering ancient signs...'
        ],
        answer: 'Answer',
        partner: {
          title: 'Partner data (for questions about current relationships)',
          firstName: 'First Name',
          lastName: 'Last Name',
          birthDate: 'Birth Date',
          birthPlace: 'Birth Place',
          birthTime: 'Birth Time'
        }
      },
      history: {
        title: 'Your Reading History',
        newReading: 'New Reading',
        empty: 'Nothing here yet',
        emptySub: 'Start your first reading',
        types: {
          taro: 'Tarot Spread',
          love: 'Love',
          money: 'Finance',
          work: 'Career',
          general: 'General'
        }
      },
      profile: {
        title: 'Profile',
        personalData: 'Personal Data for Readings',
        personalSub: 'This data helps the tarot reader give more accurate answers',
        firstName: 'First Name',
        lastName: 'Last Name',
        birthDate: 'Birth Date',
        birthPlace: 'Birth Place',
        birthTime: 'Birth Time',
        save: 'Save',
        saved: 'Data saved successfully'
      },
      admin: {
        title: 'Prompt Management',
        create: 'Create Prompt',
        edit: 'Edit',
        delete: 'Delete',
        name: 'Name (key)',
        nameHint: 'Use: taro, love, money, work, general',
        content: 'System Prompt',
        save: 'Save',
        cancel: 'Cancel',
        confirmDelete: 'Delete this prompt?',
        confirmDeleteSub: 'This action cannot be undone. Readings of this type will stop working.',
        empty: 'No prompts created',
        emptySub: 'Create system prompts for different reading types'
      },
      common: {
        back: 'Back',
        close: 'Close',
        error: 'An error occurred'
      }
    }
  },
  ru: {
    translation: {
      nav: {
        home: 'Главная',
        history: 'История',
        profile: 'Профиль',
        prompts: 'Промпты',
        login: 'Войти',
        logout: 'Выйти'
      },
      home: {
        title: 'Откройте тайны судьбы',
        subtitle: 'Древняя мудрость Таро раскроет перед вами завесу будущего. Позвольте картам направить вас на путь истинный.',
        startJourney: 'Начать путешествие',
        startReading: 'Начать гадание'
      },
      services: {
        tarot: {
          title: 'Расклад Таро',
          desc: 'Классический расклад на 5 карт раскроет прошлое, настоящее и будущее.',
          btn: 'Сделать расклад'
        },
        love: {
          title: 'Вопрос о любви',
          desc: 'Узнайте ответы на вопросы сердца. Любовь, отношения, совместимость.',
          btn: 'Задать вопрос'
        },
        money: {
          title: 'Финансовый вопрос',
          desc: 'Деньги и материальное благополучие. Узнайте, что ждёт вас в финансах.',
          btn: 'Задать вопрос'
        },
        work: {
          title: 'Вопрос о карьере',
          desc: 'Работа, карьера, призвание. Раскройте свой потенциал.',
          btn: 'Задать вопрос'
        },
        general: {
          title: 'Общий вопрос',
          desc: 'Любой вопрос, который тревожит вашу душу. Спросите — космос ответит.',
          btn: 'Задать вопрос'
        }
      },
      auth: {
        welcome: 'Добро пожаловать',
        welcomeSub: 'Войдите, чтобы узнать тайны судьбы',
        createAccount: 'Присоединяйтесь',
        createSub: 'Создайте аккаунт и откройте врата к знаниям',
        email: 'Email',
        password: 'Пароль',
        username: 'Имя пользователя',
        signIn: 'Войти',
        signUp: 'Создать аккаунт',
        noAccount: 'Нет аккаунта?',
        hasAccount: 'Уже есть аккаунт?',
        register: 'Регистрация',
        login: 'Войти',
        optionalData: 'Личные данные для гаданий (необязательно)',
        optionalHint: 'Эти данные помогут тарологу дать более точные ответы. Можете пропустить, если не знаете.',
        birthPlacePlaceholder: 'Город, Страна',
        birthDataTitle: 'Данные для матрицы судьбы',
        birthDataHint: 'Эти данные необходимы для построения вашей персональной матрицы судьбы и точных гаданий.',
        optional: 'необязательно'
      },
      tarot: {
        title: 'Расклад Пяти Карт',
        subtitle: 'Нажмите на карты, чтобы раскрыть их',
        getInterpretation: 'Получить толкование',
        interpretation: 'Толкование карт',
        loading: [
          'Духи читают карты...',
          'Арканы раскрывают тайны...',
          'Древняя мудрость пробуждается...',
          'Символы выстраиваются...',
          'Судьба разворачивается...'
        ],
        positions: {
          you: 'Вы',
          past: 'Прошлое',
          present: 'Настоящее',
          future: 'Будущее',
          advice: 'Совет'
        },
        reversed: 'Перевёрнута'
      },
      question: {
        love: 'Вопрос о любви',
        money: 'Финансовый вопрос',
        work: 'Вопрос о карьере',
        general: 'Общий вопрос',
        placeholder: 'Опишите, что вас беспокоит...',
        submit: 'Получить ответ',
        newQuestion: 'Новый вопрос',
        loading: [
          'Духи ищут ответ...',
          'Смотрим на звёзды...',
          'Карты шепчут...',
          'Связываемся с космосом...',
          'Завеса приоткрывается...',
          'Расшифровываем знаки...'
        ],
        answer: 'Ответ',
        partner: {
          title: 'Данные партнёра (при вопросе о текущих отношениях)',
          firstName: 'Имя',
          lastName: 'Фамилия',
          birthDate: 'Дата рождения',
          birthPlace: 'Место рождения',
          birthTime: 'Время рождения'
        }
      },
      history: {
        title: 'История ваших гаданий',
        newReading: 'Новое гадание',
        empty: 'Пока здесь пусто',
        emptySub: 'Начните своё первое гадание',
        types: {
          taro: 'Расклад Таро',
          love: 'Любовь',
          money: 'Финансы',
          work: 'Карьера',
          general: 'Общий'
        }
      },
      profile: {
        title: 'Профиль',
        personalData: 'Личные данные для гаданий',
        personalSub: 'Эти данные помогут тарологу дать более точный ответ',
        firstName: 'Имя',
        lastName: 'Фамилия',
        birthDate: 'Дата рождения',
        birthPlace: 'Место рождения',
        birthTime: 'Время рождения',
        save: 'Сохранить',
        saved: 'Данные успешно сохранены'
      },
      admin: {
        title: 'Управление промптами',
        create: 'Создать промпт',
        edit: 'Изменить',
        delete: 'Удалить',
        name: 'Название (ключ)',
        nameHint: 'Используйте: taro, love, money, work, general',
        content: 'Системный промпт',
        save: 'Сохранить',
        cancel: 'Отмена',
        confirmDelete: 'Удалить этот промпт?',
        confirmDeleteSub: 'Это действие нельзя отменить. Гадания этого типа перестанут работать.',
        empty: 'Промпты не созданы',
        emptySub: 'Создайте системные промпты для разных типов гаданий'
      },
      common: {
        back: 'Назад',
        close: 'Закрыть',
        error: 'Произошла ошибка'
      }
    }
  }
};

const getDefaultLanguage = () => {
  const saved = localStorage.getItem('language');
  if (saved) return saved;
  
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'ru' ? 'ru' : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDefaultLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;