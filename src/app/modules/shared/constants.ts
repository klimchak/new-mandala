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
  }
}

export const EDITOR_MODULES = {
  toolbar: [
    'bold', 'italic', 'underline', 'strike',
    {separator: ''}, {align: ''}, {align: 'center'}, {align: 'right'},
    {align: 'justify'}
  ],
};
