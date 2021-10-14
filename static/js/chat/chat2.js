const yandexChat = () => {
  const btnLink = document.querySelector('a[href*=popup-support].popup-link');
  const popupSupport = document.getElementById('popup-support');
  const popupSupportContent = popupSupport?.getElementsByClassName('popup__content')[0];

  console.log(btnLink);
  console.log(popupSupport);
  console.log(popupSupportContent);

  if (!btnLink || !popupSupport || !popupSupportContent) return;

  btnLink.addEventListener('click', () => {
    const yaWidget = document.getElementsByClassName('ya-chat-widget')[0];

    // Return false if already initialized
    if (popupSupport.querySelector('.ya-chat-widget')) return;

    // Insert yaWidget to popup's content
    popupSupportContent.insertAdjacentElement('beforeend', yaWidget);

    // Open yandex chat
    document.querySelector('.ya-chat-button').click();

    // Close modal on header click
    document.querySelector('.ya-chat-header').addEventListener('click', () => {
      popupSupport.click();
      document.querySelector('body').classList.remove('ya-chat-disable-page-scroll');
    });
  });
};
yandexChat();
