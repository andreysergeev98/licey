document.querySelector('a[href*=popup-support].popup-link').addEventListener('click', function (e) {
  // Some vars
  let containerName = 'popup-support__content'
  let popupSupport = document.querySelector('#popup-support');
  let yaWidget = document.querySelectorAll('.ya-chat-widget')[0];

  // Return false if already initialized
  if (!!popupSupport.querySelector('.ya-chat-widget')) return;

  // Remove whole content
  popupSupport.querySelector('.popup-support__content').remove();

  // Create & fill element
  let div = document.createElement('div');
  div.className = containerName;
  div.insertAdjacentElement('beforeend', yaWidget);
  popupSupport.querySelector('.popup__content').insertAdjacentElement('beforeend', div);

  // Open yandex chat
  document.querySelector('.ya-chat-button').click();

  // Close modal on header click
  document.querySelector('.ya-chat-header').addEventListener('click', function (e) {
    popupSupport.click();
    document.querySelector('body').classList.remove('ya-chat-disable-page-scroll');
  })
})