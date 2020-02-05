firebase.initializeApp({
    messagingSenderId: '1009541058929'
});

var timeToShowSubscribe = 1000;

if (
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'localStorage' in window &&
    'fetch' in window &&
    'postMessage' in window
) {

    var messaging = firebase.messaging();

    // если уже есть разрешение на показ
    if (Notification.permission === 'granted') {
        getToken();
    }

    // on ready показываем запрос на подписку через 10 секунд после загрузки документа
    $(document).ready(function () {
        setTimeout(function () {
            getToken()
        }, timeToShowSubscribe);

    });

    // обработчик прихода уведомлений с сервера
    messaging.onMessage(function (payload) {
        console.log('Message received', payload);

        // регистрируем фейк сервис воркера для показа на мобилках
        navigator.serviceWorker.register('firebase-messaging-sw.js');
        Notification.requestPermission(function (permission) {
            if (permission === 'granted') {
                navigator.serviceWorker.ready.then(function (registration) {
                    // Копируем объект данных для получения обработчика клика на уведомление
                    payload.data.data = JSON.parse(JSON.stringify(payload.data));

                    registration.showNotification(payload.data.title, payload.data);
                }).catch(function (error) {
                    // если регистрация сервис воркера не удалась
                    showError('ServiceWorker registration failed', error);
                });
            }
        });
    });

    // Колбэк при обновлении токена
    messaging.onTokenRefresh(function () {
        messaging.getToken()
            .then(function (refreshedToken) {
                console.log('Token refreshed');
                // Отправить токен на сервер
                sendTokenToServer(refreshedToken);
            })
            .catch(function (error) {
                showError('Unable to retrieve refreshed token', error);
            });
    });

} else {
    if (!('Notification' in window)) {
        showError('Notification not supported');
    } else if (!('serviceWorker' in navigator)) {
        showError('ServiceWorker not supported');
    } else if (!('localStorage' in window)) {
        showError('LocalStorage not supported');
    } else if (!('fetch' in window)) {
        showError('fetch not supported');
    } else if (!('postMessage' in window)) {
        showError('postMessage not supported');
    }

    console.warn('This browser does not support desktop notification.');
    console.log('Is HTTPS', window.location.protocol === 'https:');
    console.log('Support Notification', 'Notification' in window);
    console.log('Support ServiceWorker', 'serviceWorker' in navigator);
    console.log('Support LocalStorage', 'localStorage' in window);
    console.log('Support fetch', 'fetch' in window);
    console.log('Support postMessage', 'postMessage' in window);

}

// функция получения токена
function getToken() {
    messaging.requestPermission()
        .then(function () {
            // Получить идентификатор экземпляра токена. Первоначально происходит с сервера firebase
            // а в последствии из кеша
            messaging.getToken()
                .then(function (currentToken) {

                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    } else {
                        showError('No Instance ID token available. Request permission to generate one');
                        setTokenSentToServer(false);
                    }
                })
                .catch(function (error) {
                    showError('An error occurred while retrieving token', error);
                    setTokenSentToServer(false);
                });
        })
        .catch(function (error) {
            showError('Unable to get permission to notify', error);
        });
}

// Отправка идентификатора токена на сервер приложений, чтобы он мог:
// - отправить сообщение обратно в это приложение
// - подписаться/отписаться из темы
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        console.log('Sending token to server...');
        // send current token to server
        var url = '/ajax_files/lk-api/api.open.php?action=setFirebaseToken';
        $.post(url, {user_token: currentToken});
        setTokenSentToServer(currentToken);
    } else {
        console.log('Token already sent to server so won\'t send it again unless it changes');
    }
}

function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') === currentToken;
}

function setTokenSentToServer(currentToken) {
    if (currentToken) {
        window.localStorage.setItem('sentFirebaseMessagingToken', currentToken);
    } else {
        window.localStorage.removeItem('sentFirebaseMessagingToken');
    }
}

function showError(error, error_data) {
    if (typeof error_data !== "undefined") {
        console.error(error, error_data);
    } else {
        console.error(error);
    }
}
