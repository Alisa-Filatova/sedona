var dataUrl = 'data/hotels.json';
var $catalogHotels = $('.search-result');

/**
 * Создает разметку отеля
 *
 * @param {Object} item 
 * @return {String}
 */
function createItemHtml(item) {
    return (
        '<div class="hotel-item">' +
        '<div class="hotel-item__wrapper">' +
            '<picture>' +
                '<source media="(max-width:768px)" srcset="'+ item.imageSmall +'">' +
                '<img class="hotel-item__photo" src="'+ item.imageBig +'" alt="photo">' +       
            '</picture>' +
            '<div class="hotel-item__group">' +
                '<a class="base-link" href="#">' +
                    '<h3 class="hotel-item__title">'+ item.title +'</h3>' +
                '</a>' +
                '<p class="hotel-item__description">' +
                    '<span class="hotel-item__type">'+ item.type +'</span>' +
                    '<span>от <span class="hotel-item__price">'+ item.price +'</span>&#8381;</span>' +
               '</p>' +
                '<div class="hotel-item__btns">' +
                    '<a class="btn hotel-item__btn" href="#">Подробнее</a>' +
                    '<a class="btn hotel-item__btn hotel-item__btn_book" href="#">Забронировать</a>' +
                '</div></div></div>' +
                '<div class="rate">' +
                    '<i class="stars-icon stars-icon_'+ item.stars +'"></i>' +
                   '<span class="rate__text">Рейтинг: <b class="rate__number">'+ item.rate +'</b></span>' +
            '</div>' +
        '</div>' 
    );
}

/**
 * Проверяет, что число входит в диапазон.
 * 
 * @param {Number} number 
 * @param {Number} start 
 * @param {Number} end 
 *
 * @returns {Boolean}
 */
function inRange(number, start, end) {
    return number >= start && number <= end;
}

/**
 * Показывает кол-во найденых отелей. 
 */
function getHotelsCount() {
    var filterResult = $('.filter-nav__search-result_number');
    filterResult.text($('.hotel-item').length);
}

/**
 * Сортирует отели по цене.
 */
function sortItemsByPriceMin(array) {
    array.sort(function (min, max) {
        return min.price - max.price;
    });
};

function sortItemsByPriceMax(array) {
    array.sort(function (min, max) {
        return max.price - min.price;
    });
};

/**
 * Сортирует отели по рейтингу.
 */
function sortItemsByRateGood(array) {
    array.sort(function (min, max) {
        return max.rate - min.rate;
    });
};

function sortItemsByRateBad(array) {
    array.sort(function (min, max) {
        return min.rate - max.rate;
    });
};

/**
 * Сортирует отели по типу (кол-во звезд).
 */
function sortItemsByTypeMax(array) {
    array.sort(function (min, max) {
        return max.stars - min.stars;
    });
};

function sortItemsByTypeMin(array) {
    array.sort(function (min, max) {
        return min.stars - max.stars;
    });
};

/**
 * Выделяет активную кнопку сортировки.
 */
function highlightSortButton($sortButton) {
    $sortButton
        $('.filter-nav__link')
        .removeClass('filter-nav__link_active');
        
    $sortButton.addClass('filter-nav__link_active');
}

/**
 * Выбирает из списка отели с элементами, соответствующими выбраным в фильтре. 
 */
function checkFilter(arrey, checked) {
    for (var indexArrey = 0; indexArrey < arrey.length; indexArrey++) {
        for (var indexChecked = 0; indexChecked < checked.length; indexChecked++) {
            if (arrey[indexArrey] === checked[indexChecked]) {
                return true;
            } 
        }
    }
}

// Стартовая загрузка отелей.

$(function() {
    $.getJSON(dataUrl).done(function(data) {
        $.each(data, function(index, item) {
            var itemHtml = createItemHtml(item);
            $catalogHotels.append(itemHtml);
            getHotelsCount();
        });
    }).fail(function() { 
        alert('Ошибка загрузки!'); 
    })
});

// Фильтр отелей.

var $filterBtn = $('.filter__btn');
var $minPrice = $('#min-price');
var $maxPrice = $('#max-price');
var $filterPrice = $('.filter-nav__link_price');
var $filterType = $('.filter-nav__link_type');
var $filterRate = $('.filter-nav__link_rate');
var $filterNav = $('filter-nav__list');
var $switchUp = $('.switch_up');
var $switchDown = $('.switch_down');

$filterBtn.on('click', function(event) {
    event.preventDefault();
    
    $.getJSON(dataUrl).done(function(data) {
    
        var $infrastructureFilter = $('input[name=infrastructure]:checked');
        var $hotelTypeFilter = $('input[name=type]:checked');
        var maxPrice = $maxPrice.val();
        var minPrice = $minPrice.val();
        
        var infrastructure = $.map($infrastructureFilter, function(element) {
            return element.value; 
        });
        
        var hotelType = $.map($hotelTypeFilter, function(element) {
            return element.value; 
        });

        if ($filterPrice.hasClass('filter-nav__link_active')) {
            sortItemsByPriceMin(data);
        }

        if ($filterRate.hasClass('filter-nav__link_active')) {
            sortItemsByRateGood(data);
        }

        if ($filterType.hasClass('filter-nav__link_active')) {
            sortItemsByTypeMax(data);
        }
       
        $catalogHotels.empty();    

        $.each(data, function(index, item) {
            if (inRange(item.price, minPrice, maxPrice)
                && hotelType.indexOf(item.type) > -1
                && checkFilter(infrastructure, item.infrastructure) === true
            ) {       
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } else {
                getHotelsCount();
                return;
            }
        });
        
        if ($('.hotel-item').length <= 0) {
            $catalogHotels.append('<div class="hotel-item__not-found">Не найдено! Измените запрос.</div>');
        }
    }).fail(function() { 
        alert('Ошибка загрузки!'); 
    })
    getHotelsCount();
});

/**
 * Загружает отели в соответствии с настройками сортировки.
 */
function onClickSortItems(event) {
    event.preventDefault;
    
    var $this = $(this);

    highlightSortButton($this);

    $.getJSON(dataUrl).done(function(data) {
        $catalogHotels.empty();

        var $infrastructureFilter = $('input[name=infrastructure]:checked');
        var $hotelTypeFilter = $('input[name=type]:checked');
        var maxPrice = $maxPrice.val();
        var minPrice = $minPrice.val();
        
        var infrastructure = $.map($infrastructureFilter, function(element) {
            return element.value; 
        });
        
        var hotelType = $.map($hotelTypeFilter, function(element) {
            return element.value; 
        });

        if ($this.hasClass('filter-nav__link_rate')) {
            sortItemsByRateGood(data);
        } 
        if ($this.hasClass('filter-nav__link_price')) {
            sortItemsByPriceMin(data);
        }
        if ($this.hasClass('filter-nav__link_type')) {
            sortItemsByTypeMax(data);
        }

        $.each(data, function(index, item) {
            if (inRange(item.price, minPrice, maxPrice)
                && hotelType.indexOf(item.type) > -1
                && checkFilter(infrastructure, item.infrastructure) === true
            ) {       
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
        });
    }).fail(function() { 
        alert('Ошибка загрузки!'); 
    })
    getHotelsCount();
}

$filterRate.on('click', onClickSortItems);
$filterType.on('click', onClickSortItems);
$filterPrice.on('click', onClickSortItems);

/**
 * Переключает отсортированные отели от большего к меньшему и наоборот.
 */
function onClickSortSwitch(event) {
    event.preventDefault;
    
    var $this = $(this);

    $.getJSON(dataUrl).done(function(data) {
        $catalogHotels.empty();

        var $infrastructureFilter = $('input[name=infrastructure]:checked');
        var $hotelTypeFilter = $('input[name=type]:checked');
        var maxPrice = $maxPrice.val();
        var minPrice = $minPrice.val();
        
        var infrastructure = $.map($infrastructureFilter, function(element) {
            return element.value; 
        });
        
        var hotelType = $.map($hotelTypeFilter, function(element) {
            return element.value; 
        });

        if ($filterPrice.hasClass('filter-nav__link_active') 
            && $this.hasClass('switch_up')) {
            sortItemsByPriceMax(data);
        } 

        if ($filterPrice.hasClass('filter-nav__link_active') 
            && $this.hasClass('switch_down')) {
            sortItemsByPriceMin(data);
        } 

        if ($filterRate.hasClass('filter-nav__link_active') 
            && $this.hasClass('switch_up')) {
            sortItemsByRateGood(data);
        }

        if ($filterRate.hasClass('filter-nav__link_active') 
            && $this.hasClass('switch_down')) {
            sortItemsByRateBad(data);
        }

        if ($filterType.hasClass('filter-nav__link_active') 
            && $this.hasClass('switch_up')) {
            sortItemsByTypeMax(data);
        }

        if ($filterType.hasClass('filter-nav__link_active') 
            && $this.hasClass('switch_down')) {
            sortItemsByTypeMin(data);
        }

        $.each(data, function(index, item) {
            if (inRange(item.price, minPrice, maxPrice)
                && hotelType.indexOf(item.type) > -1
                && checkFilter(infrastructure, item.infrastructure) === true
            ) {       
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
        });
    }).fail(function() { 
        alert('Ошибка загрузки!'); 
    })
    getHotelsCount();
}

$switchUp.on('click', onClickSortSwitch);
$switchDown.on('click', onClickSortSwitch);

