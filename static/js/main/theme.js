
$(document).ready(function () {

    

    // $('.container-bonus-notauth').addClass('display-none')
    infoProfile()





});





if($('.bonusHeader').html() != undefined){
    $('.bonusHeader').html($('.bonusHeader').html().split('.')[0]);
}




if (Cookies.get('logged') != undefined){


    
	if (Cookies.get('logged') == 0) {

        anketaPopup()
        Cookies.set('logged', 2)
        
        console.log()


	}else if(Cookies.get('logged') == 1){
       
        anketaPopup()
        Cookies.set('logged', 2)
        
    }else{

        console.log(Cookies.get('logged'))

    }

}


$('.birthday').mask('0000-00-00');
$('.tel_mask').mask('+7 (000) 000-00-00');


function anketaPopup() {
    
    $('#popup-menu').addClass('open')
    // $('body').addClass('lock')

}





jQuery(function($){
	$(document).mouseup(function (e){ // событие клика по веб-документу
		var div = $("#popup-menu .popup__content"); // тут указываем ID элемента
		if (!div.is(e.target) // если клик был не по нашему блоку
		    && div.has(e.target).length === 0) { // и не по его дочерним элементам
		

            $('#popup-menu').removeClass('open')

            // console.log('1')
		}
	});
});





jQuery(function($){
	$(document).mouseup(function (e){ // событие клика по веб-документу
		var div = $("#popup-dish .popup__content"); // тут указываем ID элемента
		if (!div.is(e.target) // если клик был не по нашему блоку
		    && div.has(e.target).length === 0) { // и не по его дочерним элементам
		

            $('#popup-dish').removeClass('open')

            // console.log('1')
		}
	});
});



 function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');


function getAuth(e) { 

    let tel = document.getElementById('registration__phone').value

    let itemAuth = {
        'phone': tel
    };

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
//    console.log(csrftoken)

//    console.log(itemAuth)


   $.ajax({
    method: "POST",
    // mode: 'same-origin',
    url: "/get-phonekey",
    headers: { "X-CSRFToken": csrftoken },
    // contentType: 'application/json; charset=utf-8',
    // dataType: 'json',

    data: { 'phone': tel},
    beforeSend: function() {
        // $('.btn_Auth').addClass('loading');
        $('.popup-registration__step-1 .loading').removeClass('display-none')
        $('.popup-registration__step-2 .loading').removeClass('display-none')
        $('.popup-registration__step-1 .btn_Auth').addClass('display-none')
        $('#registration__phone').attr('disabled','disabled')
    },
    success: function(html){  
        // $(".btn_Auth").removeClass('loading');  
        $('.popup-registration__step-2 .loading').addClass('display-none')
        $('.popup-registration__step-1').addClass('display-none')
        $('.popup-registration__step-2').removeClass('display-none')
    },
  })
  
    .done(function( msg ) {


        if(msg['success'] == true){

           
            

            if(msg['obj'].hasOwnProperty("Registration")){

                Cookies.set('logged', 0)

                var codeTimeReg = parseInt(msg['obj']['Registration']['Code_Timeout']);
                console.log(msg)
                $('.box-error-sms span').html(msg['obj']['Registration']['Message'])

           
                intervalsms = setInterval(function(){
                    
                    
                    

                    
                 
                    codeTimeReg -= 1;
               
                    console.log(codeTimeReg)

                    $('.code-timeout span').html('Повторный код через: ' + codeTimeReg)

                    if(codeTimeReg == 0){



                        clearInterval(intervalsms)

                        $('.code-timeout span').html('<div class="btn-default" onclick="getAuth();">Отправить sms</div>')

                    }
                  
                
                }, 1000);


                $('.code-timeout span').html(msg['obj']['Registration']['Code_Timeout'])

            }else if(msg['obj'].hasOwnProperty("Login")){

                Cookies.set('logged', 1)

                var codeTimeLogin = msg['obj']['Login']['Code_Timeout']

           
                intervalsms = setInterval(function(){
                    
                    
                    

                    
                 
                    codeTimeLogin -= 1;
               
                    console.log(codeTimeLogin)

                    $('.code-timeout span').html('Повторный код через: ' + codeTimeLogin)

                    if(codeTimeLogin == 0){



                        clearInterval(intervalsms)

                        $('.code-timeout span').html('<div class="btn-default" onclick="getAuth();">Отправить sms</div>')

                    }
                  
                
                }, 1000);


                console.log(msg)
                

                $('.box-error-sms span').html(msg['obj']['Login']['Message'])

            }

            
            
        }else{

            $('.box-error-sms span').html(msg['obj']['Data']['@ErrorText'])

            // console.log()
            console.log(false);
          
        }
    });

   }



$( "#popup-registration__sms-pass-inp" ).keyup(function() {

    let count = this.value.length;

    

    if(count == 6){

        let tel = document.getElementById('registration__phone').value

        console.log(this.value, tel)

        checkKey(tel,this.value)

    }

});


function checkKey(tel, keysms) { 

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    $.ajax({
        method: "POST",
        url: "/check-phonekey",
        headers: { "X-CSRFToken": csrftoken },
        data: { 'phone': tel, 'keysms':keysms},
        beforeSend: function() {

            $('.popup-registration__step-2 .loading').removeClass('display-none')


        
            
        },
        success: function(html){  

           $('.popup-registration__step-2 .loading').addClass('display-none')
    
        },

        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.log(msg)

            $('.box-error-sms span').html('Упс! Что-то пошло не так.')

        },
      })
      
        .done(function( msg ) {

            console.log(msg)

            if(msg['success'] == true){

                location.reload();



            }else{

                $('.box-error-sms span').html(msg['response']['Data']['@ErrorText'])
                console.log(msg['response']['Data']['@ErrorText'])

            }


            
    
            // if(msg['success'] == true){
            //     console.log( msg['success'] );
            // }else{
            //     console.log(false);
            // }
        });

 }


 function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#avatar')
                .attr('src', e.target.result)
                .width(150)
                .height(200);
                console.log(e.target.result)
        };

        

        reader.readAsDataURL(input.files[0]);
    }
}



 function testt(tel, keysms) { 

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    $.ajax({
        method: "POST",
        url: "/test",
        headers: { "X-CSRFToken": csrftoken },
        data: { 'phone': tel, 'keysms':keysms},
        beforeSend: function() {
        
            
        },
        success: function(html){  

           
    
        },
      })
      
        .done(function( msg ) {


            console.log(msg)


            // msg['session'].forEach(element => {

            //    if(element['Transaction_Type'] == '32'){
            //     console.log(element)

            //     var decodedData = window.atob(element['Dop_Info']['#text']);

            //     // const obj = JSON.parse(decodedData);
            //     console.log(decodedData)
            //    }

                
            // });
    
            // if(msg['success'] == true){
            //     console.log( msg['success'] );
            // }else{
            //     console.log(false);
            // }
        });

 }


 function infoProfile() { 

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    $.ajax({
        method: "POST",
        url: "/infoprofile",
        headers: { "X-CSRFToken": csrftoken },
        data: { 'phone': '1'},
        beforeSend: function() {


           
            
            $('#popup-data .container_profile .loading').removeClass('display-none')
            $('#popup-data .container_profile .content-profile').addClass('display-none')

        
          
                 
        },
        success: function(html){  

            

            $('#popup-data .container_profile .loading').addClass('display-none')
            $('#popup-data .container_profile .content-profile').removeClass('display-none')

    
           
    
        },
      })
      
        .done(function( msg ) {


            if($('#popup-data').hasClass('popup_back open')){
            

            
            $('.f_name').val(msg['object']['Holder']['F_Name'])
            $('.l_name').val(msg['object']['Holder']['L_Name'])
            // $('.m_name').val(msg['object']['Holder']['M_Name'])

            arr_contact = msg['object']['Holder']['Holders_Contacts']['Holder_Contact']['Contact']


            if(arr_contact){
                if(Array.isArray(arr_contact)){
                    arr_contact.forEach(element => {
                    if(element['Type_ID'] == 2) $('.phone_name').val(element['Value']);
                    if(element['Type_ID'] == 1) $('.email_name').val(element['Value']);  
                    });

                }else{//если с запроса пришел не массив то делаем проверку
                    if(arr_contact['Type_ID'] == 2) $('.phone_name').val(arr_contact['Value']);
                    if(arr_contact['Type_ID'] == 1) $('.email_name').val(arr_contact['Value']);
                }
            }


            console.log(msg['object']['Holder']['Gender'])
            console.log(msg['object']['Holder']['Holders_Images']['Holder_Image']['Photo'])
            $('.birthday').val(msg['object']['Holder']['Birth'])

            $('.gender').val(msg['object']['Holder']['Gender'])

         
            console.log(msg['object']['Holder'])
    
        }else{

            if(msg['success'] == true){
                $('.container-bonus-notauth').addClass('display-none')

                if(msg['auth'] != undefined){
                console.log(msg)

                let bonus = $('.bonusHeader').html()

                $('.box-up-auth .picture-auth').html(
                    
                    '<p class="name-auth-main">'+msg['object']['Holder']['Full_Name']+'</p>'+
                    '<p style="font-size: 20px;">'+msg['auth']+'</p>'+
                    '<div class="bonus-main-block"><h2>Доступно</h2><h2 class="count-bonus-main">'+bonus+'</h2><h2>Бонусов</h2></div>'
                    // <span data-check="True" onclick="refreshBonus(this)"><img src="/licey/static/images/circular-arrow.svg" alt=""></span>
                    
                    );
                $('.container-bonus .box-btn_content').html('');
                $('.container-bonus').removeClass('display-none')
                $('.container-bonus .box-qr-main').removeClass('display-none')

            }


            }else{
                $('.container-bonus').addClass('display-none')
                $('.container-bonus-notauth').removeClass('display-none')
                console.log('1')
            }
            
        }
        });

 }



 function SaveProfile() { 

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    let f_name = $('.f_name').val()
    let l_name = $('.l_name').val()
    let birthday = $('.birthday').val()

    let gender = $('.gender').val()

    let email_name = $('.email_name').val()




    

    // let avatar = $('#avatar').attr('src')

    // console.log(avatar)
        console.log(email_name)

    $.ajax({
        method: "POST",
        url: "/save-profile",
        headers: { "X-CSRFToken": csrftoken },
       
        data: { 'f_name': f_name, 'l_name': l_name, 'birthday': birthday, 'gender':gender,'email_name':email_name},
        beforeSend: function() {

            $('.btn-saveProfile').css("background-color", "#c3c3c3");
            $('.btn-saveProfile').attr('onlyread');


                 
        },
        success: function(html){  

            $('.bonus-system-box .name-auth-main').html(''+l_name +' '+f_name+'')

           $('.btn-saveProfile').css("background-color", "#337ff1");
            $('.btn-saveProfile').removeAttr('onlyread');

            $.iaoAlert({

                msg:"Данные успешно сохранены!",
                type: "success",
                mode:"dark",
                position:'bottom-right',
            
              });
    
        },
      })
      
        .done(function( msg ) {

            console.log(msg)

            // $('.f_name').val(msg['object']['Holder']['F_Name'])
            // $('.l_name').val(msg['object']['Holder']['L_Name'])
            // $('.m_name').val(msg['object']['Holder']['M_Name'])
            // $('.phone').html(msg['object']['Holder']['Full_Name'])

            // $('.birthday').val(msg['object']['Holder']['Birth'])

           
         
            // console.log(msg['object']['Holder'])
    
            // if(msg['success'] == true){
            //     console.log( msg['success'] );
            // }else{
            //     console.log(false);
            // }
        });

 }



 function getQrCode() { 

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    $.ajax({
        method: "POST",
        url: "/generate-qrcode",
        headers: { "X-CSRFToken": csrftoken },
       
        data: { },
        beforeSend: function() {


            $('#popup-qrmenu .popup__main .loading').removeClass('display-none')
            $('#popup-qrmenu .popup__main .content-profile').addClass('display-none')

            
                 
        },
        success: function(html){  

            $('#popup-qrmenu .popup__main .loading').addClass('display-none')
            $('#popup-qrmenu .popup__main .content-profile').removeClass('display-none')

           
    
        },
      })
      
        .done(function( msg) {

            if(msg['success'] == true){

           

           

           qrcode = msg['object']['Holder']['Holders_Cards']['Holder_Card']['Card']['Card_Code']

           $('#qrcode').html('')

           $('#qrcode').qrcode({width: 200,height: 200,text: qrcode});


        }else{
            console.log(msg)

            $('div').removeClass('open')

            $('#popup-menu').addClass('open')

        }
          
            // console.log(qrcode)
           
        });

 }


 function exitAccount() { 



    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    $.ajax({
        method: "POST",
        url: "/logout-profile",
        headers: { "X-CSRFToken": csrftoken },
       
        data: { },
        beforeSend: function() {

            
                 
        },
        success: function(html){  

           
    
        },
      })
      
        .done(function( msg) {

            if(msg['success'] == true){

                location.reload();

            }

            console.log(msg['success'])
          
            // console.log(qrcode)
           
        });






  }


  let fields = document.querySelectorAll('.field__file');
  Array.prototype.forEach.call(fields, function (input) {
    let label = input.nextElementSibling,
      labelVal = label.querySelector('.field__file-fake');

    input.addEventListener('change', function (e) {
      let countFiles = '';
      if (this.files && this.files.length >= 1)
        countFiles = this.files.length;

      if (countFiles)
        label.querySelector('.field__file-fake').innerText = 'Выбрано файлов: ' + countFiles;
      else
        label.querySelector('.field__file-fake').innerText = labelVal;
    });
  });






  function UserHistory() {


        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
        $.ajax({
            method: "POST",
            url: "/get-history",
            headers: { "X-CSRFToken": csrftoken },
           
            data: { },
            beforeSend: function() {


                $('#popup-history .popup__main .loading').removeClass('display-none')
                $('#popup-history .popup__main .content-profile').addClass('display-none')
    
                
                     
            },
            success: function(html){  
    
                $('#popup-history .popup__main .loading').addClass('display-none')
                $('#popup-history .popup__main .content-profile').removeClass('display-none')
        
            },
          })
          
            .done(function( msg) {


                console.log(msg)

                if(msg['success'] == true){

                    console.log(msg)

    
                    $('.content-checks').html('')

                    


                    var sumt = 0
                        $.each(msg['story'], function (indexInArray, element) { 
                             
                        });
                    

                     var summa = 0;   
                    //  var bonuses = 0;

                     let countItem = 0;
                     let bonus = ''

                    
                     




                    msg['story'].forEach(element => {

                        countItem++;

                        console.log(element['CHECK'])

                        var date_check = element['CHECK']['@generateddatetime'].split('T')[0];
                        var time_check = element['CHECK']['@generateddatetime'].split('T')[1];

                        var items_b = element['CHECK']['CHECKDATA']['CHECKLINES']['LINE']

                        var sum = element['CHECK']['CHECKDATA']['CHECKPAYMENTS']['PAYMENT']['@sum']
                        

                        if (element['CHECK']['CHECKDATA']['CHECKBONUSES']){
                            var bonus = element['CHECK']['CHECKDATA']['CHECKBONUSES']['BONUS']['@sum']
                            // bonuses += parseFloat(bonus)

                        }else{
                            bonus = 0
                        }

                        
                        
                        summa += parseFloat(sum) 


                        if(time_check != undefined){
                            var hour = time_check.split(':')[0];

                            var minuts = time_check.split(':')[1];

                            console.log(hour + ':' +minuts);
                        }


                        sumt +=parseInt(bonusmonth(date_check,bonus))
                        

                        console.log(sumt) 
                        

                        if (element['CHECK']['CHECKDATA']['CHECKBONUSES']){

                            bonus = '<div class="fontello">$ Начислено баллов: <strong>'+element['CHECK']['CHECKDATA']['CHECKBONUSES']['BONUS']['@sum']+'</strong></div>'

                        }else{
                            bonus = ''
                        }
                       

                    //    console.log(time_check.replace(/^(?:[01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/g, '%20')) 

                      
                        $('.content-checks').append(
                            '<li class="popup-history__slide-item tableItem prodItems">'+
                                
                                '<span class="date-time-box"><strong class="date-his-top">'+date_check+'</strong><strong class="date-his-top">'+hour + ':' +minuts+'</strong></span>'+
                                '<div class="popup-history__slide-item-elem">'+
                                ' <div class="fontello">&#xe835; Сумма покупки: <strong>'+element['CHECK']['CHECKDATA']['CHECKPAYMENTS']['PAYMENT']['@sum']+' &#8381;</strong></div>'+
                                bonus+
                                
                                '<div class="btn-arrow-history" onclick="ToggleCheck(this)"><img src="/static/images/down-arrow.svg" alt=""></div>'+


                                '<div class="items_prod-'+element['CHECK']['CHECKDATA']['@checknum']+' box_check-item"></div>'+
                                '</div>'+
                            '</li>')

                            


                            // $('.items_prod').html('')

                            if(items_b.length > 0){

                            

                            items_b.forEach(elem => {


                                
                                $('.items_prod-'+element['CHECK']['CHECKDATA']['@checknum']+'').append(
                                    '<div class="item-his-user">'+
                            '<span class="item-name"><span class="name-check-user">'+elem['@name']+'</span><span><span> '+elem['@sum']+' ₽ </span> x'+elem['@quantity']+'</span></span>'+
                            ''+

                          '</div>'); 


    
                                
                                console.log(elem)
                                
                            });

                        }else{
                            $('.items_prod-'+element['CHECK']['CHECKDATA']['@checknum']+'').append(
                                
                                '<div class="item-his-user">'+
                            '<span class="item-name"><span class="name-check-user">'+items_b['@name']+'</span><span><span> '+items_b['@sum']+' ₽ </span> x'+items_b['@quantity']+'</span></span>'+
                            ''+

                          '</div>'); 
                        }

                    });
                    
                    $('#pagination-container').html('<p class="paginacaoCursor" id="beforePagination"><</p>'+
                    '<p class="paginacaoCursor" id="afterPagination">></p>')
                    // $('#pagination-container').append()
                    paginatehis(countItem);

                    // $('.content-checks').append('<div class="active-block"></div>')


                    msg['pay'].forEach(element => {

                        console.log(element)

                        var summaPay = element['summa']

                        var timePay = element['time'].split(' ')[1].split(':')[0] + ':' + element['time'].split(' ')[1].split(':')[1]

                        var namePay = element['name']


                        $('.content-checks').append(
                            '<li class="popup-history__slide-item tableItem payItems">'+
                                
                                '<span class="date-time-box"><strong class="date-his-top">'+element['time'].split(' ')[0]+'</strong><strong class="date-his-top">'+timePay+'</strong></span>'+
                                '<div class="popup-history__slide-item-elem">'+
                                ' <div class="fontello">&#xe835; Пополнение счета: <strong>'+element['summa']+' &#8381;</strong></div>'+
                              

                                '</div>'+
                            '</li>'
                            
                            )

                     })




                    

                    


                    $('.content-checks').prepend('<div class="popup-history__saved">Экономия в этом месяце:<span>'+sumt+' &#8381;</span></div>')

                    console.log('Сумма: ' + summa)

                    // $('#storyPoint').html(bonuses)

 
                }else{

                    $('#popup-history .popup__main .content-profile').html('Заказов не найдено.')


                    console.log(msg)
                }

               
            });
    
    

   }


function backbtn(elem) {
    parent.history.back();
    return false;
}



function ToggleCheck(elem) {

    $(elem).parent().find('.box_check-item').slideToggle( "slow" );


    console.log(elem)


    }


function UserGifts(elem) {

    console.log(elem)



    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    $.ajax({
        method: "POST",
        url: "/get-gifts",
        headers: { "X-CSRFToken": csrftoken },
       
        data: { },
        beforeSend: function() {


            $('#popup-notifications .popup-notifications__items .loading').removeClass('display-none')
            $('#popup-notifications .popup-notifications__items .content-profile').addClass('display-none')

            
                 
        },
        success: function(html){  

            $('#popup-notifications .popup-notifications__items .loading').addClass('display-none')
            $('#popup-notifications .popup-notifications__items .content-profile').removeClass('display-none')
    
        },
      })
      
        .done(function( msg) {

            if(msg['success'] == true){

               coupons = msg['coupons']['Holder_Coupon']['Coupon']

               console.log(msg['coupons']['@Count'])


               if(msg['coupons']['@Count'] > 0){

               $('.popup-notifications__items .content-profile').html('')

               if(coupons.length > 0){

               coupons.forEach(elem => {


                console.log(elem['Coupon_Type_Name'])
                console.log(elem['Expired'])
                console.log(elem['Offered'])
                console.log(elem['Status'])
                console.log(elem['Coupon_Code'])
                    $('.popup-notifications__items .content-profile').append(
                        '<div class="popup-notifications__item">'+
                            '<div class="popup-notifications__item-header">'+
                                '<div class="popup-notifications__item-header-text">'+
                                '<div>'+elem['Coupon_Type_Name']+' <span class="status_notif">'+elem['Status']+'</span></div>'+
                                ' <div>От: '+elem['Offered']+' До: '+elem['Expired']+'</div>'+
                                '</div>'+
                                '<span class="fontello">&#xe805;</span>'+
                            '</div>'+
                            '<div class="popup-notifications__item-text display-none">'+
                            'Код купона: '+elem['Coupon_Code']+''+

                            '</div>'+
                        '</div>'
                )
               });


            }else{


                $('.popup-notifications__items .content-profile').append(

                    '<div class="popup-notifications__item">'+
                        '<div class="popup-notifications__item-header">'+
                            '<div class="popup-notifications__item-header-text">'+
                            '<div>'+coupons['Coupon_Type_Name']+' <span class="status_notif">'+coupons['Status']+'</span></div>'+
                            ' <div>От: '+coupons['Offered']+' До: '+coupons['Expired']+'</div>'+
                            '</div>'+
                            '<span class="fontello">&#xe805;</span>'+
                        '</div>'+
                        '<div class="popup-notifications__item-text display-none">'+
                        'Код купона: '+coupons['Coupon_Code']+''+

                        '</div>'+
                    '</div>'


            )


            }



        }else{

            $('.popup-notifications__items .content-profile').html('<p>Купонов не найдено.</p>')

        }
                
            }

           

          
            // console.log(qrcode)
           
        });

  }


function favorite(elem) { 


    


    $(elem).toggleClass('actived')
    $(elem).find('.icon_fav_active').toggleClass('deactive_fav')
    let id = $(elem).parent().data('id')
    let price = $(elem).parent().find('.dish-price').data('price')
    let name = $(elem).parent().find('.dish-content').data('name')
    let picture = $(elem).parent().find('.picture_item_dish img').attr('src')
    let content = $(elem).parent().find('.dish-content').data('content')

    let protein = $(elem).parent().find('.BJU-blocks .count-protein').data('protein')

    let fats = $(elem).parent().find('.BJU-blocks .count-fats').data('fats')

    let energy = $(elem).parent().find('.BJU-blocks .count-energy').data('energy')

    let clock = $(elem).parent().find('.time-dish').data('clock')

    let carbohydrates = $(elem).parent().find('.BJU-blocks .count-carbohydrates').data('carbohydrates')
   
    if($(elem).hasClass('actived') == true){

        if (Cookies.get('dishes') == undefined){
            var arr = []
        }else{
            var arr = jQuery.parseJSON([ Cookies.get('dishes') ]);



        }

        arr.push({'id': id, 'name': name,'picture': picture,'price': price,'content': content, 'protein': protein, 'fats':fats, 'carbohydrates':carbohydrates, 'energy': energy, 'clock':clock})
        Cookies.set('dishes',arr)

        console.log('id товара: ' + id)

        console.log('БЖУ: ' , arr)
        
        console.log(jQuery.parseJSON(Cookies.get('dishes')))
   

    }else{


        if (Cookies.get('dishes') == undefined){
            var arr = []
        }else{

            var arr = jQuery.parseJSON([ Cookies.get('dishes') ]);

            function RemoveNode(id) {
                return arr.filter(function(emp) {
                    if (emp.id == id) {
                        return false;
                    }
                    return true;
                });
            }
            
            var newData = RemoveNode(id);
            Cookies.set('dishes',JSON.stringify(newData, 0, 4))
            console.log(newData)
    
        }
   
    }


    // document.stopPropagation();

}


const swiper = new Swiper('.swiper-container', {
    speed: 400,
    spaceBetween: 100,
    slidesPerView: 10
  });



  
//   var block_show = null;
 
// function scrollTracking(){
// 	var wt = $(window).scrollTop();
// 	var wh = $(window).height();
// 	var et = $('.active-block').offset().top;
// 	var eh = $('.active-block').outerHeight();
	
// 	if (et >= wt && et + eh <= wh + wt){
// 		if (block_show == null || block_show == false) {
// 			// $('#console').html('Блок active полностью виден');

//             console.log('Блок active полностью виден')



// 		}
// 		block_show = true;
// 	} else {
// 		if (block_show == null || block_show == true) {
// 			console.log('Блок active полностью не виден')
// 		}
// 		block_show = false;
// 	}
// }
 
// $('#popup-history').scroll(function(){
// 	scrollTracking();
// });
	
// $(document).ready(function(){ 
// 	scrollTracking();
// });




// $('#pagination-container').pagination({
//     dataSource: [1, 2, 3, 4, 5, 6, 7],
//     callback: function(data, pagination) {
//         // template method of yourself
//         var html = template(data);
//         $('#data-container').html(html);
//     }
// })



// function simpleTemplating(data) {
//     var html = '<ul>';
//     $.each(data, function(index, item){
//         html += '<li>'+ item +'</li>';
//     });
//     html += '</ul>';
//     return html;
// }



// $('#pagination-container').pagination({
//     dataSource: [1, 2, 3, 4, 5, 6, 7],
//     callback: function(data, pagination) {
//         var html = simpleTemplating(data);
//         $('#data-container').html(html);
//     }
// })


let summ = 0

function bonusmonth(datehis,bonushis) { 

    

    console.log(datehis)


    if(datehis != undefined){

        var date_y = datehis.split('-')[0];
        var date_m = datehis.split('-')[1];

        var date_y_m = date_y + '-' + date_m
        console.log();
    }

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();


    if(month != 10 && month != 11 && month != 12){
        newdate = year + "-" + '0' + month;
       

    }else{
        newdate = year + "-" + month;
       
    }


    if(newdate == date_y_m){
        console.log(newdate + '=' + date_y_m)

        // let summ =+ bonushis;

        return bonushis;

        

        
    }

    


 }



function refreshBonus() {


   console.log('обновить бонусы')
    

  }






function sentLikedapp() { 



    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


    let title = 'Анкета'
    let content = $('#popup-rating__text-area-review').val()

    // console.log(content)

    $.ajax({
        method: "POST",
        url: "/likedapp",
        headers: { "X-CSRFToken": csrftoken },

        
       
        data: { 'title': title, 'content': content },
        beforeSend: function() {

            $('.anketa-likedapp').css("background-color", "#c3c3c3");
            $('.anketa-likedapp').attr('onlyread');
                 
        },
        success: function(html){  

            $('.anketa-likedapp').css("background-color", "#ffd200");
            $('.anketa-likedapp').removeAttr('onlyread');

            $('#popup-rating .popup__main').html('<p>Спасибо за оценку приложения!</p>')

            $.iaoAlert({

                msg:"Анкета успешно отправлена!",
                type: "warning",
                mode:"dark",
                position:'bottom-right',
            
              });
    
        },
      })
      
        .done(function( msg) {

            

            if(msg['success'] == true){

                

            }

            console.log(msg['success'])
          
            // console.log(qrcode)
           
        });

  }



function showDish(elem) {


   

   var picture = $(elem).parent().find('.picture_item_dish img').attr('src')

   console.log(elem)


   var protein = $(elem).parent().find('.dish__item-text .BJU-blocks .count-protein').data( "protein");

   var fats = $(elem).parent().find('.dish__item-text .BJU-blocks .count-fats').data( "fats");

   var carbohydrates = $(elem).parent().find('.dish__item-text .BJU-blocks .count-carbohydrates').data( "carbohydrates");

   var energy = $(elem).parent().find('.dish__item-text .BJU-blocks .count-energy').data( "energy");

    


   console.log('Белки: ' + protein, 'Жиры: ' + fats, 'Углеводы: ' + carbohydrates)

   var price = $(elem).parent().find('.dish__item-text .dish-price').data( "price");
   var name = $(elem).parent().find('.dish__item-text .dish-content').data( "name");

   var idef = $(elem).parent().find('.dish__item-text .dish-content').data( "id");
   var content = $(elem).parent().find('.dish__item-text .dish-content').data( "content");
   console.log(price)
   console.log(name)
   console.log(content)

   $('#popup-dish .popup__content .popup__main .popup-category-dish').html('<p>'+idef+'</p>')

   






    $('#popup-dish .popup__content .popup__main h2').html(name)

    $('#popup-dish .popup__content .popup__navigation .title_nav-popup').html(name)

    $('#popup-dish .popup__content .popup__main .btn-market').html('В корзину ('+price+' ₽)')



    

    $('#popup-dish .popup__content .popup__main .BJU-table .count-protein').html(protein)
    $('#popup-dish .popup__content .popup__main .BJU-table .count-fats').html(fats)
    $('#popup-dish .popup__content .popup__main .BJU-table .count-carbohydrates').html(carbohydrates)

    $('#popup-dish .popup__content .popup__main .circle-ckal .circle-ckal-count').html(energy)

    $('#popup-dish .popup__content .popup__main #dish-white-block img').attr('src',picture)

    $('#popup-dish .popup__content .popup__main .popup-dish-content').html(''+content+'')


    $('#popup-dish').addClass('popup_back open')


  }



function  Readyfavorites() { 



    console.log(jQuery.parseJSON([Cookies.get('dishes')]))



    var arr = jQuery.parseJSON([Cookies.get('dishes')])
    
    $('.dishes__items').find('.dish__item .favorites__item').removeClass('actived')
    $('.dishes__items').find('.dish__item .favorites__item .icon_fav_active').removeClass('deactive_fav')
    let dishItems = $('.dishes__items').find('.dish__item')





    $(dishItems).each(function (i, elem) {
    //    console.log($(elem).data('id'))
       
       $.each(arr, function (i, val) { 

        if($(elem).data('id') == val['id']){


            // console.log(elem)

            $(elem).find('.favorites__item').addClass('actived');

            $(elem).find('.icon_fav_active').addClass('deactive_fav')

        }
   
       });
  
    });
  
    console.log(dishItems)
    
    console.log('1111')

 }




 function favoriteShow() {



    var arr = jQuery.parseJSON([Cookies.get('dishes')])

    $('.dishes__items').parent().find('.content-favor-items').removeClass('display-none')
    $('.dishes__items').addClass('display-none')


    $('.content-favor-items').html('')


    $.each(arr, function (i, val) { 

        
       $('.content-favor-items').append(showDishes(val)) 






    });


    if($('.picture_item_dish').hasClass('display-none')){

        $('.content-favor-items').find('.picture_item_dish').addClass('display-none')

        $('.content-favor-items').find('.dish__item-text .dish-description').removeClass('display-none')


    }else{
        $('.content-favor-items').find('.picture_item_dish').removeClass('display-none')
        $('.content-favor-items').find('.dish__item-text .dish-description').addClass('display-none')
    }





   }

function ShowAllDishes() {

    $('.dishes__items .dish__item').removeClass('display-none')

    Readyfavorites()
    $('.dishes__items').removeClass('display-none')
    $('.dishes__items').parent().find('.content-favor-items').addClass('display-none')

   

  }


function ActiveDevice() {

    $.getJSON("https://ipgeolocation.abstractapi.com/v1/?api_key=343192254d7649e7aed2655a9673c247", function(data) {

    console.log(data);


    console.log();
    console.log(data['city']);

    console.log(data['ip_address']);

    console.log(data['flag']['svg']);

    
    $('#popup-activedevices .box-devices').html(''
    
    +'<span class="icon-flag-devices"><img src="'+data['flag']['svg']+'" /></span> '+data['country']+' '+data['city']+' '+data['ip_address']+' ' +data['timezone']['current_time']+
    
    
    '')

})


  }



function marketView() {
    

    $.getJSON("https://web-menu.stop.cash/api/v1/categories?sn=AW38CB461SD4GH4N", function(data) {


    console.log(data['result']['categories'])


        $('.swiper-categorys').html(                
                
            '<p onclick="ShowAllDishes()"><img src="" alt=""><span style="color:#fff;">все</span></p>'+
            '<p class="favorites_btn" onclick="favoriteShow();"><img src="" alt=""><span style="color:#fff;">избранное</span></p>')

        $.each(data['result']['categories'], function (i, val) { 

           

            $('.swiper-categorys').append(
                

                '<p onclick="filterDishes(this);"><img src="" alt=""><span class="link-fiter-dish" style="color:#fff;" data-id="'+val['orderSort']+'">'+val['nameCategory']+'</span></p>'
                
           )
             
        });
        


    })

    







    $.getJSON("https://web-menu.stop.cash/api/v1/products?sn=AW38CB461SD4GH4N", function(data) {

        console.log(data);



    $.each(data['result']['products'], function (i, val) { 


        $('.dishes__items').append(
            
        '<div class="dishes-box-fav dish__item dish-link_item" data-count="0" data-id="'+val['id']+'" data-catid="'+val['categoryId']+'"  >'+
        '<div>'+    
            '<div>'+
                '<div class="add-toCart minusCart display-none" onclick="AddToCart(this);"><img src="/licey/static/images/minus.svg" alt=""></div>'+
                '<div class="add-toCart plusCart" onclick="AddToCart(this);"><img src="/licey/static/images/add.svg" alt=""></div>'+
            '</div>'+
        '</div>'+


        '<a href="#popup-comments" class="widget-dish popup-menu__main-item popup-link fontello"><span>1</span><span class="info-widget"><img  src="/licey/static/images/speech-bubble.svg" alt=""></span><span >12</span><span class="info-widget"><img src="/licey/static/images/eye.svg" alt=""></span></a>'+

        '<div class="favorites__item" onclick="favorite(this)"><?xml version="1.0"?>'+
        ' <?xml version="1.0"?>'+
        ' <svg  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="100%" height="100%" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><circle r="256" cx="256" cy="256" fill="#3a3b3f" shape="circle"/><g transform="matrix(0.7,0,0,0.7,76.80000000000001,76.7999393463135)">'+
        ' <path class="icon_fav_active" xmlns="http://www.w3.org/2000/svg" style="" d="M247.931,487.774C32.21,372.032,0,247.587,0,183.71C0,23.139,161.509-27.459,256,76.623  c94.67-104.28,256-53.364,256,107.087c0,63.878-32.21,188.323-247.931,304.064C259.032,490.477,252.971,490.479,247.931,487.774z" fill="#bbbbbb" data-original="#ff7976" class=""/>'+
        '<path class="icon_fav_active" xmlns="http://www.w3.org/2000/svg" style="" d="M256,76.623c-0.001-0.001-0.002-0.002-0.003-0.003v413.182c2.776,0.001,5.552-0.676,8.073-2.028  C479.79,372.032,512,247.587,512,183.71C512,23.259,350.67-27.656,256,76.623z" fill="#8f8f8f" data-original="#ff5752" class=""/>'+
        '<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+
        '<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+
        '<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+' <g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+
            ' <g xmlns="http://www.w3.org/2000/svg">'+' </g>'+'<g xmlns="http://www.w3.org/2000/svg">'+' </g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+
            '<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+'<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+
            '<g xmlns="http://www.w3.org/2000/svg">'+'</g>'+' </g></svg>'+
        '</div>'+

            '<div class="infodish-more" onclick="showDish(this)">'+ 

            ''+
                ' <div class="picture_item_dish dish-picture"><img src="'+val['urlImg']+'" alt=""></div>'+

                

                '<div class="dish__item-text">'+


                

                '<h2 class="dish-content" style="text-align: left; margin-bottom: 5px;" data-id="'+val['id']+'" data-name="'+val['seoTitle']+'" data-content="'+val['seoDescription']+'">'+val['seoTitle']+'</h2>'+

                '<p class="time-dish" data-clock="'+val['cookingTime']+'"><img src="/licey/static/images/clock.svg" alt=""> <span>'+val['cookingTime']+' мин.</span></p>'+

                

                '<p class="dish-description display-none" style="color: #cacaca;">'+val['seoDescription']+'</p>'+
                '<div class="BJU-blocks">'+
                '</span><span title="Энерг. ценность" class="count-energy" data-energy="'+val['energyValue']+'"> <img src="/licey/static/images/renewable-energy.svg" alt=""> '+val['energyValue']+'</span>'+
                
                '<span title="Белки" class="count-protein" data-protein="'+val['proteins']+'"> <img src="/licey/static/images/protein.svg" alt=""> '+val['proteins']+'</span><span title="Жиры" class="count-fats" data-fats="'+val['fats']+'"> <img src="/licey/static/images/trans-fat.svg" alt=""> '+val['fats']+
                '</span><span title="Углеводы" class="count-carbohydrates" data-carbohydrates="'+val['carbohydrates']+'"> <img src="/licey/static/images/bread.svg" alt=""> '+val['carbohydrates']+
                '</div>'+


                '<div class="boxPrice-dish">'+


               
                
                
                '<p class="dish-price" style="text-align: left; color: #ffd200;" data-price="'+val['price']/100+'">'+val['price']/100+' ₽</p>'+
                
                
                '</div>'+
                
                '</div>'+

               
            ''+


            '</div>'+
        '</div>')
         
    });


    
    ReadyCart()
    Readyfavorites()


    

    })


    // return;
   
  }


  let dish_count;

function AddToCart(elem) {

   console.log($(elem).parent().data('count'))
   dish_count = parseInt($(elem).parent().data('count'))
   dish_count++;
   $(elem).parent().data('count',dish_count)


   let id = $(elem).parent().parent().parent().data('id')
   let picture = $(elem).parent().parent().parent().find('.dish-picture').html();
   let name = $(elem).parent().parent().parent().find('.dish-content').data('name');
   let content = $(elem).parent().parent().parent().find('.dish-content').data('content');
   let price = $(elem).parent().parent().parent().find('.dish-price').data('price');



   if (Cookies.get('cart') == undefined){
        var arr = []

       
    }else{
        var arr = jQuery.parseJSON([ Cookies.get('cart') ]);
        

        if(arr.filter(x => x.id == id).length > 0){

            console.log(arr.filter(x => x.id == id))


            // console.log()

            let summ = 0;
            let block_summ;

            if($(elem).parent().parent().parent().hasClass('popup-item_dish')){

               
           

            summ =  parseInt($(elem).parent().parent().parent().parent().find('.popup-summa-dish .summa-dishs').html())

            block_summ = $(elem).parent().parent().parent().parent().find('.popup-summa-dish .summa-dishs')


            }

            if($(elem).hasClass('plusCart')){

                console.log('Плюс')
                arr.filter(x => x.id == id)[0]['dishcount'] += 1

               $(elem).parent().find('.minusCart').removeClass('display-none')


                
               if($(elem).parent().parent().parent().hasClass('popup-item_dish')){
               

                summ +=  parseInt(arr.filter(x => x.id == id)[0]['price'])


                $(block_summ).html(summ)

                console.log(summ)


            }

                

              

                
            }else if($(elem).hasClass('minusCart')){
                console.log('минус')

                if(arr.filter(x => x.id == id)[0]['dishcount'] > 1){
                    arr.filter(x => x.id == id)[0]['dishcount'] -= 1


                if($(elem).parent().parent().parent().hasClass('popup-item_dish')){
                    

                
                    summ -=  parseInt(arr.filter(x => x.id == id)[0]['price'])

                    $(block_summ).html(summ)

                    console.log('Сумма чека: '+ summ)

                }



                }else{
                    arr.filter(x => x.id == id)[0]['dishcount'] = 0

                    $(elem).addClass('display-none')



                    if($(elem).parent().parent().parent().hasClass('popup-item_dish')){

                        summ -=  parseInt(arr.filter(x => x.id == id)[0]['price'])
    
                        $(block_summ).html(summ)
    
                        console.log('Сумма чека: '+ summ)


                        $(elem).parent().parent().parent().remove()



                    }


                    
                }
                
            }else{

            }


            if($(elem).parent().parent().parent().hasClass('popup-item_dish')){


                $(elem).parent().parent().parent().find('.item_dish_count').html(arr.filter(x => x.id == id)[0]['dishcount'])



            }


            




        }else{
            console.log('пусто')

            arr.push({'id': id, 'name': name,'picture': picture,'price': price,'content': content, 'dishcount': 1})



            $(elem).parent().find('.minusCart').removeClass('display-none')

        }

        

    }

    Cookies.set('cart',arr)
    console.log(id, picture, name, content, price, 'кол-во: ' + dish_count)
    console.log(jQuery.parseJSON(Cookies.get('cart')))


}



function ReadyCart() {


    var arr = jQuery.parseJSON([ Cookies.get('cart') ]);

    let id;
    $('.dishes__items .dish__item').each(function (index, element) {
       id = $(element).data('id');
       console.log($(element))

       if(arr.filter(x => x.id == id).length > 0){


        console.log(arr.filter(x => x.id == id))

        if(arr.filter(x => x.id == id)[0]['dishcount'] > 0){

            $(element).find('.minusCart').removeClass('display-none')

        }else{
            $(element).find('.minusCart').addClass('display-none')
        }

        

        console.log($(element).find('.minusCart'))
        
            
       }

        
    });



  }

function filterDishes(elem){

    ShowAllDishes()
    
    let dishItems = $('.dishes__items').find('.dish__item')



    // console.log($(elem).find('.link-fiter-dish').data('id'))



    list_id = $(elem).find('.link-fiter-dish').data('id')


    $(dishItems).addClass('display-none')


    $(dishItems).each(function (i, val) {
    //    console.log($(elem).data('id'))
    

        if($(val).data('catid') == list_id){


            $(val).removeClass('display-none')
            // console.log(elem)

        }
   
    
    });



}






function AdaptiveBlocks(elem) {


    console.log(elem)

    $(elem).find('.sort_block').toggleClass('display-none')
    $(elem).find('.sort_block2').toggleClass('display-none active-sort2')


    if($(elem).find('.sort_block2').hasClass('active-sort2')){

        $('.dishes__items .dish__item').find('.picture_item_dish').addClass('display-none')

        $('.dishes__items .dish__item').find('.dish-description').removeClass('display-none')

        $('.dishes__items .dish-link_item .dish__item-text').addClass('list-block-menu')

        
        
        

    }else{
        $('.dishes__items .dish__item').find('.picture_item_dish').removeClass('display-none')
        $('.dishes__items .dish__item').find('.dish-description').addClass('display-none')

        $('.dishes__items .dish-link_item').removeClass('list-block-menu')
        
    }




    $('.content-favor-items .picture_item_dish').toggleClass('display-none')

    $('.content-favor-items .dish__item-text .dish-description').toggleClass('display-none')

   
  }


function showCart() { 


    if (Cookies.get('cart') == undefined){
        var arr = []

        $('#popup-cart .popup__content .popup-cart .popup__main').html('<p>корзина пуста</p>')

       
    }else{
        var arr = jQuery.parseJSON([ Cookies.get('cart') ]);

        $('#popup-cart .popup__content .popup-cart .popup__main').html('')

        let summa = 0;

        $.each(arr, function (index, value) { 

            if(value['dishcount'] > 0){

                console.log(value)

                summa += parseInt(value['price']) * parseInt(value['dishcount'])


                $('#popup-cart .popup__content .popup-cart .popup__main').append(
                    
                    '<div class="popup-item_dish" data-id="'+value['id']+'">'+

                '<div class="box-item-dishL">'+
                  
                  '<span class="item_dish_title dish-content" data-name="'+value['name']+'" data-content="'+value['content']+'">'+value['name']+'</span>'+

                  '<div class="item_dish_add">'+

                    '<span class="add-toCart minusCart btn-addCart" onclick="AddToCart(this);"><img src="/licey/static/images/minus.svg" alt=""></span>'+
                    '<span class="item_dish_count">'+value['dishcount']+'</span>'+
                    '<span class="add-toCart plusCart btn-addCart" onclick="AddToCart(this);"><img src="/licey/static/images/add.svg" alt=""></span>'+
                  '</div>'+

                  '</div>'+


                  '<div class="box-item-dishR">'+
                  '<div class="item_dish_picture dish-picture">'+value['picture']+'</div>'+


                  '<span class="item_dish_price dish-price" data-price="'+value['price']+'">'+value['price']+' ₽</span>'+

                  '</div>'+

                '</div>'
                    
                    
                    
                )




            }


            
             
        });


        $('#popup-cart .popup__content .popup-cart .popup__main').append('<div class="popup-summa-dish"><span style="margin-right: 10px;">Итого: </span><span class="summa-dishs"> '+summa+'</span><span> ₽</span></div>')


        $('#popup-cart .popup__content .popup-cart .popup__main').append('<div class="btn-default btn-checkout-popup"><span>Оформить заказ<span></div>')


    }



 }



 function findShow(elem) {



    $(elem).parent().find('.box-find-dishs').removeClass('display-none')



}

function findHide(elem) { 


    $(elem).parent().addClass('display-none')


    $("#search-dish").val('');

    $(".dishes__items .dish__item").css('display','flex')




 }


 $( "#search-dish" ).keyup(function() {

    var value = $(this).val()

    $(".dishes__items .dish__item").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });


  });



function SendCommentDish(elem) {

    let name = $(elem).parent().find('.comment-name-enter').val();

    let content = $(elem).parent().find('.comment-content').val();


    if(name != '' && content != ''){

   
        

    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes();
  

    
    $(elem).parent().parent().find('.box-comments').prepend(

        '<div class="user-comment">'+
        '<div class="coment-name_and_content">'+
            '<p class="coment-name">'+name+'</p>'+
            '<p>'+content+'</p>'+
            '</div>'+
            '<div class="comment-time"><p>'+time+'</p></div>'+
        '</div>'

    );

    $(elem).parent().find('.comment-name-enter').val('');
    $(elem).parent().find('.comment-content').val('');

}else{
    console.log('Пустой комментарий')
}




  }



function InactiveCart(elem) {

    console.log(elem)

    

    console.log($(elem).data('status'))


    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    $.ajax({
        method: "POST",
        url: "/inactive-cart",
        headers: { "X-CSRFToken": csrftoken },
        data: { },
        beforeSend: function() {


            $('#popup-managmentCart .popup__main .loading').removeClass('display-none')
            $('#popup-managmentCart .popup__main .box-devices').addClass('display-none')

            
                 
        },
        success: function(html){  

            $('#popup-managmentCart .popup__main .loading').addClass('display-none')
            $('#popup-managmentCart .popup__main .box-devices').removeClass('display-none')
    
        },

        error: function (jqXHR, exception) {
           

        },
      })
      
        .done(function( msg ) {

            console.log(msg)

            if(msg['success'] == true){

                if (msg['status'] == 'Inactive'){

                    $('#popup-managmentCart').find('.box-devices').html('')

                    $('#popup-managmentCart').find('.box-devices').html(
                        
                        '<div class="btn-default inactive-cart" onclick="activeCart(this)" data-status="inactive">Активировать карту</div>')
               
                        
                    }



            }else{



           

            }

        });


  }







  function activeCart(elem) {


    console.log($(elem).data('status'))


    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    $.ajax({
        method: "POST",
        url: "/active-cart",
        headers: { "X-CSRFToken": csrftoken },
        data: { },
        beforeSend: function() {


            $('#popup-managmentCart .popup__main .loading').removeClass('display-none')
            $('#popup-managmentCart .popup__main .box-devices').addClass('display-none')

            
                 
        },
        success: function(html){  

            $('#popup-managmentCart .popup__main .loading').addClass('display-none')
            $('#popup-managmentCart .popup__main .box-devices').removeClass('display-none')
    
        },

        error: function (jqXHR, exception) {
           
        },
      })
      
        .done(function( msg ) {

            console.log(msg)

            if(msg['success'] == true){

                if (msg['status'] == 'active'){

                    $('#popup-managmentCart').find('.box-devices').html('')

                    $('#popup-managmentCart').find('.box-devices').html(
                        
                        '<div class="btn-default inactive-cart" onclick="InactiveCart(this)" data-status="active">Деактивировать карту</div>')
               
                        
                    }

                    

            }else{



           

            }

        });

  }



    $('.popup-history__open-purchases').click(function (e) { 
       

        $('.popup-history__open-purchases').removeClass('popup-history__menu-active')

        $(this).addClass('popup-history__menu-active')

        console.log($(this))
        
    });


function showPayList(elem) { 

    $('#popup-history').find('.content-checks').find('.prodItems').css('display','none')
    $('#popup-history').find('.content-checks').find('.payItems').css('display','block')

 }

 function showProdList(elem) { 

    $('#popup-history').find('.content-checks').find('.prodItems').css('display','block')
    $('#popup-history').find('.content-checks').find('.payItems').css('display','none')

 }

 function showAllList(elem) {

    $('#popup-history').find('.content-checks').find('li').css('display','block')
     
 }