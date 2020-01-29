$(function() {
    $('#send').on('click', function () {
        var url = 'https://fcm.googleapis.com/fcm/send';
        $.ajax({
            type: 'POST',
            url: url,
            headers: {
                Authentication: 'AAAA6w1WEXE:APA91bEi_7jXUxn4h3ou-kXUaMWcnpRDmmx7nuL1_pOrjzL4BzuUWzjfV6Liv0ufJLTMfyDd2RJ1_NBRH0Dp74GO0Ud1n08aebHoYAWqpZ9wptvkuQISQxcYaokrS8C7Vpr2EnittJL4'
            },
            contentType: 'application/json',
            data: {
                "notification": {
                    "title": "Ералаш",
                    "body": "Начало в 21:00",
                    "icon": "https://eralash.ru.rsz.io/sites/all/themes/eralash_v5/logo.png?width=40&height=40",
                    "click_action": "http://eralash.ru/"
                },
                "to": $('#to').val()
            }
        })
    })
});