$(function() {
    $('#send').on('click', function () {
        var url = 'fcm.googleapis.com';
        $.ajax({
            type: 'POST',
            url: url,
            Authorization: key='AAAA6w1WEXE:APA91bEi_7jXUxn4h3ou-kXUaMWcnpRDmmx7nuL1_pOrjzL4BzuUWzjfV6Liv0ufJLTMfyDd2RJ1_NBRH0Dp74GO0Ud1n08aebHoYAWqpZ9wptvkuQISQxcYaokrS8C7Vpr2EnittJL4',
            data: {
                "notification": {
                    "title": "Ералаш",
                    "body": "Начало в 21:00",
                    "icon": "https://eralash.ru.rsz.io/sites/all/themes/eralash_v5/logo.png?width=40&height=40",
                    "click_action": "http://eralash.ru/"
                },
                "to": "dFIpkrMbJdk:APA91bF9R-UviaR7sJ5EBwHdwV0JZ_0bBL2dlAp6mIfb6fzXpjsYu68roAIq_5MbOpEFv_BNjGql3AqrUKu18qYst0emQuWbDlgBA82J8G3WJIhARsGUZzZTywaElpmTOA_yhAR_q2-n"
            }
        })
    })
});