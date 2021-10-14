from django.urls import path

from . import views

urlpatterns = [
    path('<int:year>/', views.year_archive),
    path('', views.main),
    path('infoprofile', views.profile),
    path('save-profile', views.saveprofile),
    path('get-history', views.gethistory),
    path('market', views.market),
    path('likedapp', views.likedapp),
    path('menuview', views.menuView),
    path('get-gifts', views.getgifts),
    path('logout-profile', views.logoutprofile),
    path('generate-qrcode', views.generateqrcode),
    path('test', views.test),
    path('get-phonekey', views.getphonekey),
    path('check-phonekey', views.checkphonekey),
    path('testuser', views.testUser),
    path('single/<int:idef>/', views.single_archive),
    path('<int:year>/<int:month>/', views.month_archive),
    path('inactive-cart', views.inactiveCart),

    path('active-cart', views.activeCart),

    

    
    # path('articles/<int:year>/<int:month>/<int:pk>/', views.article_detail),
]