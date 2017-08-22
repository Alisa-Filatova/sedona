var dataUrl = 'data/hotels.json';
var $catalogHotels = $('.search-result');

/**
 * Создает разметку товара
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

function getHotelsCount() {
    var filterResult = $('.filter-nav__search-result_number');
    filterResult.text($('.hotel-item').length);
}

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

// Фильтр

var $filterBtn = $('.filter__btn');
var $minPrice = $('#min-price');
var $maxPrice = $('#max-price');
var $filterPrice = $('.filter-nav__link_price');
var $filterType = $('.filter-nav__link_type');
var $filterRate = $('.filter-nav__link_rate');
var $filterNav = $('filter-nav__list');
var $switchUp = $('#switch-up');
var $switchDown = $('#switch-down');

$filterBtn.on('click', function(event) {
    event.preventDefault();
    
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

        if ($filterPrice.hasClass('filter-nav__link_active')) {
            sortItemsByPriceMax(data);
        }

        if ($filterRate.hasClass('filter-nav__link_active')) {
            sortItemsByRateGood(data);
        }


        if ($filterType.hasClass('filter-nav__link_active')) {
            sortItemsByTypeMax(data);
        }

        $.each(data, function(index, item) {
            
            var obj = item.infrastructure;
            
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('pool') > -1
                && hotelType.indexOf(item.type) > -1
                && item.infrastructure.pool === true
            ) {       
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('parking') > -1
                && item.infrastructure.parking === true
                && hotelType.indexOf(item.type) > -1
            ) {      
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('wiFi') > -1
                && item.infrastructure.wiFi === true
                && hotelType.indexOf(item.type) > -1
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
});

$filterRate.on('click', function(event) {
    event.preventDefault();

    $('.filter-nav__link').removeClass('filter-nav__link_active');
    $(this).addClass('filter-nav__link_active');

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

        sortItemsByRateGood(data);

        $.each(data, function(index, item) {
           
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('pool') > -1
                && item.infrastructure.pool === true
                && hotelType.indexOf(item.type) > -1
            ) {       
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('parking') > -1
                && item.infrastructure.parking === true
                && hotelType.indexOf(item.type) > -1
            ) {      
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('wiFi') > -1
                && item.infrastructure.wiFi === true
                && hotelType.indexOf(item.type) > -1
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
});

$filterType.on('click', function(event) {
    event.preventDefault();

    $('.filter-nav__link').removeClass('filter-nav__link_active');
    $(this).addClass('filter-nav__link_active');

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

        sortItemsByTypeMax(data);

        $.each(data, function(index, item) {
           
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('pool') > -1
                && item.infrastructure.pool === true
                && hotelType.indexOf(item.type) > -1
            ) {       
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('parking') > -1
                && item.infrastructure.parking === true
                && hotelType.indexOf(item.type) > -1
            ) {      
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('wiFi') > -1
                && item.infrastructure.wiFi === true
                && hotelType.indexOf(item.type) > -1
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
});

// Cортировка товаров

$filterPrice.on('click', function(event) {
    event.preventDefault;
   
    $('.filter-nav__link').removeClass('filter-nav__link_active');
    $(this).addClass('filter-nav__link_active');
    
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

        sortItemsByPriceMin(data);

        $.each(data, function(index, item) {
           
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('pool') > -1
                && item.infrastructure.pool === true
                && hotelType.indexOf(item.type) > -1
            ) {       
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('parking') > -1
                && item.infrastructure.parking === true
                && hotelType.indexOf(item.type) > -1
            ) {      
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('wiFi') > -1
                && item.infrastructure.wiFi === true
                && hotelType.indexOf(item.type) > -1
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
});

$switchUp.on('click', function(event) {
    event.preventDefault;

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

        if ($filterPrice.hasClass('filter-nav__link_active')) {
            sortItemsByPriceMax(data);
        }

        if ($filterRate.hasClass('filter-nav__link_active')) {
            sortItemsByRateGood(data);
        }


        if ($filterType.hasClass('filter-nav__link_active')) {
            sortItemsByTypeMax(data);
        }

        $.each(data, function(index, item) {
           
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('pool') > -1
                && item.infrastructure.pool === true
                && hotelType.indexOf(item.type) > -1
            ) {       
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('parking') > -1
                && item.infrastructure.parking === true
                && hotelType.indexOf(item.type) > -1
            ) {      
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('wiFi') > -1
                && item.infrastructure.wiFi === true
                && hotelType.indexOf(item.type) > -1
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
});

$switchDown.on('click', function(event) {
    event.preventDefault;

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

        if ($filterPrice.hasClass('filter-nav__link_active')) {
            sortItemsByPriceMin(data);
        }

        if ($filterRate.hasClass('filter-nav__link_active')) {
            sortItemsByRateBad(data);
        }

        if ($filterType.hasClass('filter-nav__link_active')) {
            sortItemsByTypeMin(data);
        }

        $.each(data, function(index, item) {
           
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('pool') > -1
                && item.infrastructure.pool === true
                && hotelType.indexOf(item.type) > -1
            ) {       
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('parking') > -1
                && item.infrastructure.parking === true
                && hotelType.indexOf(item.type) > -1
            ) {      
                var itemHtml = createItemHtml(item);
                $catalogHotels.append(itemHtml);
                getHotelsCount();
            } 
            if (item.price <= maxPrice
                && item.price >= minPrice
                && infrastructure.indexOf('wiFi') > -1
                && item.infrastructure.wiFi === true
                && hotelType.indexOf(item.type) > -1
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
});

