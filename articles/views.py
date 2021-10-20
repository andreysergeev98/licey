from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_protect
from .models import Article, Story, BigDiscount, CrazySale, Category, Likedapp
import pdb, xmltodict, json
import requests
from django import template
import base64
from base64 import b64encode
# from robokassa.forms import RobokassaForm


from django.core import serializers



# import pdb; pdb.set_trace()

def year_archive(request, year):
    a_list = Article.objects.filter(pub_date__year=year)
    context = {'year': year, 'article_list': a_list}
    return render(request, 'news/year_archive.html', context)


def month_archive(request, year, month):
    a_list = Article.objects.filter(pub_date__month=month)
    context = {'year': year, 'month': month, 'article_list': a_list}
    return render(request, 'news/month_archive.html', context)

def single_archive(request, idef):
    a_list = Article.objects.get(id=idef)
    context = {'idef': idef, 'article': a_list}
    return render(request, 'news/single_archive.html', context)




def main(request):
    stories = Story.objects.all()
    big_discs = BigDiscount.objects.all()
    crazySales = CrazySale.objects.all()
    categories = Category.objects.all()
    bonus_account = None
    userStory = []



    if 'Auth' in request.session:
        story_ge = requests.get("https://ipgeolocation.abstractapi.com/v1/?api_key=343192254d7649e7aed2655a9673c247")
        

        story_data = story_ge.json()

        # print(data)
        print(story_data)


       




        userStory.append({'story': story_data})
            
        print('-------2-----')
        if 'storyuser' in request.session:

            # sessionlist = request.session['storyuser']
            # sessionlist.append(userStory)


            # sessionlist = request.session.get('storyuser')
            # sessionlist.append(userStory)

            print(request.session['storyuser'])

        else:
            request.session['storyuser'] = userStory
            print(request.session['storyuser'])



        headers = {
            'Message-ID': '1',
            'Message-Type': 'Request',
            'Time': '2010-01-26 13:57:23',
            'Terminal-Type': '333',
            'Content-Length': '210',
            'Content-Type': 'text/text; charset=utf-8',

            }

            

        obj_req = requests.post('http://195.3.247.215:1192/', data = '''
        <?xml version="1.0" encoding="utf-8" standalone="yes" ?>
            <Message Action="Edit holders" Terminal_Type="333" Global_Type="" Unit_ID="1">
                <Include>Account,  Holder_Card, Holder_Coupon, Holder_Contact, Holder_Coupon_Available</Include>
                <Holder>
                    <Phone>'''+request.session['Auth']+'''</Phone>
                    
                </Holder>
            </Message>''', headers=headers)
        
        if obj_req.status_code == 200:

            print(obj_req.status_code)

        else:
            print(obj_req.status_code)


        obj = xmltodict.parse(obj_req.content)

        if 'Holder' in obj:

            request.session['HolderID'] = obj['Holder']['Holder_ID']

            
            cart = obj['Holder']['Holders_Cards']['Holder_Card']['Card']['Card_Code']
            


            bonus = obj['Holder']['Accounts']['Account']

            account =  obj['Holder']


            if bonus:
                print(bonus)
                for val in bonus:
                    
                    if val['Account_Type_ID'] == '1':
                        
                        bonus_account = val['Balance']
        

            if not cart:
                qrcode = obj['Holder']['Holders_Cards']['Holder_Card']['Card']['Card_Code']
            else:
                qrcode = 0 

            if account:
                auth = True
                phoneCart = request.session['Auth']

                # form = RobokassaForm(initial={
                #     'OutSum': 0.01,
                    
                #     'Desc': 'asd',
                #     'Email': 'sergeevandrey98@yandex.ru',
                #     # 'IncCurrLabel': '',
                #     # 'Culture': 'ru'
                # })
            
                context = {'stories': stories, 'big_discs': big_discs, 'crazySales': crazySales, 'categories': categories, 'auth':auth, 'qrcode':qrcode, 'bonus_account':bonus_account, 'account':account, 'cart':cart, 'phonecart':phoneCart}
        
            else:
                auth = False
                qrcode = False
                print('User not register.')
                context = {'stories': stories, 'big_discs': big_discs, 'crazySales': crazySales, 'categories': categories, 'auth':auth, 'qrcode':qrcode, 'bonus_account':bonus_account}
       
        else:
            auth = False
            qrcode = False
            context = {'stories': stories, 'big_discs': big_discs, 'crazySales': crazySales, 'categories': categories, 'auth':auth, 'qrcode':qrcode}
    else:
        auth = False
        qrcode = False
        context = {'stories': stories, 'big_discs': big_discs, 'crazySales': crazySales, 'categories': categories, 'auth':auth, 'qrcode':qrcode}

    return render(request, 'news/main.html', context)

def testUser(request):
     fav_color = request.session['fav_color']
     return JsonResponse({'session':fav_color})

def test(request):

    url='http://195.3.247.215:1192/'
    headers = {
            'Message-ID': '1',
            'Message-Type': 'Request',
            'Time': '2010-01-26 13:57:23',
            'Terminal-Type': '333',
            'Content-Length': '210',
            'Content-Type': 'text/text; charset=utf-8',

            }

    # Истории заказов тест

    obj_req = requests.post('http://195.3.247.215:1192/', data = '''
        <?xml version="1.0" encoding="utf-8" standalone="yes" ?>
            <Message Action="Edit holders" Terminal_Type="333" Global_Type="" Unit_ID="1">
                <Include>Account,  Holder_Card, Holder_Coupon, Holder_Coupon_Available</Include>
                <Holder>
                    <Phone>'''+request.session['Auth']+'''</Phone>
                    
                </Holder>
            </Message>''', headers=headers)


    





    obj = xmltodict.parse(obj_req.content)

    
    return JsonResponse({'session':obj})

    # print(obj["employees"]["employee"]['role'])

    # return render(request, 'testing/test.html', {'obj':obj})


@csrf_protect
def getphonekey(request):

    if request.method == 'POST':
        phone = request.POST['phone']

        headers = {
            'Message-ID': '1',
            'Message-Type': 'Request',
            'Time': '2010-01-26 13:57:23',
            'Terminal-Type': '333',
            'Content-Length': '210',
            'Content-Type': 'text/text; charset=utf-8',

            }

        obj_req = requests.post('http://195.3.247.215:1192/', data = '''
        <?xml version="1.0" encoding="utf-8" standalone="yes" ?>
            <Message Action="Login" Terminal_Type="333" Global_Type="" Unit_ID="1" User_ID="1">
                <Login Auto_Registry="True">''' + phone + '''</Login>
                <Include>Code_Timeout</Include>
            </Message>''', headers=headers)
        # print('1')


        obj = xmltodict.parse(obj_req.content)

        if 'Registration' in obj or 'Login' in obj:
           err = {'success':True, 'obj':obj}
        else:

           err = {'success':False, 'obj':obj}

    return JsonResponse(err)



@csrf_protect
def checkphonekey(request):

    if request.method == 'POST':
        phone = request.POST['phone']
        keysms = request.POST['keysms']
        res = {}

        headers = {
            'Message-ID': '1',
            'Message-Type': 'Request',
            'Time': '2010-01-26 13:57:23',
            'Terminal-Type': '333',
            'Content-Length': '210',
            'Content-Type': 'text/text; charset=utf-8',

            }

        obj_req = requests.post('http://195.3.247.215:1192/', data = '''
         <?xml version="1.0" encoding="utf-8" standalone="yes" ?>
            <Message Action="Login" Terminal_Type="333" Global_Type="" Unit_ID="1" User_ID="1">
                <Login Auto_Registry="True">'''+phone+'''</Login>

                <Auth_Code>'''+keysms+'''</Auth_Code>
            </Message>''', headers=headers)

        obj = xmltodict.parse(obj_req.content)
        userStory = {}
        

        # obj = None

        if 'Data' not in obj:

            
            res = {'success': False, 'response':obj}

            if 'Card_Code' in obj['Holder']['Cards']['Card']:

                request.session['Auth'] = phone


                print('-------1-----')

                print(phone)

                
                res = {'success': True}
            else:
                res = {'success': False, 'response':obj}  

        else:

            if '@ErrorCode' not in obj['Data']:


                



               



                request.session['Auth'] = phone


                

                # request.session['HolderID'] = obj
                res = {'success': True}
            else:
                res = {'success': False, 'response':obj}
            

        return JsonResponse(res)
        
@csrf_protect
def profile(request):
    if request.method == 'POST':

        arr = {}
        if 'Auth' in request.session:

            auth = request.session['Auth']

            headers = {
            'Message-ID': '1',
            'Message-Type': 'Request',
            'Time': '2010-01-26 13:57:23',
            'Terminal-Type': '333',
            'Content-Length': '210',
            'Content-Type': 'text/text; charset=utf-8',

            }

            obj_req = requests.post('http://195.3.247.215:1192/', data = '''
            <?xml version="1.0" encoding="utf-8" standalone="yes" ?>
                <Message Action="Edit holders" Terminal_Type="333" Global_Type="" Unit_ID="1">
                    <Include>Account, Holder, Holder_Address, Holder_Image, Holder_Contact</Include>
                    <Holder>
                        <Phone>'''+auth+'''</Phone>
                    </Holder>
                </Message>''', headers=headers)

            obj = xmltodict.parse(obj_req.content)

            arr = {'success':True,'object':obj, 'auth':auth}
            
        else:


            arr = {'success':False}
            print('User not register.')

    return JsonResponse(arr)
    
def saveprofile(request):
    if request.method == 'POST':
        if 'Auth' in request.session:
            auth = request.session['Auth']

            l_name = request.POST['l_name']
            f_name = request.POST['f_name']
            birthday = request.POST['birthday']
            gender = request.POST['gender']
            email_name = request.POST['email_name']


            if email_name != '':
                mailVal = '''<Contacts>
                            <Contact>
                                
                                <Type_ID>1</Type_ID>
                                <Value>'''+email_name+'''</Value >
                                <Dispatch>True</Dispatch>
                            </Contact>
                        </Contacts>'''
            else:

                mailVal = ''



            headers = {
                'Message-ID': '1',
                'Message-Type': 'Request',
                'Time': '2010-01-26 13:57:23',
                'Terminal-Type': '333',
                'Content-Length': '210',
                'Content-Type': 'text/text; charset=utf-8',

                }

            
            text = '''
            <?xml version="1.0" encoding="Windows-1251" standalone="yes" ?>
                <Message Action="Edit holders" Terminal_Type="333" Global_Type="" Unit_ID="1">
                    <Include>Holder, Holder_Address, Holder_Image, Holder_Contact</Include>
                    
                    <Holder>
                        <Phone>'''+auth+'''</Phone>
                        <F_Name>'''+f_name+'''</F_Name>
                        <L_Name>'''+l_name+'''</L_Name>
                        <Birth>'''+birthday+'''</Birth>
                        <Gender>'''+gender+'''</Gender>


                     
                        
                        '''+mailVal+'''


                    </Holder>

                    

                </Message>'''

            obj_req = requests.post('http://195.3.247.215:1192/', data = text.encode('utf-8'), headers=headers)

            obj = xmltodict.parse(obj_req.content)

        else:
            print('User not register.')

    return JsonResponse({'success':True,'object':obj})
        

def generateqrcode(request):
    if request.method == 'POST':
        if 'Auth' in request.session:
            auth = request.session['Auth']
            headers = {
                'Message-ID': '1',
                'Message-Type': 'Request',
                'Time': '2010-01-26 13:57:23',
                'Terminal-Type': '333',
                'Content-Length': '210',
                'Content-Type': 'text/text; charset=utf-8',

                }


            text = '''
            <?xml version="1.0" encoding="Windows-1251" standalone="yes" ?>
                <Message Action="Edit holders" Terminal_Type="333" Global_Type="" Unit_ID="1">
                    <Include>Holder_Card</Include>
                    <Holder>
                        <Phone>'''+auth+'''</Phone>
                    
                        
                    </Holder>
                </Message>'''

            obj_req = requests.post('http://195.3.247.215:1192/', data = text.encode('utf-8'), headers=headers)

            obj = xmltodict.parse(obj_req.content)

            arr = {'success':True,'object':obj}

        else:
            print('User not register.')
            arr = {'success':False}

    return JsonResponse(arr)

def logoutprofile(request):
    if request.method == 'POST':
        if 'Auth' in request.session:
            del request.session['Auth']


    return JsonResponse({'success':True})


def gethistory(request):

    if request.method == 'POST':
        if 'Auth' in request.session:

            print('1')

            arr = {'success': True}


            url='http://195.3.247.215:1192/'
            headers = {
                    'Message-ID': '1',
                    'Message-Type': 'Request',
                    'Time': '2010-01-26 13:57:23',
                    'Terminal-Type': '333',
                    'Content-Length': '210',
                    'Content-Type': 'text/text; charset=utf-8',

                    }

            # Истории заказов тест

            obj_req = requests.post(url, data = '''
            <?xml version="1.0" encoding="utf-8" standalone="yes" ?>
                <Message Action="Get transactions info" Terminal_Type="333" Global_Type="" Unit_ID="1" 
                User_ID="1">
                    <Transaction>
                        
                        <Holder_ID>'''+request.session['HolderID']+'''</Holder_ID>
                        <Count>10000</Count>
                        <Include>Transaction_DopInfo</Include>
                    </Transaction>
                </Message>''', headers=headers)

            obj = xmltodict.parse(obj_req.content)
            arr = {}

            array = []

            if 'Transaction' in obj['Transactions']:
                

                writeoff = []
                for val in obj['Transactions']['Transaction']:

                    
                    print(val)
                    print(val['Transaction_Type'])

                    

                    if val['Transaction_Type'] == '11':
                        if 'External_ID' in val:
                            print(val['External_ID'])
                            writeoff.append(val['External_ID'])
                        
                        
                    if val['Transaction_Type'] == '22':
                        if 'External_ID' in val:
                            print(val['External_ID'])

                            if val['External_ID']  in writeoff:
                                # print(val['External_ID'])
                                print(val)
                                
                            else:
                                
                                data = base64.b64decode(val['Dop_Info']['#text'])
                                array.append(xmltodict.parse(data))

                            

                        

                        #print(val['Dop_Info']['#text'])
                        
                        
                        # arr.update({'checkes': xmltodict.parse(data)})

                if not array:
                    story_arr = {'success': False, 'story': obj}

                    
                else:
                    story_arr = {'success': True, 'story': array, 'obj': obj, 'arrNote':writeoff}
                    print()

            else:
                story_arr = {'success': False, 'obj': obj}  


        else:
            story_arr = {'success': False}


    return JsonResponse(story_arr)


def getgifts(request):

    if request.method == 'POST':
        if 'Auth' in request.session:
            auth = request.session['Auth']

            url='http://195.3.247.215:1192/'
            headers = {
                        'Message-ID': '1',
                        'Message-Type': 'Request',
                        'Time': '2010-01-26 13:57:23',
                        'Terminal-Type': '333',
                        'Content-Length': '210',
                        'Content-Type': 'text/text; charset=utf-8',

                        }

                # Истории заказов тест

            obj_req = requests.post(url, data = '''
                <?xml version="1.0" encoding="Windows-1251" standalone="yes" ?>
                        <Message Action="Get holder info" Terminal_Type="333" Global_Type="" Unit_ID="1">

                            <Holder_ID>'''+request.session['HolderID']+'''</Holder_ID>
                            <Include>Holder_Coupon, Holder_Coupon_Available</Include>
                     

                            
                        </Message>''', headers=headers)
            obj = xmltodict.parse(obj_req.content)




    return JsonResponse({'success': True, 'coupons':obj['Holder']['Holders_Coupons']})






def market(request):

    # a_list = Article.objects.all()


    # url='http://ugits.net:1143/'
    # headers = {
    #             'Message-ID': '1',
    #             'Message-Type': 'Request',
    #             'Time': '2010-01-26 13:57:23',
    #             'Terminal-Type': '333',
    #             'Content-Length': '210',
    #             'Content-Type': 'text/text; charset=utf-8',

    #             }

    #     # Истории заказов тест

    # obj_req = requests.post(url, data = '''
    #     <?xml version="1.0" encoding="windows-1251"?>
    #     <RK7Query>
    #     <RK7CMD CMD="GetSystemInfo"/>
    #     </RK7Query>''', headers=headers)
    # obj = xmltodict.parse(obj_req.content)




    # return JsonResponse({'success': True, 'coupons':obj})


    obj_req = requests.get('https://web-menu.stop.cash/api/v1/products?sn=AW38CB461SD4GH4N')
    # context = {'obj_req': obj_req}

    

    products = {'products': obj_req.json()}


  

    print(products)


    # return HttpResponse(obj_req, content_type="application/json")
    return render(request, 'markets/market.html', products)


def likedapp(request):
    if request.method == 'POST':
        comment = Likedapp(theme= request.POST['title'], content=request.POST['content'])
        comment.save()

    return JsonResponse({'success': True})





def menuView(request):


    obj_req = requests.get('https://web-menu.stop.cash/api/v1/products?sn=AW38CB461SD4GH4N')

    return JsonResponse({'success': True, 'arr': obj_req})



def inactiveCart(request):

    if 'Auth' in request.session:
        headers = {
                'Message-ID': '1',
                'Message-Type': 'Request',
                'Time': '2010-01-26 13:57:23',
                'Terminal-Type': '333',
                'Content-Length': '210',
                'Content-Type': 'text/text; charset=utf-8',

                }

                

        obj_req = requests.post('http://195.3.247.215:1192/', data = '''
        <?xml version="1.0" encoding="utf-8" standalone="yes" ?>
            <Message Action="Edit holders" Terminal_Type="333" Global_Type="" Unit_ID="1">
                <Include>Holder_Card</Include>
                <Holder>
                    <Phone>'''+request.session['Auth']+'''</Phone>
                    
                </Holder>
            </Message>''', headers=headers)
        
        if obj_req.status_code == 200:

            print(obj_req.status_code)

        else:
            print(obj_req.status_code)
        
        obj = xmltodict.parse(obj_req.content)

        cart = obj['Holder']['Holders_Cards']['Holder_Card']['Card']['Card_Code']

        if cart:

            req_incative = requests.post('http://195.3.247.215:1192/', data = '''
            <?xml version="1.0" encoding="utf-8" standalone="yes" ?>
            <Message Action="Card inactive" Terminal_Type="333" Global_Type="" Unit_ID="1"
            User_ID="1">
                <Card_Code>'''+cart+'''</Card_Code>
            </Message>''', headers=headers)
        
            print(req_incative.status_code)

            if req_incative.status_code == 200:
                print(obj['Holder']['Holders_Cards']['Holder_Card']['Card']['Status'])

                status_cart = obj['Holder']['Holders_Cards']['Holder_Card']['Card']['Status']

                context = {'success': True, 'cart':cart, 'status':'Inactive'}
            else:
                print('error')


    return JsonResponse(context)


def activeCart(request):


    if 'Auth' in request.session:
        headers = {
                'Message-ID': '1',
                'Message-Type': 'Request',
                'Time': '2010-01-26 13:57:23',
                'Terminal-Type': '333',
                'Content-Length': '210',
                'Content-Type': 'text/text; charset=utf-8',

                }

                

        obj_req = requests.post('http://195.3.247.215:1192/', data = '''
        <?xml version="1.0" encoding="utf-8" standalone="yes" ?>
            <Message Action="Edit holders" Terminal_Type="333" Global_Type="" Unit_ID="1">
                <Include>Holder_Card</Include>
                <Holder>
                    <Phone>'''+request.session['Auth']+'''</Phone>
                    
                </Holder>
            </Message>''', headers=headers)

        obj = xmltodict.parse(obj_req.content)

        cart = obj['Holder']['Holders_Cards']['Holder_Card']['Card']['Card_Code']

        if cart:

            req_aсtive = requests.post('http://195.3.247.215:1192/', data = '''
            <?xml version="1.0" encoding="utf-8" standalone="yes" ?>
            <Message Action="Card active" Terminal_Type="333" Global_Type="" Unit_ID="1"
            User_ID="1">
                <Card_Code>'''+cart+'''</Card_Code>
            </Message>''', headers=headers)
        
            print(req_aсtive.status_code)

            if req_aсtive.status_code == 200:
                print(obj['Holder']['Holders_Cards']['Holder_Card']['Card']['Status'])

                status_cart = obj['Holder']['Holders_Cards']['Holder_Card']['Card']['Status']

                context = {'success': True, 'cart':cart, 'status':'active'}
            else:
                context = {'success': False}
                print('error')


    

    return JsonResponse(context)





