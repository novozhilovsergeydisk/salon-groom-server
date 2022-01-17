// Фунции общего применения

const master_link = document.getElementById('master-link');
console.log({ master_link });
master_link.addEventListener('click', function() {
    const body = document.getElementById('body');
    body.classList.remove('lock');
    const menu = document.getElementById('menu');
    menu.classList.remove('active');
    const header_burger = document.getElementById('header-burger');
    header_burger.classList.remove('active');
    console.log({ body });
});


const log = (log) => {
    console.log({ log });
}
const hide = (el) => {
    el.classList.add('hidden');
}
const show = (el) => {
    el.classList.remove('hidden');
}
const setCookie = (name, value) => {
    document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)
    let cookie = document.cookie
    console.log('cookie = ', cookie)
}
const getCookie = (name) => {
    // Возвращает cookie с указанным name или undefined, если ничего не найдено!

    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent(matches[1]) : undefined;
}
const getCookieByName = getCookie;
const deleteCookie = (name) => {
    setCookie(name, '', {
        'max-age': -1
    })
}
const deleteCookieByName = deleteCookie;
const isEmpty = (data) => {
    switch (data) {
        case typeof(data) === "undefined":
        case "":
        case 0:
        case "0":
        case null:
        case false:
        case Array.isArray(data) && data.length === 0:
        case typeof data === 'object' && Object.keys(data).length === 0:
            return true;
        default:
            return false;
    }
}
const Validate = {
    required: () => {

    },
    max: () => {

    },
    min: () => {

    },
    maxLength: (string, length) => {
        return string.length > length;
    },
    minLength: () => {

    },
    cmatch: (pattern) => {

    }
}

// END Фунции общего применения

let btn_complex = document.getElementById('btn-complex');
let complex = document.getElementById('complex');

if (btn_complex !== null) {
    btn_complex.addEventListener('click', function() {
        hideClassTabs();
        btn_complex.classList.add('btn-tab-active');
        show(complex);
    });
}

let btn_hygiene = document.getElementById('btn-hygiene');
let hygiene = document.getElementById('hygiene');

if (btn_hygiene !== null) {
    btn_hygiene.addEventListener('click', function() {
        hideClassTabs();
        btn_hygiene.classList.add('btn-tab-active');
        show(hygiene);
    });
}

let btn_washing_drying = document.getElementById('btn-washing-drying');
let washing_drying = document.getElementById('washing-drying');

if (btn_washing_drying !== null) {
    btn_washing_drying.addEventListener('click', function() {
        hideClassTabs();
        btn_washing_drying.classList.add('btn-tab-active');
        show(washing_drying);
    });
}

let btn_trimming = document.getElementById('btn-trimming');
let trimming = document.getElementById('trimming');

if (btn_trimming !== null) {
    btn_trimming.addEventListener('click', function() {
        hideClassTabs();
        btn_trimming.classList.add('btn-tab-active');
        show(trimming);
    });
}

let btn_express_molt = document.getElementById('btn-express-molt');
let express_molt = document.getElementById('express-molt');

if (btn_express_molt !== null) {
    btn_express_molt.addEventListener('click', function() {
        hideClassTabs();
        btn_express_molt.classList.add('btn-tab-active');
        show(express_molt);
    });
}

let btn_cats = document.getElementById('btn-cats');
let cats = document.getElementById('cats');

if (btn_cats !== null) {
    btn_cats.addEventListener('click', function() {
        hideClassTabs();
        btn_cats.classList.add('btn-tab-active');
        show(cats);
    });
}

let btn_additional_services = document.getElementById('btn-additional-services');
let additional_services = document.getElementById('additional-services');

if (btn_additional_services !== null) {
    btn_additional_services.addEventListener('click', function() {
        hideClassTabs();
        btn_additional_services.classList.add('btn-tab-active');
        show(additional_services);
    });
}

// ************ Показывать и скрывать цены complex
let hideElements = function(els_list) {
    for (let i = 0; i < els_list.length; i++) {
        els_list[i].classList.add('hidden');
    }
}

// ************ Global vars
let _class_ = '';
let remove_class_list
// ************ END Global vars

const head_small_complex = document.getElementById('head-small-complex');
const tbody_small_complex = document.getElementById('tbody-small-complex');
const head_middle_complex = document.getElementById('head-middle-complex');
const tbody_middle_complex = document.getElementById('tbody-middle-complex');
const head_large_complex = document.getElementById('head-large-complex');
const tbody_large_complex = document.getElementById('tbody-large-complex');
const head_mestizo_complex = document.getElementById('head-mestizo-complex');
const tbody_mestizo_complex = document.getElementById('tbody-mestizo-complex');

if (head_small_complex !== null) {
    head_small_complex.addEventListener('click', function() {
        _class_ = tbody_small_complex.getAttribute('class');

        hideElements([tbody_small_complex, tbody_middle_complex, tbody_large_complex, tbody_mestizo_complex]);

        if (_class_ == 'hidden') {
            tbody_small_complex.classList.remove('hidden');
        } else {
            tbody_small_complex.classList.add('hidden');
        }
    });
}

if (head_middle_complex !== null) {
    head_middle_complex.addEventListener('click', function() {
        _class_ = tbody_middle_complex.getAttribute('class');

        hideElements([tbody_small_complex, tbody_middle_complex, tbody_large_complex, tbody_mestizo_complex]);

        if (_class_ == 'hidden') {
            tbody_middle_complex.classList.remove('hidden');
        } else {
            tbody_middle_complex.classList.add('hidden');
        }
    });
}

if (head_large_complex !== null) {
    head_large_complex.addEventListener('click', function() {
        _class_ = tbody_large_complex.getAttribute('class');

        hideElements([tbody_small_complex, tbody_middle_complex, tbody_large_complex, tbody_mestizo_complex]);

        if (_class_ == 'hidden') {
            tbody_large_complex.classList.remove('hidden');
        } else {
            tbody_large_complex.classList.add('hidden');
        }
    });
}

if (head_mestizo_complex !== null) {
    head_mestizo_complex.addEventListener('click', function() {
        // magicActions(tbody_mestizo_complex);

        _class_ = tbody_mestizo_complex.getAttribute('class');

        hideElements([tbody_small_complex, tbody_middle_complex, tbody_large_complex, tbody_mestizo_complex]);

        if (_class_ == 'hidden') {
            tbody_mestizo_complex.classList.remove('hidden');
        } else {
            tbody_mestizo_complex.classList.add('hidden');
        }
    });
}

// Гигиена
let head_small_hygiene = document.getElementById('head-small-hygiene');
let tbody_small_hygiene = document.getElementById('tbody-small-hygiene');
let head_middle_hygiene = document.getElementById('head-middle-hygiene');
let tbody_middle_hygiene = document.getElementById('tbody-middle-hygiene');
let head_large_hygiene = document.getElementById('head-large-hygiene');
let tbody_large_hygiene = document.getElementById('tbody-large-hygiene');
let head_mestizo_hygiene = document.getElementById('head-mestizo-hygiene');
let tbody_mestizo_hygiene = document.getElementById('tbody-mestizo-hygiene');
remove_class_list = [tbody_small_hygiene, tbody_middle_hygiene, tbody_large_hygiene, tbody_mestizo_hygiene];

if (head_small_hygiene !== null) {
    head_small_hygiene.addEventListener('click', function() {
        _class_ = tbody_small_hygiene.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_small_hygiene.classList.remove('hidden');
        } else {
            tbody_small_hygiene.classList.add('hidden');
        }
    });
}

if (head_middle_hygiene !== null) {
    head_middle_hygiene.addEventListener('click', function() {
        _class_ = tbody_middle_hygiene.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_middle_hygiene.classList.remove('hidden');
        } else {
            tbody_middle_hygiene.classList.add('hidden');
        }
    });
}

if (head_large_hygiene !== null) {
    head_large_hygiene.addEventListener('click', function() {
        _class_ = tbody_large_hygiene.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_large_hygiene.classList.remove('hidden');
        } else {
            tbody_large_hygiene.classList.add('hidden');
        }
    });
}

if (head_mestizo_hygiene !== null) {
    head_mestizo_hygiene.addEventListener('click', function() {
        _class_ = tbody_mestizo_hygiene.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_mestizo_hygiene.classList.remove('hidden');
        } else {
            tbody_mestizo_hygiene.classList.add('hidden');
        }
    });
}

// Мытье-сушка
let head_small_washing = document.getElementById('head-small-washing');
let tbody_small_washing = document.getElementById('tbody-small-washing');
let head_middle_washing = document.getElementById('head-middle-washing');
let tbody_middle_washing = document.getElementById('tbody-middle-washing');
let head_large_washing = document.getElementById('head-large-washing');
let tbody_large_washing = document.getElementById('tbody-large-washing');
let head_mestizo_washing = document.getElementById('head-mestizo-washing');
let tbody_mestizo_washing = document.getElementById('tbody-mestizo-washing');
remove_class_list = [tbody_small_washing, tbody_middle_washing, tbody_large_washing, tbody_mestizo_washing];

if (head_small_washing !== null) {
    head_small_washing.addEventListener('click', function() {
        _class_ = tbody_small_washing.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_small_washing.classList.remove('hidden');
        } else {
            tbody_small_washing.classList.add('hidden');
        }
    });
}

if (head_middle_washing !== null) {
    head_middle_washing.addEventListener('click', function() {
        _class_ = tbody_middle_washing.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_middle_washing.classList.remove('hidden');
        } else {
            tbody_middle_washing.classList.add('hidden');
        }
    });
}

if (head_large_washing !== null) {
    head_large_washing.addEventListener('click', function() {
        _class_ = tbody_large_washing.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_large_washing.classList.remove('hidden');
        } else {
            tbody_large_washing.classList.add('hidden');
        }
    });
}

if (head_mestizo_washing !== null) {
    head_mestizo_washing.addEventListener('click', function() {
        _class_ = tbody_mestizo_washing.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_mestizo_washing.classList.remove('hidden');
        } else {
            tbody_mestizo_washing.classList.add('hidden');
        }
    });
}

// Express molt
let head_small_express = document.getElementById('head-small-express');
let tbody_small_express = document.getElementById('tbody-small-express');
let head_middle_express = document.getElementById('head-middle-express');
let tbody_middle_express = document.getElementById('tbody-middle-express');
let head_large_express = document.getElementById('head-large-express');
let tbody_large_express = document.getElementById('tbody-large-express');
let head_mestizo_express = document.getElementById('head-mestizo-express');
let tbody_mestizo_express = document.getElementById('tbody-mestizo-express');
remove_class_list = [tbody_small_express, tbody_middle_express, tbody_large_express, tbody_mestizo_express];

if (head_small_express !== null) {
    head_small_express.addEventListener('click', function() {
        _class_ = tbody_small_express.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_small_express.classList.remove('hidden');
        } else {
            tbody_small_express.classList.add('hidden');
        }
    });
}

if (head_middle_express !== null) {
    head_middle_express.addEventListener('click', function() {
        _class_ = tbody_middle_express.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_middle_express.classList.remove('hidden');
        } else {
            tbody_middle_express.classList.add('hidden');
        }
    });
}

if (head_large_express !== null) {
    head_large_express.addEventListener('click', function() {
        _class_ = tbody_large_express.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_large_express.classList.remove('hidden');
        } else {
            tbody_large_express.classList.add('hidden');
        }
    });
}

if (head_mestizo_express !== null) {
    head_mestizo_express.addEventListener('click', function() {
        _class_ = tbody_mestizo_express.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_mestizo_express.classList.remove('hidden');
        } else {
            tbody_mestizo_express.classList.add('hidden');
        }
    });
}

// Trimming
let head_main_trimming = document.getElementById('head-main-trimming');
let tbody_main_trimming = document.getElementById('tbody-main-trimming');
let head_mestizo_trimming = document.getElementById('head-mestizo-trimming');
let tbody_mestizo_trimming = document.getElementById('tbody-mestizo-trimming');
remove_class_list = [tbody_main_trimming, tbody_mestizo_trimming];

if (head_main_trimming !== null) {
    head_main_trimming.addEventListener('click', function() {
        _class_ = tbody_main_trimming.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_main_trimming.classList.remove('hidden');
        } else {
            tbody_main_trimming.classList.add('hidden');
        }
    });
}

if (head_mestizo_trimming !== null) {
    head_mestizo_trimming.addEventListener('click', function() {
        _class_ = tbody_mestizo_trimming.getAttribute('class');

        hideElements(remove_class_list);

        if (_class_ == 'hidden') {
            tbody_mestizo_trimming.classList.remove('hidden');
        } else {
            tbody_mestizo_trimming.classList.add('hidden');
        }
    });
}

// ************* END

let magicActions = function(el) {
    _class_ = el.getAttribute('class');

    console.log(_class_, el);

    hideElements([tbody_small_complex, tbody_middle_complex, tbody_large_complex, tbody_mestizo_complex]);

    if (_class_ == 'hidden') {
        el.remove('hidden');
        console.log('test')
    } else {
        el.add('hidden');
    }
}

function hideClassTabs() {
    let tab_btn = document.getElementsByClassName('tab-btn');
    let tabs_price = document.getElementsByClassName('tabs-price');

    for (let i = 0; i < tab_btn.length; i++) {
        tab_btn[i].classList.remove('btn-tab-active');
    }

    for (let i = 0; i < tabs_price.length; i++) {
        tabs_price[i].classList.add('hidden');
    }
}

function codeTarget(code, target) {
    ym(code,'reachGoal',target)
    log('codeTarget()')
}

const googleConvertionTarget = () => {
    gtag('event', 'conversion', {'send_to': 'AW-342943335/_KP6CIeAn4EDEOfMw6MB'});
}

// ym(70137172,'reachGoal','nazhatie-na-knopku-zapis')
// ym(70137172,'reachGoal','nazhatie-na-telefon')

$(document).ready(function () {
    // Event click
    $("#header-phone").click(function () {
        if (getCookie('user_statistic') == undefined || getCookie('user_statistic') == '') {
            let date = new Date(Date.now() + 86400e3);
            document.cookie = "user_statistic=click_on_phone; expires=" + date;
            // document.cookie = "user_statistic=click_on_phone; max-age=10";

            codeTarget(70137172, 'nazhatie-na-telefon');

            console.log('click header-phone');
        }

        // log(document.cookie);
        log(getCookie('user_statistic'));
    });
    $("#footer-phone").click(function () {
        if (getCookie('user_statistic') == undefined || getCookie('user_statistic') == '') {
            let date = new Date(Date.now() + 86400e3);
            document.cookie = "user_statistic=click_on_phone; expires=" + date;
            // document.cookie = "user_statistic=click_on_phone; max-age=10";

            codeTarget(70137172, 'nazhatie-na-telefon');

            console.log('click footer-phone');
        }

        // log(document.cookie);
        log(getCookie('user_statistic'));
    });
    $('.slider').slick({
        arrows: false,
        dots: true,
        slidesToShow: 1,
        autoplay: false,
        speed: 1000,
    });
    // $("#menu").on("click","a", function (event) {
    //     event.preventDefault();
    //     var id  = $(this).attr('href'),
    //         top = $(id).offset().top;
    //     $('body,html').animate({scrollTop: top}, 1500);
    // });
    $('.header-burger').click(function (event) {
        $('.header-burger, .menu-nav').toggleClass('active');
        $('body').toggleClass('lock');
    });
    // $("#menu").on("click","a", function (event) {
    //     event.preventDefault();
    //     var id  = $(this).attr('href'),
    //         top = $(id).offset().top,
    //         burger = $('.header-burger'),
    //         menuNav = $('.menu-nav');
    //
    //     if(burger.attr('class').includes('active')){
    //         $('body').removeClass('lock');
    //         burger.removeClass('active');
    //         menuNav.removeClass('active');
    //     }
    //
    //     $('body,html').animate({scrollTop: top}, 1500);
    // });

    // Event submit
    $('#contactform').on('submit', function (e) {
        // console.log({ e });

        e.preventDefault();

        const _token = document.getElementById('_token');
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');

        const senderror = document.getElementById('senderror');
        const sendmessage = document.getElementById('sendmessage');

        const form = document.querySelector('#contactform');
        const formEntries = new FormData(form).entries(); // Получаем введеные данные из формы

        const json = Object.assign(...Array.from(formEntries, ([x,y]) => ({[x]:y}))); // Преобразуем массив в объект ключ->значение

        // console.log({ 'Array.from(formEntries': Array.from(formEntries) });
        // console.log({ 'formEntries': formEntries });
        // console.log({ 'json': json });
        // const xxxArray = [1, 'test', { 'foo': 'bar' }];
        // const xxxObj = Object.assign(...xxxArray); // Преобразуем массив в объект ключ->значение
        // console.log({ xxxArray, xxxObj });

        if (isEmpty(json.name) || isEmpty(json.phone)) {
            senderror.innerText = 'Поля Имя и Телефон обязательны к заполнению.';
            show(senderror);
            hide(sendmessage);

            // $('#senderror').show();
            // $('#sendmessage').hide();
            // console.log('Поля Имя и Телефон обязательны к заполнению!');
            return false;
        }

        if (Validate.maxLength(json.name, 11)) {
            senderror.innerText = 'Имя должно содержать не более 11 символов.';
            show(senderror);
            hide(sendmessage);

            console.log({ 'json.name.length': json.name.length });
            return false;
        }

        if (Validate.maxLength(json.phone, 18)) {
            senderror.innerText = 'Телефон должен содержать не более 18 символов.';
            show(senderror);
            hide(sendmessage);

            console.log({ 'json.phone.length': json.phone.length });
            return false;
        }

        console.log('Сообщение отправлено!');

        $.ajax({
            type: 'POST',
            url: '/order',
            data: $('#contactform').serialize(),
            success: function (data) {
                console.log('order');
                const res = JSON.parse(data);
                console.log(res);
                console.log(res.status);

                if (data.result == 'success') {
                    codeTarget(70137172, 'nazhatie-na-knopku-zapis');
                    googleConvertionTarget();

                    // console.log('data.result = ', data.result);

                    $('#senderror').hide();
                    $('#sendmessage').show();
                    $('#contactform')[0].reset();
                }

                if (data.result == 'failed') {
                    console.log('data = ', data);
                    $('#senderror').show();
                    $('#sendmessage').hide();
                }
            },
            error: function () {
                console.log('error ajax');
            }
        });
    });
});

const raitengItemsList = document.querySelectorAll('.raiteng_item');
const raitengItemsArray = Array.prototype.slice.call(raitengItemsList);

raitengItemsArray.forEach(item =>
    item.addEventListener('click', () => {
        const { itemValue } = item.dataset;
        item.parentNode.dataset.totalValue = itemValue;
    })
);

// Examples
// 1 Array.prototype.filter()
const studentsAge = [17, 16, 18, 19, 21, 17];
const ableToDrink = studentsAge.filter( age => age > 18 );
// Массив ableToDrink будет содержать два значения: [19, 21]

console.log({ 'studentsAge': studentsAge });
console.log({ 'ableToDrink': ableToDrink });

// 2 Array.prototype.map()
let numbers = [2, 3, 4, 5];
const dollars = numbers.map( number => '$' + number);
// Вот как будет выглядеть массив dollars: ['$2', '$3', '$4', '$5']

console.log({ 'numbers Array.prototype.map()': numbers });
console.log({ 'dollars': dollars });

// 3 Array.prototype.reduce()
/*
Метод Array.prototype.reduce() нередко незаслуженно обходят вниманием. Он позволяет свести массив к единственному значению, накапливаемому в элементе-приёмнике. Значение, возвращаемое этим методом, может быть любого типа. Например, это может быть объект, массив, строка или число.
 */
numbers = [5, 10, 15];
const total = numbers.reduce( (accumulator, currentValue) => accumulator + currentValue);
// в константу total будет записано число 30

console.log({ 'numbers Array.prototype.reduce()': numbers });
console.log({ 'total': total });

// 4 Array.prototype.some()
/*
Метод Array.prototype.some() проверяет, соответствует ли хотя бы один элемент массива условию, задаваемому передаваемой ему функцией. Этот метод, например, способен хорошо показать себя в решении задачи проверки полномочий пользователя. Его можно рассматривать в качестве аналога ранее рассмотренного .forEach(), с той разницей, что, при его применении, с помощью функции, которая ему передана, можно выполнять над элементами массива некие действия до тех пор, пока эта функция не вернёт истинное значение, после чего — прервать обработку.
 */
const userPrivileges = ['user', 'user', 'user', 'admin'];
const containsAdmin = userPrivileges.some( element => element === 'admin');
// в containsAdmin будет записано true

console.log({ 'userPrivileges': userPrivileges });
console.log({ 'containsAdmin': containsAdmin });

// 5 Array.prototype.forEach()
const emotions = ['happy', 'sad', 'angry'];
emotions.forEach( emotion => console.log(emotion) );
// Выведено будет следующее:
// 'happy'
// 'sad'
// 'angry'

// 6 Array.prototype.every()
/*
Метод Array.prototype.every() похож на вышеописанный метод .some(), но он возвращает true только в том случае, если все элементы массива соответствуют условию, задаваемому передаваемой этому методу функцией.
 */
const ratings = [3, 5, 4, 3, 5];
const goodOverallRating = ratings.every( rating => rating >= 3 );
//goodOverallRating будет равно true

console.log({ 'ratings': ratings });
console.log({ 'goodOverallRating': goodOverallRating });

// END Examples

