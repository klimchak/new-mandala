export const ALL_WORDS = {
  TOOLTIP: {
    TOOLTIP_DOUBLE: {
      enable: {
        enable_abbreviation: 'Слово будет удвоено и сокращено',
        disable_abbreviation: 'Слово будет удвоено без сокращения',
      },
      disable: 'Слово не будет удвоено и сокращено',
    },
    TOOLTIP_LANDSCAPE: {
      enable: 'Альбомная ориентация бумаги',
      disable: 'Портретная ориентация бумаги',
    },
    TOOLTIP_ABBREVIATION: {
      ENABLED_FORM: {
        enable: 'Слово будет сокращено',
        disable: 'Слово не будет сокращено',
      },
      DISABLED_FORM: 'Для сокращения слова необходимо включить удвоение',
    },
    TOOLTIP_HEADER_MENU: {
      create: 'Установить параметры и создать мандалу',
      edit: 'Изменить параметры и пересоздать мандалу',
      export: 'Открыть окно для экспорта мандалы в PDF или PNG',
      saveDB: 'Открыть окно для сохранения в базу данных',
      quit: 'Выход из программы',
    },
    TOOLTIP_SWITCHER_ZOOM: {
      enable: 'Включено зуммирование колесом мыши, перемещение изображения и кнопки зуммирования',
      disable: 'Зум отключен, мандала в стандартном размере'
    },
    TOOLTIP_SWITCHER_HELP_TEXT: {
      enable: 'Включено окошко с дополнительной информацией по мандале',
      disable: 'Отключено окошко с дополнительной информацией по мандале'
    },
    TOOLTIP_SWITCHER_SCHEMA: {
      enable: 'Цвета существующей мандалы будут сброшены',
      disable: 'Цвета существующей мандалы будут сохранены'
    },
  },
  BUTTON: {
    DIALOGS: {
      confirm_dialog: {
        confirm: 'Подтверждаю',
        cancel: 'Отмена',
        yes: 'Да',
        no: 'Нет',
        noRemandLater: 'На напоминать больше',
        removeLatestVersion: 'Удалить предыдущую версию?',
      }
    },
    HEADER: {
      start_params: {
        enable: 'Изменить',
        disable: 'Создать'
      },
      switch_zoom: {
        enable: 'Зум',
        disable: 'Зум'
      },
      switch_shadow_help_text: {
        enable: 'Доп. инфо',
        disable: 'Доп. инфо'
      },
      switch_schema: {
        enable: 'Не сохранять цвет',
        disable: 'Сохранить цвет'
      },
      menu: {
        button_text: 'Меню',
        menu_model: {
          create: 'Создать',
          edit: 'Редактировать',
          export: 'Экспорт',
          saveDB: 'Сохранить в базу',
          quit: 'Выход',
        }
      }
    }
  },
  COMPONENTS: {
    appComponent: {
      confirm_dialog_text: 'Найден файл базы данных предыдущей версии. Импортировать данные из предыдущей базы?',
    }
  },
  otherStrings: {
    on: 'Включено',
    off: 'Выключено',
    success: 'Успех',
    info: 'Уведомление',
    warning: 'Внимание',
    error: 'Ошибка',
    messages: {
      paramsForGenerateError: 'Проверьте правильность заполнения полей',
      startMandalaGeneration: 'Начинаю генерацию мандалы',
      startRestoreMandala: 'Открываю мандалу',
      startRestoreLastMandala: 'Открываю последнюю сохраненную мандалу',
      startMandalaSaveDb: 'Начинаю сохранение мандалы в базу',
      saveDbSuccessful: 'Успешное сохранение мандалы в базу',
      saveDbByLastVersionSuccessful: 'Мандала перезаписана',
      settingSaveSuccessful: 'Настройки программы успешно сохранены',
      settingSaveError: 'Ошибка при сохранении настроек программы',
      cleanLogsSuccessful: 'Логи успешно очищены',
      saveImageFileSuccessful: 'Файл .PNG успешно экспортирован',
      savePdfFileSuccessful: 'Файл .PDF успешно экспортирован',
      saveImageFileError: 'Экспорт в PNG ранее созданной мандалы пока не доступен. Воспользуйтесь экспортом в PDF.',
      resetColorSuccessful: 'Цвета успешно сброшены',
      infoAboutClearColor: 'Полигоны будут очищены от раскраски. Рекомендуется сохранить, перед экспортом схемы.'
    }
  },
  settings: {
    openRecent: 'Открывать последнюю мандалу',
    fastSaveEditor: 'Включить быстрое сохранение в базу',
    darkMode: 'Темный режим приложения',
    notRemain: 'Не напоминать о: ',
    notRemainForEdit: '- редактировании мандалы',
    notRemainForDelete: '- удалении мандалы',
    notRemainForUpdate: '- перезаписи мандалы',

    sessionStart: 'Приложение запущено: ',
    sessionStop: 'Приложение закрыто: ',
    type: 'Вариант сообщения: ',
    summary: 'Заголовок: ',
    detail: 'Детали: ',

    appSetting: 'Настройки приложения',
    appSaveSetting: 'Сохранить настройки',
    appLogs: 'Логи приложения',
    appLogsRemove: 'Удалить логи',
    appLogsUpdate: 'Обновить логи',
    appFolder: 'Пака программы',
    appSureClearLogs: 'Уверены, что хотите очистить файл логов?',
    appSureReloadLogs: 'Обновить данные логов?',
    appSureSaveSetting: 'Уверены, что хотите сохранить настройки?',
    appLogFileIsEmpty: 'Файл логов пустой'
  }
};

export const EDITOR_MODULES = {
  toolbar: [
    'bold', 'italic', 'underline', 'strike',
    {separator: ''}, {align: ''}, {align: 'center'}, {align: 'right'},
    {align: 'justify'}
  ],
};
