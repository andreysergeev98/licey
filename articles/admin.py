from django.contrib import admin

from . import models

class StoryAdmin(admin.ModelAdmin):
    search_fields = ('headline', 'pub_date')

admin.site.register(models.Article, StoryAdmin)
admin.site.register(models.Story,StoryAdmin)
admin.site.register(models.BigDiscount,StoryAdmin)
admin.site.register(models.CrazySale,StoryAdmin)
admin.site.register(models.Category,StoryAdmin)
admin.site.register(models.Likedapp,StoryAdmin)