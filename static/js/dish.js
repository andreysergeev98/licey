function showDishes(elem) {


    

    


    var itemBlock = '<div class="dishes-box-fav dish__item"  data-id="'+elem['id']+'"  >'+
    '<div class="favorites__item actived" onclick="favorite(this)"><?xml version="1.0"?>'+
        '<?xml version="1.0"?>'+
        '<svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="100%" height="100%" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class="">'+'<circle r="256" cx="256" cy="256" fill="#3a3b3f" shape="circle"/>'+'<g transform="matrix(0.7,0,0,0.7,76.80000000000001,76.7999393463135)">'+
            '<path class="icon_fav_active deactive_fav" xmlns="http://www.w3.org/2000/svg" style="" d="M247.931,487.774C32.21,372.032,0,247.587,0,183.71C0,23.139,161.509-27.459,256,76.623  c94.67-104.28,256-53.364,256,107.087c0,63.878-32.21,188.323-247.931,304.064C259.032,490.477,252.971,490.479,247.931,487.774z" fill="#bbbbbb" data-original="#ff7976" class=""/>'+
            '<path class="icon_fav_active deactive_fav" xmlns="http://www.w3.org/2000/svg" style="" d="M256,76.623c-0.001-0.001-0.002-0.002-0.003-0.003v413.182c2.776,0.001,5.552-0.676,8.073-2.028  C479.79,372.032,512,247.587,512,183.71C512,23.259,350.67-27.656,256,76.623z" fill="#8f8f8f" data-original="#ff5752" class=""/>'+
            '<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+
        '<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+
        '<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+' <g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+
            ' <g xmlns="http://www.w3.org/2000/svg">'+' </g>'+'<g xmlns="http://www.w3.org/2000/svg">'+' </g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+
            '<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+
            '<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+' </g>'+'</svg>'+
        '</div>'+


        '<div class="infodish-more" onclick="showDish(this)">'+

        

    '<a href="#popup-dish" class=" popup-link dish-link_item" >'+
        '<div class="picture_item_dish">'+'<img src="'+elem['picture']+'" alt="">'+'</div>'+
        '<div class="dish__item-text list-block-menu">'+

        '<h2 class="dish-content" style="text-align: left; margin-bottom: 5px;" data-name="'+elem['name']+'" data-content="'+elem['content']+'">'+elem['name']+'</h2>'+

        '<p class="time-dish"><img src="/qrmenud/static/images/clock.svg" alt=""> <span>'+elem['clock']+' мин.</span></p>'+

        '<p class="dish-description display-none" style="color: #cacaca;">'+elem['content']+'</p>'+
            '<div class="BJU-blocks"><span title="Энерг. ценность" class="count-energy" data-energy="'+elem['energy']+'"> <img src="/qrmenud/static/images/renewable-energy.svg" alt=""> '+elem['energy']+'</span><span title="Белки" class="count-protein" data-protein="'+elem['protein']+'"> <img src="/qrmenud/static/images/protein.svg" alt=""> '+elem['protein']+'</span><span title="Жиры" class="count-fats" data-fats="'+elem['fats']+'"> <img src="/qrmenud/static/images/trans-fat.svg" alt=""> '+elem['fats']+'</span><span title="Углеводы" class="count-carbohydrates" data-carbohydrates="'+elem['carbohydrates']+'"> <img src="/qrmenud/static/images/bread.svg" alt=""> '+elem['carbohydrates']+'</span></div>'+
            '<div class="boxPrice-dish"><p class="dish-price" style="text-align: left; color: #ffd200;" data-price="'+elem['price']+'">'+elem['price']+' ₽</p></div>'+
        '</div>'+
    '</a>'+

    '</div>'+
'</div>'




    return itemBlock;




  }